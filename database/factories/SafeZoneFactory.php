<?php

namespace Database\Factories;

use App\Enums\SafeZoneType;
use App\Models\SafeZone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SafeZone>
 */
class SafeZoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Safe Zone '.fake()->company(),
            'type' => fake()->randomElement(SafeZoneType::cases()),
            'latitude' => fake()->latitude(-4.5, 4.5),
            'longitude' => fake()->longitude(108.5, 119.0),
            'capacity_left' => fake()->numberBetween(10, 200),
        ];
    }
}
