/**
 * PDFService.js
 * Servicio para generar PDFs profesionales usando PDF-LIB
 */

import { CONFIG } from '../config.js';
import { formatDate, formatCurrency } from '../utils/formatter.js';

export class PDFService {
    constructor() {
        // PDF-LIB se carga desde el script en index.html
        this.PDFLib = window.PDFLib;
        
        if (!this.PDFLib) {
            throw new Error('PDF-LIB no está cargado');
        }
    }

    /**
     * Genera un PDF completo a partir de un presupuesto
     * @param {Budget} budget - Objeto de presupuesto
     * @returns {Promise<Uint8Array>} - Bytes del PDF
     */
    async generatePDF(budget) {
        try {
            const { PDFDocument, rgb, StandardFonts } = this.PDFLib;
            
            // Crear documento
            const pdfDoc = await PDFDocument.create();
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
            
            // Crear página A4
            const page = pdfDoc.addPage([CONFIG.PDF.PAGE_SIZE.width, CONFIG.PDF.PAGE_SIZE.height]);
            const { width, height } = page.getSize();
            const margins = { top: 40, right: 40, bottom: 40, left: 40 };
            
            let yPosition = height - margins.top;
            
            // ===== 1. ENCABEZADO =====
            yPosition = this._drawHeader(page, fontBold, fontRegular, yPosition, rgb);
            
            // ===== 2. DATOS DE LA CLÍNICA + NÚMERO DE FACTURA =====
            yPosition -= 20;
            yPosition = this._drawClinicAndInvoiceInfo(page, fontBold, fontRegular, budget, yPosition, rgb, width, margins);
            
            // ===== 3. DATOS DEL PACIENTE =====
            yPosition -= 20;
            yPosition = this._drawPatientInfo(page, fontBold, fontRegular, budget, yPosition, rgb, margins);
            
            // ===== 4. TABLA DE TRATAMIENTOS =====
            yPosition -= 20;
            yPosition = this._drawTreatmentsTable(page, fontBold, fontRegular, budget, yPosition, rgb, width, margins);
            
            // ===== 5. TOTALES =====
            yPosition -= 10;
            yPosition = this._drawTotals(page, fontBold, fontRegular, budget, yPosition, rgb, width, margins);
            
            // ===== 6. FOOTER =====
            this._drawFooter(page, fontBold, fontRegular, rgb, margins);
            
            // Serializar el PDF a bytes
            const pdfBytes = await pdfDoc.save();
            
            return pdfBytes;
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw new Error(CONFIG.MESSAGES.ERROR_GENERATE_PDF);
        }
    }

