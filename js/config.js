/**
 * config.js
 * Configuración global de la aplicación
 * Aquí se centralizan todos los parámetros configurables
 */

export const CONFIG = {
    // Configuración de la aplicación
    APP_NAME: 'Gestor de Presupuestos Odontológicos',
    APP_VERSION: '1.0.0',
    
    // Rutas de datos
    DATA_PATHS: {
        TREATMENTS: './data/tratamientos.json'
    },
    
    // Configuración de IVA y moneda
    TAX: {
        IVA_RATE: 21, // Porcentaje de IVA (se puede sobrescribir desde JSON)
        CURRENCY: 'EUR',
        CURRENCY_SYMBOL: '€'
    },
    
    // Configuración del PDF
    PDF: {
        // Información de la clínica (PERSONALIZABLE)
        CLINIC_INFO: {
            // Datos personales de la doctora (para encabezado)
            doctorName: 'Karelys M. Matheus Spinola',
            doctorFullName: 'Dra. Karelys Matheus Marielys Spinola',
            headerSubtitle1: 'ODONTÓLOGO - ORTODONCISTA',
            headerSubtitle2: 'Nº COLEGIADO 28017582',
            
            // Datos de la clínica (para cuerpo del PDF)
            clinicName: 'BUKODENT',
            clinicBrand: 'Tu Clínica Dental en Madrid',
            clinicAddress: 'Calle López de Hoyos, 474. CP 28043',
            clinicEmail: 'dental@dra-matheus-spinola.com',
            clinicPhone: '631914884',
            
            // Información de exención de IVA
            ivaExemptionNote: 'FACTURA SUJETA A LA EXENCIÓN DEL IVA POR EL ARTÍCULO 20.5 DE LA LEY 37/1992',
            
            // Datos bancarios
            bankName: 'CaixaBank',
            bankIBAN: 'ES21 2100 3230 0213 0044 5835',
            
            // Notas al pie
            paymentNote: 'Prontopago 5% de descuento',
            validityNote: 'Presupuesto válido por 30 días a partir de la fecha de emisión'
        },
        
        // Configuración de tamaño y márgenes
        PAGE_SIZE: {
            width: 595.28, // A4 en puntos (210mm)
            height: 841.89  // A4 en puntos (297mm)
        },
        MARGINS: {
            top: 60,
            right: 50,
            bottom: 60,
            left: 50
        },
        
        // Configuración de fuentes y estilos
        FONTS: {
            TITLE_SIZE: 24,
            HEADING_SIZE: 16,
            SUBHEADING_SIZE: 12,
            BODY_SIZE: 10,
            SMALL_SIZE: 8
        },
        
        // Colores (RGB normalizado 0-1)
        COLORS: {
            PRIMARY: { r: 0.2, g: 0.4, b: 0.6 },      // Azul corporativo
            SECONDARY: { r: 0.4, g: 0.4, b: 0.4 },    // Gris
            TEXT: { r: 0.2, g: 0.2, b: 0.2 },         // Gris oscuro
            BACKGROUND: { r: 0.95, g: 0.95, b: 0.95 }, // Gris claro
            SUCCESS: { r: 0.2, g: 0.6, b: 0.3 },      // Verde
            WHITE: { r: 1, g: 1, b: 1 }
        }
    },
    
    // Configuración de la UI
    UI: {
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 500, // Delay para actualizar vista previa
        DATE_FORMAT: 'DD/MM/YYYY'
    },
    
    // Mensajes de la aplicación
    MESSAGES: {
        NO_TREATMENTS: 'No hay tratamientos agregados',
        ERROR_LOAD_DATA: 'Error al cargar los datos de tratamientos',
        ERROR_GENERATE_PDF: 'Error al generar el PDF',
        SUCCESS_DOWNLOAD: 'PDF descargado correctamente',
        CONFIRM_CLEAR: '¿Está seguro de que desea limpiar el formulario?',
        VALIDATION: {
            PATIENT_NAME: 'Por favor, ingrese el nombre del paciente',
            NO_TREATMENTS: 'Por favor, agregue al menos un tratamiento'
        }
    }
};

/**
 * Función helper para obtener configuración anidada
 * @param {string} path - Ruta separada por puntos (ej: 'PDF.COLORS.PRIMARY')
 * @param {*} defaultValue - Valor por defecto si no se encuentra
 */
export function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

export default CONFIG;


