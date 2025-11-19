/**
 * ActionsComponent.js
 * Componente para manejar las acciones principales (descargar PDF, etc.)
 */

import { getBudgetService } from '../services/BudgetService.js';
import { getPDFService } from '../services/PDFService.js';
import { getHistoryService } from '../services/HistoryService.js';
import { formatDate } from '../utils/formatter.js';
import { CONFIG } from '../config.js';

export class ActionsComponent {
    constructor() {
        this.budgetService = getBudgetService();
        this.pdfService = getPDFService();
        this.historyService = getHistoryService();
        
        this.elements = {
            downloadBtn: document.getElementById('download-pdf-btn')
        };

        this._bindEvents();
    }

    /**
     * Vincula eventos de acciones
     * @private
     */
    _bindEvents() {
        this.elements.downloadBtn.addEventListener('click', () => {
            this._handleDownloadPDF();
        });
    }

    /**
     * Maneja la descarga del PDF
     * @private
     */
    async _handleDownloadPDF() {
        const validation = this.budgetService.validate();

        if (!validation.valid) {
            alert(validation.errors.join('\n'));
            return;
        }

        try {
            // Deshabilitar botón y mostrar loading
            this._setButtonLoading(true);

            const budget = this.budgetService.getCurrentBudget();
            
            // Generar PDF
            const pdfBytes = await this.pdfService.generatePDF(budget);

            // Generar nombre del archivo
            const filename = this._generateFilename(budget);

            // Descargar
            this.pdfService.downloadPDF(pdfBytes, filename);

            // Guardar en historial
            const budgetData = budget.toJSON();
            this.historyService.saveBudget(budgetData);

            // Mostrar mensaje de éxito (opcional)
            this._showSuccess();

        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert(CONFIG.MESSAGES.ERROR_GENERATE_PDF);
        } finally {
            this._setButtonLoading(false);
        }
    }

    /**
     * Genera un nombre de archivo para el PDF
     * @private
     */
    _generateFilename(budget) {
        const patientName = budget.patientName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        
        const date = formatDate(budget.date, 'YYYY-MM-DD');
        
        return `presupuesto-${patientName}-${date}.pdf`;
    }

    /**
     * Establece el estado de loading del botón
     * @private
     */
    _setButtonLoading(loading) {
        const btn = this.elements.downloadBtn;
        
        if (loading) {
            btn.disabled = true;
            btn.dataset.originalText = btn.innerHTML;
            btn.innerHTML = '<span class="btn-icon">⏳</span> Generando PDF...';
            btn.classList.add('loading');
        } else {
            btn.disabled = false;
            btn.innerHTML = btn.dataset.originalText || '<span class="btn-icon">📄</span> Descargar PDF';
            btn.classList.remove('loading');
        }
    }

    /**
     * Muestra un mensaje de éxito temporal
     * @private
     */
    _showSuccess() {
        const btn = this.elements.downloadBtn;
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<span class="btn-icon">✓</span> ¡Descargado!';
        btn.classList.add('success');
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('success');
        }, 2000);
    }
}

export default ActionsComponent;


