<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectInviteController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;

Route::prefix("auth")->group(function(){
    Route::post("/login" ,[AuthController::class ,"login"]);
    Route::post("/register" ,[AuthController::class ,"register"]);
    Route::get("/me" ,[AuthController::class ,"me"]);
});

Route::post('/projects/{project}/invite', [ProjectInviteController::class, 'invite']);
Route::post('/invitations/accept', [ProjectInviteController::class, 'accept']);
Route::get('/invitations', [ProjectInviteController::class, 'index']);

Route::prefix('project')->group(function(){
    Route::get('/getProjects', [ProjectController::class, 'get']);
    Route::post('/createProject', [ProjectController::class, 'create']);
    Route::put('/updateProject/{id}', [ProjectController::class, 'update']);
    Route::delete('/deleteProject/{id}', [ProjectController::class, 'delete']);
});

