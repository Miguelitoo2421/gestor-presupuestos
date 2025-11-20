/**
 * FormComponent.js
 * Componente para manejar el formulario de entrada de datos
 */

import { getDataService } from '../services/DataService.js';
import { getBudgetService } from '../services/BudgetService.js';

export class FormComponent {
    constructor() {
        this.dataService = getDataService();
        this.budgetService = getBudgetService();
        
        this.elements = {
            budgetCode: document.getElementById('budget-code'),
            patientName: document.getElementById('patient-name'),
            patientDNI: document.getElementById('patient-dni'),
            patientAddress: document.getElementById('patient-address'),
            patientRegion: document.getElementById('patient-region'),
            patientPostalCode: document.getElementById('patient-postal-code'),
            patientEmail: document.getElementById('patient-email'),
            patientPhone: document.getElementById('patient-phone'),
            budgetDate: document.getElementById('budget-date'),
            treatmentSelect: document.getElementById('treatment-select'),
            treatmentQuantity: document.getElementById('treatment-quantity'),
            treatmentDiscount: document.getElementById('treatment-discount'),
            addTreatmentBtn: document.getElementById('add-treatment-btn'),
            clearFormBtn: document.getElementById('clear-form-btn')
        };

        this._initializeDate();
        this._bindEvents();
    }

    /**
     * Inicializa la fecha actual en el campo de fecha y muestra el código
     * @private
     */
    _initializeDate() {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        this.elements.budgetDate.value = dateString;
        this.budgetService.setDate(today);
        
        // Mostrar código de presupuesto
        const budget = this.budgetService.getCurrentBudget();
        this.elements.budgetCode.textContent = budget.budgetCode;
    }

    /**
     * Actualiza todos los campos del formulario con los datos del presupuesto actual
     * @public
     */
    updateFormFromBudget() {
        const budget = this.budgetService.getCurrentBudget();
        
        // Actualizar código de presupuesto
        this.elements.budgetCode.textContent = budget.budgetCode;
        
        // Actualizar campos del paciente
        this.elements.patientName.value = budget.patientName || '';
        this.elements.patientDNI.value = budget.patientDNI || '';
        this.elements.patientAddress.value = budget.patientAddress || '';
        this.elements.patientRegion.value = budget.patientRegion || '';
        this.elements.patientPostalCode.value = budget.patientPostalCode || '';
        this.elements.patientEmail.value = budget.patientEmail || '';
        this.elements.patientPhone.value = budget.patientPhone || '';
        
        // Actualizar fecha
        const dateString = budget.date.toISOString().split('T')[0];
        this.elements.budgetDate.value = dateString;
        
        // Resetear campos de tratamiento
        this.elements.treatmentSelect.value = '';
        this.elements.treatmentQuantity.value = '1';
        this.elements.treatmentDiscount.value = '0';
    }

