<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommentAddedNotification extends Notification
{
    use Queueable;

    public function __construct(public $comment)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'comment_added',
            'message' => "New comment on task: {$this->comment->task->title}",
            'meta' => [
                'task_id' => $this->comment->task_id,
                'comment_id' => $this->comment->id,
                'project_id' => $this->comment->task->project_id
            ]
        ];
    }
}