<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CheckupReservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'family_id',
        'clinic_id',
        'clinic_name',
        'clinic_address',
        'patient_name',
        'patient_role',
        'checkup_date',
        'checkup_time',
        'symptoms',
        'status',
        'is_read',
        'admin_notes',
        'handled_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'checkup_date' => 'date:Y-m-d',
            'is_read' => 'boolean',
            'handled_at' => 'datetime',
        ];
    }

    /**
     * Relasi ke User pemohon.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Family pemohon.
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Scope untuk reservasi pending.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope untuk reservasi disetujui.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope untuk reservasi ditolak.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
