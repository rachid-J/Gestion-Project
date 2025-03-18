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
    
        // Check if the invited user is in the sender's accepted contacts
        if (!$sender->acceptedContacts()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'User must be in your contacts to invite.'], 403);
        }
    
        // Existing checks for collaborators and invitations
        if ($project->users()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'User is already a collaborator.'], 400);
        }
    
        if ($project->invitations()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'Invitation already sent.'], 400);
        }
    
        // Create and send project invitation
        $invitation = $project->invitations()->create([
            'sender_id' => $sender->id,
            'email' => $request->email,
            'token' => Str::random(32),
        ]);
    
        $invitation->notify(new ProjectInvitationNotification($invitation));
    
        return response()->json(['message' => 'Invitation sent.']);
    }

    public function accept(Request $request) {
        $request->validate(['token' => 'required|string']);
    
        $invitation = Invitation::where('token', $request->token)->first();
    
  
    
    
        if ($invitation->email !== auth("api")->user()->email) {
            return response()->json(['error' => 'You are not the intended recipient'], 403);
        }
    
     
        $invitation->project->users()->attach(auth("api")->id(), ['role' => 'member']);
        $invitation->update(['status' => 'accepted']);
    
        return response()->json(['message' => 'Invitation accepted!']);
    }
    public function verify(Request $request) {
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
        ->with('project', 'sender') // Load project & sender details
        ->get();

    return response()->json($invitations);
}
    
}
