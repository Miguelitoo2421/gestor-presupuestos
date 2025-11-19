/**
 * calculations.js
 * Utilidades para cálculos matemáticos y financieros
 */

/**
 * Calcula el IVA de una cantidad
 * @param {number} amount - Cantidad base
 * @param {number} rate - Porcentaje de IVA
 * @returns {number}
 */
export function calculateIVA(amount, rate = 21) {
    return amount * (rate / 100);
}

/**
 * Calcula el total con IVA incluido
 * @param {number} amount - Cantidad base
 * @param {number} rate - Porcentaje de IVA
 * @returns {number}
 */
export function calculateWithIVA(amount, rate = 21) {
    return amount + calculateIVA(amount, rate);
}

/**
 * Calcula el precio sin IVA a partir del precio con IVA
 * @param {number} totalWithIVA - Precio con IVA incluido
 * @param {number} rate - Porcentaje de IVA
 * @returns {number}
 */
export function calculateWithoutIVA(totalWithIVA, rate = 21) {
    return totalWithIVA / (1 + rate / 100);
}

/**
 * Calcula el subtotal de una lista de items
 * @param {Array} items - Array de items con precio y cantidad
 * @returns {number}
 */
export function calculateSubtotal(items) {
    return items.reduce((total, item) => {
        const price = parseFloat(item.price || item.precio || 0);
        const quantity = parseInt(item.quantity || item.cantidad || 1);
        return total + (price * quantity);
    }, 0);
}

/**
 * Calcula el descuento sobre una cantidad
 * @param {number} amount - Cantidad base
 * @param {number} discountPercent - Porcentaje de descuento
 * @returns {number}
 */
export function calculateDiscount(amount, discountPercent) {
    return amount * (discountPercent / 100);
}

/**
 * Aplica un descuento a una cantidad
 * @param {number} amount - Cantidad base
 * @param {number} discountPercent - Porcentaje de descuento
 * @returns {number}
 */
export function applyDiscount(amount, discountPercent) {
    return amount - calculateDiscount(amount, discountPercent);
}

/**
 * Redondea un número a los decimales especificados
 * @param {number} value - Valor a redondear
 * @param {number} decimals - Número de decimales
 * @returns {number}
 */
export function roundToDecimals(value, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Suma un array de números con precisión
 * @param {Array<number>} numbers - Array de números
 * @returns {number}
 */
export function sum(numbers) {
    return numbers.reduce((total, num) => total + parseFloat(num || 0), 0);
}

/**
 * Calcula el promedio de un array de números
 * @param {Array<number>} numbers - Array de números
 * @returns {number}
 */
export function average(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    return sum(numbers) / numbers.length;
}

export default {
    calculateIVA,
    calculateWithIVA,
    calculateWithoutIVA,
    calculateSubtotal,
    calculateDiscount,
    applyDiscount,
    roundToDecimals,
    sum,
    average
};






