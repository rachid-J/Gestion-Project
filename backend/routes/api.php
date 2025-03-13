<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;

Route::post("/login" ,[AuthController::class ,"login"]);

Route::post("/register" ,[AuthController::class ,"register"]);



Route::prefix('project')->group(function(){
    Route::get('/getProjects', [ProjectController::class, 'get']);
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


