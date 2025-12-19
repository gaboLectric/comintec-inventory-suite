export const getErrorMessage = (error) => {
    if (!error) return 'Error desconocido';

    // Error de red o servidor caído
    if (error.status === 0) {
        return 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    }

    // Errores específicos de PocketBase
    if (error.status === 400) {
        // Credenciales inválidas suele ser 400 en authWithPassword
        if (error.message?.toLowerCase().includes('failed to authenticate') || 
            error.message?.toLowerCase().includes('invalid login credentials')) {
            return 'Credenciales incorrectas. Verifique su correo y contraseña.';
        }
        return 'Solicitud incorrecta (400). Verifique los datos ingresados.';
    }

    if (error.status === 403) {
        return 'No tiene permisos para realizar esta acción.';
    }

    if (error.status === 404) {
        return 'El recurso solicitado no fue encontrado.';
    }

    // Si es un objeto de error de JS estándar
    if (error.message) {
        return error.message;
    }

    return 'Ocurrió un error inesperado.';
};
