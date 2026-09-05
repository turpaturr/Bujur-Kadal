<?php

namespace App\Events;

use App\Models\CheckupReservation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CheckupReservationStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public CheckupReservation $reservation) {}

    /**
     * The channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new Channel('admin-reservations'),
        ];

        if ($this->reservation->user_id) {
            $channels[] = new Channel('user-reservations.'.$this->reservation->user_id);
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'reservation.updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $r = $this->reservation;

        return [
            'reservation' => [
                'id' => $r->id,
                'user_id' => $r->user_id,
                'status' => $r->status,
                'is_read' => (bool) $r->is_read,
                'admin_notes' => $r->admin_notes,
                'patient_name' => $r->patient_name,
                'clinic_name' => $r->clinic_name,
                'checkup_date' => $r->checkup_date?->format('Y-m-d'),
                'checkup_time' => $r->checkup_time,
                'handled_at' => $r->handled_at?->diffForHumans() ?? 'Baru saja',
            ],
        ];
    }
}
