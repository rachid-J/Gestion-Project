<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class UsersInfo extends Model
{
  protected $table = 'users_infos';
    use HasFactory ;

    protected $fillable = [
        'user_id',
        'background',
        'profile_photo',
        'job',
        'phone',
        'address',
        'city'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}