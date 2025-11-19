/**
 * HistoryComponent.js
 * Componente para gestionar el modal del historial de presupuestos
 */

import { getHistoryService } from '../services/HistoryService.js';
import { formatDate, formatCurrency } from '../utils/formatter.js';

export class HistoryComponent {
    constructor() {
        this.historyService = getHistoryService();
        
        this.elements = {
            historyBtn: document.getElementById('history-btn'),
            modal: document.getElementById('history-modal'),
            closeBtn: document.getElementById('close-history-modal'),
            searchInput: document.getElementById('history-search'),
            clearFiltersBtn: document.getElementById('clear-filters-btn'),
            historyList: document.getElementById('history-list')
        };

        this._bindEvents();
    }

    /**
     * Vincula eventos del componente
     * @private
     */
    _bindEvents() {
        // Abrir modal
        this.elements.historyBtn.addEventListener('click', () => {
            this._openModal();
        });

        // Cerrar modal
        this.elements.closeBtn.addEventListener('click', () => {
            this._closeModal();
        });

        // Cerrar al hacer click fuera del modal
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this._closeModal();
            }
        });

        // Buscar
        this.elements.searchInput.addEventListener('input', (e) => {
            this._renderHistory(e.target.value);
        });

        // Limpiar filtros
        this.elements.clearFiltersBtn.addEventListener('click', () => {
            this.elements.searchInput.value = '';
            this._renderHistory();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.modal.classList.contains('active')) {
                this._closeModal();
            }
        });
    }

    /**
     * Abre el modal
     * @private
     */
    _openModal() {
        this.elements.modal.classList.add('active');
        this._renderHistory();
    }

    /**
     * Cierra el modal
     * @private
     */
    _closeModal() {
        this.elements.modal.classList.remove('active');
    }

    /**
     * Renderiza el historial
     * @private
     */
    _renderHistory(searchTerm = '') {
        const budgets = searchTerm ? 
            this.historyService.searchBudgets(searchTerm) : 
            this.historyService.getAllBudgets();

        if (budgets.length === 0) {
            this.elements.historyList.innerHTML = `
                <div class="history-empty">
                    <p>${searchTerm ? 'No se encontraron resultados' : 'No hay presupuestos guardados'}</p>
                </div>
            `;
            return;
        }

        this.elements.historyList.innerHTML = '';
        budgets.forEach(budget => {
            const item = this._createHistoryItem(budget);
            this.elements.historyList.appendChild(item);
        });
    }

    /**
     * Crea un elemento de historial
     * @private
     */
    _createHistoryItem(budget) {
        const div = document.createElement('div');
        div.className = 'history-item';

        const date = formatDate(new Date(budget.date));
        const savedAt = new Date(budget.savedAt).toLocaleString('es-ES');

        div.innerHTML = `
            <div class="history-item-header">
                <div>
                    <div class="history-item-title">${budget.patientName}</div>
                    <div class="history-item-code">${budget.budgetCode}</div>
                </div>
                <div class="history-item-actions">
                    <button class="btn btn-danger btn-small delete-btn" data-code="${budget.budgetCode}">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
            <div class="history-item-info">
                <div class="history-item-info-item">
                    <span class="history-item-info-label">Fecha</span>
                    <span class="history-item-info-value">${date}</span>
                </div>
                <div class="history-item-info-item">
                    <span class="history-item-info-label">Total</span>
                    <span class="history-item-info-value">${budget.summary?.totalFormatted || 'N/A'}</span>
                </div>
                <div class="history-item-info-item">
                    <span class="history-item-info-label">Guardado</span>
                    <span class="history-item-info-value">${savedAt}</span>
                </div>
            </div>
        `;

        // Evento eliminar
        const deleteBtn = div.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            this._handleDelete(budget.budgetCode);
        });

        return div;
    }

    /**
     * Maneja la eliminación de un presupuesto
     * @private
     */
    _handleDelete(budgetCode) {
        if (confirm('¿Está seguro de que desea eliminar este presupuesto del historial?')) {
            this.historyService.deleteBudget(budgetCode);
            this._renderHistory(this.elements.searchInput.value);
        }
    }
}

export default HistoryComponent;





