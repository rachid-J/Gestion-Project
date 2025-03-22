<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectDeletedNotification extends Notification 
{
    use Queueable;

    public function __construct(
        public object $project,
        public mixed $deletedBy,
    
    ) {}

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "Project '{$this->project->name}' was deleted",
            'type' => 'project_deleted',
            'project_id' => $this->deletedBy->pivot->project_id,
            'deleted_by' => $this->deletedBy->pivot->name,
            'role' => $this->deletedBy->pivot->role
           
          
        ];
       
    }
}