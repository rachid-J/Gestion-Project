<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->optional()->paragraph(),
            'start_date' => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'end_date' => $this->faker->optional()->dateTimeBetween('+1 month', '+1 year'),
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'completed']),
            'created_by' => User ::factory()->create()->id,
        ];
    }
}
