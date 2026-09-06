<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Proxy NASA FIRMS CSV API ke frontend.
 *
 * Browser tidak bisa langsung fetch ke FIRMS API karena CORS.
 * Controller ini memforward request ke NASA dan mengembalikan
 * data CSV sebagai JSON kepada klien.
 */
class WildfireController extends Controller
{
    /** Bounding box Pulau Kalimantan: west,south,east,north */
    private const KALIMANTAN_BBOX = '108.0,-4.5,119.5,7.5';

    /** Sensor yang didukung */
    private const ALLOWED_SENSORS = [
        'VIIRS_SNPP_NRT',
        'VIIRS_NOAA20_NRT',
        'MODIS_NRT',
    ];

    private function getApiKey(): ?string
    {
        // Prioritaskan membaca langsung dari file .env agar tidak terkena cache memory proses lama
        $envPath = base_path('.env');
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines !== false) {
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (str_starts_with($line, '#')) {
                        continue;
                    }
                    if (preg_match('/^(?:VITE_)?NASA_API_KEY=["\']?([a-zA-Z0-9]+)["\']?/', $line, $matches)) {
                        return trim($matches[1]);
                    }
                }
            }
        }

        $configKey = config('services.nasa.firms_key') ?: env('NASA_API_KEY');

        return $configKey ? trim((string) $configKey, " \t\n\r\0\x0B\"'") : null;
    }

    /**
     * Proxy data hotspot NASA FIRMS untuk area Kalimantan.
     *
     * GET /api/wildfire/hotspots?sensor=VIIRS_SNPP_NRT&days=1
     */
    public function hotspots(Request $request): JsonResponse
    {
        $apiKey = $this->getApiKey();

        if (empty($apiKey)) {
            return response()->json([
                'error' => 'NASA FIRMS API Key tidak dikonfigurasi di server.',
            ], 503);
        }

        $sensor = $request->query('sensor', 'VIIRS_SNPP_NRT');
        $days = (int) $request->query('days', 1);

        /** @var string $sensor */
        if (! in_array($sensor, self::ALLOWED_SENSORS, strict: true)) {
            return response()->json([
                'error' => "Sensor tidak valid: {$sensor}",
            ], 422);
        }

        $days = max(1, min(10, $days));

        $url = sprintf(
            'https://firms.modaps.eosdis.nasa.gov/api/area/csv/%s/%s/%s/%d',
            $apiKey,
            $sensor,
            self::KALIMANTAN_BBOX,
            $days,
        );

        try {
            $response = Http::timeout(20)->get($url);

            if (! $response->successful()) {
                Log::warning('FIRMS API returned non-2xx', [
                    'status' => $response->status(),
                    'sensor' => $sensor,
                    'key_length' => strlen($apiKey),
                    'url' => $url,
                ]);

                return response()->json([
                    'error' => "NASA FIRMS API gagal merespons (HTTP {$response->status()}).",
                ], 502);
            }

            $body = $response->body();

            // Jika NASA mengembalikan halaman HTML (error page), tolak
            if (str_starts_with(ltrim($body), '<')) {
                Log::warning('FIRMS API returned HTML instead of CSV', ['sensor' => $sensor]);

                return response()->json([
                    'error' => 'NASA FIRMS API mengembalikan respons tidak valid. Periksa API key.',
                ], 502);
            }

            // Jika NASA mengembalikan 0 titik data (hanya header CSV karena satelit belum melintas/memproses hari ini),
            // otomatis perluas ke rentang 2 hari (48 jam terakhir) agar data hotspot aktif Kalimantan selalu tampil.
            $csvLines = preg_split('/\r\n|\r|\n/', trim($body));
            if (count($csvLines) <= 1 && $days < 2) {
                $fallbackDays = 2;
                $fallbackUrl = sprintf(
                    'https://firms.modaps.eosdis.nasa.gov/api/area/csv/%s/%s/%s/%d',
                    $apiKey,
                    $sensor,
                    self::KALIMANTAN_BBOX,
                    $fallbackDays,
                );
                $fallbackResponse = Http::timeout(20)->get($fallbackUrl);
                if ($fallbackResponse->successful() && ! str_starts_with(ltrim($fallbackResponse->body()), '<')) {
                    $fallbackLines = preg_split('/\r\n|\r|\n/', trim($fallbackResponse->body()));
                    if (count($fallbackLines) > 1) {
                        $body = $fallbackResponse->body();
                        $days = $fallbackDays;
                    }
                }
            }

            return response()->json([
                'sensor' => $sensor,
                'days' => $days,
                'csv' => $body,
            ]);
        } catch (ConnectionException $e) {
            Log::error('FIRMS API connection failed', ['error' => $e->getMessage()]);

            return response()->json([
                'error' => 'Tidak dapat terhubung ke NASA FIRMS API.',
            ], 504);
        }
    }
}
