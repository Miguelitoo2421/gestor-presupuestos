# 🏗️ Arquitectura del Sistema

## Visión General

Este documento detalla la arquitectura técnica del **Gestor de Presupuestos Odontológicos**, un sistema modular construido con **JavaScript Vanilla** siguiendo principios de diseño limpio y escalable.

## 📐 Principios de Diseño

### 1. Separación de Responsabilidades (SoC)
Cada módulo tiene una responsabilidad única y bien definida:
- **Models**: Representación de datos
- **Services**: Lógica de negocio
- **Components**: Presentación e interacción
- **Utils**: Funciones auxiliares reutilizables

### 2. Modularidad
El código está organizado en módulos ES6 independientes y reutilizables, facilitando:
- Mantenimiento
- Testing
- Escalabilidad
- Reutilización

### 3. Patrón Singleton
Los servicios principales se implementan como Singletons para garantizar una única instancia:
```javascript
let instance = null;
export function getService() {
    if (!instance) instance = new Service();
    return instance;
}
```

### 4. Patrón Observer
El `BudgetService` notifica cambios a los componentes interesados:
```javascript
budgetService.subscribe(callback);
budgetService.notifyObservers();
```

## 🎯 Capas de la Aplicación

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│  (Components - UI & User Interaction)   │
├─────────────────────────────────────────┤
│           BUSINESS LOGIC LAYER          │
│  (Services - Application Logic)         │
├─────────────────────────────────────────┤
│           DATA MODEL LAYER              │
│  (Models - Data Entities)               │
├─────────────────────────────────────────┤
│           DATA SOURCE LAYER             │
│  (JSON Files - Data Storage)            │
└─────────────────────────────────────────┘
```

## 📦 Detalle de Módulos

### 1. Models (Capa de Datos)

#### `Treatment.js`
Representa un tratamiento odontológico.

**Responsabilidades:**
- Encapsular datos de tratamiento
- Validación de datos
- Formateo de precios
- Conversión a JSON

**Propiedades:**
- `id`: Identificador único
- `nombre`: Nombre del tratamiento
- `categoria`: Categoría (Preventiva, Restauradora, etc.)
- `precio`: Precio unitario
- `descripcion`: Descripción del tratamiento

**Métodos clave:**
```javascript
isValid()              // Valida el tratamiento
getPrecioFormateado()  // Retorna precio formateado
clone()                // Crea una copia
toJSON()               // Serializa a objeto plano
```

#### `Budget.js`
Representa un presupuesto completo.

**Responsabilidades:**
- Gestionar items del presupuesto
- Calcular totales (subtotal, IVA, total)
- Validar presupuesto completo
- Generar resúmenes

**Propiedades:**
- `patientName`: Nombre del paciente
- `date`: Fecha del presupuesto
- `items`: Array de BudgetItem
- `ivaRate`: Porcentaje de IVA
- `currencySymbol`: Símbolo de moneda

**Métodos clave:**
```javascript
addItem(treatment, quantity)  // Agrega tratamiento
removeItem(itemId)            // Elimina tratamiento
getSubtotal()                 // Calcula subtotal
getIVA()                      // Calcula IVA
getTotal()                    // Calcula total
getSummary()                  // Genera resumen
isValid()                     // Valida presupuesto
```

#### `BudgetItem`
Representa un tratamiento dentro de un presupuesto.

**Propiedades:**
- `treatment`: Instancia de Treatment
- `quantity`: Cantidad
- `id`: ID único de la fila

### 2. Services (Capa de Lógica)

#### `DataService.js`
Gestiona la carga y acceso a datos de tratamientos.

**Responsabilidades:**
- Cargar tratamientos desde JSON
- Buscar y filtrar tratamientos
- Gestionar configuración

**Métodos clave:**
```javascript
async loadTreatments()        // Carga datos desde JSON
getTreatments()               // Obtiene todos los tratamientos
getTreatmentById(id)          // Busca por ID
getTreatmentsByCategory(cat) // Filtra por categoría
getCategories()               // Obtiene categorías únicas
searchTreatments(term)        // Búsqueda por texto
```

**Flujo de carga:**
```
1. Fetch del JSON
2. Parsing y validación
3. Creación de instancias Treatment
4. Actualización de configuración global
5. Notificación de éxito
```

#### `BudgetService.js`
Gestiona la lógica de negocio del presupuesto.

**Responsabilidades:**
- CRUD de presupuestos
- Cálculos financieros
- Validaciones de negocio
- Notificación de cambios (Observer)

**Patrón Observer implementado:**
```javascript
// Componentes se suscriben
budgetService.subscribe((budget, summary) => {
    // Actualizar UI
});

