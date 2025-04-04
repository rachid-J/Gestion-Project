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
    
            return response()->json(["tasks" => $tasks]);
    
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
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
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
    
            $project = Project::where('id', $projectId)
                ->where('created_by', $user->id)
                ->first();
    
            if (!$project) {
                return response()->json(['message' => 'Project not found or unauthorized'], 404);
            }
    
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'sometimes|string|in:low,medium,high',
                'due_date' => 'required|date|after_or_equal:today',
                'assigned_to' => 'required|exists:users,id',
                'status' => 'sometimes|string|in:to_do,in_progress,done'
            ]);
    
         
            if (!$project->users()->where('user_id', $validated['assigned_to'])->exists()) {
                return response()->json(['message' => 'Assigned user is not a project member'], 400);
            }
    
            $task = Task::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'priority' => strtolower($validated['priority'] ?? 'medium'),
                'status' => strtolower($validated['status'] ?? 'to_do'),
                'due_date' => Carbon::parse($validated['due_date']),
                'assigned_to' => $validated['assigned_to'],
                'project_id' => $project->id,
                'created_by' => $user->id
            ]);
    
            $task->project->users()
            ->where('users.id', '!=', $user->id)
            ->each(function ($user) use ($task) {
                $user->notify(new TaskCreatedNotification($task, auth("api")->user()));
            });
            return response()->json([
                'message' => 'Task created successfully',
                
            ], 201);
    
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Invalid token'], 401);
        } catch (Exception $e) {
            Log::error('Task Creation Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Server error',
                'error' => config('app.debug') ? $e->getMessage() : 'Please try again later'
            ], 500);
        }
    }

    public function updateTask(Request $request, $projectId, $taskId) {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(["message" => "User not found"], 404);
            }
    
            $project = Project::where("created_by", $user->id)->find($projectId);
            if (!$project) {
                return response()->json(["message" => "Project not found"], 404);
            }
    
            $task = Task::where("project_id", $project->id)->find($taskId);
            if (!$task) {
                return response()->json(["message" => "Task not found"], 404);
            }
    
            $validation = $request->validate([
                "title" => "string|sometimes",
                "description" => "string|sometimes",
                "status" => "string|in:to_do,in_progress,done|sometimes",
                "assigned_to" => "nullable|exists:users,id",
                "due_date" => "nullable|date",
            ]);
    
            $validation['due_date'] = $validation['due_date'] ?? null;
            
            $task->update($validation);
            $task->project->users()
            ->where('users.id', '!=', $user->id)
            ->each(function ($user) use ($task) {
                $user->notify(new TaskUpdatedNotification($task, auth("api")->user()));
            });
    
         
            return response()->json([
                "message" => "Task updated successfully",
                "task" => $task
            ]);
    
        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function deleteTask($id){
        try{    
            $user = JWTAuth::parseToken()->authenticate();

            if(!$user){
                return response()->json([
                    "message"=>"user not found"
                ],404);
            }
            $task = Task::find($id);
            $task->delete();
            return response()->json([
                "message"=>"deleted successfully",
            ]);

        }catch(Exception $e){
            return response()->json([
                "error"=>$e->getMessage()
            ],500);
        }
    }
    public function memberOfProject($id){
        try {
            $user = JWTAuth::parseToken()->authenticate();
    
            $project = Project::where("id", $id)
                              ->whereHas("users", function ($query) use ($user) {
                                  $query->where("created_by", $user->id);
                              })
                              ->with("users")
                              ->first();
    
            if (!$project) {
                return response()->json([
                    "message" => "Project not found or you are not a creator"
                ], 404);
            }
    
            return response()->json([
                "members" => $project->users
            ]);
        } catch (Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], 500);
        }
    }
    public function updateStatus(Request $request, $taskId)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json(["message" => "User not found"], 404);
        }

        $task = Task::find($taskId);
        if (!$task) {
            return response()->json(["message" => "Task not found"], 404);
        }

        $project = Project::where('id', $task->project_id)
            ->where(function($query) use ($user) {
                $query->where('created_by', $user->id)
                      ->orWhereHas('users', function($q) use ($user) {
                          $q->where('user_id', $user->id);
                      });
            })->first();

        if (!$project) {
            return response()->json(["message" => "Unauthorized access"], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:to_do,in_progress,done'
        ]);

        $task->update(['status' => $validated['status']]);

        return response()->json([
            "message" => "Status updated successfully",
            "task" => $task
        ]);

    } catch (Exception $e) {
        return response()->json(["error" => $e->getMessage()], 500);
    }
}
    
}
