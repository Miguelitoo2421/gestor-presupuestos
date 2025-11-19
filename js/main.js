/**
 * main.js
 * Punto de entrada principal de la aplicación
 * Inicializa todos los componentes y servicios
 */

import { CONFIG } from './config.js';
import { FormComponent } from './components/FormComponent.js';
import { TableComponent } from './components/TableComponent.js';
import { PreviewComponent } from './components/PreviewComponent.js';
import { ActionsComponent } from './components/ActionsComponent.js';
import { HistoryComponent } from './components/HistoryComponent.js';

/**
 * Clase principal de la aplicación
 */
class App {
    constructor() {
        this.components = {};
        this.isInitialized = false;
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        try {
            console.log(`🚀 Iniciando ${CONFIG.APP_NAME} v${CONFIG.APP_VERSION}`);

            // Verificar que PDF-LIB esté cargado
            if (!window.PDFLib) {
                throw new Error('PDF-LIB no está cargado. Verifica la conexión a internet o el CDN.');
            }

            // Inicializar componentes
            this.components.form = new FormComponent();
            this.components.table = new TableComponent();
            this.components.preview = new PreviewComponent();
            this.components.actions = new ActionsComponent();
            this.components.history = new HistoryComponent();

            // Cargar datos
            await this.components.form.loadTreatments();

            this.isInitialized = true;
            console.log('✓ Aplicación inicializada correctamente');

            // Mostrar información de desarrollo en consola
            this._showDevInfo();

        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
            this._showErrorScreen(error.message);
        }
    }

    /**
     * Muestra información de desarrollo en consola
     * @private
     */
    _showDevInfo() {
        console.log('%c📋 Gestor de Presupuestos Odontológicos', 'font-size: 16px; font-weight: bold; color: #2c5aa0;');
        console.log('%cVersión:', 'font-weight: bold;', CONFIG.APP_VERSION);
        console.log('%cArquitectura:', 'font-weight: bold;', 'Modular con componentes');
        console.log('%cComponentes cargados:', 'font-weight: bold;', Object.keys(this.components).join(', '));
        console.log('\n%c💡 Tip: Puedes acceder a la aplicación mediante window.app', 'color: #666; font-style: italic;');
    }

    /**
     * Muestra una pantalla de error
     * @private
     */
    _showErrorScreen(message) {
        const appContainer = document.querySelector('.app-container');
        
        if (appContainer) {
            appContainer.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    padding: 20px;
                    text-align: center;
                    font-family: system-ui, -apple-system, sans-serif;
                ">
                    <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                    <h1 style="color: #d32f2f; margin-bottom: 10px;">Error al inicializar</h1>
                    <p style="color: #666; max-width: 500px; margin-bottom: 20px;">${message}</p>
                    <button 
                        onclick="location.reload()" 
                        style="
                            padding: 12px 24px;
                            background: #2c5aa0;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                        "
                    >
                        Recargar Página
                    </button>
                </div>
            `;
        }
    }

    /**
     * Obtiene un componente específico
     */
    getComponent(name) {
        return this.components[name];
    }

    /**
     * Limpia y destruye la aplicación
     */
    destroy() {
        if (this.components.preview) {
            this.components.preview.destroy();
        }
        
        this.components = {};
        this.isInitialized = false;
        
        console.log('✓ Aplicación destruida');
    }
}

// Crear instancia global de la aplicación
const app = new App();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Exportar para acceso global (útil para debugging)
window.app = app;

export default app;


