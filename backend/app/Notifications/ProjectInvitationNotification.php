<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Invitation;

class ProjectInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $invitation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Invitation $invitation)
    {
        $this->invitation = $invitation;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = config('app.frontend_url').'/accept-invitation';
        $acceptUrl = "{$frontendUrl}?token={$this->invitation->token}";

        return (new MailMessage)
            ->subject('You\'ve Been Invited to Join a Project')
            ->greeting("Hello!")
            ->line("{$this->invitation->sender->name} has invited you to collaborate on the project:")
            ->line("**{$this->invitation->project->name}**")
            ->action('Accept Invitation', $acceptUrl)
            ->line("This invitation will expire on {$this->invitation->expires_at->format('F j, Y')}")
            ->line("If you don't recognize this project, you can safely ignore this email.");
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'project_id' => $this->invitation->project_id,
            'project_name' => $this->invitation->project->name,
            'sender_name' => $this->invitation->sender->name,
        ];
    }
}