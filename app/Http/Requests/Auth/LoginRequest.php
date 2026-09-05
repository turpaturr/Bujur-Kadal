<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'nik' => ['required', 'string', 'size:16', 'regex:/^[0-9]{16}$/'],
            'pin' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
            'remember' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nik.required' => 'NIK wajib diisi untuk login.',
            'nik.size' => 'NIK harus 16 digit angka.',
            'pin.required' => 'PIN 6-digit keluarga wajib diisi.',
            'pin.size' => 'PIN keluarga harus 6 digit angka.',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $rawNik = (string) $this->input('nik');
        $rawPin = (string) $this->input('pin');
        $hashedNik = User::hashNik($rawNik);

        $user = User::with('family')->where('nik', $hashedNik)->first();

        // 1. Validasi keberadaan NIK pada basis data keluarga terdaftar
        if (! $user || ! $user->family_id) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'nik' => __('NIK Anda belum terdaftar dalam Kartu Keluarga (KK) manapun di sistem.'),
            ]);
        }

        // 2. Validasi PIN keluarga
        if (! Hash::check($rawPin, (string) $user->pin)) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'pin' => __('PIN keluarga yang Anda masukkan tidak sesuai.'),
            ]);
        }

        Auth::login($user, $this->boolean('remember'));

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'nik' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('nik')).'|'.$this->ip());
    }
}
