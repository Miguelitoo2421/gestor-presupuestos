# 📝 Notas de Desarrollo

Este archivo contiene información importante para futuros desarrollos y modificaciones del sistema.

## 🔧 Antes de Modificar

### Archivos que deberás personalizar OBLIGATORIAMENTE:

1. **`js/config.js`** - Sección `CLINIC_INFO`
   ```javascript
   CLINIC_INFO: {
       name: '[TU CLÍNICA]',
       address: '[TU DIRECCIÓN]',
       city: '[TU CIUDAD]',
       phone: '[TU TELÉFONO]',
       email: '[TU EMAIL]',
       web: '[TU WEB]',
       cif: '[TU CIF]'
   }
   ```

2. **`data/tratamientos.json`** - Agregar tus tratamientos reales
   - Reemplaza los tratamientos de ejemplo con los reales
   - Ajusta precios según tu tarifa
   - Organiza por categorías relevantes para ti

### Archivos que puedes dejar tal cual:

- Toda la estructura de carpetas `js/`
- Todos los archivos CSS
- El archivo `index.html` (solo cambia textos si quieres)

## 🎨 Personalización de la Plantilla PDF

### Cambiar colores corporativos

En `js/config.js`, sección `PDF.COLORS`:

```javascript
COLORS: {
    PRIMARY: { r: 0.2, g: 0.4, b: 0.6 },  // Azul corporativo
    // Cambia estos valores RGB (de 0 a 1)
}
```

**Convertir colores HEX a RGB normalizado:**
```
HEX: #2c5aa0
RGB: 44, 90, 160
Normalizado: { r: 44/255, g: 90/255, b: 160/255 }
           = { r: 0.173, g: 0.353, b: 0.627 }
```

### Cambiar tamaños de fuente del PDF

En `js/config.js`, sección `PDF.FONTS`:

```javascript
FONTS: {
    TITLE_SIZE: 24,      // Título principal
    HEADING_SIZE: 16,    // Encabezados
    SUBHEADING_SIZE: 12, // Subencabezados
    BODY_SIZE: 10,       // Texto normal
    SMALL_SIZE: 8        // Texto pequeño
}
```

### Cambiar márgenes del PDF

En `js/config.js`, sección `PDF.MARGINS`:

```javascript
MARGINS: {
    top: 60,     // Margen superior
    right: 50,   // Margen derecho
    bottom: 60,  // Margen inferior
    left: 50     // Margen izquierdo
}
```

## 📊 Agregar Nuevos Tratamientos

### Formato correcto en `data/tratamientos.json`:

```json
{
  "id": "identificador-unico",          // Sin espacios, minúsculas
  "nombre": "Nombre Visible",           // Como aparece en el select/PDF
  "categoria": "Categoría del Servicio", // Agrupa tratamientos
  "precio": 100.00,                     // Número decimal
  "descripcion": "Descripción opcional" // Aparece en tabla y PDF
}
```

**Categorías sugeridas:**
- Preventiva
- Restauradora
- Endodoncia
- Prótesis
- Cirugía
- Estética
- Ortodoncia
- Implantología
- Periodoncia
- Pediatría

## 💰 Cambiar el IVA

Hay dos formas:

### Opción 1: En el JSON (recomendado)
Archivo: `data/tratamientos.json`
```json
"configuracion": {
  "iva": 10
}
```

### Opción 2: En la configuración
Archivo: `js/config.js`
```javascript
TAX: {
    IVA_RATE: 10
}
```

## 🌐 Cambiar la Moneda

En `data/tratamientos.json`:
```json
"configuracion": {
  "moneda": "USD",
  "simbolo_moneda": "$"
}
```

## 🎯 Modificar la Plantilla del PDF

Si necesitas cambiar la estructura del PDF (agregar logo, cambiar layout, etc.):

**Archivo a modificar:** `js/services/PDFService.js`

### Secciones del PDF:

1. **Header** - Método `_drawHeader()`
   - Fondo azul con nombre de clínica
   - Información de contacto

2. **Budget Info** - Método `_drawBudgetInfo()`
   - Título "PRESUPUESTO"
   - Nombre del paciente
   - Fecha

3. **Tabla** - Método `_drawTreatmentsTable()`
   - Encabezados de columnas
   - Filas de tratamientos
   - Totales (subtotal, IVA, total)

4. **Footer** - Método `_drawFooter()`
   - Información legal
   - Línea separadora

### Ejemplo: Agregar un logo

```javascript
// En _drawHeader()
const logoImage = await pdfDoc.embedPng(logoBytes);
page.drawImage(logoImage, {
    x: margins.left,
    y: yPosition - 40,
    width: 80,
    height: 40
});
```

## 🔄 Agregar Descuentos (Futuro)

### 1. Agregar campo al modelo Budget:
```javascript
// En js/models/Budget.js
constructor() {
    // ... campos existentes
    this.discount = 0; // Porcentaje de descuento
}
```

