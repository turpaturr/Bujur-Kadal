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
        Schema::table('users', function (Blueprint $table) {
            $table->string('nik_masked', 30)->nullable()->after('nik');
            $table->date('birth_date')->nullable()->after('name');
            $table->string('gender', 20)->nullable()->after('birth_date'); // 'laki-laki' / 'perempuan'
            $table->string('occupation')->nullable()->after('gender');
        });

        Schema::table('health_profiles', function (Blueprint $table) {
            $table->string('vulnerability_category', 50)->nullable()->after('is_vulnerable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('health_profiles', function (Blueprint $table) {
            $table->dropColumn('vulnerability_category');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nik_masked', 'birth_date', 'gender', 'occupation']);
        });
    }
};
