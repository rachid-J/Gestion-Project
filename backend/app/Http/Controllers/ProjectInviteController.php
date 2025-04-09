<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProjectInviteController extends Controller
{
    public function invite(Project $project, Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $sender = auth("api")->user();

        if (!$sender->acceptedContacts()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'User must be in your contacts to invite.'], 403);
        }

        if ($project->users()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'User is already a collaborator.'], 400);
        }

        if ($project->invitations()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'Invitation already sent.'], 400);
        }

        $invitation = $project->invitations()->create([
            'sender_id' => $sender->id,
            'email' => $request->email,
            'token' => Str::random(32),
        ]);

        $invitation->notify(new ProjectInvitationNotification($invitation));

        return response()->json(['message' => 'Invitation sent.']);
    }

    public function accept(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        $invitation = Invitation::where('token', $request->token)->first();

        if (!$invitation) {
            return response()->json(['error' => 'Invalid or expired invitation'], 404);
        }

        if ($invitation->email !== auth("api")->user()->email) {
            return response()->json(['error' => 'You are not the intended recipient'], 403);
        }

        $invitation->project->users()->attach(auth("api")->id(), ['role' => 'member']);
        $invitation->update(['status' => 'accepted']);

        return response()->json(['message' => 'Invitation accepted!']);
    }

    public function verify(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        $invitation = Invitation::where('token', $request->token)->first();

        if (!$invitation) {
            return response()->json(['error' => 'Invalid or expired invitation'], 404);
        }

        return response()->json([
            'sender' => [
                'name' => $invitation->sender->name,
                'email' => $invitation->sender->email,
            ],
            'project' => [
                'name' => $invitation->project->name,
                'id' => $invitation->project->id,
            ],
            'status' => $invitation->status
        ]);
    }

    public function receivedInvitations()
    {
        $user = auth("api")->user();
        $invitations = Invitation::where('email', $user->email)
            ->where('status', 'pending')
            ->with('project', 'sender')
            ->get();

        return response()->json($invitations);
    }

    public function sentInvitations($id)
    {
        $user = JWTAuth::user();
        $invitations = Invitation::where('sender_id', $user->id)
            ->where('project_id', $id)
            ->get();

        return response()->json($invitations);
    }

    public function cancel(Invitation $invitation)
    {
        $user = JWTAuth::user();

        if (!$invitation->exists || $invitation->trashed()) {
            return response()->json(['error' => 'Invitation not found'], 404);
        }

        if ($invitation->sender_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized action'], 403);
        }

        if ($invitation->status === 'accepted') {
            return response()->json(['error' => 'Accepted invitations cannot be canceled'], 400);
        }

        $invitation->delete();

        return response()->json([
            'message' => 'Invitation cancelled successfully',
            'cancelled_at' => now()->toDateTimeString()
        ]);
    }

    public function decline(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        $invitation = Invitation::where('token', $request->token)->first();

        if (!$invitation) {
            return response()->json(['error' => 'Invalid or expired invitation'], 404);
        }

        $user = JWTAuth::user();

        if ($invitation->email !== $user->email) {
            return response()->json(['error' => 'You are not the intended recipient'], 403);
        }

        if ($invitation->status !== 'pending') {
            return response()->json(['error' => 'Only pending invitations can be declined'], 400);
        }

        $invitation->update(['status' => 'declined']);

        return response()->json([
            'message' => 'Invitation declined successfully',
            'declined_at' => now()->toDateTimeString()
        ]);
    }
}
