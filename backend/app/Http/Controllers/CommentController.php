<?php

namespace App\Http\Controllers;


use App\Models\Task;
use App\Notifications\CommentAddedNotification;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentController extends Controller
{
    public function index(Task $task)
    {
        try {
            $comments = $task->comments()
                ->with(['user' => fn($q) => $q->select('id', 'name', 'email')])
                ->latest()
                ->get();

            return response()->json($comments);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request, Task $task)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $validated = $request->validate([
                'content' => 'required|string|max:1000'
            ]);

            $comment = $task->comments()->create([
                'content' => $validated['content'],
                'user_id' => $user->id
            ]);
            $task->project->users()
            ->where('users.id', '!=', $user->id)
            ->each(function ($user) use ($comment) {
                $user->notify(new CommentAddedNotification($comment));
            });

            return response()->json($comment->load('user'), 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}