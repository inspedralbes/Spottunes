<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('historic_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_id')->nullable();
            $table->string('event')->nullable();
            $table->string('artist')->nullable();
            $table->string('date')->nullable();
            $table->string('time')->nullable();
            $table->string('venue')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->float('latitude')->nullable();
            $table->float('longitude')->nullable();
            $table->string('genre')->nullable();
            $table->string('subgenre')->nullable();
            $table->float('minprice')->nullable();
            $table->float('maxprice')->nullable();
            $table->string('promoter')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historic_events');
    }
};
