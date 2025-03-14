<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Invitation extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = ['project_id', 'sender_id', 'email', 'token', 'status'];

    public function project() {
        return $this->belongsTo(Project::class);
    }
    
    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }
}