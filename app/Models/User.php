<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $family_id
 * @property string $nik
 * @property string $name
 * @property string $whatsapp_number
 * @property string $pin
 * @property UserRole $role
 * @property string|null $home_address
 * @property float|null $home_latitude
 * @property float|null $home_longitude
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'family_id',
        'nik',
        'name',
        'whatsapp_number',
        'pin',
        'role',
        'home_address',
        'home_latitude',
        'home_longitude',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'pin',
        'remember_token',
    ];

    /**
     * Get the password for authentication.
     */
    public function getAuthPassword(): string
    {
        return (string) $this->pin;
    }

    /**
     * Get the name of the password attribute for authentication.
     */
    public function getAuthPasswordName(): string
    {
        return 'pin';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'role' => UserRole::class,
            'pin' => 'hashed',
            'home_latitude' => 'float',
            'home_longitude' => 'float',
        ];
    }

    /**
     * Get the family that the user belongs to.
     *
     * @return BelongsTo<Family, $this>
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Get the health profile associated with the user.
     *
     * @return HasOne<HealthProfile, $this>
     */
    public function healthProfile(): HasOne
    {
        return $this->hasOne(HealthProfile::class);
    }

    /**
     * Get all SOS requests initiated by the user.
     *
     * @return HasMany<SosRequest, $this>
     */
    public function sosRequests(): HasMany
    {
        return $this->hasMany(SosRequest::class);
    }
}
