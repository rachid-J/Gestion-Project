<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskCreatedNotification;
use App\Notifications\TaskUpdatedNotification;
use Carbon\Carbon;
use Dotenv\Exception\ValidationException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskController extends Controller
{
    public function getTasks($id) {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return response()->json(["message" => "User not found"], 404);
    
            $project = Project::with(['creator' => function($q) {
                $q->select('id', 'name', 'email'); 
            }])->find($id);
    
            if (!$project) return response()->json(["message" => "Project not found"], 404);
    
            $isCreator = $project->created_by === $user->id;
            $isCollaborator = $project->users()->where('user_id', $user->id)->exists();
    
            if (!$isCreator && !$isCollaborator) {
                return response()->json(["message" => "Access denied"], 403);
            }
    
            $tasks = $project->tasks()
                ->with(['assignedTo', 'creator' => function($q) {
                    $q->select('id', 'name', 'email'); 
                }])
                ->paginate(9);
    
            $tasks->getCollection()->transform(function ($task) use ($isCreator) {
                $task->role = $isCreator ? 'creator' : 'member';
                $task->creator = $task->creator ? [
                    'id' => $task->creator->id,
                    'name' => $task->creator->name,
                    'email' => $task->creator->email
                ] : null;
                return $task;
            });
    
            return response()->json($tasks, 200);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    
    public function getAllTasks($projectId) {  
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return response()->json(["message" => "User not found"], 404);
    
            $project = Project::with(['creator' => function($q) {
                $q->select('id', 'name', 'email');
            }])->find($projectId);  
    
            if (!$project) return response()->json(["message" => "Project not found"], 404);
    
            $isCreator = $project->created_by === $user->id;
            $isCollaborator = $project->users()->where('user_id', $user->id)->exists();
    
            if (!$isCreator && !$isCollaborator) {
                return response()->json(["message" => "Access denied"], 403);
            }
    
          

            $tasks = $project->tasks()
            ->with([
                'assignedTo:id,name,email',
                'assignedTo.usersInfo:job,user_id',
                'creator:id,name,email',
                'creator.usersInfo:job,user_id'
            ])
            ->get();  
    
            $transformedTasks = $tasks->map(function ($task) use ($isCreator) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'assignee' => $task->assignedTo ? $task->assignedTo->name : null,
                    'assigneejob' => optional($task->assignedTo->usersInfo)->job,
                    'key' => $task->key,
                    'created_at'=>$task->created_at,
                    'updated_at'=>$task->updated_at,
                    'due_date' => $task->due_date,
                    'creator' => $task->creator ? [
                        'id' => $task->creator->id,
                        'name' => $task->creator->name,
                        'email' => $task->creator->email,
                        
                    ] : null
                ];
            });
    
            return response()->json(["tasks" => $transformedTasks]);
    
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }
    
    public function create(Request $request, $projectId)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return response()->json(["message" => "User not found"], 404);
    
            $project = Project::find($projectId);
            if (!$project) return response()->json(["message" => "Project not found"], 404);
    
            $isCreator = $project->created_by === $user->id;
            $isCollaborator = $project->users()->where('user_id', $user->id)->exists();
    
            if (!$isCreator && !$isCollaborator) {
                return response()->json(["message" => "Access denied"], 403);
            }
    
            $task = Task::create([
                'title' => $request->title,
                'description' => $request->description,
                'status' => $request->status,
                'priority' => $request->priority,
                'due_date' => $request->due_date,
                'project_id' => $projectId,
                'created_by' => $user->id,
                'assigned_to' => $request->assigned_to
            ]);
    
            if ($request->assigned_to) {
                $assignedUser = User::find($request->assigned_to);
                if ($assignedUser) {
                    $assignedUser->notify(new TaskCreatedNotification($task, $project));
                }
            }
    
            return response()->json(["task" => $task], 201);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    
    public function updateTask(Request $request, $projectId, $taskId) {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return response()->json(["message" => "User not found"], 404);
    
            $project = Project::find($projectId);
            if (!$project) return response()->json(["message" => "Project not found"], 404);
    
            $isCreator = $project->created_by === $user->id;
            $isCollaborator = $project->users()->where('user_id', $user->id)->exists();
    
            if (!$isCreator && !$isCollaborator) {
                return response()->json(["message" => "Access denied"], 403);
            }
    
            $task = Task::find($taskId);
            if (!$task) return response()->json(["message" => "Task not found"], 404);
    
            $task->update([
                'title' => $request->title,
                'description' => $request->description,
                'status' => $request->status,
                'priority' => $request->priority,
                'due_date' => $request->due_date,
                'assigned_to' => $request->assigned_to
            ]);
    
            if ($request->assigned_to) {
                $assignedUser = User::find($request->assigned_to);
                if ($assignedUser) {
                    $assignedUser->notify(new TaskUpdatedNotification($task, $project));
                }
            }
    
            return response()->json(["task" => $task], 200);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    
    public function deleteTask($id){
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return response()->json(["message" => "User not found"], 404);
    
            $task = Task::find($id);
            if (!$task) return response()->json(["message" => "Task not found"], 404);
    
            $project = Project::find($task->project_id);
            if (!$project) return response()->json(["message" => "Project not found"], 404);
    
            $isCreator = $project->created_by === $user->id;
            $isCollaborator = $project->users()->where('user_id', $user->id)->exists();
    
            if (!$isCreator && !$isCollaborator) {
                return response()->json(["message" => "Access denied"], 403);
            }
    
            $task->delete();
            return response()->json(["message" => "Task deleted successfully"], 200);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    
    public function memberOfProject($id){
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return response()->json(["message" => "User not found"], 404);
    
            $project = Project::find($id);
            if (!$project) return response()->json(["message" => "Project not found"], 404);
    
            $isCreator = $project->created_by === $user->id;
            $isCollaborator = $project->users()->where('user_id', $user->id)->exists();
    
            if (!$isCreator && !$isCollaborator) {
                return response()->json(["message" => "Access denied"], 403);
            }
    
            return response()->json(["isMember" => true], 200);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
    
    public function updateStatus(Request $request, $taskId)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return response()->json(["message" => "User not found"], 404);
    
            $task = Task::find($taskId);
            if (!$task) return response()->json(["message" => "Task not found"], 404);
    
            $project = Project::find($task->project_id);
            if (!$project) return response()->json(["message" => "Project not found"], 404);
    
            $isCreator = $project->created_by === $user->id;
            $isCollaborator = $project->users()->where('user_id', $user->id)->exists();
    
            if (!$isCreator && !$isCollaborator) {
                return response()->json(["message" => "Access denied"], 403);
            }
    
            $task->update([
                'status' => $request->status
            ]);
    
            return response()->json(["task" => $task], 200);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }
}
