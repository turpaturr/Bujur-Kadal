<?php

namespace App\Http\Requests\Auth;

use App\Models\Family;
use App\Models\User;
use App\Services\DukcapilService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class RegisterRequest extends FormRequest
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
            // Step 1: No KK & NIK Kepala Keluarga
            'no_kk' => [
                'required',
                'string',
                'size:16',
                'regex:/^[0-9]{16}$/',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (Family::where('no_kk', Family::hashNoKk($value))->exists()) {
                        $fail('Nomor KK ini telah terdaftar di BorneoCare. Silakan login menggunakan NIK dan PIN keluarga.');
                    }
                },
            ],
            'nik' => [
                'required',
                'string',
                'size:16',
                'regex:/^[0-9]{16}$/',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (User::where('nik', User::hashNik($value))->exists()) {
                        $fail('NIK ini telah terdaftar di BorneoCare.');
                    }
                },
            ],
            'name' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'gender' => ['required', 'string', 'in:laki-laki,perempuan'],
            'occupation' => ['required', 'string', 'max:255'],

            // Step 2: Address & Geocoordinates
            'home_address' => ['required', 'string', 'max:1000'],
            'home_latitude' => ['required', 'numeric', 'between:-90,90'],
            'home_longitude' => ['required', 'numeric', 'between:-180,180'],

            // Step 3: WhatsApp & 6-digit Family PIN
            'whatsapp_number' => ['required', 'string', 'min:9', 'max:20'],
            'pin' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'no_kk.required' => 'Nomor KK wajib diisi.',
            'no_kk.size' => 'Nomor KK harus 16 digit.',
            'nik.required' => 'NIK Kepala Keluarga wajib diisi.',
            'nik.size' => 'NIK Kepala Keluarga harus 16 digit.',
            'nik.unique' => 'NIK ini telah terdaftar di BorneoCare.',
            'name.required' => 'Nama lengkap Kepala Keluarga wajib diisi.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'birth_date.date' => 'Format tanggal lahir tidak valid.',
            'birth_date.before_or_equal' => 'Tanggal lahir tidak boleh di masa depan.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'gender.in' => 'Pilihan jenis kelamin tidak valid.',
            'occupation.required' => 'Pekerjaan Kepala Keluarga wajib diisi.',
            'home_address.required' => 'Alamat tempat tinggal wajib diisi.',
            'home_latitude.required' => 'Titik koordinat latitude wajib ditentukan.',
            'home_longitude.required' => 'Titik koordinat longitude wajib ditentukan.',
            'whatsapp_number.required' => 'Nomor WhatsApp darurat keluarga wajib diisi.',
            'pin.required' => 'PIN 6-digit keluarga wajib dibuat.',
            'pin.size' => 'PIN keluarga harus terdiri dari tepat 6 angka.',
            'pin.regex' => 'PIN keluarga hanya boleh berisi angka.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $dukcapilService = app(DukcapilService::class);

            if (! $validator->errors()->has('nik')) {
                $nikCheck = $dukcapilService->validateNik((string) $this->input('nik'));
                if (! $nikCheck['valid']) {
                    $validator->errors()->add('nik', $nikCheck['message'] ?? 'Struktur NIK tidak valid.');
                }
            }

            if (! $validator->errors()->has('no_kk') && ! $validator->errors()->has('nik')) {
                $pairCheck = $dukcapilService->validate(
                    (string) $this->input('nik'),
                    (string) $this->input('no_kk')
                );

                if (! $pairCheck['valid']) {
                    $validator->errors()->add(
                        'nik',
                        $pairCheck['message'] ?? 'Verifikasi data Dukcapil gagal.'
                    );
                }
            }
        });
    }
}
