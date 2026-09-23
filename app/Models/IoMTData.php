<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class IoMTData extends Model
{
    use HasFactory;

    protected $table = 'iomt_devices_data';

    protected $fillable = [
        'paciente_id',
        'device_type',
        'encrypted_data',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
    ];

    /**
     * Mutator para encriptar la data antes de guardar
     */
    public function setEncryptedDataAttribute($value)
    {
        // Encriptar el valor usando el facade Crypt de Laravel
        $this->attributes['encrypted_data'] = Crypt::encryptString(json_encode($value));
    }

    /**
     * Accessor para desencriptar la data al consultarla
     */
    public function getDecryptedDataAttribute()
    {
        if (empty($this->encrypted_data)) {
            return null;
        }

        try {
            $decrypted = Crypt::decryptString($this->encrypted_data);

            return json_decode($decrypted, true);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Relación con el paciente
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}
