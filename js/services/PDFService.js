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
            
            // Cargar logo
            let logoImage = null;
            try {
                const logoResponse = await fetch('images/logo_1_sinF.png');
                const logoArrayBuffer = await logoResponse.arrayBuffer();
                logoImage = await pdfDoc.embedPng(logoArrayBuffer);
            } catch (error) {
                console.warn('No se pudo cargar el logo:', error);
            }
            
            // Crear página A4
            const page = pdfDoc.addPage([CONFIG.PDF.PAGE_SIZE.width, CONFIG.PDF.PAGE_SIZE.height]);
            const { width, height } = page.getSize();
            const margins = { top: 40, right: 40, bottom: 40, left: 40 };
            
            let yPosition = height - margins.top;
            
            // ===== 1. ENCABEZADO =====
            yPosition = this._drawHeader(page, fontBold, fontRegular, yPosition, rgb, width, logoImage);
            
            // ===== 2. DATOS DE LA CLÍNICA + NÚMERO DE FACTURA =====
            yPosition -= 40; // Más separación del encabezado (1cm aprox)
            yPosition = this._drawClinicAndInvoiceInfo(page, fontBold, fontRegular, budget, yPosition, rgb, width, margins);
            
            // ===== 3. DATOS DEL PACIENTE =====
            yPosition -= 40; // Más separación (1cm aprox)
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
    _drawHeader(page, fontBold, fontRegular, yPosition, rgb, width, logoImage) {
        const clinic = CONFIG.PDF.CLINIC_INFO;
        const leftX = 40;
        const rightX = 555 - 180; // Posición derecha para datos de la doctora
        
        // Calcular la altura del encabezado negro
        const headerTopY = yPosition;
        const headerBottomY = yPosition - 50;
        
        // FONDO NEGRO para toda la franja del encabezado (de extremo a extremo)
        page.drawRectangle({
            x: 0,
            y: headerBottomY,
            width: width,
            height: 50,
            color: rgb(0, 0, 0),
        });
        
        // Título principal (izquierda) - TEXTO BLANCO
        page.drawText('PLAN DE TRATAMIENTO', {
            x: leftX,
            y: yPosition,
            size: 16,
            font: fontBold,
            color: rgb(1, 1, 1), // Blanco
        });
        
        // Datos de la doctora (derecha) - TEXTO BLANCO
        page.drawText(clinic.doctorFullName, {
            x: rightX,
            y: yPosition,
            size: 11,
            font: fontBold,
            color: rgb(1, 1, 1), // Blanco
        });
        
        yPosition -= 15;
        
        // Subtítulos de la doctora (derecha) - TEXTO BLANCO
        page.drawText(clinic.headerSubtitle1, {
            x: rightX,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(1, 1, 1), // Blanco
        });
        
        yPosition -= 12;
        
        page.drawText(clinic.headerSubtitle2, {
            x: rightX,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: rgb(1, 1, 1), // Blanco
        });
        
        yPosition -= 15;
        
        // Logo debajo del título (si está disponible)
        if (logoImage) {
            const logoWidth = 100; // Ancho del logo
            const logoHeight = logoImage.height * (logoWidth / logoImage.width); // Mantener proporción
            
            page.drawImage(logoImage, {
                x: leftX,
                y: yPosition - logoHeight - 10,
                width: logoWidth,
                height: logoHeight,
            });
            
            yPosition -= (logoHeight + 20); // Ajustar posición después del logo
        }
        
        // NO HAY LÍNEA DIVISORIA
        
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
        
        // NO HAY LÍNEA DIVISORIA
        
        return yPosition;
    }

    /**
     * Dibuja la información del paciente
     * @private
     */
    _drawPatientInfo(page, fontBold, fontRegular, budget, yPosition, rgb, margins) {
        const leftX = margins.left + 30; // Mover a la derecha
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
        
        // Dirección (con comunidad y código postal en la misma línea)
        page.drawText('Dirección:', {
            x: leftX,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        const direccionCompleta = `${budget.patientAddress || '-'}, ${budget.patientRegion || '-'}, CP: ${budget.patientPostalCode || '-'}`;
        page.drawText(direccionCompleta, {
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
        
        // NO HAY LÍNEA DIVISORIA
        
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
        page.drawText('PLAN DE TRATAMIENTO', {
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
        const leftX = width - margins.right - 280; // Mover más a la izquierda
        
        // Calcular total sin descuento
        let totalSinDescuento = 0;
        budget.items.forEach(item => {
            totalSinDescuento += item.getSubtotalWithoutDiscount();
        });
        
        // Calcular importe del descuento
        const importeDescuento = totalSinDescuento - summary.subtotal;
        
        yPosition -= 15;
        
        // Total del presupuesto sin descuento
        page.drawText('Total del presupuesto sin descuento:', {
            x: leftX,
            y: yPosition,
            size: 10,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(formatCurrency(totalSinDescuento, budget.currencySymbol), {
            x: leftX + 220,
            y: yPosition,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 15;
        
        // Importe del descuento
        page.drawText('Importe del descuento:', {
            x: leftX,
            y: yPosition,
            size: 10,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        page.drawText(formatCurrency(importeDescuento, budget.currencySymbol), {
            x: leftX + 220,
            y: yPosition,
            size: 10,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        yPosition -= 20;
        
        // Importe total con descuento - FRANJA NEGRA DE EXTREMO A EXTREMO
        // Fondo negro para toda la franja
        page.drawRectangle({
            x: 0,
            y: yPosition - 15,
            width: width,
            height: 25,
            color: rgb(0, 0, 0), // Negro
        });
        
        page.drawText('Importe total con descuento:', {
            x: leftX,
            y: yPosition,
            size: 12,
            font: fontBold,
            color: rgb(1, 1, 1), // Blanco
        });
        
        page.drawText(summary.subtotalFormatted, {
            x: leftX + 220,
            y: yPosition,
            size: 12,
            font: fontBold,
            color: rgb(1, 1, 1), // Blanco
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
        
        // NO HAY LÍNEA DIVISORIA
        
        // Nota de exención de IVA
        page.drawText(clinic.ivaExemptionNote, {
            x: leftX,
            y: footerY,
            size: 8,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        footerY -= 15;
        
        // Nota de prontopago
        page.drawText(clinic.paymentNote, {
            x: leftX,
            y: footerY,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        footerY -= 15;
        
        // Validez del presupuesto
        page.drawText(clinic.validityNote, {
            x: leftX,
            y: footerY,
            size: 9,
            font: fontRegular,
            color: rgb(0, 0, 0),
        });
        
        footerY -= 15;
        
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
