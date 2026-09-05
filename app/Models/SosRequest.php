<?php

namespace App\Models;

use App\Enums\SosStatus;
use Database\Factories\SosRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property float $latitude
 * @property float $longitude
 * @property SosStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class SosRequest extends Model
{
    /** @use HasFactory<SosRequestFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => SosStatus::class,
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    /**
     * Scope a query to only include active emergency requests (pending or evacuating).
     *
     * @param  Builder<SosRequest>  $query
     * @return Builder<SosRequest>
     */
    #[Scope]
    protected function active(Builder $query): Builder
    {
        return $query->whereIn('status', [SosStatus::Pending, SosStatus::Evacuating]);
    }

    /**
     * Get the user that initiated the SOS request.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
