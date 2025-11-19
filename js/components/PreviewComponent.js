/**
 * PreviewComponent.js
 * Componente para mostrar la vista previa del PDF
 */

import { getBudgetService } from '../services/BudgetService.js';
import { getPDFService } from '../services/PDFService.js';
import { CONFIG } from '../config.js';

export class PreviewComponent {
    constructor() {
        this.budgetService = getBudgetService();
        this.pdfService = getPDFService();
        this.container = document.getElementById('pdf-preview');
        this.currentBlobUrl = null;
        this.updateTimeout = null;

        this._subscribe();
        this._renderPlaceholder();
    }

    /**
     * Se suscribe a cambios en el presupuesto
     * @private
     */
    _subscribe() {
        this.budgetService.subscribe(() => {
            this._scheduleUpdate();
        });
    }

    /**
     * Programa una actualización de la vista previa con debounce
     * @private
     */
    _scheduleUpdate() {
        // Cancelar actualización pendiente
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        // Programar nueva actualización
        this.updateTimeout = setTimeout(() => {
            this._updatePreview();
        }, CONFIG.UI.DEBOUNCE_DELAY);
    }

    /**
     * Actualiza la vista previa del PDF
     * @private
     */
    async _updatePreview() {
        const budget = this.budgetService.getCurrentBudget();

        // Si no hay datos suficientes, mostrar placeholder
        if (!budget.patientName || budget.getItemCount() === 0) {
            this._renderPlaceholder();
            return;
        }

        try {
            // Mostrar loading
            this._renderLoading();

            // Generar PDF
            const pdfBytes = await this.pdfService.generatePDF(budget);
            
            // Crear URL del blob
            if (this.currentBlobUrl) {
                URL.revokeObjectURL(this.currentBlobUrl);
            }
            
            this.currentBlobUrl = this.pdfService.createPreviewURL(pdfBytes);

            // Mostrar PDF
            this._renderPDF(this.currentBlobUrl);

        } catch (error) {
            console.error('Error al actualizar vista previa:', error);
            this._renderError();
        }
    }

    /**
     * Renderiza el placeholder inicial
     * @private
     */
    _renderPlaceholder() {
        this.container.innerHTML = `
            <div class="preview-placeholder">
                <div class="placeholder-icon">📄</div>
                <p class="placeholder-title">Vista Previa del Presupuesto</p>
                <p class="placeholder-text">Complete los datos del paciente y agregue tratamientos para ver la vista previa</p>
            </div>
        `;
    }

    /**
     * Renderiza el estado de carga
     * @private
     */
    _renderLoading() {
        this.container.innerHTML = `
            <div class="preview-loading">
                <div class="spinner"></div>
                <p>Generando vista previa...</p>
            </div>
        `;
    }

    /**
     * Renderiza el PDF en un iframe
     * @private
     */
    _renderPDF(blobUrl) {
        this.container.innerHTML = `
            <iframe 
                src="${blobUrl}#toolbar=0&navpanes=0&scrollbar=0" 
                class="pdf-iframe"
                title="Vista previa del presupuesto"
            ></iframe>
        `;
    }

    /**
     * Renderiza un error
     * @private
     */
    _renderError() {
        this.container.innerHTML = `
            <div class="preview-error">
                <div class="error-icon">⚠️</div>
                <p class="error-title">Error al generar la vista previa</p>
                <p class="error-text">Por favor, intente nuevamente</p>
            </div>
        `;
    }

    /**
     * Fuerza una actualización inmediata de la vista previa
     */
    forceUpdate() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        this._updatePreview();
    }

    /**
     * Limpia recursos
     */
    destroy() {
        if (this.currentBlobUrl) {
            URL.revokeObjectURL(this.currentBlobUrl);
        }
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
    }
}

export default PreviewComponent;






