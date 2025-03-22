<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactInvitationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProjectInviteController;
use App\Http\Controllers\UserInfoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;

Route::prefix("auth")->group(function(){
    Route::post("/login" ,[AuthController::class ,"login"]);
    Route::post("/register" ,[AuthController::class ,"register"]);
    Route::get("/me" ,[AuthController::class ,"me"]);
    Route::post("/logout" ,[AuthController::class ,"logout"]);
});

Route::middleware("api")->prefix('/user')->group(function () {
Route::get('/projects', [UserInfoController::class, 'showindex']);
Route::put('/update', [UserInfoController::class, 'update']);
});

Route::get('/projects/{project}/users', [ProjectController::class, 'getUsers']);
Route::get('/project-invitations/verify', [ProjectInviteController::class, 'verify']);
Route::post('/projects/{project}/invite', [ProjectInviteController::class, 'invite']);
Route::post('/invitations/accept', [ProjectInviteController::class, 'accept']);
Route::get('/invitations/received', [ProjectInviteController::class, 'receivedInvitations']);

Route::post('/contact-invite', [ContactInvitationController::class, 'send']);
Route::post('/contact-invite/accept', [ContactInvitationController::class, 'accept']);

Route::middleware('auth:api')->group(function() {  
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contact-invitations/verify', [ContactInvitationController::class, 'verifyInvitation']);
    Route::get('/contact-invitations/received', [ContactInvitationController::class, 'receivedInvitations']);
    Route::get('/contact-invitations/sent', [ContactInvitationController::class, 'sentInvitations']);
   
});

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


Route::middleware('auth:api')->group(function () {
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/mark-read', [NotificationController::class, 'markAsRead']);
});