/**
 * formatter.js
 * Utilidades para formateo de datos
 */

/**
 * Formatea una fecha a string
 * @param {Date} date - Fecha a formatear
 * @param {string} format - Formato deseado (por defecto DD/MM/YYYY)
 * @returns {string}
 */
export function formatDate(date, format = 'DD/MM/YYYY') {
    if (!(date instanceof Date) || isNaN(date)) {
        return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        default:
            return `${day}/${month}/${year}`;
    }
}

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} symbol - Símbolo de moneda
 * @param {number} decimals - Número de decimales
 * @returns {string}
 */
export function formatCurrency(amount, symbol = '€', decimals = 2) {
    if (isNaN(amount)) {
        amount = 0;
    }
    
    const formatted = parseFloat(amount).toFixed(decimals);
    const parts = formatted.split('.');
    
    // Añadir separadores de miles
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${parts.join(',')} ${symbol}`;
}

/**
 * Parsea un string de fecha en formato DD/MM/YYYY a Date
 * @param {string} dateString
 * @returns {Date|null}
 */
export function parseDate(dateString) {
    if (!dateString) return null;
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    return isNaN(date) ? null : date;
}

/**
 * Formatea un número de teléfono español
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
    if (!phone) return '';
    
    // Eliminar espacios y caracteres no numéricos excepto +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Formato español: +34 XXX XXX XXX
    if (cleaned.startsWith('+34')) {
        const number = cleaned.substring(3);
        return `+34 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
    
    return cleaned;
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str
 * @returns {string}
 */
export function capitalizeWords(str) {
    if (!str) return '';
    
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text
 * @param {number} maxLength
 * @param {string} suffix
 * @returns {string}
 */
export function truncate(text, maxLength = 50, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

export default {
    formatDate,
    formatCurrency,
    parseDate,
    formatPhone,
    capitalizeWords,
    truncate
};






