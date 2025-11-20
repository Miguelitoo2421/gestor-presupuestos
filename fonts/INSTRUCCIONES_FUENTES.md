# 🎨 CÓMO USAR FUENTES PERSONALIZADAS EN EL PDF

## 📁 Paso 1: Descargar y Colocar la Fuente

1. **Descargar fuente .ttf:**
   - Ve a [Google Fonts](https://fonts.google.com/)
   - Busca la fuente que te guste (ej: Montserrat, Roboto, Lato)
   - Descarga el archivo `.ttf` (asegúrate de que sea formato TrueType)

2. **Colocar en esta carpeta:**
   - Coloca el archivo `.ttf` aquí: `fonts/tu-fuente.ttf`
   - Ejemplo: `fonts/Montserrat-Bold.ttf`

---

## 💻 Paso 2: Modificar PDFService.js

### A) Cargar la fuente en el método `generatePDF`

**Ubicación:** `js/services/PDFService.js` - Línea ~35 (después de cargar `fontBold` y `fontRegular`)

```javascript
// DESPUÉS DE ESTA LÍNEA:
const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

// AGREGAR ESTO:
// Cargar fuente personalizada
const fontCustomBytes = await fetch('fonts/Montserrat-Bold.ttf').then(res => res.arrayBuffer());
const fontCustom = await pdfDoc.embedFont(fontCustomBytes);
```

**Nota:** Cambia `Montserrat-Bold.ttf` por el nombre de tu archivo de fuente.

---

### B) Pasar la fuente a las funciones de dibujo

**Ubicación:** Línea ~46-54 (donde se llaman las funciones `_drawHeader`, `_drawClinicAndInvoiceInfo`, etc.)

**CAMBIAR:**
```javascript
yPosition = this._drawHeader(page, fontBold, fontRegular, yPosition, rgb, width, margins, logoImage);
```

**POR:**
```javascript
yPosition = this._drawHeader(page, fontBold, fontRegular, fontCustom, yPosition, rgb, width, margins, logoImage);
```

**Repetir para todas las funciones** que quieras que usen la fuente personalizada:
- `_drawHeader`
- `_drawClinicAndInvoiceInfo`
- `_drawPatientInfo`
- `_drawTreatmentsTable`
- `_drawTotals`
- `_drawFooter`

---

### C) Actualizar la firma de las funciones

**Ubicación:** Cada función privada (ej: `_drawHeader`)

**CAMBIAR:**
```javascript
_drawHeader(page, fontBold, fontRegular, yPosition, rgb, width, margins, logoImage) {
```

**POR:**
```javascript
_drawHeader(page, fontBold, fontRegular, fontCustom, yPosition, rgb, width, margins, logoImage) {
```

**Repetir para todas las funciones** donde quieras tener disponible `fontCustom`.

---

### D) Usar la fuente donde quieras

**Ejemplo:** Cambiar el título "PLAN DE TRATAMIENTO" para usar la fuente personalizada

**Ubicación:** `_drawHeader` - Línea ~120

**CAMBIAR:**
```javascript
page.drawText('PLAN DE TRATAMIENTO', {
    x: leftX,
    y: yPosition,
    size: 16,
    font: fontBold,  // ⬅️ Fuente actual
    color: rgb(1, 1, 1),
});
```

**POR:**
```javascript
page.drawText('PLAN DE TRATAMIENTO', {
    x: leftX,
    y: yPosition,
    size: 16,
    font: fontCustom,  // ⬅️ Fuente personalizada
    color: rgb(1, 1, 1),
});
```

---

## 🎯 DÓNDE USAR LA FUENTE PERSONALIZADA (Ejemplos)

### 1. Títulos principales:
- "PLAN DE TRATAMIENTO" (línea ~120 en `_drawHeader`)
- "DATOS DEL PACIENTE" (línea ~287 en `_drawPatientInfo`)
- "PLAN DE TRATAMIENTO" (línea ~417 en `_drawTreatmentsTable`)

### 2. Nombre de la doctora:
- Línea ~125 en `_drawHeader`

### 3. Encabezados de tabla:
- Líneas ~434-485 en `_drawTreatmentsTable`

### 4. Totales:
- Líneas ~584, 603, 631 en `_drawTotals`

---

## ⚠️ IMPORTANTE

1. **Cache del navegador:** Después de agregar la fuente, haz `Ctrl + Shift + R` para recargar sin caché.

2. **Archivo .ttf válido:** Asegúrate de que el archivo sea formato TrueType (`.ttf`), no `.otf` ni `.woff`.

3. **Nombre exacto:** El nombre del archivo en `fetch('fonts/...')` debe coincidir exactamente con el archivo descargado.

4. **Probar primero:** Cambia solo un título primero (ej: "PLAN DE TRATAMIENTO") para verificar que funcione antes de cambiar todos.

---

## 🎨 FUENTES RECOMENDADAS

### Para títulos:
- **Montserrat-Bold.ttf** (moderna, elegante)
- **Raleway-Bold.ttf** (sofisticada, delgada)
- **Oswald-Bold.ttf** (impactante, fuerte)

### Para texto general:
- **Roboto-Regular.ttf** (limpia, corporativa)
- **Lato-Regular.ttf** (versátil, profesional)
- **OpenSans-Regular.ttf** (clara, legible)

---

## 📞 ¿Necesitas ayuda?

Si tienes problemas, házmelo saber y te ayudaré paso a paso. 🚀

