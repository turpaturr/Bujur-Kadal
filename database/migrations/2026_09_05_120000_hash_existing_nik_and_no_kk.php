<?php

use App\Models\Family;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Hash any existing plain text no_kk in families table
        DB::table('families')
            ->whereRaw('LENGTH(no_kk) != 64')
            ->get()
            ->each(function ($family) {
                DB::table('families')
                    ->where('id', $family->id)
                    ->update(['no_kk' => Family::hashNoKk((string) $family->no_kk)]);
            });

        // Hash any existing plain text nik in users table
        DB::table('users')
            ->whereRaw('LENGTH(nik) != 64')
            ->get()
            ->each(function ($user) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['nik' => User::hashNik((string) $user->nik)]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible cryptographic one-way hash
    }
};
