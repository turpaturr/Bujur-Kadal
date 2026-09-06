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
        Schema::create('evacuation_missions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('family_id')->nullable()->constrained('families')->nullOnDelete();
            $table->string('family_name');
            $table->string('head_name');
            $table->string('whatsapp_number')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->unsignedInteger('vulnerable_members_count')->default(0);
            $table->unsignedInteger('total_members_count')->default(1);
            $table->string('safe_zone_name')->default('Posko Ruang Oksigen (Oxygen Shelter)');
            $table->string('status')->default('waiting_team'); // 'waiting_team', 'in_transit', 'completed'
            $table->text('status_notes')->nullable();
            $table->timestamp('team_assigned_at')->nullable();
            $table->timestamp('in_transit_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evacuation_missions');
    }
};
