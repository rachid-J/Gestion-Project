<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectInviteController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;

Route::prefix("auth")->group(function(){
    Route::post("/login" ,[AuthController::class ,"login"]);
    Route::post("/register" ,[AuthController::class ,"register"]);
    Route::get("/me" ,[AuthController::class ,"me"]);
});

Route::post('/projects/{project}/invite', [ProjectInviteController::class, 'invite']);
Route::post('/invitations/accept', [ProjectInviteController::class, 'accept']);

Route::prefix('project')->group(function(){
    Route::get('/getProjects', [ProjectController::class, 'get']);
    Route::get("/searchProjectbyName/{name}",[ProjectController::class, 'searchProjectbyName']);
    Route::get("/filterProjectsByStatus/{status}",[ProjectController::class, 'filterProjectsByStatus']);
    Route::post('/createProject', [ProjectController::class, 'create']);
    Route::put('/updateProject/{id}', [ProjectController::class, 'update']);
    Route::delete('/deleteProject/{id}', [ProjectController::class, 'delete']);
});

Route::prefix('task')->group(function(){
    Route::get('/getTasks',[TaskController::class,'getTasks']);
    Route::post('/createTask/{id}',[TaskController::class,'create']);
    Route::delete('/deleteTask/{id}',[TaskController::class,'deleteTask']);
    Route::put('/updateTask/projects/{projectId}/tasks/{taskId}',[TaskController::class,'updateTask']);
});