    /**
     * Vincula eventos del formulario
     * @private
     */
    _bindEvents() {
        // Eventos de cambio en los campos del paciente
        this.elements.patientName.addEventListener('input', (e) => {
            this.budgetService.setPatientName(e.target.value);
        });

        this.elements.patientDNI.addEventListener('input', (e) => {
            this.budgetService.setPatientDNI(e.target.value);
        });

        this.elements.patientAddress.addEventListener('input', (e) => {
            this.budgetService.setPatientAddress(e.target.value);
        });

        this.elements.patientRegion.addEventListener('input', (e) => {
            this.budgetService.setPatientRegion(e.target.value);
        });

        this.elements.patientPostalCode.addEventListener('input', (e) => {
            this.budgetService.setPatientPostalCode(e.target.value);
        });

        this.elements.patientEmail.addEventListener('input', (e) => {
            this.budgetService.setPatientEmail(e.target.value);
        });

        this.elements.patientPhone.addEventListener('input', (e) => {
            this.budgetService.setPatientPhone(e.target.value);
        });

        this.elements.budgetDate.addEventListener('change', (e) => {
            const date = new Date(e.target.value);
            this.budgetService.setDate(date);
        });

        // Botón agregar tratamiento
        this.elements.addTreatmentBtn.addEventListener('click', () => {
            this._handleAddTreatment();
        });

        // Enter en cantidad también agrega el tratamiento
        this.elements.treatmentQuantity.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._handleAddTreatment();
            }
        });

        // Botón limpiar formulario
        this.elements.clearFormBtn.addEventListener('click', () => {
            this._handleClearForm();
        });
    }

    /**
     * Carga los tratamientos en el select
     */
    async loadTreatments() {
        try {
            await this.dataService.loadTreatments();
            this._populateTreatmentSelect();
        } catch (error) {
            console.error('Error al cargar tratamientos:', error);
            alert('Error al cargar los tratamientos. Por favor, recarga la página.');
        }
    }

    /**
     * Rellena el select de tratamientos
     * @private
     */
    _populateTreatmentSelect() {
        const treatments = this.dataService.getTreatments();
        const select = this.elements.treatmentSelect;
        
        // Limpiar opciones existentes (excepto la primera)
        select.innerHTML = '<option value="">Seleccione un tratamiento...</option>';
        
        // Agrupar por categoría
        const categories = this.dataService.getCategories();
        
        categories.forEach(category => {
            const categoryTreatments = this.dataService.getTreatmentsByCategory(category);
            
            if (categoryTreatments.length > 0) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = category;
                
                categoryTreatments.forEach(treatment => {
                    const option = document.createElement('option');
                    option.value = treatment.id;
                    option.textContent = `${treatment.nombre} - ${treatment.getPrecioFormateado()}`;
                    option.dataset.price = treatment.precio;
                    optgroup.appendChild(option);
                });
                
                select.appendChild(optgroup);
            }
        });
    }

    /**
     * Maneja la adición de un tratamiento
     * @private
     */
    _handleAddTreatment() {
        const treatmentId = this.elements.treatmentSelect.value;
        const quantity = parseInt(this.elements.treatmentQuantity.value) || 1;
        const discount = parseFloat(this.elements.treatmentDiscount.value) || 0;

        if (!treatmentId) {
            alert('Por favor, seleccione un tratamiento');
            return;
        }

        const treatment = this.dataService.getTreatmentById(treatmentId);
        
        if (!treatment) {
            alert('Tratamiento no encontrado');
            return;
        }

        // Agregar al presupuesto con descuento
        this.budgetService.addTreatment(treatment, quantity, discount);

        // Resetear selección
        this.elements.treatmentSelect.value = '';
        this.elements.treatmentQuantity.value = '1';
        this.elements.treatmentDiscount.value = '0';
        this.elements.treatmentSelect.focus();
    }

    /**
     * Maneja la limpieza del formulario
     * @private
     */
    _handleClearForm() {
        if (confirm('¿Está seguro de que desea limpiar el formulario?')) {
            this.budgetService.reset();
            
            // Limpiar campos del paciente
            this.elements.patientName.value = '';
            this.elements.patientDNI.value = '';
            this.elements.patientAddress.value = '';
            this.elements.patientRegion.value = '';
            this.elements.patientPostalCode.value = '';
            this.elements.patientEmail.value = '';
            this.elements.patientPhone.value = '';
            
            // Resetear tratamiento
            this.elements.treatmentSelect.value = '';
            this.elements.treatmentQuantity.value = '1';
            this.elements.treatmentDiscount.value = '0';
            
            // Reinicializar fecha y código
            this._initializeDate();
        }
    }

    /**
     * Obtiene los valores actuales del formulario
     */
    getFormValues() {
        return {
            patientName: this.elements.patientName.value,
            date: this.elements.budgetDate.value,
            selectedTreatment: this.elements.treatmentSelect.value,
            quantity: this.elements.treatmentQuantity.value
        };
    }

    /**
     * Habilita o deshabilita el formulario
     */
    setEnabled(enabled) {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.disabled = !enabled;
            }
        });
    }
}

export default FormComponent;


