<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectUpdatedNotification extends Notification 
{
    use Queueable;

    public function __construct(
        public $project,
        public $updatedBy,
     
    ) {}

    public function via($notifiable)
    {
        return ['database'];
    }

 public function toArray($notifiable)
{
    return [
        'message' => "Project '{$this->project->name}' updated by {$this->updatedBy->name}",
        'type' => 'project_updated',
        'project_id' => $this->updatedBy->pivot->project_id,
        'updater' => $this->updatedBy->name,
        'role' => $this->updatedBy->pivot->role
    ];
}
}