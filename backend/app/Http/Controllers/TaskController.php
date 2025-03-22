<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskController extends Controller
{
    public function getTasks($id){
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    "message" => "User not found"
                ], 404);
            }

            $project = Project::find($id);
    
            if (!$project) {
                return response()->json([
                    "message" => "Project not found"
                ], 404);
            }
    
            $isCreator = $project->created_by === $user->id;
    
            $isCollaborator = $project->users()->where('user_id', $user->id)->exists();
    
            if (!$isCreator && !$isCollaborator) {
                return response()->json([
                    "message" => "You do not have access to this project"
                ], 403);
            }
    
            $tasks = $project->tasks()->paginate(3);
    
            $tasks->getCollection()->transform(function ($task) use ($isCreator, $project) {
                $task->role = $isCreator ? 'creator' : 'member';
                $task->creator = [
                    'id' => $project->created_by,
                    'role' => 'creator'
                ];
                return $task;
            });
    
            return response()->json([
                "tasks" => $tasks
            ]);
    
        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function create(Request $request,$id){
        try{
            $user = JWTAuth::parseToken()->authenticate();
            if(!$user){
                return response()->json([
                    "message"=>"User not found"
                ],404);
            }
            $project = Project::where("created_by",$user->id)->find($id);

            $validation = $request->validate([
                "title"=>"string|required",
                "description"=>"string|required",
                "priority"=>"string|in:low,medium,high",
                "due_date"=>"string|date",
                "assigned_to" => "required|integer|exists:users,id"
            ]);

            Task::create([
                "title"=>$validation["title"],
                "description"=>$validation["description"],
                "priority"=> $validation["priority"],
                "due_date"=> $validation["due_date"],
                "assigned_to"=>$validation["assigned_to"],
                "project_id"=>$project->id
            ]);
            
            return response()->json([
                "message"=>"created successfully"
            ]);

        }catch(Exception $e){
            return response()->json([
                "error"=>$e->getMessage()
            ],500);
        };
    }

    public function updateTask(Request $request,$projectId,$taskId){
        try{
            $user = JWTAuth::parseToken()->authenticate();
            if(!$user){
                return response()->json([
                    "message"=>"User not found"
                ],404);
            }
            $project = Project::where("created_by",$user->id)->find($projectId);
            if(!$project){
                return response()->json([
                    "message"=>"project not found"
                ],404);
            };  
            $task = Task::where("project_id",$project->id)->find($taskId);
            if(!$task){
                return response()->json([
                    "message"=>"Task not foud"
                ],404);
            }

            $validation = $request->validate([
                "title"=>"string|sometimes",
                "description"=>"string|sometimes",
                "status"=>"string|in:to_do,in_progress,done|sometimes",
                "priority"=>"string|in:low,medium,high|sometimes",
                "due_date"=>"string|date|sometimes",
            ]);

            $task->update($validation);
            return response()->json([
                "message"=>"updated successfully"
            ]);

        }catch(Exception $e){
            return response()->json([
                "error"=>$e->getMessage()
            ],500);
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
                    "message" => "Project not found or you are not a member"
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
    
}
