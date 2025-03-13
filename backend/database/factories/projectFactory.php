<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\project>
 */
class projectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array

    {
        $startDate = fake()->dateTimeBetween('-1 month', '+1 month');
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'start_date' => $startDate,
            'end_date' => fake()->dateTimeBetween($startDate, '+6 months'),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
            'created_by' => User::factory(),
        ];
    }
}
