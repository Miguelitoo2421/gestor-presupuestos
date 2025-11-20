/**
 * BudgetService.js
 * Servicio para gestionar la lógica de negocio del presupuesto
 */

import { Budget } from '../models/Budget.js';
import { CONFIG } from '../config.js';

export class BudgetService {
    constructor() {
        this.currentBudget = new Budget();
        this.observers = []; // Patrón Observer para notificar cambios
        
        // Configurar IVA desde la configuración global
        this.currentBudget.setIvaRate(CONFIG.TAX.IVA_RATE);
        this.currentBudget.currencySymbol = CONFIG.TAX.CURRENCY_SYMBOL;
    }

    /**
     * Obtiene el presupuesto actual
     * @returns {Budget}
     */
    getCurrentBudget() {
        return this.currentBudget;
    }

    /**
     * Establece el nombre del paciente
     * @param {string} name
     */
    setPatientName(name) {
        this.currentBudget.setPatientName(name);
        this.notifyObservers();
    }

    /**
     * Establece el DNI del paciente
     * @param {string} dni
     */
    setPatientDNI(dni) {
        this.currentBudget.setPatientDNI(dni);
        this.notifyObservers();
    }

    /**
     * Establece la dirección del paciente
     * @param {string} address
     */
    setPatientAddress(address) {
        this.currentBudget.setPatientAddress(address);
        this.notifyObservers();
    }

    /**
     * Establece la comunidad autónoma del paciente
     * @param {string} region
     */
    setPatientRegion(region) {
        this.currentBudget.setPatientRegion(region);
        this.notifyObservers();
    }

    /**
     * Establece el código postal del paciente
     * @param {string} postalCode
     */
    setPatientPostalCode(postalCode) {
        this.currentBudget.setPatientPostalCode(postalCode);
        this.notifyObservers();
    }

    /**
     * Establece el email del paciente
     * @param {string} email
     */
    setPatientEmail(email) {
        this.currentBudget.setPatientEmail(email);
        this.notifyObservers();
    }

    /**
     * Establece el teléfono del paciente
     * @param {string} phone
     */
    setPatientPhone(phone) {
        this.currentBudget.setPatientPhone(phone);
        this.notifyObservers();
    }

    /**
     * Establece la fecha del presupuesto
     * @param {Date|string} date
     */
    setDate(date) {
        this.currentBudget.setDate(date);
        this.notifyObservers();
    }

    /**
     * Agrega un tratamiento al presupuesto
     * @param {Treatment} treatment
     * @param {number} quantity
     * @param {number} discount
     * @returns {BudgetItem}
     */
    addTreatment(treatment, quantity = 1, discount = 0) {
        const item = this.currentBudget.addItem(treatment, quantity, discount);
        this.notifyObservers();
        return item;
    }

    /**
     * Elimina un tratamiento del presupuesto
     * @param {string} itemId
     * @returns {boolean}
     */
    removeTreatment(itemId) {
        const removed = this.currentBudget.removeItem(itemId);
        if (removed) {
            this.notifyObservers();
        }
        return removed;
    }

    /**
     * Limpia todos los tratamientos
     */
    clearTreatments() {
        this.currentBudget.clearItems();
        this.notifyObservers();
    }

    /**
     * Obtiene el resumen del presupuesto
     * @returns {Object}
     */
    getSummary() {
        return this.currentBudget.getSummary();
    }

    /**
     * Valida el presupuesto antes de generar PDF
     * @returns {Object} { valid: boolean, errors: Array<string> }
     */
    validate() {
        const errors = [];

        if (!this.currentBudget.patientName || this.currentBudget.patientName.trim() === '') {
            errors.push(CONFIG.MESSAGES.VALIDATION.PATIENT_NAME);
        }

        if (this.currentBudget.getItemCount() === 0) {
            errors.push(CONFIG.MESSAGES.VALIDATION.NO_TREATMENTS);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Reinicia el presupuesto
     */
    reset() {
        this.currentBudget.reset();
        this.currentBudget.setIvaRate(CONFIG.TAX.IVA_RATE);
        this.currentBudget.currencySymbol = CONFIG.TAX.CURRENCY_SYMBOL;
        this.notifyObservers();
    }

    /**
     * Exporta el presupuesto a JSON
     * @returns {Object}
     */
    exportToJSON() {
        return this.currentBudget.toJSON();
    }

    /**
     * Carga un presupuesto desde JSON
     * @param {Object} budgetData - Datos del presupuesto en formato JSON
     */
    loadBudgetFromJSON(budgetData) {
        // Reiniciar el presupuesto actual
        this.currentBudget.reset();
        
        // Cargar datos del paciente
        this.currentBudget.budgetCode = budgetData.budgetCode;
        this.currentBudget.setPatientName(budgetData.patientName || '');
        this.currentBudget.setPatientDNI(budgetData.patientDNI || '');
        this.currentBudget.setPatientAddress(budgetData.patientAddress || '');
        this.currentBudget.setPatientRegion(budgetData.patientRegion || '');
        this.currentBudget.setPatientPostalCode(budgetData.patientPostalCode || '');
        this.currentBudget.setPatientEmail(budgetData.patientEmail || '');
        this.currentBudget.setPatientPhone(budgetData.patientPhone || '');
        this.currentBudget.setDate(new Date(budgetData.date));
        
        // Cargar items (tratamientos)
        if (budgetData.items && Array.isArray(budgetData.items)) {
            budgetData.items.forEach(itemData => {
                // Reconstruir el tratamiento
                const treatment = {
                    id: itemData.treatment.id,
                    nombre: itemData.treatment.nombre,
                    categoria: itemData.treatment.categoria,
                    precio: itemData.treatment.precio
                };
                
                // Agregar el item
                this.currentBudget.addItem(treatment, itemData.quantity, itemData.discount);
            });
        }
        
        // Configurar IVA y moneda
        this.currentBudget.setIvaRate(CONFIG.TAX.IVA_RATE);
        this.currentBudget.currencySymbol = CONFIG.TAX.CURRENCY_SYMBOL;
        
        // Notificar a los observadores
        this.notifyObservers();
    }

    // Patrón Observer

    /**
     * Registra un observador
     * @param {Function} callback - Función a llamar cuando cambie el presupuesto
     */
    subscribe(callback) {
        if (typeof callback === 'function') {
            this.observers.push(callback);
        }
    }

    /**
     * Elimina un observador
     * @param {Function} callback
     */
    unsubscribe(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    /**
     * Notifica a todos los observadores
     */
    notifyObservers() {
        const budget = this.currentBudget;
        const summary = this.getSummary();
        
        this.observers.forEach(callback => {
            try {
                callback(budget, summary);
            } catch (error) {
                console.error('Error en observer:', error);
            }
        });
    }
}

// Singleton
let budgetServiceInstance = null;

export function getBudgetService() {
    if (!budgetServiceInstance) {
        budgetServiceInstance = new BudgetService();
    }
    return budgetServiceInstance;
}

export default BudgetService;


