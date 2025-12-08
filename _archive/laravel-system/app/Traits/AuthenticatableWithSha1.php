<?php

namespace App\Traits;

use Illuminate\Support\Facades\Hash;

trait AuthenticatableWithSha1
{
    /**
     * Validate the password of the user for the Passport password grant.
     *
     * @param  string  $password
     * @return bool
     */
    public function validateForPassportPasswordGrant($password)
    {
        return $this->checkPassword($password);
    }

    /**
     * Check password using both SHA1 and Bcrypt methods
     */
    public function checkPassword($password)
    {
        // Verificar con SHA1 (compatible con el sistema original)
        if (hash_equals($this->password, sha1($password))) {
            return true;
        }

        // Si no coincide con SHA1, probar con Bcrypt
        return Hash::check($password, $this->password);
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->password;
    }
}