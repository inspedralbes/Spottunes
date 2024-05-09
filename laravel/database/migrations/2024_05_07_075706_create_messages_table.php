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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_id')->references('id')->on('chats')->constrained()->cascadeOnDelete()->nullable();
            $table->foreignId('user_id')->references('id')->on('users')->constrained()->cascadeOnDelete();
            $table->string('content');
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamp('read_at')->nullable();
            $table->enum('state', ['enviado', 'recibido', 'leído'])->default('enviado');
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
