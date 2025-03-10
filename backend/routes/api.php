<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::prefix('project')->group(function(){
    Route::get('/getProjects', [ProjectController::class, 'get']);
    Route::post('/createProject', [ProjectController::class, 'create']);
    Route::put('/updateProject/{id}', [ProjectController::class, 'update']);
    Route::delete('/deleteProject/{id}', [ProjectController::class, 'delete']);
});