    /**
     * Dibuja el encabezado del PDF
     * @private
     */
    _drawHeader(page, fontBold, fontRegular, yPosition, rgb) {
        const clinic = CONFIG.PDF.CLINIC_INFO;
        const leftX = 40;
        
        // Título principal
        page.drawText('PLAN DE TRATAMIENTO', {
            x: leftX,
            y: yPosition,
            size: 16,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 25;
        
        // Nombre de la doctora
        page.drawText(clinic.doctorFullName, {
            x: leftX,
            y: yPosition,
            size: 12,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 15;
        
        // Subtítulos
        page.drawText(clinic.headerSubtitle1, {
            x: leftX,
            y: yPosition,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        page.drawText(clinic.headerSubtitle2, {
            x: leftX,
            y: yPosition,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 10;
        
        // Línea divisoria
        page.drawLine({
            start: { x: 40, y: yPosition },
            end: { x: 555, y: yPosition },
            thickness: 1,
            color: rgb(0, 0, 0),
        });
        
        return yPosition;
    }

    /**
     * Dibuja la información de la clínica y el número de factura
     * @private
     */
    _drawClinicAndInvoiceInfo(page, fontBold, fontRegular, budget, yPosition, rgb, width, margins) {
        const clinic = CONFIG.PDF.CLINIC_INFO;
        const leftX = margins.left;
        const rightX = width - margins.right - 150;
        
        // ===== LADO IZQUIERDO: Datos de la clínica =====
        page.drawText(clinic.clinicName, {
            x: leftX,
            y: yPosition,
            size: 10,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        page.drawText(clinic.clinicBrand, {
            x: leftX,
            y: yPosition,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        page.drawText(`${clinic.clinicCompany} - ${clinic.clinicCIF}`, {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        page.drawText(clinic.clinicAddress, {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        page.drawText(clinic.clinicEmail, {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        page.drawText(clinic.clinicPhone, {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        // ===== LADO DERECHO: Número de factura y fecha =====
        const invoiceY = yPosition + 60; // Alinear con la parte superior de los datos de la clínica
        
        page.drawText('FACTURA Nº:', {
            x: rightX,
            y: invoiceY,
            size: 10,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(budget.budgetCode, {
            x: rightX + 75,
            y: invoiceY,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        page.drawText('FECHA:', {
            x: rightX,
            y: invoiceY - 15,
            size: 10,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(formatDate(budget.date), {
            x: rightX + 75,
            y: invoiceY - 15,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 10;
        
        // Línea divisoria
        page.drawLine({
            start: { x: 40, y: yPosition },
            end: { x: 555, y: yPosition },
            thickness: 1,
            color: rgb(0, 0, 0),
        });
        
        return yPosition;
    }

    /**
     * Dibuja la información del paciente
     * @private
     */
    _drawPatientInfo(page, fontBold, fontRegular, budget, yPosition, rgb, margins) {
        const leftX = margins.left;
        const labelWidth = 120;
        
        // Título
        page.drawText('DATOS DEL PACIENTE', {
            x: leftX,
            y: yPosition,
            size: 11,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 15;
        
        // Nombre
        page.drawText('Nombre:', {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(budget.patientName || '-', {
            x: leftX + labelWidth,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        // DNI
        page.drawText('DNI:', {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(budget.patientDNI || '-', {
            x: leftX + labelWidth,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        // Dirección
        page.drawText('Dirección:', {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(budget.patientAddress || '-', {
            x: leftX + labelWidth,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        // Comunidad
        page.drawText('Comunidad:', {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(budget.patientRegion || '-', {
            x: leftX + labelWidth,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        // Código Postal
        page.drawText('Código Postal:', {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(budget.patientPostalCode || '-', {
            x: leftX + labelWidth,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        // Email
        page.drawText('Email:', {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(budget.patientEmail || '-', {
            x: leftX + labelWidth,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 12;
        
        // Teléfono
        page.drawText('Teléfono:', {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(budget.patientPhone || '-', {
            x: leftX + labelWidth,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 10;
        
        // Línea divisoria
        page.drawLine({
            start: { x: 40, y: yPosition },
            end: { x: 555, y: yPosition },
            thickness: 1,
            color: rgb(0, 0, 0),
        });
        
        return yPosition;
    }

    /**
     * Dibuja la tabla de tratamientos
     * @private
     */
    _drawTreatmentsTable(page, fontBold, fontRegular, budget, yPosition, rgb, width, margins) {
        const tableWidth = width - margins.left - margins.right;
        const startX = margins.left;
        
        // Anchos de columnas
        const colWidths = {
            tratamiento: 180,
            cantidad: 50,
            precioUnit: 70,
            descuento: 55,
            impDescuento: 70,
            precioTotal: 90
        };
        
        // Título de la tabla
        page.drawText('PRESUPUESTO', {
            x: startX,
            y: yPosition,
            size: 11,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 15;
        
        // ===== ENCABEZADOS DE LA TABLA =====
        const headerY = yPosition;
        const headerHeight = 20;
        
        // Fondo gris para encabezados
        page.drawRectangle({
            x: startX,
            y: headerY - headerHeight,
            width: tableWidth,
            height: headerHeight,
            color: rgb(0.9, 0.9, 0.9),
        });
        
        // Bordes del encabezado
        page.drawRectangle({
            x: startX,
            y: headerY - headerHeight,
            width: tableWidth,
            height: headerHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });
        
        // Textos del encabezado
        let currentX = startX + 5;
        
        page.drawText('Tratamiento', {
            x: currentX,
            y: headerY - 13,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        currentX += colWidths.tratamiento;
        page.drawText('Cant.', {
            x: currentX,
            y: headerY - 13,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        currentX += colWidths.cantidad;
        page.drawText('Precio Unit.', {
            x: currentX,
            y: headerY - 13,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        currentX += colWidths.precioUnit;
        page.drawText('Dto. (%)', {
            x: currentX,
            y: headerY - 13,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        currentX += colWidths.descuento;
        page.drawText('Imp. Dto.', {
            x: currentX,
            y: headerY - 13,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        currentX += colWidths.impDescuento;
        page.drawText('Precio Total', {
            x: currentX,
            y: headerY - 13,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        yPosition = headerY - headerHeight;
        
        // ===== FILAS DE TRATAMIENTOS =====
        const rowHeight = 18;
        
        budget.items.forEach((item, index) => {
            const isEven = index % 2 === 0;
            
            // Fondo alternado
            if (isEven) {
                page.drawRectangle({
                    x: startX,
                    y: yPosition - rowHeight,
                    width: tableWidth,
                    height: rowHeight,
                    color: rgb(0.95, 0.95, 0.95),
                });
            }
            
            // Bordes de la fila
            page.drawRectangle({
                x: startX,
                y: yPosition - rowHeight,
                width: tableWidth,
                height: rowHeight,
                borderColor: rgb(0, 0, 0),
                borderWidth: 0.5,
            });
            
            currentX = startX + 5;
            const textY = yPosition - 12;
            
            // Tratamiento (truncar si es muy largo)
            const treatmentText = item.treatment.nombre.length > 30 
                ? item.treatment.nombre.substring(0, 27) + '...'
                : item.treatment.nombre;
            
            page.drawText(treatmentText, {
                x: currentX,
                y: textY,
                size: 8,
                font: fontRegular,
                color: rgb(0, 0, 0),
            });
            
            currentX += colWidths.tratamiento;
            page.drawText(String(item.quantity), {
                x: currentX,
                y: textY,
                size: 8,
                font: fontRegular,
                color: rgb(0, 0, 0),
            });
            
            currentX += colWidths.cantidad;
            page.drawText(formatCurrency(item.treatment.precio, budget.currencySymbol), {
                x: currentX,
                y: textY,
                size: 8,
                font: fontRegular,
                color: rgb(0, 0, 0),
            });
            
            currentX += colWidths.precioUnit;
            const descuentoText = item.discount > 0 ? `${item.discount}%` : '-';
            page.drawText(descuentoText, {
                x: currentX,
                y: textY,
                size: 8,
                font: fontRegular,
                color: rgb(0, 0, 0),
            });
            
            currentX += colWidths.descuento;
            const impDescuentoText = item.discount > 0 
                ? formatCurrency(item.getDiscountAmount(), budget.currencySymbol) 
                : '-';
            page.drawText(impDescuentoText, {
                x: currentX,
                y: textY,
                size: 8,
                font: fontRegular,
                color: rgb(0, 0, 0),
            });
            
            currentX += colWidths.impDescuento;
            page.drawText(formatCurrency(item.getSubtotal(), budget.currencySymbol), {
                x: currentX,
                y: textY,
                size: 8,
                font: fontRegular,
                color: rgb(0, 0, 0),
            });
            
            yPosition -= rowHeight;
        });
        
        return yPosition;
    }

    /**
     * Dibuja los totales
     * @private
     */
    _drawTotals(page, fontBold, fontRegular, budget, yPosition, rgb, width, margins) {
        const summary = budget.getSummary();
        const rightX = width - margins.right - 150;
        
        yPosition -= 15;
        
        // Subtotal
        page.drawText('Subtotal:', {
            x: rightX,
            y: yPosition,
            size: 10,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(summary.subtotalFormatted, {
            x: rightX + 100,
            y: yPosition,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 15;
        
        // IRPF (7%)
        const irpf = summary.subtotal * 0.07;
        const irpfFormatted = formatCurrency(irpf, budget.currencySymbol);
        
        page.drawText('IRPF (7%):', {
            x: rightX,
            y: yPosition,
            size: 10,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(irpfFormatted, {
            x: rightX + 100,
            y: yPosition,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 20;
        
        // TOTAL
        const totalConIRPF = summary.subtotal - irpf;
        const totalFormatted = formatCurrency(totalConIRPF, budget.currencySymbol);
        
        // Fondo gris para el total
        page.drawRectangle({
            x: rightX - 10,
            y: yPosition - 15,
            width: 200,
            height: 25,
            color: rgb(0.85, 0.85, 0.85),
        });
        
        page.drawText('TOTAL:', {
            x: rightX,
            y: yPosition,
            size: 12,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(totalFormatted, {
            x: rightX + 100,
            y: yPosition,
            size: 12,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        return yPosition - 20;
    }

    /**
     * Dibuja el pie de página
     * @private
     */
    _drawFooter(page, fontBold, fontRegular, rgb, margins) {
        const clinic = CONFIG.PDF.CLINIC_INFO;
        const leftX = margins.left;
        let footerY = 120;
        
        // Línea divisoria superior
        page.drawLine({
            start: { x: 40, y: footerY + 20 },
            end: { x: 555, y: footerY + 20 },
            thickness: 1,
            color: rgb(0, 0, 0),
        });
        
        // Nota de exención de IVA
        page.drawText(clinic.ivaExemptionNote, {
            x: leftX,
            y: footerY,
            size: 8,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        footerY -= 15;
        
        // Nombre de la doctora
        page.drawText(clinic.doctorName, {
            x: leftX,
            y: footerY,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        footerY -= 15;
        
        // Nota de pago
        page.drawText(clinic.paymentNote, {
            x: leftX,
            y: footerY,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        footerY -= 12;
        
        // Banco
        page.drawText(`Banco: ${clinic.bankName}`, {
            x: leftX,
            y: footerY,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        footerY -= 12;
        
        // IBAN
        page.drawText(`IBAN: ${clinic.bankIBAN}`, {
            x: leftX,
            y: footerY,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
    }

    /**
     * Descarga el PDF generado
     * @param {Uint8Array} pdfBytes - Bytes del PDF
     * @param {string} filename - Nombre del archivo
     */
    downloadPDF(pdfBytes, filename = 'presupuesto.pdf') {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Genera un blob del PDF para vista previa
     * @param {Uint8Array} pdfBytes - Bytes del PDF
     * @returns {string} - URL del blob
     */
    createPreviewURL(pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
    }
}

// Singleton
let pdfServiceInstance = null;

export function getPDFService() {
    if (!pdfServiceInstance) {
        pdfServiceInstance = new PDFService();
    }
    return pdfServiceInstance;
}

export default PDFService;
