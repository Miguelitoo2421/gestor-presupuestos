/**
 * HistoryService.js
 * Servicio para gestionar el historial de presupuestos en localStorage
 */

const STORAGE_KEY = 'budgets_history';

export class HistoryService {
    constructor() {
        this.budgets = this._loadFromStorage();
    }

    /**
     * Carga el historial desde localStorage
     * @private
     */
    _loadFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al cargar historial:', error);
            return [];
        }
    }

    /**
     * Guarda el historial en localStorage
     * @private
     */
    _saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.budgets));
        } catch (error) {
            console.error('Error al guardar historial:', error);
        }
    }

    /**
     * Guarda un presupuesto en el historial
     * @param {Object} budgetData - Datos del presupuesto (toJSON())
     */
    saveBudget(budgetData) {
        const budgetWithTimestamp = {
            ...budgetData,
            savedAt: new Date().toISOString()
        };
        
        this.budgets.unshift(budgetWithTimestamp); // Agregar al inicio
        this._saveToStorage();
        
        console.log(`✓ Presupuesto ${budgetData.budgetCode} guardado en historial`);
    }

    /**
     * Obtiene todos los presupuestos
     * @returns {Array}
     */
    getAllBudgets() {
        return [...this.budgets];
    }

    /**
     * Busca presupuestos por término
     * @param {string} searchTerm
     * @returns {Array}
     */
    searchBudgets(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return this.getAllBudgets();
        }

        const term = searchTerm.toLowerCase();
        
        return this.budgets.filter(budget => {
            const matchesName = budget.patientName && budget.patientName.toLowerCase().includes(term);
            const matchesCode = budget.budgetCode && budget.budgetCode.toLowerCase().includes(term);
            
            // Buscar por fecha en diferentes formatos
            const dateStr = new Date(budget.date).toLocaleDateString();
            const matchesDate = dateStr.includes(term);
            
            return matchesName || matchesCode || matchesDate;
        });
    }

    /**
     * Obtiene un presupuesto por su código
     * @param {string} budgetCode
     * @returns {Object|null}
     */
    getBudgetByCode(budgetCode) {
        return this.budgets.find(b => b.budgetCode === budgetCode) || null;
    }

    /**
     * Elimina un presupuesto del historial
     * @param {string} budgetCode
     * @returns {boolean}
     */
    deleteBudget(budgetCode) {
        const index = this.budgets.findIndex(b => b.budgetCode === budgetCode);
        
        if (index !== -1) {
            this.budgets.splice(index, 1);
            this._saveToStorage();
            console.log(`✓ Presupuesto ${budgetCode} eliminado del historial`);
            return true;
        }
        
        return false;
    }

    /**
     * Limpia todo el historial
     */
    clearAll() {
        this.budgets = [];
        this._saveToStorage();
        console.log('✓ Historial limpiado completamente');
    }

    /**
     * Obtiene estadísticas del historial
     * @returns {Object}
     */
    getStats() {
        return {
            total: this.budgets.length,
            totalAmount: this.budgets.reduce((sum, b) => sum + (b.summary?.total || 0), 0),
            lastSaved: this.budgets.length > 0 ? this.budgets[0].savedAt : null
        };
    }
}

// Singleton
let historyServiceInstance = null;

export function getHistoryService() {
    if (!historyServiceInstance) {
        historyServiceInstance = new HistoryService();
    }
    return historyServiceInstance;
}

export default HistoryService;





