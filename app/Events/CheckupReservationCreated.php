<?php

namespace App\Events;

use App\Models\CheckupReservation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CheckupReservationCreated implements ShouldBroadcastNow
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
        return [
            new Channel('admin-reservations'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'reservation.created';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $r = $this->reservation;
        $head = $r->user;
        $cleanWa = preg_replace('/[^0-9]/', '', (string) ($head?->whatsapp_number ?? ''));
        if (str_starts_with($cleanWa, '0')) {
            $cleanWa = '62'.substr($cleanWa, 1);
        }

        return [
            'reservation' => [
                'id' => $r->id,
                'clinic_id' => $r->clinic_id,
                'clinic_name' => $r->clinic_name,
                'clinic_address' => $r->clinic_address,
                'patient_name' => $r->patient_name,
                'patient_role' => $r->patient_role,
                'checkup_date' => $r->checkup_date?->format('Y-m-d'),
                'checkup_time' => $r->checkup_time,
                'symptoms' => $r->symptoms,
                'status' => $r->status,
                'admin_notes' => $r->admin_notes,
                'created_at' => $r->created_at?->diffForHumans() ?? 'Baru saja',
                'user' => [
                    'id' => $head?->id,
                    'name' => $head?->name,
                    'no_kk' => $head?->family?->no_kk,
                    'home_address' => $head?->home_address,
                    'whatsapp_number' => $head?->whatsapp_number,
                    'whatsapp_link' => $cleanWa ? "https://wa.me/{$cleanWa}" : null,
                ],
            ],
        ];
    }
}
