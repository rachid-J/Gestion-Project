<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AttachmentAddedNotification extends Notification
{
    use Queueable;

    public function __construct(public $attachment, public $uploader)
    {
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'attachment_added',
            'message' => "New attachment '{$this->attachment->file_name}' added to task",
            'meta' => [
                'task_id' => $this->attachment->task_id,
                'attachment_id' => $this->attachment->id,
                'project_id' => $this->attachment->task->project_id,
                'uploader_id' => $this->uploader->id
            ]
        ];
    }
}