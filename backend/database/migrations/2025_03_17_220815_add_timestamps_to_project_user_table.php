<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->boolean('read')->default(false);
        });
        
        Schema::table('contact_invitations', function (Blueprint $table) {
            $table->boolean('read')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
     
    }
};
