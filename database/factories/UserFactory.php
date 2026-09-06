<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Family;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current PIN being used by the factory.
     */
    protected static ?string $pin;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'family_id' => Family::factory(),
            'nik' => fake()->unique()->numerify('################'), // 16 digit NIK
            'name' => fake()->name(),
            'whatsapp_number' => fake()->numerify('628##########'),
            'pin' => static::$pin ??= Hash::make('123456'),
            'role' => fake()->randomElement([UserRole::KepalaKeluarga, UserRole::Anggota, UserRole::Pendatang]),
            'home_address' => fake()->address(),
            'home_latitude' => fake()->latitude(-4.5, 4.5), // Borneo latitude range approx
            'home_longitude' => fake()->longitude(108.5, 119.0), // Borneo longitude range approx
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user belongs to a family.
     */
    public function forFamily(?Family $family = null): static
    {
        return $this->state(fn () => [
            'family_id' => $family?->id ?? Family::factory(),
        ]);
    }

    /**
     * Indicate that the user is a Kepala Keluarga.
     */
    public function kepalaKeluarga(): static
    {
        return $this->state(fn () => [
            'role' => UserRole::KepalaKeluarga,
        ]);
    }

    /**
     * Indicate that the user is an Administrator.
     */
    public function admin(): static
    {
        return $this->state(fn () => [
            'family_id' => null,
            'nik' => null,
            'whatsapp_number' => null,
            'pin' => null,
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => UserRole::Admin,
        ]);
    }
}
