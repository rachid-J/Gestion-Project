<?php

namespace App\Http\Controllers;

use App\Models\ContactInvitations;
use App\Models\User;
use App\Notifications\ContactInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class ContactInvitationController extends Controller
{
    public function send(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $sender = auth("api")->user();

        if ($sender->acceptedContacts()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'User is already in your contacts.'], 400);
        }

        if (
            ContactInvitations::where('sender_id', $sender->id)
                ->where('recipient_email', $request->email)
                ->where('status', 'pending')
                ->exists()
        ) {
            return response()->json(['error' => 'Invitation already sent.'], 400);
        }

        $invitation = ContactInvitations::create([
            'sender_id' => $sender->id,
            'recipient_email' => $request->email,
            'token' => Str::random(32),
            'status' => 'pending',
        ]);


        $invitation->notify(new ContactInvitationNotification($invitation));

        return response()->json(['message' => 'Contact invitation sent.']);
    }

    public function accept(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        $invitation = ContactInvitations::where('token', $request->token)->firstOrFail();
        $recipient = JWTAuth::user();

        if ($recipient->email !== $invitation->recipient_email) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $sender = User::find($invitation->sender_id);
        $sender->contacts()->syncWithoutDetaching([$recipient->id => ['status' => 'accepted']]);
        $recipient->contacts()->syncWithoutDetaching([$sender->id => ['status' => 'accepted']]);

        $invitation->update(['status' => 'accepted']);

        return response()->json(['message' => 'Contact added successfully.']);
    }
    public function receivedInvitations(Request $request)
{
    $user = auth("api")->user();
    $perPage = $request->input('per_page', 5);

    $invitations = ContactInvitations::with('sender')
        ->where('recipient_email', $user->email)
        ->where('status', 'pending')
        ->when($request->search, function($query) use ($request) {
            $query->whereHas('sender', function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        })
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

    return response()->json($invitations);
}
public function sentInvitations(Request $request)
{
    $user = auth("api")->user();
    $perPage = $request->input('per_page', 5);

    $invitations = ContactInvitations::with(['recipient' => function ($query) {
            $query->select('id', 'name', 'email');
        }])
        ->where('sender_id', $user->id)
        ->when($request->search, function($query) use ($request) {
            $query->where('recipient_email', 'like', '%'.$request->search.'%')
                  ->orWhereHas('recipient', function($q) use ($request) {
                      $q->where('name', 'like', '%'.$request->search.'%');
                  });
        })
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

    return response()->json($invitations);
}
 
    public function verifyInvitation(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        $invitation = ContactInvitations::with('sender')
            ->where('token', $request->token)
            ->first();

        if (!$invitation) {
            return response()->json(['error' => 'Invalid invitation token'], 404);
        }

        if ($invitation->status !== 'pending') {
            return response()->json(['error' => 'Invitation already processed'], 400);
        }

        return response()->json($invitation);
    }
    public function decline(Request $request)
{
    $request->validate(['token' => 'required|string']);
    $invitation = ContactInvitations::where('token', $request->token)->firstOrFail();
    $recipient = JWTAuth::user();

    if ($recipient->email !== $invitation->recipient_email) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    if ($invitation->status !== 'pending') {
        return response()->json(['error' => 'Invitation already processed'], 400);
    }

    $invitation->update(['status' => 'declined']);

    return response()->json(['message' => 'Invitation declined successfully']);
}
}