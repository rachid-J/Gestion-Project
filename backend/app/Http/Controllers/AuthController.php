<?php

namespace App\Http\Controllers;

use App\Models\User;

use App\Models\UsersInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $token,
            'user' => JWTAuth::user(),
        ]);

    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
        ]);
        UsersInfo::create([
            'user_id' => $user->id,
        ]);

        $token = JWTAuth::fromUser($user);
        $user->load('usersInfo');

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function verifyToken(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();


            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token invalid'], 401);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        return response()->json([
            'message' => 'Token is valid',
            'user' => $user,
        ], 200);
    }

    public function me()
    {
        try {
            $user = JWTAuth::user();
            
            if (!$user) {
                return response()->json(["error" => "Unauthenticated"], 401);
            }
            $user->load('usersInfo');
            return response([
                "user" => $user,
               
            ]);
        } catch (TokenExpiredException $e) {
            return response()->json(["error" => "Token has expired"], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(["error" => "Invalid token"], 401);
        } catch (JWTException $e) {
            return response()->json(["error" => "Token is missing"], 401);
        } catch (\Exception $e) {
            return response()->json(["error" => "Something went wrong"], 500);
        }
    }

    public function logout()
    {
        try {
            JWTAuth::parseToken()->invalidate();
            return response()->json(['message' => 'User logged out successfully']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to logout'], 500);
        }
    }
 

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);
    
        $user = JWTAuth::user();
    
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Password is incorrect'], 401);
        }
    
        JWTAuth::invalidate(JWTAuth::getToken());
        $user->delete();
    
        return response()->json(['message' => 'Account deleted successfully']);
    }
public function updateAccount(Request $request)
{
    $user = JWTAuth::user();
    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
        'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
        'job' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
        'city' => 'nullable|string|max:255',
    ]);

    $user->update($request->only(['name', 'email', 'username']));

    $user->usersInfo()->updateOrCreate(
        ['user_id' => $user->id],
        $request->only(['job', 'phone', 'address', 'city'])
    );

    $user->load('usersInfo');

    return response()->json([
        'message' => 'Account updated successfully',
        'user' => $user
    ]);
}

public function changePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required|string',
        'new_password' => 'required|string|min:8|confirmed',
    ]);

    $user = JWTAuth::user();

    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json(['message' => 'Current password is incorrect'], 401);
    }

    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json(['message' => 'Password updated successfully']);
}
}
