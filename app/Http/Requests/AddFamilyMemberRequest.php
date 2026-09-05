<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class AddFamilyMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === UserRole::KepalaKeluarga;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'nik' => [
                'required',
                'string',
                'size:16',
                'regex:/^[0-9]{16}$/',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (User::where('nik', User::hashNik($value))->exists()) {
                        $fail('NIK ini telah terdaftar di dalam sistem.');
                    }
                },
            ],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'gender' => ['required', 'string', 'in:laki-laki,perempuan'],
            'occupation' => ['required', 'string', 'max:255'],
            'vulnerability_category' => [
                'required',
                'string',
                'in:ibu_hamil,balita,anak_anak,penyakit_bawaan,lansia,tidak_rentan',
            ],
            'comorbidity_notes' => [
                'nullable',
                'string',
                'max:1000',
                'required_if:vulnerability_category,penyakit_bawaan',
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
            'name.required' => 'Nama anggota keluarga wajib diisi.',
            'nik.required' => 'NIK anggota keluarga wajib diisi.',
            'nik.size' => 'NIK harus terdiri dari tepat 16 digit angka.',
            'nik.regex' => 'NIK hanya boleh berisi angka.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'birth_date.date' => 'Format tanggal lahir tidak valid.',
            'birth_date.before_or_equal' => 'Tanggal lahir tidak boleh di masa depan.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'gender.in' => 'Pilihan jenis kelamin tidak valid.',
            'occupation.required' => 'Pekerjaan anggota keluarga wajib diisi.',
            'vulnerability_category.required' => 'Kategori kerentanan wajib dipilih.',
            'vulnerability_category.in' => 'Kategori kerentanan tidak valid.',
            'comorbidity_notes.required_if' => 'Rincian penyakit bawaan wajib dijelaskan untuk kategori ini.',
        ];
    }
}
