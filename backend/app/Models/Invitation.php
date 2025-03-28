<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Invitation extends Model
{
    use HasFactory, Notifiable ,SoftDeletes;

    protected $fillable = ['project_id', 'sender_id', 'email','receiver_id', 'token', 'status'];

  
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    public function recipient()
    {
        return $this->belongsTo(User::class, 'receiver_id')->withDefault([
            'name' => 'Deleted User',
            'email' => $this->email 
        ]);
    }
}