<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;

class ContactInvitations extends Model
{
    use HasFactory, Notifiable;
    protected $table = 'contact_invitations'; // Explicit table name

    protected $fillable = [
        'sender_id', 
        'recipient_email',
        'token',
        'status'
    ];

   
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

   
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_email', 'email');
    }
}