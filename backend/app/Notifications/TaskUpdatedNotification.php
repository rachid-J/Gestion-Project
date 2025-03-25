<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskUpdatedNotification extends Notification
{
    use Queueable;

    public function __construct(public $task, public $updater)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'task_updated',
            'message' => "Task '{$this->task->title}' was updated by {$this->updater->name}",
            'meta' => [
                'task_id' => $this->task->id,
                'project_id' => $this->task->project_id,
                'updater_id' => $this->updater->id
            ]
        ];
    }
}