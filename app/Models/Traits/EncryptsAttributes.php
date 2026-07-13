<?php

namespace App\Models\Traits;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

trait EncryptsAttributes
{
    public static function bootEncryptsAttributes(): void
    {
        static::saving(function ($model) {
            $model->encryptAttributes();
        });

        static::saved(function ($model) {
            $model->decryptAttributes();
        });

        static::retrieved(function ($model) {
            $model->decryptAttributes();
        });
    }

    protected function encryptAttributes(): void
    {
        foreach ($this->getEncryptedFields() as $field) {
            if (! empty($this->attributes[$field])) {
                if ($this->isEncryptedValue($this->attributes[$field])) {
                    continue;
                }
                $this->attributes[$field] = Crypt::encryptString($this->attributes[$field]);
            }
        }
    }

    protected function decryptAttributes(): void
    {
        foreach ($this->getEncryptedFields() as $field) {
            if (! empty($this->attributes[$field])) {
                if (! $this->isEncryptedValue($this->attributes[$field])) {
                    continue;
                }
                try {
                    $this->attributes[$field] = Crypt::decryptString($this->attributes[$field]);
                } catch (DecryptException $e) {
                    Log::warning("Failed to decrypt {$field} on ".class_basename($this)." #{$this->getKey()}: MAC invalid or key mismatch");
                }
            }
        }
    }

    public function getEncryptedFields(): array
    {
        return property_exists($this, 'encrypted') ? $this->encrypted : [];
    }

    protected function isEncryptedValue(string $value): bool
    {
        if (! str_starts_with($value, 'eyJ')) {
            return false;
        }

        $decoded = base64_decode($value, true);
        if ($decoded === false) {
            return false;
        }

        $json = json_decode($decoded, true);
        if (! is_array($json)) {
            return false;
        }

        return isset($json['iv'], $json['value'], $json['mac']);
    }
}
