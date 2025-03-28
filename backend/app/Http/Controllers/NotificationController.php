<?php

namespace App\Http\Controllers;

use App\Models\ContactInvitations;
use App\Models\Invitation;
use App\Notifications\AttachmentAddedNotification;
use App\Notifications\CommentAddedNotification;
use App\Notifications\ProjectDeletedNotification;
use App\Notifications\ProjectUpdatedNotification;
use App\Notifications\TaskCreatedNotification;
use App\Notifications\TaskUpdatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth("api")->user();

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

        $dbNotifications = $user->notifications()
            ->whereIn('type', [
                ProjectDeletedNotification::class,
                ProjectUpdatedNotification::class
            ])
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->data['type'],
                    'message' => $notification->data['message'],
                    'timestamp' => $notification->created_at->diffForHumans(),
                    'read' => $notification->read_at !== null,
                    'data' => $notification->data
                ];
            });
            $TaskNotifications = $user->notifications()
            ->whereIn('type', [
               
                TaskCreatedNotification::class,       
                TaskUpdatedNotification::class,       
                CommentAddedNotification::class,      
                AttachmentAddedNotification::class    
            ])
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->data['type'],
                    'message' => $notification->data['message'],
                    'timestamp' => $notification->created_at->diffForHumans(),
                    'read' => $notification->read_at !== null,
                    'data' => $notification->data
                ];
            });

        
        $notifications = array_merge(
            $projectInvitations,
            $contactInvitations,
            $dbNotifications->toArray(),
            $TaskNotifications->toArray()
        );

        usort(
            $notifications,
            fn($a, $b) =>
            strtotime($b['timestamp']) <=> strtotime($a['timestamp'])
        );


        return response()->json(['notifications' => $notifications]);
    }
    public function markAsRead(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'types' => 'required|array|size:' . count($request->ids)
        ]);
    
        $user = auth('api')->user();
    
        foreach ($request->ids as $index => $id) {
            $type = $request->types[$index];
            
            try {
                switch ($type) {
                    case 'project':
                        Invitation::where('id', $id)->update(['read' => true]);
                        break;
                    
                    case 'contact':
                        ContactInvitations::where('id', $id)->update(['read' => true]);
                        break;
                    
                    default:
                        $user->notifications()
                            ->where('id', $id)
                            ->update(['read_at' => now()]);
                        break;
                }
            } catch (\Exception $e) {
                Log::error("Mark read failed: " . $e->getMessage());
            }
        }
    
        return response()->json(['message' => 'Notifications marked as read']);
    }
}