### 2. Agregar cálculo:
```javascript
getDiscount() {
    return this.getSubtotal() * (this.discount / 100);
}

getTotal() {
    return this.getSubtotal() - this.getDiscount() + this.getIVA();
}
```

### 3. Agregar input en el formulario:
```html
<!-- En index.html -->
<div class="form-group">
    <label for="discount">Descuento (%)</label>
    <input type="number" id="discount" min="0" max="100" value="0">
</div>
```

### 4. Actualizar vista previa y PDF

## 💾 Agregar Guardado Local (Futuro)

```javascript
// En js/services/BudgetService.js

saveBudget() {
    const data = JSON.stringify(this.currentBudget.toJSON());
    localStorage.setItem('current_budget', data);
    localStorage.setItem('budget_backup', data); // Backup
}

loadBudget() {
    const data = localStorage.getItem('current_budget');
    if (data) {
        const parsed = JSON.parse(data);
        // Reconstruir el presupuesto
    }
}

// Auto-save cada minuto
setInterval(() => this.saveBudget(), 60000);
```

## 📧 Conectar con Email (Futuro)

Para enviar presupuestos por email, necesitarás un backend. Opciones:

### Opción 1: EmailJS (Sin backend)
```javascript
// Agregar EmailJS a index.html
emailjs.send('service_id', 'template_id', {
    to_email: 'paciente@email.com',
    patient_name: budget.patientName,
    pdf_attachment: pdfBase64
});
```

### Opción 2: Backend propio (Node.js + Nodemailer)
```javascript
// backend/sendEmail.js
const nodemailer = require('nodemailer');

async function sendBudgetEmail(to, pdfBuffer) {
    const transporter = nodemailer.createTransport({...});
    await transporter.sendMail({
        to: to,
        subject: 'Tu Presupuesto Odontológico',
        attachments: [{
            filename: 'presupuesto.pdf',
            content: pdfBuffer
        }]
    });
}
```

## 🗄️ Conectar con Base de Datos (Futuro)

### Cambiar DataService para usar API:

```javascript
// js/services/DataService.js
async loadTreatments() {
    const response = await fetch('https://tu-api.com/api/treatments');
    const data = await response.json();
    this.treatments = data.map(t => new Treatment(t));
}
```

### Backend sugerido:
- **Node.js + Express** (JavaScript)
- **Django/Flask** (Python)
- **Laravel** (PHP)

### Base de datos sugerida:
- **PostgreSQL** (relacional, robusto)
- **MySQL** (relacional, popular)
- **MongoDB** (NoSQL, flexible)
- **Firebase** (sin servidor, fácil)

## 🐛 Debugging

### Ver el estado actual de la aplicación:

Abre la consola del navegador (F12) y escribe:

```javascript
// Ver configuración
window.app

// Ver presupuesto actual
window.app.getComponent('form').budgetService.getCurrentBudget()

// Ver tratamientos cargados
window.app.getComponent('form').dataService.getTreatments()

// Ver resumen
window.app.getComponent('form').budgetService.getSummary()
```

### Activar logs de desarrollo:

En `js/main.js`, descomentar o agregar:

```javascript
// Logging detallado
budgetService.subscribe((budget, summary) => {
    console.log('Budget actualizado:', budget, summary);
});
```

## ⚠️ Problemas Comunes

### 1. PDF no se genera
- **Causa:** PDF-LIB no cargado desde CDN
- **Solución:** Verificar conexión a internet o descargar PDF-LIB localmente

### 2. Tratamientos no cargan
- **Causa:** No estás usando un servidor web
- **Solución:** Usar Live Server o `python -m http.server`

### 3. Vista previa no aparece
- **Causa:** Navegador bloquea iframe con blob URLs
- **Solución:** Usar navegadores modernos (Chrome, Firefox, Edge)

### 4. Formato de números incorrecto
- **Causa:** Configuración regional del navegador
- **Solución:** Los formatos están hardcodeados en `formatter.js`

## 🚀 Próximos Pasos Sugeridos

1. ✅ Personalizar información de la clínica
2. ✅ Agregar tratamientos reales
3. ✅ Ajustar colores corporativos
4. ⬜ Agregar logo al PDF
5. ⬜ Implementar guardado local
6. ⬜ Agregar sistema de descuentos
7. ⬜ Conectar con backend
8. ⬜ Implementar envío por email
9. ⬜ Agregar historial de presupuestos
10. ⬜ Crear área de administración

## 📞 Soporte

Si necesitas ayuda con el código:

1. Revisa `ARQUITECTURA.md` para entender la estructura
2. Lee los comentarios en el código fuente
3. Usa las herramientas de debugging mencionadas arriba
4. Consulta la documentación de PDF-LIB: https://pdf-lib.js.org/

---

**Última actualización:** Noviembre 2025






