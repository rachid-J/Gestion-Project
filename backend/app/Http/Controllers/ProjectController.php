<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProjectController extends Controller
{
    public function get(){
        try{
            $user = JWTAuth::parseToken()->authenticate();	
            if(!$user){
                return response()->json(["error" => "User not found"],404);
            }
            $projects = Project::where("created_by", $user->id)->get();
            return response()->json(["projects" => $projects]);
        }catch(Exception $e){
            return response()->json(["error" => $e->getMessage()],500);
        }
    }
    public function create(Request $request){
        try{
            $user = JWTAuth::parseToken()->authenticate();	
            if(!$user){
                return response()->json(["error" => "User not found"],404);
            }
            $validatedData = $request->validate([
                "created_by" => "required|exists:users,id",
                "name" => "required|string",
                "description" => "required|string",
                "start_date" => "required|date",
                "end_date" => "required|date",
                "status" => "required|in:pending,in_progress,completed",
            ]);
            $project = Project::create([
                "created_by" => $user->id,
                "name" => $validatedData["name"],
                "description" => $validatedData["description"],
                "start_date" => $validatedData["start_date"],
                "end_date" => $validatedData["end_date"],
                "status" => $validatedData["status"],
            ]);
            return response()->json([
                "message" => "Project created",
                "project" => $project
            ]);
        }catch(Exception $e){
            return response()->json(["error" =>  $e->getMessage()],500);
        }
    }

    public function update(Request $request, $id){
        try{
            $user = JWTAuth::parseToken()->authenticate();
            if(!$user){
                return response()->json(["error" => "User not found"],404);
            }
            $project = Project::find($id);
            if(!$project){
                return response()->json(["error" => "Project not found"],404);
            }
            if($project->created_by != $user->id){
                return response()->json(["error" => "Unauthorized"],401);	
            }
            $validatedData = $request->validate([
                "name" => "required|string",
                "description" => "required|string",
                "start_date" => "required|date",
                "end_date" => "required|date",
                "status" => "required|in:pending,in_progress,completed",
            ]);
            $project->name = $validatedData["name"];
            $project->description = $validatedData["description"];
            $project->start_date = $validatedData["start_date"];
            $project->end_date = $validatedData["end_date"];
            $project->status = $validatedData["status"];
            $project->save();
            return response()->json([
                "message" => "Project updated",
                "project" => $project
            ]);
        }catch(Exception $e){
            return response()->json(["error" => $e->getMessage()],500);
        }	
    }

    public function delete($id){
        try{
            $user = JWTAuth::parseToken()->authenticate();
            if(!$user){
                return response()->json(["error" => "User not found"],404);
            }
            $project = Project::find($id);
            if(!$project){
                return response()->json(["error" => "Project not found"],404);
            }
            if($project->created_by != $user->id){
                return response()->json(["error" => "Unauthorized"],401);
            }
            $project->delete();
            return response()->json(["message" => "Project deleted"]);
        }catch(Exception $e){
            return response()->json(["error" => $e->getMessage()],500);
        }
    }
}
