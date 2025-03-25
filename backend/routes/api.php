<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserInfoController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectInviteController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactInvitationController;
use App\Http\Controllers\NotificationController;

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// User Profile Routes
Route::middleware('api')->prefix('/user')->group(function () {
    Route::get('/{username}/projects', [UserInfoController::class, 'showindex']);
    Route::get('/{username}/profile', [UserInfoController::class, 'getUserProfile']);
    Route::put('/update', [UserInfoController::class, 'update']);
});

// Project Management Routes
Route::middleware('auth:api')->prefix('project')->group(function () {
    Route::get('/searchProjectbyName/{name}', [ProjectController::class, 'searchProjectbyName']);
    Route::get('/filterProjectsByStatus/{status}', [ProjectController::class, 'filterProjectsByStatus']);
    Route::get('/getAllProject', [ProjectController::class, 'getAll']);
    Route::get('/getProjects', [ProjectController::class, 'get']);
    Route::post('/createProject', [ProjectController::class, 'create']);
    
    Route::middleware('project.owner')->group(function () {
        Route::put('/updateProject/{id}', [ProjectController::class, 'update']);
        Route::delete('/deleteProject/{id}', [ProjectController::class, 'delete']);
       
    });
});
Route::middleware('project.owner')->post('/projects/{project}/invite', [ProjectInviteController::class, 'invite']);
// Project Collaboration Routes
Route::get('/projects/{project}/users', [ProjectController::class, 'getUsers']);
Route::get('/project-invitations/verify', [ProjectInviteController::class, 'verify']);
Route::post('/invitations/accept', [ProjectInviteController::class, 'accept']);
Route::get('/invitations/received', [ProjectInviteController::class, 'receivedInvitations']);

// Task Management Routes
Route::prefix('task')->group(function () {
    Route::get('/getTasks/{projectId}', [TaskController::class, 'getTasks']);
    Route::get('/getAllTasks/{projectId}', [TaskController::class, 'getAllTasks']);
    Route::patch('/{taskId}/status', [TaskController::class, 'updateStatus']);
    Route::get('/memberOfProject/{id}', [TaskController::class, 'memberOfProject']);

    Route::middleware('project.owner')->group(function () {
        Route::post('/createTask/{id}', [TaskController::class, 'create']);
        Route::delete('/deleteTask/{id}', [TaskController::class, 'deleteTask']);
        Route::patch('/projects/{projectId}/tasks/{taskId}', [TaskController::class, 'updateTask']);
    });

    // Task Comments & Attachments
    Route::get('/{task}/comments', [CommentController::class, 'index']);
    Route::post('/{task}/comments', [CommentController::class, 'store']);
    Route::get('/{task}/attachments', [AttachmentController::class, 'index']);
    Route::post('/{task}/attachments', [AttachmentController::class, 'store']);
    Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy']);
});

// Contact Management Routes
Route::middleware('auth:api')->group(function () {
    Route::post('/contact-invite', [ContactInvitationController::class, 'send']);
    Route::post('/contact-invite/accept', [ContactInvitationController::class, 'accept']);
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contact-invitations/verify', [ContactInvitationController::class, 'verifyInvitation']);
    Route::get('/contact-invitations/received', [ContactInvitationController::class, 'receivedInvitations']);
    Route::get('/contact-invitations/sent', [ContactInvitationController::class, 'sentInvitations']);
});

// Notification Routes
Route::middleware('auth:api')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/mark-read', [NotificationController::class, 'markAsRead']);
});

// Project Invitation Management
Route::prefix('invitations/project')->group(function () {
    Route::get('{projectId}/sent', [ProjectInviteController::class, 'sentInvitations']);
    Route::post('/decline', [ProjectInviteController::class, 'decline']);
    Route::delete('/{invitation}', [ProjectInviteController::class, 'cancel']);
});