import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './errorHandler';

describe('getErrorMessage', () => {
    it('returns default message for null/undefined error', () => {
        expect(getErrorMessage(null)).toBe('Error desconocido');
        expect(getErrorMessage(undefined)).toBe('Error desconocido');
    });

    it('returns network error message for status 0', () => {
        const error = { status: 0 };
        expect(getErrorMessage(error)).toBe('No se pudo conectar con el servidor. Verifique su conexión a internet.');
    });

    it('returns invalid credentials message for 400 with specific text', () => {
        const error1 = { status: 400, message: 'Failed to authenticate.' };
        expect(getErrorMessage(error1)).toBe('Credenciales incorrectas. Verifique su correo y contraseña.');

        const error2 = { status: 400, message: 'Something invalid login credentials something' };
        expect(getErrorMessage(error2)).toBe('Credenciales incorrectas. Verifique su correo y contraseña.');
    });

    it('returns generic 400 message for other 400 errors', () => {
        const error = { status: 400, message: 'Bad request' };
        expect(getErrorMessage(error)).toBe('Solicitud incorrecta (400). Verifique los datos ingresados.');
    });

    it('returns permission error for 403', () => {
        const error = { status: 403 };
        expect(getErrorMessage(error)).toBe('No tiene permisos para realizar esta acción.');
    });

    it('returns not found error for 404', () => {
        const error = { status: 404 };
        expect(getErrorMessage(error)).toBe('El recurso solicitado no fue encontrado.');
    });

    it('returns error.message if present and no status matches', () => {
        const error = { message: 'Custom error message' };
        expect(getErrorMessage(error)).toBe('Custom error message');
    });

    it('returns unexpected error for object without message or known status', () => {
        const error = { foo: 'bar' };
        expect(getErrorMessage(error)).toBe('Ocurrió un error inesperado.');
    });
});