// Service notifica cambios
this.notifyObservers();
```

**Métodos clave:**
```javascript
setPatientName(name)             // Establece paciente
setDate(date)                    // Establece fecha
addTreatment(treatment, qty)     // Agrega tratamiento
removeTreatment(itemId)          // Elimina tratamiento
getSummary()                     // Obtiene resumen
validate()                       // Valida presupuesto
reset()                          // Reinicia presupuesto
subscribe(callback)              // Suscribe observador
```

#### `PDFService.js`
Genera PDFs profesionales usando PDF-LIB.

**Responsabilidades:**
- Generar PDF desde Budget
- Renderizar encabezado, tabla, totales y pie
- Aplicar estilos y colores corporativos
- Crear blob URLs para preview
- Descargar PDF

**Métodos públicos:**
```javascript
async generatePDF(budget)       // Genera PDF completo
downloadPDF(pdfBytes, filename) // Descarga PDF
createPreviewURL(pdfBytes)      // Crea URL para preview
```

**Métodos privados de renderizado:**
```javascript
_drawHeader()           // Dibuja encabezado
_drawBudgetInfo()       // Dibuja info del presupuesto
_drawTreatmentsTable()  // Dibuja tabla de tratamientos
_drawFooter()           // Dibuja pie de página
```

**Estructura del PDF generado:**
```
┌─────────────────────────────────┐
│  HEADER (con info de clínica)   │
├─────────────────────────────────┤
│  TÍTULO: PRESUPUESTO            │
│  Paciente: [nombre]             │
│  Fecha: [fecha]                 │
├─────────────────────────────────┤
│  TABLA DE TRATAMIENTOS          │
│  - Tratamiento | Cant | € | €   │
│  - ...                          │
├─────────────────────────────────┤
│  TOTALES                        │
│  Subtotal: X €                  │
│  IVA (21%): X €                 │
│  TOTAL: X €                     │
├─────────────────────────────────┤
│  FOOTER (datos legales)         │
└─────────────────────────────────┘
```

### 3. Components (Capa de Presentación)

#### `FormComponent.js`
Gestiona el formulario de entrada.

**Responsabilidades:**
- Capturar datos del usuario
- Validar entradas
- Cargar tratamientos en el select
- Interactuar con BudgetService

**Elementos DOM gestionados:**
- `patient-name`: Input de nombre
- `budget-date`: Input de fecha
- `treatment-select`: Selector de tratamientos
- `treatment-quantity`: Input de cantidad
- Botones de acción

**Eventos:**
- `input` en nombre → actualiza budget
- `change` en fecha → actualiza budget
- `click` en agregar → añade tratamiento
- `keypress` Enter → añade tratamiento
- `click` en limpiar → resetea formulario

#### `TableComponent.js`
Renderiza y gestiona la tabla de tratamientos.

**Responsabilidades:**
- Mostrar tratamientos agregados
- Actualizar totales
- Permitir eliminar tratamientos
- Suscribirse a cambios del budget

**Estados de renderizado:**
- **Vacío**: Mensaje placeholder
- **Con datos**: Tabla completa con filas

**Columnas de la tabla:**
1. Tratamiento (nombre + descripción)
2. Cantidad
3. Precio Unitario
4. Subtotal
5. Acciones (eliminar)

**Animaciones:**
- Fade in al agregar fila
- Fade out al eliminar
- Pulse en totales al actualizar

#### `PreviewComponent.js`
Muestra la vista previa del PDF en tiempo real.

**Responsabilidades:**
- Generar preview del PDF
- Actualizar con debounce (500ms)
- Gestionar estados (loading, error, empty)
- Limpiar blob URLs

**Estados visuales:**
- **Placeholder**: Sin datos suficientes
- **Loading**: Generando PDF
- **Success**: Mostrando iframe con PDF
- **Error**: Mensaje de error

**Debounce implementado:**
```javascript
_scheduleUpdate() {
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
        this._updatePreview();
    }, 500);
}
```

#### `ActionsComponent.js`
Gestiona las acciones principales (descargar PDF).

**Responsabilidades:**
- Validar antes de descargar
- Generar nombre de archivo
- Mostrar estados de loading
- Feedback visual de éxito

**Flujo de descarga:**
```
1. Validar presupuesto
2. Mostrar loading
3. Generar PDF
4. Crear nombre de archivo
5. Descargar
6. Mostrar éxito
7. Restaurar estado
```

### 4. Utils (Utilidades)

#### `formatter.js`
Funciones de formateo de datos.

**Funciones:**
```javascript
formatDate(date, format)              // Formatea fechas
formatCurrency(amount, symbol)        // Formatea moneda
parseDate(dateString)                 // Parsea fecha
formatPhone(phone)                    // Formatea teléfono
capitalizeWords(str)                  // Capitaliza palabras
truncate(text, maxLength)             // Trunca texto
```

#### `calculations.js`
Funciones de cálculo matemático/financiero.

**Funciones:**
```javascript
calculateIVA(amount, rate)            // Calcula IVA
calculateWithIVA(amount, rate)        // Suma IVA
calculateWithoutIVA(total, rate)      // Resta IVA
calculateSubtotal(items)              // Suma items
calculateDiscount(amount, percent)    // Calcula descuento
applyDiscount(amount, percent)        // Aplica descuento
roundToDecimals(value, decimals)      // Redondea
sum(numbers)                          // Suma array
average(numbers)                      // Promedio
```

### 5. Config (`config.js`)
Configuración centralizada de la aplicación.

**Secciones:**
```javascript
CONFIG = {
    APP_NAME,           // Nombre de la app
    APP_VERSION,        // Versión
    DATA_PATHS,         // Rutas a JSON
    TAX,                // IVA y moneda
    PDF: {
        CLINIC_INFO,    // Datos de la clínica
        PAGE_SIZE,      // Tamaño de página
        MARGINS,        // Márgenes
        FONTS,          // Tamaños de fuente
        COLORS          // Paleta de colores
    },
    UI,                 // Config de UI
    MESSAGES            // Mensajes de la app
}
```

**Helper:**
```javascript
getConfig(path, defaultValue)  // Obtiene config anidada
```

## 🔄 Flujo de Datos

### Inicialización de la Aplicación
```
1. DOM Ready
2. App.init()
3. Crear instancias de componentes
4. FormComponent.loadTreatments()
5. DataService.loadTreatments()
6. Fetch JSON
7. Parsear y crear instancias Treatment
8. Poblar selector de tratamientos
9. Suscripción de componentes a BudgetService
10. App lista
```

### Agregar un Tratamiento
```
Usuario selecciona tratamiento y cantidad
    ↓
