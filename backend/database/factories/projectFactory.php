<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;
    
    public function definition(): array
    {
        // Retrieve an existing user or create one to be the project creator.
        $creator = User::inRandomOrder()->first() ?? User::factory()->create();

        return [
            'name'        => $this->faker->words(3, true),
            'description' => $this->faker->optional()->paragraph(),
            'start_date'  => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'end_date'    => $this->faker->optional()->dateTimeBetween('+1 month', '+1 year'),
            'status'      => $this->faker->randomElement(['pending', 'in_progress', 'completed']),
            'created_by'  => $creator->id,
        ];
    }
    
    public function configure()
    {
        return $this->afterCreating(function (Project $project) {
            // Choose random users (excluding the creator) to attach as collaborators.
            $userIds = User::where('id', '!=', $project->created_by)
                           ->inRandomOrder()
                           ->take(rand(1, 5))
                           ->pluck('id')
                           ->toArray();
            // Optionally, include the creator as well.
            $userIds[] = $project->created_by;

            // Attach the users to the project via the pivot table with a default role.
            $project->users()->attach(array_unique($userIds), ['role' => 'member']);
        });
    }
}
