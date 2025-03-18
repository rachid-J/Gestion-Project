<?php

namespace App\Http\Controllers;

use App\Models\ContactInvitations;
use App\Models\Invitation;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth("api")->user();

        // Get project invitations as array
        $projectInvitations = Invitation::with(['sender', 'project'])
            ->where('email', $user->email)
            ->where('status', 'pending')
            ->get()
            ->map(function ($invite) {
                return [
                    'id' => $invite->id,
                    'type' => 'project',
                    'message' => "Project invitation: {$invite->project->name}",
                    'sender' => $invite->sender->name,
                    'timestamp' => $invite->created_at->diffForHumans(),
                    'read' => (bool) $invite->read,
                    'token' => $invite->token
                ];
            })->all();

        // Get contact invitations as array
        $contactInvitations = ContactInvitations::with(['sender'])
            ->where('recipient_email', $user->email)
            ->where('status', 'pending')
            ->get()
            ->map(function ($invite) {
                return [
                    'id' => $invite->id,
                    'type' => 'contact',
                    'message' => "Connection request from {$invite->sender->name}",
                    'sender' => $invite->sender->name,
                    'timestamp' => $invite->created_at->diffForHumans(),
                    'read' => (bool) $invite->read,
                    'token' => $invite->token
                ];
            })->all();

        // Merge arrays
        $notifications = array_merge($projectInvitations, $contactInvitations);

        return response()->json([
            'notifications' => $notifications
        ]);
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'types' => 'required|array|size:' . count($request->ids)
        ]);

        foreach ($request->ids as $index => $id) {
            $type = $request->types[$index];
            
            try {
                if ($type === 'project') {
                    Invitation::where('id', $id)->update(['read' => true]);
                } else {
                    ContactInvitations::where('id', $id)->update(['read' => true]);
                }
            } catch (\Exception $e) {
                report($e);
                continue;
            }
        }

        return response()->json(['message' => 'Notifications marked as read']);
    }
}