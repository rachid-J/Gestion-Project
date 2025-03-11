<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;


Route::prefix('project')->group(function(){
    Route::get('/getProjects', [ProjectController::class, 'get']);
    Route::post('/createProject', [ProjectController::class, 'create']);
    Route::put('/updateProject/{id}', [ProjectController::class, 'update']);
    Route::delete('/deleteProject/{id}', [ProjectController::class, 'delete']);
});


Route::post("/login" ,[AuthController::class ,"login"]);