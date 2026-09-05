<?php

namespace App\Models;

use App\Models\Builders\FamilyBuilder;
use Database\Factories\FamilyFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $no_kk
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Family extends Model
{
    /** @use HasFactory<FamilyFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'no_kk',
    ];

    /**
     * Create a new Eloquent query builder for the model.
     *
     * @param  Builder  $query
     * @return FamilyBuilder<static>
     */
    public function newEloquentBuilder($query): FamilyBuilder
    {
        return new FamilyBuilder($query);
    }

    /**
     * Hash a plain 16-digit No. KK using SHA-256 for secure, privacy-compliant storage.
     */
    public static function hashNoKk(?string $noKk): ?string
    {
        if ($noKk === null || $noKk === '') {
            return $noKk;
        }

        $trimmed = trim($noKk);

        // If already a 64-character hex string (SHA-256), do not re-hash
        if (strlen($trimmed) === 64 && ctype_xdigit($trimmed)) {
            return $trimmed;
        }

        return hash('sha256', $trimmed);
    }

    /**
     * Automatically hash no_kk when setting the attribute.
     */
    protected function setNoKkAttribute($value): void
    {
        $this->attributes['no_kk'] = self::hashNoKk((string) $value);
    }

    /**
     * Get all users that belong to the family.
     *
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
