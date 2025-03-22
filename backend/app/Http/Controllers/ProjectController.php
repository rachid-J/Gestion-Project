<?php

namespace App\Http\Controllers;

use App\Models\Project;

use App\Notifications\ProjectDeletedNotification;
use App\Notifications\ProjectUpdatedNotification;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProjectController extends Controller
{


    public function getAll()
    {
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
    
            // Combine results using SQL UNION and get all records
            $allProjects = $createdProjects->union($collaboratingProjects)->get();
    
            return response()->json(["projects" => $allProjects], 200);
    
        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }
    
    public function get()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(["error" => "User not found"], 404);
            }


            $createdProjects = Project::where("created_by", $user->id)
                ->with(["users", "creator:id,email,name,username"])
                ->selectRaw('projects.*, "creator" as role');


            $collaboratingProjects = $user->projects()
                ->selectRaw('projects.*, project_user.role as role');

            // Combine results using SQL UNION
            $allProjects = $createdProjects->union($collaboratingProjects)->paginate(5);

            return response()->json(["projects" => $allProjects], 200);

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
    
            $searchTerm = '%' . $name . '%';
    
            // Get projects created by user matching name
            $createdProjects = Project::where("created_by", $user->id)
                ->where("name", "LIKE", $searchTerm)
                ->with(["users", "creator:id,email,name,username"])
                ->selectRaw('projects.*, "creator" as role');
    
            // Get projects where user is collaborator matching name
            $collaboratingProjects = $user->projects()
                ->where("projects.name", "LIKE", $searchTerm)
                ->with(["users", "creator:id,email,name,username"])
                ->selectRaw('projects.*, project_user.role as role');
    
            // Combine results with union and paginate
            $combinedProjects = $createdProjects->union($collaboratingProjects)
                ->orderBy('created_at', 'desc')
                ->paginate(5);
    
            return response()->json([
                "projects" => $combinedProjects
            ], 200);
    
        } catch (Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], 500);
        }
    }

    public function filterProjectsByStatus($status)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(["error" => "User not found"], 404);
            }

            $createdProjects = Project::where("created_by", $user->id)
            ->where("status", "LIKE", $status)
            ->with(["users", "creator:id,email,name,username"])
            ->selectRaw('projects.*, "creator" as role');

        // Get projects where user is collaborator matching name
        $collaboratingProjects = $user->projects()
            ->where("projects.status", "LIKE", $status)
            ->with(["users", "creator:id,email,name,username"])
            ->selectRaw('projects.*, project_user.role as role');

        // Combine results with union and paginate
        $combinedProjects = $createdProjects->union($collaboratingProjects)
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        return response()->json([
            "projects" => $combinedProjects
        ], 200);
    
} catch (Exception $e) {
    return response()->json([
        "message" => $e->getMessage()
    ], 500);
}
}

    public function create(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(["error" => "User not found"], 404);
            }
            $validatedData = $request->validate([
                "name" => "required|string",
                "description" => "required|string",
            ]);
            $project = Project::create([
                "created_by" => $user->id,
                "name" => $validatedData["name"],
                "description" => $validatedData["description"],
                "start_date" => new DateTime(),
                "status" => "pending",
            ]);
            $project->users()->attach($user->id, ['role' => 'creator']);
            return response()->json([
                "message" => "Project created",
                "project" => $project
            ],200);
        } catch (Exception $e) {
            return response()->json(["error" => $e->getMessage()], 500);
        }
    }

   public function delete($id)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) return response()->json(["error" => "User not found"], 404);
        
        $project = Project::find($id);
        if (!$project) return response()->json(["error" => "Project not found"], 404);
        if ($project->created_by != $user->id) return response()->json(["error" => "Unauthorized"], 401);


        $project->delete();

        return response()->json(["message" => "Project deleted",]);
    } catch (Exception $e) {
        return response()->json(["error" => $e->getMessage()], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) return response()->json(["error" => "User not found"], 404);
        
        $project = Project::find($id);
        if (!$project) return response()->json(["error" => "Project not found"], 404);
        if ($project->created_by != $user->id) return response()->json(["error" => "Unauthorized"], 401);

        $validatedData = $request->validate([
            "name" => "sometimes|string",
            "description" => "sometimes|string",
            "end_date" => "sometimes|date",
            "status" => "sometimes|in:pending,in_progress,completed",
        ]);
        $project->update($validatedData);

        $collaborators = $project->users()->get();

            foreach ($collaborators as $collaborator) {
                try {
                    $collaborator->notify(
                        new ProjectUpdatedNotification(
                            $project, 
                            $collaborator
                        )
                    );
                } catch (Exception $e) {
                    Log::error("Notification failed: " . $e->getMessage());
                }
            }

        return response()->json(["message" => "Project updated", "project" => $project,
    "colab"=>$collaborators], 200);
    } catch (Exception $e) {
        return response()->json(["error" => $e->getMessage()], 500);
    }
}
    public function getUsers(Project $project)
    {
        $users = $project->users()->withPivot('role')->get();
        return response()->json($users);
    }
}

