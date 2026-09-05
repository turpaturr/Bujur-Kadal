<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use App\Services\DukcapilService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
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
            // Step 1: No KK & NIK
            'no_kk' => ['required', 'string', 'size:16', 'regex:/^[0-9]{16}$/'],
            'nik' => ['required', 'string', 'size:16', 'regex:/^[0-9]{16}$/', 'unique:users,nik'],
            'name' => ['required', 'string', 'max:255'],

            // Step 2: Address & Geocoordinates
            'home_address' => ['required', 'string', 'max:1000'],
            'home_latitude' => ['required', 'numeric', 'between:-90,90'],
            'home_longitude' => ['required', 'numeric', 'between:-180,180'],

            // Step 3: Role Assignment
            'role' => ['required', Rule::enum(UserRole::class)],

            // Step 4: Health Vulnerability
            'is_vulnerable' => ['required', 'boolean'],
            'comorbidity_notes' => ['nullable', 'string', 'max:1000'],

            // Step 5: WhatsApp & 6-digit PIN
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
            'nik.required' => 'NIK wajib diisi.',
            'nik.size' => 'NIK harus 16 digit.',
            'nik.unique' => 'NIK ini telah terdaftar di BorneoCare.',
            'name.required' => 'Nama lengkap wajib diisi.',
            'home_address.required' => 'Alamat tempat tinggal wajib diisi.',
            'home_latitude.required' => 'Titik koordinat latitude wajib ditentukan.',
            'home_longitude.required' => 'Titik koordinat longitude wajib ditentukan.',
            'role.required' => 'Peran dalam keluarga wajib dipilih.',
            'is_vulnerable.required' => 'Status kerentanan kesehatan wajib ditentukan.',
            'whatsapp_number.required' => 'Nomor WhatsApp darurat wajib diisi.',
            'pin.required' => 'PIN darurat 6-digit wajib dibuat.',
            'pin.size' => 'PIN darurat harus terdiri dari tepat 6 angka.',
            'pin.regex' => 'PIN hanya boleh berisi angka.',
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
