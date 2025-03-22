<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Models\UsersInfo;
use Exception;
use Illuminate\Http\Request;


use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserInfoController extends Controller
{
   

 
    
    public function update(Request $request)
    {
        // Retrieve the authenticated user
        $user = JWTAuth::user();
    
        $validated = $request->validate([
            'background'    => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'job'           => 'nullable|string|max:255',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:255',
            'city'          => 'nullable|string|max:255',
        ]);
    
      
        $userInfo = $user->usersInfo;
        if (!$userInfo) {
            $userInfo = new UsersInfo();
            $userInfo->user_id = $user->id;
        }
    
       
        foreach (['job', 'phone', 'address', 'city'] as $field) {
            $userInfo->$field = array_key_exists($field, $validated) && $validated[$field] !== '' 
                ? $validated[$field] 
                : null;
        }
    
        
        if ($request->hasFile('background')) {
            
            if ($userInfo->background) {
                Storage::disk('public')->delete($userInfo->background);
            }
           
            $userInfo->background = $request->file('background')->store('backgrounds', 'public');
        }
    
        
        if ($request->hasFile('profile_photo')) {
          
            if ($userInfo->profile_photo) {
                Storage::disk('public')->delete($userInfo->profile_photo);
            }
           
            $userInfo->profile_photo = $request->file('profile_photo')->store('profile_photos', 'public');
        }
    
        
        $userInfo->save();
    
        return response()->json([
            'message'  => 'Profile updated successfully',
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
            ->where('status', 'in_progress')
            ->with(["users", "creator:id,email,name"])
            ->selectRaw('projects.*, "creator" as role');

        $collaboratingProjects = $user->projects()
            ->where('status', 'in_progress')
            ->selectRaw('projects.*, project_user.role as role');

        $allProjects = $createdProjects->union($collaboratingProjects)
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get();

        return response()->json(["projects" => $allProjects], 200);

    } catch (Exception $e) {
        return response()->json([
            "error" => "Server error: " . $e->getMessage()
        ], 500);
    }
    }
    public function getUserProfile($username){
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json(["error" => "User not found"], 404);
        }
        $user->load('usersInfo');
        return response()->json([
            'user' => $user,
        ]);
    }
    
}