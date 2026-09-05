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
        Schema::create('checkup_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('family_id')->nullable()->constrained('families')->nullOnDelete();
            $table->string('clinic_id');
            $table->string('clinic_name');
            $table->text('clinic_address')->nullable();
            $table->string('patient_name');
            $table->string('patient_role')->nullable();
            $table->date('checkup_date');
            $table->string('checkup_time', 20);
            $table->text('symptoms')->nullable();
            $table->string('status', 30)->default('pending'); // pending, approved, rejected
            $table->text('admin_notes')->nullable();
            $table->timestamp('handled_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['clinic_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checkup_reservations');
    }
};
