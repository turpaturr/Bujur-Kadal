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
            $table->string('email')->nullable()->unique()->after('name');
            $table->string('password')->nullable()->after('email');
            $table->string('nik')->nullable()->change();
            $table->string('whatsapp_number')->nullable()->change();
            $table->string('pin')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email', 'password']);
            $table->string('nik')->nullable(false)->change();
            $table->string('whatsapp_number')->nullable(false)->change();
            $table->string('pin')->nullable(false)->change();
        });
    }
};
