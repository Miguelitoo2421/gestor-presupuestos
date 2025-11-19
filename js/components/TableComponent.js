/**
 * TableComponent.js
 * Componente para mostrar y gestionar la tabla de tratamientos
 */

import { getBudgetService } from '../services/BudgetService.js';
import { formatCurrency } from '../utils/formatter.js';
import { CONFIG } from '../config.js';

export class TableComponent {
    constructor() {
        this.budgetService = getBudgetService();
        this.container = document.getElementById('treatments-table-container');
        
        this.elements = {
            subtotal: document.getElementById('subtotal'),
            iva: document.getElementById('iva'),
            total: document.getElementById('total')
        };

        this._render();
        this._subscribe();
    }

    /**
     * Se suscribe a cambios en el presupuesto
     * @private
     */
    _subscribe() {
        this.budgetService.subscribe(() => {
            this._render();
        });
    }

    /**
     * Renderiza la tabla
     * @private
     */
    _render() {
        const budget = this.budgetService.getCurrentBudget();
        
        if (budget.getItemCount() === 0) {
            this._renderEmpty();
        } else {
            this._renderTable(budget);
        }

        this._updateTotals(budget);
    }

    /**
     * Renderiza el estado vacío
     * @private
     */
    _renderEmpty() {
        this.container.innerHTML = `
            <div class="table-empty">
                <p>${CONFIG.MESSAGES.NO_TREATMENTS}</p>
            </div>
        `;
    }

    /**
     * Renderiza la tabla con datos (versión simplificada para el formulario)
     * @private
     */
    _renderTable(budget) {
        const list = document.createElement('div');
        list.className = 'treatments-list';
        
        budget.items.forEach(item => {
            const row = this._createRow(item);
            list.appendChild(row);
        });

        // Reemplazar contenido
        this.container.innerHTML = '';
        this.container.appendChild(list);
    }

    /**
     * Crea un item de tratamiento (versión simplificada)
     * @private
     */
    _createRow(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'treatment-item';
        itemDiv.dataset.itemId = item.id;

        // Nombre del tratamiento
        const nameDiv = document.createElement('div');
        nameDiv.className = 'treatment-item-name';
        nameDiv.innerHTML = `
            <strong>${item.treatment.nombre}</strong>
            ${item.treatment.descripcion ? `<br><small>${item.treatment.descripcion}</small>` : ''}
        `;

        // Detalles (cantidad y descuento si existe)
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'treatment-item-details';
        
        let detailsText = `Cantidad: ${item.quantity}`;
        if (item.discount > 0) {
            detailsText += ` | Descuento: ${item.discount}%`;
        }
        detailsDiv.textContent = detailsText;

        // Acciones
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'treatment-item-actions';
        
        // Botón editar
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-icon-small btn-secondary';
        btnEdit.innerHTML = '✏️';
        btnEdit.title = 'Editar';
        btnEdit.addEventListener('click', () => {
            this._handleEdit(item);
        });
        
        // Botón eliminar
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-icon-small btn-danger';
        btnDelete.innerHTML = '🗑️';
        btnDelete.title = 'Eliminar';
        btnDelete.addEventListener('click', () => {
            this._handleDelete(item.id);
        });
        
        actionsDiv.appendChild(btnEdit);
        actionsDiv.appendChild(btnDelete);

        // Contenedor principal
        const contentDiv = document.createElement('div');
        contentDiv.className = 'treatment-item-content';
        contentDiv.appendChild(nameDiv);
        contentDiv.appendChild(detailsDiv);

        itemDiv.appendChild(contentDiv);
        itemDiv.appendChild(actionsDiv);

        return itemDiv;
    }

    /**
     * Maneja la edición de un item
     * @private
     */
    _handleEdit(item) {
        const newQuantity = prompt('Ingrese la nueva cantidad:', item.quantity);
        
        if (newQuantity === null) return; // Cancelado
        
        const quantity = parseInt(newQuantity);
        if (isNaN(quantity) || quantity < 1) {
            alert('La cantidad debe ser un número mayor a 0');
            return;
        }

        const newDiscount = prompt('Ingrese el descuento (%):', item.discount);
        
        if (newDiscount === null) return; // Cancelado
        
        const discount = parseFloat(newDiscount);
        if (isNaN(discount) || discount < 0 || discount > 100) {
            alert('El descuento debe ser un número entre 0 y 100');
            return;
        }

        // Actualizar el item
        item.quantity = quantity;
        item.discount = discount;
        
        // Notificar cambios
        this.budgetService.notifyObservers();
    }

    /**
     * Maneja la eliminación de un item
     * @private
     */
    _handleDelete(itemId) {
        if (confirm('¿Desea eliminar este tratamiento?')) {
            this.budgetService.removeTreatment(itemId);
        }
    }

    /**
     * Actualiza los totales
     * @private
     */
    _updateTotals(budget) {
        const summary = budget.getSummary();
        
        this.elements.subtotal.textContent = summary.subtotalFormatted;
        this.elements.iva.textContent = summary.ivaFormatted;
        this.elements.total.textContent = summary.totalFormatted;

        // Animación de actualización
        [this.elements.subtotal, this.elements.iva, this.elements.total].forEach(el => {
            el.classList.add('updated');
            setTimeout(() => el.classList.remove('updated'), 300);
        });
    }
}

export default TableComponent;


