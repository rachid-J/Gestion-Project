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
    public function getTasks(){
        try{
            $user = JWTAuth::parseToken()->authenticate();
            if(!$user){
                return response()->json([
                    "message"=>"User not found"
                ]);
            }
            $projects = Project::where("created_by",$user->id)
                                ->with("tasks")                
                                ->get();
                                
            return response()->json([
                "projects" => $projects
            ]);

        }catch(Exception $e){
            return response()->json([
                "error" => $e->getMessage()
            ]);
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

            $valiadtion = $request->validate([
                "title"=>"string|required",
                "description"=>"string|required",
                "status"=>"string|in:to_do,in_progress,done",
                "priority"=>"string|in:low,medium,high",
                "due_date"=>"string|date",
            ]);

            Task::create([
                "title"=>$valiadtion["title"],
                "description"=>$valiadtion["description"],
                "status"=> $valiadtion["status"],
                "priority"=> $valiadtion["priority"],
                "due_date"=> $valiadtion["due_date"],
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
}
