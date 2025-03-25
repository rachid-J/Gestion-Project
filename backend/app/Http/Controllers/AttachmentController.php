<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Task;
use App\Notifications\AttachmentAddedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class AttachmentController extends Controller
{
    public function index(Task $task)
    {
        try {
            $attachments = $task->attachments()
                ->with(['user' => fn($q) => $q->select('id', 'name', 'email')])
                ->latest()
                ->get();

            return response()->json($attachments);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request, Task $task)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $validated = $request->validate([
                'file' => 'required|file|max:2048|mimes:pdf,jpg,png,docx,txt'
            ]);

            $file = $request->file('file');
            $path = $file->store('attachments', 'public');

            $attachment = $task->attachments()->create([
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'user_id' => $user->id
            ]);
            $task->project->users()
            ->where('users.id', '!=', $user->id)
            ->each(function ($user) use ($attachment) {
                $user->notify(new AttachmentAddedNotification($attachment, auth("api")->user()));
            });

            return response()->json($attachment->load('user'), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Attachment $attachment)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($attachment->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            Storage::disk('public')->delete($attachment->file_path);
            $attachment->delete();

            return response()->json(['message' => 'Attachment deleted']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}