<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Models\Builders\UserBuilder;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $family_id
 * @property string|null $nik
 * @property string|null $nik_masked
 * @property string $name
 * @property string|null $email
 * @property string|null $password
 * @property Carbon|null $birth_date
 * @property string|null $gender
 * @property string|null $occupation
 * @property string|null $whatsapp_number
 * @property string|null $pin
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
        'nik_masked',
        'name',
        'email',
        'password',
        'birth_date',
        'gender',
        'occupation',
        'whatsapp_number',
        'pin',
        'role',
        'home_address',
        'home_latitude',
        'home_longitude',
    ];

    /**
     * Create a new Eloquent query builder for the model.
     *
     * @param  Builder  $query
     * @return UserBuilder<static>
     */
    public function newEloquentBuilder($query): UserBuilder
    {
        return new UserBuilder($query);
    }

    /**
     * Hash a plain 16-digit NIK using SHA-256 for secure, privacy-compliant storage.
     */
    public static function hashNik(?string $nik): ?string
    {
        if ($nik === null || $nik === '') {
            return $nik;
        }

        $trimmed = trim($nik);

        // If already a 64-character hex string (SHA-256), do not re-hash
        if (strlen($trimmed) === 64 && ctype_xdigit($trimmed)) {
            return $trimmed;
        }

        return hash('sha256', $trimmed);
    }

    /**
     * Automatically hash NIK and set nik_masked when setting the attribute.
     */
    protected function setNikAttribute($value): void
    {
        if ($value === null || $value === '') {
            $this->attributes['nik'] = null;
            $this->attributes['nik_masked'] = null;

            return;
        }

        $trimmed = trim((string) $value);
        if (strlen($trimmed) === 16 && ctype_digit($trimmed)) {
            $this->attributes['nik_masked'] = substr($trimmed, 0, 4).'••••••••'.substr($trimmed, -4);
        }
        $this->attributes['nik'] = self::hashNik($trimmed);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'pin',
        'remember_token',
    ];

    /**
     * Get the password for authentication.
     */
    public function getAuthPassword(): string
    {
        return (string) ($this->password ?? $this->pin);
    }

    /**
     * Get the name of the password attribute for authentication.
     */
    public function getAuthPasswordName(): string
    {
        return $this->password !== null ? 'password' : 'pin';
    }

    /**
     * Determine if the user is an administrator or faskes.
     */
    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin || $this->role === UserRole::Faskes;
    }

    /**
     * Determine if the user is a regular user (warga / citizen).
     */
    public function isUser(): bool
    {
        return $this->role !== UserRole::Admin && $this->role !== UserRole::Faskes;
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
            'password' => 'hashed',
            'pin' => 'hashed',
            'birth_date' => 'date',
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
