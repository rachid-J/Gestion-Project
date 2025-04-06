<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'name'        => $this->faker->words(3, true),
            'description' => $this->faker->optional()->paragraph(),
            'start_date'  => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'end_date'    => $this->faker->optional()->dateTimeBetween('+1 month', '+1 year'),
            'status'      => $this->faker->randomElement(['pending', 'in_progress', 'completed']),
            'created_by'  => User::factory(),
        ];
    }
    
    public function configure()
    {
        return $this->afterCreating(function (Project $project) {
            $project->users()->attach($project->created_by, ['role' => 'creator']);

            $otherUsers = User::where('id', '!=', $project->created_by)
                ->inRandomOrder()
                ->take(rand(0, 4))
                ->pluck('id')
                ->toArray();

            if (!empty($otherUsers)) {
                $project->users()->attach($otherUsers, ['role' => 'member']);
            }
        });
    }
}