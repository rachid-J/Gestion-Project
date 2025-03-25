<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_name',
        'file_path',
        'user_id',
        'task_id',
        'mime_type',
        'size'
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withDefault([
            'name' => 'Unknown User',
            'email' => 'unknown@example.com'
        ]);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    // Add URL accessor
    public function getUrlAttribute()
    {
        return Storage::url($this->file_path);
    }

    // Add validation rules
    public static function rules()
    {
        return [
            'file' => 'required|file|max:5120|mimes:pdf,jpg,png,doc,docx,txt',
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id'
        ];
    }

    // Automatically delete file when model is deleted
    protected static function booted()
    {
        static::deleted(function ($attachment) {
            Storage::delete($attachment->file_path);
        });
    }
}