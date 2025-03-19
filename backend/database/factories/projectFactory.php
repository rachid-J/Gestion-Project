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
         
            $userIds = User::where('id', '!=', $project->created_by)
                           ->inRandomOrder()
                           ->take(rand(1, 5))
                           ->pluck('id')
                           ->toArray();
        
            $userIds[] = $project->created_by;

            $project->users()->attach(array_unique($userIds), ['role' => 'member']);
        });
    }
}
