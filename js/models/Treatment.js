/**
 * Treatment.js
 * Modelo de datos para Tratamiento
 */

export class Treatment {
    constructor(data) {
        this.id = data.id || '';
        this.nombre = data.nombre || '';
        this.categoria = data.categoria || '';
        this.precio = parseFloat(data.precio) || 0;
        this.descripcion = data.descripcion || '';
    }

    /**
     * Valida si el tratamiento tiene los datos mínimos requeridos
     */
    isValid() {
        return this.id && this.nombre && this.precio >= 0;
    }

    /**
     * Obtiene el precio formateado con moneda
     */
    getPrecioFormateado(simboloMoneda = '€') {
        return `${this.precio.toFixed(2)} ${simboloMoneda}`;
    }

    /**
     * Clona el tratamiento
     */
    clone() {
        return new Treatment({
            id: this.id,
            nombre: this.nombre,
            categoria: this.categoria,
            precio: this.precio,
            descripcion: this.descripcion
        });
    }

    /**
     * Convierte el tratamiento a objeto plano
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            categoria: this.categoria,
            precio: this.precio,
            descripcion: this.descripcion
        };
    }
}

export default Treatment;






