<?php

namespace App\Models;

use App\Enums\SafeZoneType;
use Database\Factories\SafeZoneFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property SafeZoneType $type
 * @property float $latitude
 * @property float $longitude
 * @property int|null $capacity_left
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class SafeZone extends Model
{
    /** @use HasFactory<SafeZoneFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'type',
        'latitude',
        'longitude',
        'capacity_left',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => SafeZoneType::class,
            'latitude' => 'float',
            'longitude' => 'float',
            'capacity_left' => 'integer',
        ];
    }

    /**
     * Scope a query to only include safe zones with available capacity.
     *
     * @param  Builder<SafeZone>  $query
     * @return Builder<SafeZone>
     */
    #[Scope]
    protected function available(Builder $query): Builder
    {
        return $query->where(function (Builder $sub) {
            $sub->whereNull('capacity_left')
                ->orWhere('capacity_left', '>', 0);
        });
    }
}
