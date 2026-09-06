<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Services\DukcapilService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class Step1RegisterRequest extends FormRequest
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
            'no_kk' => ['required', 'string', 'size:16', 'regex:/^[0-9]{16}$/'],
            'nik' => [
                'required',
                'string',
                'size:16',
                'regex:/^[0-9]{16}$/',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (User::where('nik', $value)->exists()) {
                        $fail('NIK ini sudah terdaftar di sistem BorneoCare.');
                    }
                },
            ],
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
            'no_kk.size' => 'Nomor KK harus tepat 16 digit.',
            'no_kk.regex' => 'Nomor KK hanya boleh berisi angka.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.size' => 'NIK harus tepat 16 digit.',
            'nik.regex' => 'NIK hanya boleh berisi angka.',
            'nik.unique' => 'NIK ini sudah terdaftar di sistem BorneoCare.',
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
