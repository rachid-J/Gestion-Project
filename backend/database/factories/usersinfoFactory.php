<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User; // Import the User model

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UsersInfo>
 */
class UsersInfoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [ 
            // Pick a random user from the database; assumes users already exist.
            'user_id'   => User::inRandomOrder()->first()->id, 
            'background'=> $this->faker->sentence,
            'job'       => $this->faker->jobTitle,
            'phone'     => $this->faker->phoneNumber,
            'address'   => $this->faker->address,
            'city'      => $this->faker->city,
        ];
    }
}
