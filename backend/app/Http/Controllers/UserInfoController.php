<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\UsersInfo;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserInfoController extends Controller
{




    public function update(Request $request)
    {
        $user = JWTAuth::user();

        $validated = $request->validate([
            'background' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'job' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
        ]);

        $userInfo = $user->usersInfo ?? new UsersInfo(['user_id' => $user->id]);

        // Only update fields that are present in the request
        foreach (['job', 'phone', 'address', 'city'] as $field) {
            if (array_key_exists($field, $validated)) {
                $userInfo->$field = $validated[$field] !== ''
                    ? $validated[$field]
                    : null;
            }
        }

        // Handle file uploads
        foreach (['background', 'profile_photo'] as $fileField) {
            if ($request->hasFile($fileField)) {
                // Delete old file if exists
                if ($userInfo->$fileField) {
                    Storage::disk('public')->delete($userInfo->$fileField);
                }
                // Store new file
                $userInfo->$fileField = $request->file($fileField)->store($fileField . 's', 'public');
            }
        }

        $userInfo->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'userInfo' => $userInfo,
        ]);
    }

    public function showindex($username)
    {
        try {

            $user = User::where('username', $username)->first();
            if (!$user) {
                return response()->json(["error" => "User not found"], 404);
            }



            $createdProjects = Project::where("created_by", $user->id)
                ->with(["users", "creator:id,email,name"])
                ->selectRaw('projects.*, "creator" as role');

            $collaboratingProjects = $user->projects()
                ->selectRaw('projects.*, project_user.role as role');

            // Combine results using SQL UNION and get all records
            $allProjects = $createdProjects->union($collaboratingProjects)->get();

            return response()->json(["projects" => $allProjects], 200);

        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }
    public function getUserProfile($username)
    {
        $user = User::with([
            'usersInfo',
            'tasks',
            'assignedTasks',  // Load assigned tasks
            'projects'
        ])
            ->where('username', $username)
            ->first();

        if (!$user) {
            return response()->json(["error" => "User not found"], 404);
        }

        return response()->json([
            'user' => $user,
            'created_tasks' => $user->tasks,
            'assigned_tasks' => $user->assignedTasks
        ]);
    }

    public function getRecentActivity($username)
    {
        $user = User::with('usersInfo')->where('username', $username)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Project creation activities
        $projectActivities = Project::where('created_by', $user->id)
            ->with(['creator:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($project) {
                return [
                    'type' => 'project_created',
                    'message' => "Created project: {$project->name}",
                    'human_time' => $project->created_at->diffForHumans(),
                    'timestamp' => $project->created_at,
                    'reference' => [
                        'id' => $project->id,
                        'name' => $project->name,
                        'type' => 'project',
                        'creator' => $project->creator->name
                    ]
                ];
            });

        // Task creation activities
        $taskActivities = Task::where('created_by', $user->id)
            ->with(['project:id,name', 'creator:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($task) {
                return [
                    'type' => 'task_created',
                    'message' => "Created task: {$task->title}",
                    'human_time' => $task->created_at->diffForHumans(),
                    'timestamp' => $task->created_at,
                    'reference' => [
                        'id' => $task->id,
                        'name' => $task->title,
                        'type' => 'task',
                        'project' => $task->project->name,
                        'creator' => $task->creator->name
                    ]
                ];
            });

        // Comment activities
        $commentActivities = $user->comments()
            ->with(['task.project:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($comment) {
                return [
                    'type' => 'comment_created',
                    'message' => "Commented on task: {$comment->task->title}",
                    'human_time' => $comment->created_at->diffForHumans(),
                    'timestamp' => $comment->created_at,
                    'reference' => [
                        'id' => $comment->id,
                        'content' => Str::limit($comment->content, 50),
                        'type' => 'comment',
                        'task' => $comment->task->title,
                        'project' => $comment->task->project->name
                    ]
                ];
            });

        // Attachment activities
        $attachmentActivities = $user->attachments()
            ->with(['task.project:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($attachment) {
                return [
                    'type' => 'attachment_created',
                    'message' => "Added attachment to task: {$attachment->task->title}",
                    'human_time' => $attachment->created_at->diffForHumans(),
                    'timestamp' => $attachment->created_at,
                    'reference' => [
                        'id' => $attachment->id,
                        'filename' => $attachment->file_name,
                        'filpath' => $attachment->file_path,
                        'type' => 'attachment',
                        'task' => $attachment->task->title,
                        'project' => $attachment->task->project->name
                    ]
                ];
            });

        // Merge and sort all activities
        $merged = $projectActivities
            ->merge($taskActivities)
            ->merge($commentActivities)
            ->merge($attachmentActivities)
            ->sortByDesc('timestamp')
            ->take(10)
            ->values()
            ->map(function ($item) {
                unset($item['timestamp']);
                return $item;
            });

        return response()->json([
            'data' => $merged,
            'meta' => [
                'total_activities' => $merged->count(),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'avatar' => $user->usersInfo->profile_photo ?? null
                ]
            ]
        ]);
    }
    public function getContact()
    {
        $user = auth("api")->user();


        $contacts = $user->acceptedContacts()
            ->select('users.id', 'name', 'email')
            ->take(3)->get();

        return response()->json($contacts);
    }

}