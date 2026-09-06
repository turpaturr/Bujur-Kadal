<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvacuationMission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'family_id',
        'family_name',
        'head_name',
        'whatsapp_number',
        'address',
        'latitude',
        'longitude',
        'vulnerable_members_count',
        'total_members_count',
        'safe_zone_name',
        'status',
        'status_notes',
        'team_assigned_at',
        'in_transit_at',
        'completed_at',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'vulnerable_members_count' => 'integer',
        'total_members_count' => 'integer',
        'team_assigned_at' => 'datetime',
        'in_transit_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }
}
