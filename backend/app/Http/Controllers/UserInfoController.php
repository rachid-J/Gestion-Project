<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\UserInfo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserInfoController extends Controller
{
    public function update(Request $request)
    {
        $user = JWTAuth::user();

        $validated = $request->validate([
            'background' => 'nullable|string',
            'job' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
        ]);

        $userInfo = $user->userInfo()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'message' => 'User info updated successfully',
            'userInfo' => $userInfo
        ]);
    }

 
    public function showindex()
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

            // Combine results using SQL UNION
            $allProjects = $createdProjects->union($collaboratingProjects)->take(4) // <-- This limits to 4 results
            ->get();

            return response()->json(["projects" => $allProjects], 200);

        } catch (Exception $e) {
            return response()->json([
                "error" => $e->getMessage()
            ], 500);
        }
    }
    
}