<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;


class Project extends Model
{
    use HasFactory, Notifiable ;
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];
 
   
    public function users()
{
    return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
        ->withPivot('role')
        ->withTimestamps();
}
    public function creator() {
        return $this->belongsTo(User::class, 'created_by')->select(["id",'email', 'name','role']);
    }
    
    public function invitations() {
        return $this->hasMany(Invitation::class);
    }
    public function notifications()
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')->orderBy('created_at', 'desc');
    }
  
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function comments()
    {
        return $this->hasManyThrough(Comment::class, Task::class);
    }


public function attachments()
{
    return $this->hasMany(Attachment::class);
}
}
