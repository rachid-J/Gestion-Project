<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProjectController extends Controller
{
    public function get() {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json(["error" => "User not found"], 404);
            }
    
      
            $createdProjects = Project::where("created_by", $user->id)
                ->with(["users", "creator:id,email,name"])
                ->selectRaw('projects.*, "creator" as role');
    
      
            $collaboratingProjects = $user->projects()
                ->selectRaw('projects.*, project_user.role as role');
    
            // Combine results using SQL UNION
            $allProjects = $createdProjects->union($collaboratingProjects)->paginate(1);
    
            return response()->json(["projects" => $allProjects],200);
    
        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function searchProjectbyName($name)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(["error" => "User not found"], 404);
            }

            $projects = Project::where('name', 'LIKE', "%$name%")
                ->with(["users", "creator:id,email,name"])
                ->where('created_by', $user->id)
                ->paginate(1);

            return response()->json([
                "projects" => $projects
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], 500);
        }
    }

    public function filterProjectsByStatus($status){
        try{
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(["error" => "User not found"], 404);
            }

            $projects = Project::where("created_by",$user->id)
                ->where("status",$status)
                ->with(["users", "creator:id,email,name"])
                ->latest()
                ->get();
            if(!$projects){
                return response()->json([
                    "message" => "Not Found"
                ],404);
            }
            return response()->json([
                "projects" => $projects
            ],200);
        }catch(Exception $e){
            return response()->json([
                "message" => $e->getMessage()
            ],500);
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
