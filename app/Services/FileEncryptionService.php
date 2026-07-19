<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FileEncryptionService
{
    private const CIPHER = 'AES-256-CBC';

    /**
     * Encrypts and stores a file in the given disk.
     */
    private static function getKey()
    {
        $key = config('app.key');
        if (str_starts_with($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }
        return $key;
    }

    /**
     * Encrypts and stores a file in the given disk.
     */
    public static function encryptAndStore($file, string $path, string $disk = 'local'): bool
    {
        try {
            $contents = file_get_contents($file->getRealPath());
            $key = self::getKey();
            $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length(self::CIPHER));

            $encrypted = openssl_encrypt($contents, self::CIPHER, $key, 0, $iv);

            // Store IV + Encrypted Data
            // We prepend IV to the file content
            $finalContent = $iv . $encrypted;

            return Storage::disk($disk)->put($path, $finalContent);
        } catch (\Exception $e) {
            Log::error("Error encrypting file: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Decrypts and returns the content of a file.
     */
    public static function decrypt($path, string $disk = 'local'): ?string
    {
        try {
            if (!Storage::disk($disk)->exists($path)) {
                return null;
            }

            $rawContent = Storage::disk($disk)->get($path);
            $key = self::getKey();
            $ivLength = openssl_cipher_iv_length(self::CIPHER);

            $iv = substr($rawContent, 0, $ivLength);
            $encrypted = substr($rawContent, $ivLength);

            return openssl_decrypt($encrypted, self::CIPHER, $key, 0, $iv);
        } catch (\Exception $e) {
            Log::error("Error decrypting file: " . $e->getMessage());
            return null;
        }
    }
}
