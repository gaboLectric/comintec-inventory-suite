import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * Evita llamadas excesivas a la API cuando el usuario escribe rápido
 * 
 * @param {any} value - Valor a hacer debounce
 * @param {number} delay - Delay en milisegundos (default: 300ms)
 * @returns {any} - Valor con debounce aplicado
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
