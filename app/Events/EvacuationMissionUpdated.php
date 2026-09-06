<?php

namespace App\Events;

use App\Models\EvacuationMission;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EvacuationMissionUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public EvacuationMission $mission) {}

    /**
     * The channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new Channel('admin-evacuations'),
        ];

        if ($this->mission->user_id) {
            $channels[] = new Channel('user-evacuations.'.$this->mission->user_id);
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'evacuation.updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $m = $this->mission;

        return [
            'mission' => [
                'id' => $m->id,
                'user_id' => $m->user_id,
                'family_id' => $m->family_id,
                'family_name' => $m->family_name,
                'head_name' => $m->head_name,
                'whatsapp_number' => $m->whatsapp_number,
                'address' => $m->address,
                'latitude' => $m->latitude,
                'longitude' => $m->longitude,
                'vulnerable_members_count' => $m->vulnerable_members_count,
                'total_members_count' => $m->total_members_count,
                'safe_zone_name' => $m->safe_zone_name,
                'status' => $m->status,
                'status_notes' => $m->status_notes,
                'team_assigned_at' => $m->team_assigned_at?->format('H:i:s'),
                'in_transit_at' => $m->in_transit_at?->format('H:i:s'),
                'completed_at' => $m->completed_at?->format('H:i:s'),
                'updated_at' => $m->updated_at?->diffForHumans() ?? 'Baru saja',
            ],
        ];
    }
}
