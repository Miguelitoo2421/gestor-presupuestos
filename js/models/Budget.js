/**
 * Budget.js
 * Modelo de datos para Presupuesto
 */

import { formatDate, formatCurrency } from '../utils/formatter.js';

export class BudgetItem {
    constructor(treatment, quantity, discount = 0) {
        this.treatment = treatment; // Instancia de Treatment
        this.quantity = parseInt(quantity) || 1;
        this.discount = parseFloat(discount) || 0; // Porcentaje de descuento
        this.id = `${treatment.id}_${Date.now()}_${Math.random()}`; // ID único para la fila
    }

    /**
     * Calcula el subtotal del item SIN descuento
     */
    getSubtotalWithoutDiscount() {
        return this.treatment.precio * this.quantity;
    }

    /**
     * Calcula el importe del descuento
     */
    getDiscountAmount() {
        return this.getSubtotalWithoutDiscount() * (this.discount / 100);
    }

    /**
     * Calcula el subtotal del item CON descuento aplicado
     */
    getSubtotal() {
        return this.getSubtotalWithoutDiscount() - this.getDiscountAmount();
    }

    /**
     * Convierte el item a objeto plano
     */
    toJSON() {
        return {
            treatment: this.treatment.toJSON(),
            quantity: this.quantity,
            discount: this.discount,
            subtotalWithoutDiscount: this.getSubtotalWithoutDiscount(),
            discountAmount: this.getDiscountAmount(),
            subtotal: this.getSubtotal()
        };
    }
}

export class Budget {
    constructor() {
        this.budgetCode = this._generateBudgetCode(); // Código único del presupuesto
        this.patientName = '';
        this.patientDNI = '';
        this.patientAddress = '';
        this.patientRegion = ''; // Comunidad
        this.patientPostalCode = '';
        this.patientEmail = '';
        this.patientPhone = '';
        this.date = new Date();
        this.items = []; // Array de BudgetItem
        this.ivaRate = 21; // Porcentaje de IVA (configurable)
        this.currencySymbol = '€';
    }

    /**
     * Genera un código único de presupuesto
     * Formato: 001, 002, 003, etc. (basado en timestamp)
     * @private
     */
    _generateBudgetCode() {
        // Generar un código secuencial basado en el timestamp
        const timestamp = Date.now();
        const code = String(timestamp).slice(-6); // Últimos 6 dígitos
        return String(parseInt(code) % 1000).padStart(3, '0'); // Convertir a 3 dígitos (001-999)
    }

    /**
     * Establece el nombre del paciente
     */
    setPatientName(name) {
        this.patientName = name.trim();
    }

    /**
     * Establece la dirección del paciente
     */
    setPatientAddress(address) {
        this.patientAddress = address.trim();
    }

    /**
     * Establece el código postal del paciente
     */
    setPatientPostalCode(postalCode) {
        this.patientPostalCode = postalCode.trim();
    }

    /**
     * Establece la provincia del paciente
     */
    setPatientProvince(province) {
        this.patientProvince = province.trim();
    }

    /**
     * Establece la comunidad autónoma del paciente
     */
    setPatientRegion(region) {
        this.patientRegion = region.trim();
    }

    /**
     * Establece el DNI del paciente
     */
    setPatientDNI(dni) {
        this.patientDNI = dni.trim();
    }

    /**
     * Establece el email del paciente
     */
    setPatientEmail(email) {
        this.patientEmail = email.trim();
    }

    /**
     * Establece el teléfono del paciente
     */
    setPatientPhone(phone) {
        this.patientPhone = phone.trim();
    }

    /**
     * Establece la fecha del presupuesto
     */
    setDate(date) {
        this.date = date instanceof Date ? date : new Date(date);
    }

    /**
     * Establece la tasa de IVA
     */
    setIvaRate(rate) {
        this.ivaRate = parseFloat(rate) || 21;
    }

    /**
     * Agrega un tratamiento al presupuesto
     */
    addItem(treatment, quantity = 1, discount = 0) {
        const item = new BudgetItem(treatment, quantity, discount);
        this.items.push(item);
        return item;
    }

    /**
     * Elimina un item del presupuesto por su ID
     */
    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Limpia todos los items
     */
    clearItems() {
        this.items = [];
    }

    /**
     * Obtiene el número de items
     */
    getItemCount() {
        return this.items.length;
    }

    /**
     * Calcula el subtotal (suma de todos los items)
     */
    getSubtotal() {
        return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
    }

    /**
     * Calcula el IVA
     */
    getIVA() {
        return this.getSubtotal() * (this.ivaRate / 100);
    }

    /**
     * Calcula el total (subtotal + IVA)
     */
    getTotal() {
        return this.getSubtotal() + this.getIVA();
    }

    /**
     * Valida si el presupuesto está completo
     */
    isValid() {
        return this.patientName.length > 0 && this.items.length > 0;
    }

    /**
     * Obtiene un resumen del presupuesto
     */
    getSummary() {
        return {
            patientName: this.patientName,
            date: formatDate(this.date),
            itemCount: this.getItemCount(),
            subtotal: this.getSubtotal(),
            subtotalFormatted: formatCurrency(this.getSubtotal(), this.currencySymbol),
            iva: this.getIVA(),
            ivaFormatted: formatCurrency(this.getIVA(), this.currencySymbol),
            total: this.getTotal(),
            totalFormatted: formatCurrency(this.getTotal(), this.currencySymbol),
            ivaRate: this.ivaRate
        };
    }

    /**
     * Convierte el presupuesto completo a objeto plano
     */
    toJSON() {
        return {
            budgetCode: this.budgetCode,
            patientName: this.patientName,
            patientDNI: this.patientDNI,
            patientAddress: this.patientAddress,
            patientRegion: this.patientRegion,
            patientPostalCode: this.patientPostalCode,
            patientEmail: this.patientEmail,
            patientPhone: this.patientPhone,
            date: this.date.toISOString(),
            items: this.items.map(item => item.toJSON()),
            summary: this.getSummary()
        };
    }

    /**
     * Limpia todo el presupuesto
     */
    reset() {
        this.budgetCode = this._generateBudgetCode();
        this.patientName = '';
        this.patientDNI = '';
        this.patientAddress = '';
        this.patientRegion = '';
        this.patientPostalCode = '';
        this.patientEmail = '';
        this.patientPhone = '';
        this.date = new Date();
        this.items = [];
    }
}

export default Budget;


