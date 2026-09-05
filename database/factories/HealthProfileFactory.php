<?php

namespace Database\Factories;

use App\Models\HealthProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HealthProfile>
 */
class HealthProfileFactory extends Factory
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
            'is_vulnerable' => false,
            'comorbidity_notes' => null,
        ];
    }

    /**
     * Indicate that the health profile is vulnerable.
     */
    public function vulnerable(?string $notes = 'Riwayat Asma Kronis'): static
    {
        return $this->state(fn () => [
            'is_vulnerable' => true,
            'comorbidity_notes' => $notes,
        ]);
    }
}
