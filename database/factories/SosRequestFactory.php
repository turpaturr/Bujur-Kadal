<?php

namespace Database\Factories;

use App\Enums\SosStatus;
use App\Models\SosRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SosRequest>
 */
class SosRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'latitude' => fake()->latitude(-4.5, 4.5),
            'longitude' => fake()->longitude(108.5, 119.0),
            'status' => fake()->randomElement(SosStatus::cases()),
        ];
    }

    /**
     * Indicate that the SOS request is pending.
     */
    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => SosStatus::Pending,
        ]);
    }
}
