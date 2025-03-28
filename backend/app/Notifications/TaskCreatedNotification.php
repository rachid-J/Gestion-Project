<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class TaskCreatedNotification extends Notification 
{
    use Queueable;

    public $task;
    public $creator;

    public function __construct($task, $creator)
    {
        $this->task = $task;
        $this->creator = $creator;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        $isAssignee = $notifiable->id === $this->task->assigned_to;

        return [
            'type' => $isAssignee ? 'task_assigned' : 'task_created',
            'message' => $this->getMessage($isAssignee),
            'task_id' => $this->task->id,
            'creator_id' => $this->creator->id,
            'assigned_to' => $this->task->assigned_to
        ];
    }

    protected function getMessage($isAssignee)
    {
        if ($isAssignee) {
            return "You've been assigned a new task: {$this->task->title}";
        }

        return "{$this->creator->name} created a new task in {$this->task->project->name}: {$this->task->title}";
    }
}