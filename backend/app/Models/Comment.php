<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'user_id',
        'task_id',
       
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withDefault([
            'name' => 'Deleted User',
            'email' => 'unknown@example.com'
        ]);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
    public function project()
{
    return $this->belongsTo(Project::class);
}


    // Add validation rules
    public static function rules()
    {
        return [
            'content' => 'required|string|max:2000',
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id'
        ];
    }
}