FormComponent._handleAddTreatment()
    ↓
BudgetService.addTreatment(treatment, qty)
    ↓
Budget.addItem() → crea BudgetItem
    ↓
BudgetService.notifyObservers()
    ↓
┌─────────────────┬──────────────────┐
│                 │                  │
TableComponent    PreviewComponent   
actualiza tabla   genera nuevo PDF
```

### Generar y Descargar PDF
```
Usuario click "Descargar PDF"
    ↓
ActionsComponent._handleDownloadPDF()
    ↓
BudgetService.validate()
    ↓
PDFService.generatePDF(budget)
    ↓
Crear PDFDocument
Renderizar contenido
Serializar a bytes
    ↓
PDFService.downloadPDF(bytes)
    ↓
Crear blob y descargar
```

## 🎨 Arquitectura CSS

### Metodología
- **Custom Properties** (CSS Variables) para temas
- **BEM-like naming** para componentes
- **Mobile-first** responsive design
- **Utility classes** para casos comunes

### Estructura
```
css/
├── main.css              # Variables, reset, layout, utils
└── components/
    ├── form.css          # Estilos de formulario
    ├── table.css         # Estilos de tabla
    └── preview.css       # Estilos de preview
```

### Variables CSS principales
```css
:root {
    --color-primary
    --color-secondary
    --color-gray-*
    --shadow-*
    --spacing-*
    --radius-*
    --transition-*
}
```

## 🔌 Puntos de Extensión

### 1. Agregar Nuevos Campos al Presupuesto
```javascript
// En Budget.js
constructor() {
    // ... campos existentes
    this.customField = '';  // Nuevo campo
}
```

### 2. Agregar Nuevos Cálculos
```javascript
// En calculations.js
export function newCalculation(params) {
    // Tu lógica
}

