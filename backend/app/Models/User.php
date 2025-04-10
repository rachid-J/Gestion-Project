<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    
    use HasFactory, Notifiable ;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'username',
        'password',
  
    ];
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_user', 'user_id', 'project_id');
       
    }
    public function createdProjects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    public function collaboratingProjects()
    {
        return $this->belongsToMany(Project::class, 'project_user', 'user_id', 'project_id')
            ->withPivot('role'); 
    }


    public function allProjects()
    {
        $created = $this->createdProjects()->selectRaw('projects.*, "creator" as role');
        $collaborating = $this->collaboratingProjects()->selectRaw('projects.*, project_user.role as role');

        return $created->union($collaborating)->latest();
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    public function assignedTasks()
{
    return $this->hasMany(Task::class, 'assigned_to');
}

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function notifications()
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')->orderBy('created_at', 'desc');
    }

    public function contacts()
    {
        return $this->belongsToMany(User::class, 'user_contacts', 'user_id', 'contact_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function acceptedContacts()
    {
        return $this->contacts()->wherePivot('status', 'accepted');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */

     public function usersInfo()
     {
         return $this->hasOne(UsersInfo::class);
     }

    protected $hidden = [
        'password'
    ];



    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
