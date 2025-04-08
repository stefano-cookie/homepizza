<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\TelegramMessage;
use Illuminate\Support\Facades\Log;

class NewTelegramMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(TelegramMessage $message)
    {
        $this->message = $message;
        Log::info('Nuovo evento NewTelegramMessage creato', [
            'chat_id' => $message->telegram_chat_id,
            'message_id' => $message->id
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channelName = 'chat.' . $this->message->telegram_chat_id;
        Log::info('Broadcasting su canale: ' . $channelName);

        return [
            new PrivateChannel($channelName),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'new.message';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $data = [
            'id' => $this->message->id,
            'message_id' => $this->message->message_id,
            'telegram_chat_id' => $this->message->telegram_chat_id,
            'text' => $this->message->text,
            'direction' => $this->message->direction,
            'sent_at' => $this->message->sent_at,
        ];

        Log::info('Dati da trasmettere:', $data);

        return $data;
    }
}