// Usar en BudgetService o Budget
import { newCalculation } from './utils/calculations.js';
```

### 3. Agregar Nuevas Plantillas de PDF
```javascript
// En PDFService.js
async generateCustomPDF(budget, template) {
    switch(template) {
        case 'detailed':
            return this._generateDetailedPDF(budget);
        case 'simple':
            return this._generateSimplePDF(budget);
    }
}
```

### 4. Conectar a un Backend Real
```javascript
// En DataService.js
async loadTreatments() {
    // Cambiar:
    const response = await fetch(CONFIG.DATA_PATHS.TREATMENTS);
    
    // Por:
    const response = await fetch('https://api.example.com/treatments');
}
```

### 5. Agregar Persistencia Local
```javascript
// En BudgetService.js
saveBudget() {
    const data = this.currentBudget.toJSON();
    localStorage.setItem('budget', JSON.stringify(data));
}

loadBudget() {
    const data = localStorage.getItem('budget');
    // Reconstruir budget
}
```

## 🧪 Testing (Futuro)

### Estructura sugerida
```
tests/
├── unit/
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/
│   └── components/
└── e2e/
    └── flows/
```

### Testing de Modelos
```javascript
// Budget.test.js
test('calcula el total correctamente', () => {
    const budget = new Budget();
    budget.addItem(treatment, 2);
    expect(budget.getTotal()).toBe(expected);
});
```

### Testing de Servicios
```javascript
// BudgetService.test.js
test('notifica a los observadores', () => {
    const callback = jest.fn();
    budgetService.subscribe(callback);
    budgetService.addTreatment(treatment, 1);
    expect(callback).toHaveBeenCalled();
});
```

## 📊 Diagrama de Clases Simplificado

```
┌─────────────┐
│  Treatment  │
└─────────────┘
      △
      │ uses
      │
┌─────────────┐     ┌─────────────┐
│ BudgetItem  │────▶│   Budget    │
└─────────────┘     └─────────────┘
                          △
                          │ manages
                          │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ DataService  │    │BudgetService │    │  PDFService  │
└──────────────┘    └──────────────┘    └──────────────┘
      △                    △                    △
      │                    │                    │
      └────────────────────┴────────────────────┘
                          │ uses
                          │
      ┌───────────────────┴───────────────────┐
      │                                       │
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│FormComponent │  │TableComponent│  │PreviewComp.. │
└──────────────┘  └──────────────┘  └──────────────┘
```

## 🚀 Mejoras Futuras de Arquitectura

### 1. State Management
Implementar un estado global centralizado:
```javascript
class Store {
    constructor() {
        this.state = {};
        this.subscribers = [];
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }
}
```

### 2. Routing
Para múltiples páginas:
```javascript
class Router {
    constructor(routes) {
        this.routes = routes;
    }
    
    navigate(path) {
        const route = this.routes[path];
        route.component.render();
    }
}
```

### 3. Componentes Web (Web Components)
Migrar a Custom Elements:
```javascript
class BudgetTable extends HTMLElement {
    connectedCallback() {
        this.render();
    }
}
customElements.define('budget-table', BudgetTable);
```

### 4. Service Worker
Para funcionamiento offline:
```javascript
// sw.js
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

## 📚 Referencias y Recursos

- [PDF-LIB Documentation](https://pdf-lib.js.org/)
- [JavaScript Modules (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Observer Pattern](https://refactoring.guru/design-patterns/observer)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Documento actualizado:** Noviembre 2025  
**Versión de la arquitectura:** 1.0.0






