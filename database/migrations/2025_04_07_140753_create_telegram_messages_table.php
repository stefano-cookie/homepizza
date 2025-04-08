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
        Schema::create('telegram_messages', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('message_id');
            $table->foreignId('telegram_chat_id')->constrained('telegram_chats');
            $table->text('text')->nullable();
            $table->string('direction'); // 'incoming' o 'outgoing'
            $table->timestamp('sent_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telegram_messages');
    }
};
