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
    public function index() {
        $user = JWTAuth::user();
    

        return Invitation::with(['sender', 'project'])
        ->where('sender_id', $user->id) 
        ->orWhere('email', $user->email) 
        ->paginate(10);
    
        
    }
    public function invite(Project $project, Request $request) {
        $request->validate(['email' => 'required|email']);
    
      
        if ($project->users()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'User is already a collaborator.'], 400);
        }
    
     
        if ($project->invitations()->where('email', $request->email)->exists()) {
            return response()->json(['error' => 'Invitation already sent.'], 400);
        }
    

        $invitation = $project->invitations()->create([
            'sender_id' => auth('api')->id(),
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
}
