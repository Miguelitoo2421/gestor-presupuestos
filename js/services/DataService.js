/**
 * DataService.js
 * Servicio para cargar y gestionar datos desde archivos JSON
 */

import { Treatment } from '../models/Treatment.js';
import { CONFIG } from '../config.js';

export class DataService {
    constructor() {
        this.treatments = [];
        this.config = null;
        this.isLoaded = false;
    }

    /**
     * Carga los tratamientos desde el archivo JSON
     * @returns {Promise<void>}
     */
    async loadTreatments() {
        try {
            const response = await fetch(CONFIG.DATA_PATHS.TREATMENTS);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cargar tratamientos
            if (data.tratamientos && Array.isArray(data.tratamientos)) {
                this.treatments = data.tratamientos.map(t => new Treatment(t));
            }
            
            // Cargar configuración
            if (data.configuracion) {
                this.config = data.configuracion;
                
                // Actualizar configuración global si existe
                if (this.config.iva) {
                    CONFIG.TAX.IVA_RATE = this.config.iva;
                }
                if (this.config.simbolo_moneda) {
                    CONFIG.TAX.CURRENCY_SYMBOL = this.config.simbolo_moneda;
                }
            }
            
            this.isLoaded = true;
            console.log(`✓ Cargados ${this.treatments.length} tratamientos`);
            
        } catch (error) {
            console.error('Error al cargar tratamientos:', error);
            throw new Error(CONFIG.MESSAGES.ERROR_LOAD_DATA);
        }
    }

    /**
     * Obtiene todos los tratamientos
     * @returns {Array<Treatment>}
     */
    getTreatments() {
        return [...this.treatments];
    }

    /**
     * Obtiene un tratamiento por su ID
     * @param {string} id - ID del tratamiento
     * @returns {Treatment|null}
     */
    getTreatmentById(id) {
        return this.treatments.find(t => t.id === id) || null;
    }

    /**
     * Obtiene tratamientos por categoría
     * @param {string} categoria - Categoría a filtrar
     * @returns {Array<Treatment>}
     */
    getTreatmentsByCategory(categoria) {
        return this.treatments.filter(t => t.categoria === categoria);
    }

    /**
     * Obtiene todas las categorías únicas
     * @returns {Array<string>}
     */
    getCategories() {
        const categories = [...new Set(this.treatments.map(t => t.categoria))];
        return categories.sort();
    }

    /**
     * Busca tratamientos por término
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Array<Treatment>}
     */
    searchTreatments(searchTerm) {
        if (!searchTerm) return this.treatments;
        
        const term = searchTerm.toLowerCase();
        return this.treatments.filter(t => 
            t.nombre.toLowerCase().includes(term) ||
            t.descripcion.toLowerCase().includes(term) ||
            t.categoria.toLowerCase().includes(term)
        );
    }

    /**
     * Obtiene la configuración cargada
     * @returns {Object|null}
     */
    getConfig() {
        return this.config;
    }

    /**
     * Verifica si los datos están cargados
     * @returns {boolean}
     */
    isDataLoaded() {
        return this.isLoaded;
    }
}

// Singleton para uso global
let dataServiceInstance = null;

export function getDataService() {
    if (!dataServiceInstance) {
        dataServiceInstance = new DataService();
    }
    return dataServiceInstance;
}

export default DataService;






