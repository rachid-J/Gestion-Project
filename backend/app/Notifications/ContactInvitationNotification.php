<?php

namespace App\Notifications;

use App\Models\ContactInvitations;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $invitation;

    public function __construct(ContactInvitations $invitation)
    {
        $this->invitation = $invitation;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = config('app.frontend_url').'/accept-contact-invitation?token='.$this->invitation->token;

        return (new MailMessage)
            ->subject('Invitation to Connect')
            ->line($this->invitation->sender->name . ' wants to add you to their contacts.')
            ->action('Accept Invitation', $url)
            ->line('This invitation will expire in 7 days.');
    }
}