# 🦷 Gestor de Presupuestos Odontológicos

Sistema web profesional para generar presupuestos odontológicos con generación automática de PDFs.

**Desarrollado para:** Dra. Karelys Matheus Marielys Spinola

---

## ✨ Características

- ✅ Generación profesional de PDFs
- ✅ Gestión de tratamientos con precios
- ✅ Cálculo automático de descuentos e IRPF
- ✅ Historial de presupuestos guardados
- ✅ Interfaz intuitiva y moderna
- ✅ 100% local - tus datos nunca salen de tu navegador
- ✅ No requiere instalación de software adicional

---

## 🚀 Opciones de Uso

### Opción 1: Uso Local (Más Rápido)

#### Para Windows:

1. **Doble clic en `INICIAR_APLICACION.bat`**
2. La aplicación se abrirá automáticamente en tu navegador
3. ¡Listo! Ya puedes usarla

**Nota:** Necesitas tener Python instalado. Si no lo tienes, descárgalo de [python.org](https://www.python.org/downloads/)

---

### Opción 2: Acceso Online con GitHub Pages (RECOMENDADO)

Esta opción permite que cualquier persona use la aplicación desde cualquier lugar con solo un enlace.

#### Pasos para Subir a GitHub Pages:

**1. Crea una cuenta en GitHub** (si no tienes)
   - Ve a [github.com](https://github.com)
   - Haz clic en "Sign Up"

**2. Crea un nuevo repositorio**
   - Haz clic en el botón "+" arriba a la derecha
   - Selecciona "New repository"
   - Nombre: `gestor-presupuestos` (o el que prefieras)
   - Marca como **Public**
   - Haz clic en "Create repository"

**3. Sube los archivos**
   
   **Opción A - Interfaz Web (Más Fácil):**
   - En la página del repositorio, haz clic en "uploading an existing file"
   - Arrastra TODOS los archivos y carpetas del proyecto
   - Haz clic en "Commit changes"

   **Opción B - Git (Si sabes usar Git):**
   ```bash
   git init
   git add .
   git commit -m "Primera versión"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/gestor-presupuestos.git
   git push -u origin main
   ```

**4. Activar GitHub Pages**
   - Ve a "Settings" (Configuración) del repositorio
   - En el menú lateral, haz clic en "Pages"
   - En "Source", selecciona "main" branch
   - Haz clic en "Save"
   - Espera 1-2 minutos

**5. ¡Listo! Tu URL será:**
   ```
   https://TU_USUARIO.github.io/gestor-presupuestos/
   ```

**Ejemplo:** Si tu usuario es "karmatheus", la URL será:
   ```
   https://karmatheus.github.io/gestor-presupuestos/
   ```

---

## 🎯 Ventajas de Usar GitHub Pages

✅ **Gratis y permanente**  
✅ **Accesible desde cualquier dispositivo con internet**  
✅ **No necesitas levantar ningún servidor**  
✅ **Tu esposa puede usarlo con solo el enlace**  
✅ **HTTPS seguro incluido**  
✅ **Fácil de actualizar** (solo subes los archivos nuevos)

---

## 📱 Uso de la Aplicación

1. **Información del Paciente**: Rellena todos los datos
2. **Agregar Tratamientos**: Selecciona tratamientos y cantidades
3. **Aplicar Descuentos**: (Opcional) Agrega descuentos por tratamiento
4. **Vista Previa**: El PDF se genera automáticamente en el panel derecho
5. **Descargar**: Haz clic en "Descargar PDF"
6. **Historial**: Todos los presupuestos se guardan automáticamente

---

## 🔧 Personalización

### Actualizar Precios de Tratamientos

Edita el archivo `data/tratamientos.json`:

```json
{
  "id": "limpieza-dental",
  "nombre": "Limpieza Dental Profesional",
  "categoria": "Prevención",
  "precio": 60.00
}
```

### Actualizar Datos de la Clínica

Edita el archivo `js/config.js` en la sección `CLINIC_INFO`.

---

## 📋 Requisitos Técnicos

- **Para Uso Local**: Python 3.x (incluido en Windows 10/11)
- **Para GitHub Pages**: Solo un navegador web moderno
  - Chrome, Firefox, Safari, Edge (versiones recientes)

---

## 🛠️ Tecnologías

- **HTML5** - Estructura
- **CSS3** - Estilos modernos
- **JavaScript Vanilla** - Lógica (sin frameworks)
- **PDF-LIB** - Generación de PDFs
- **LocalStorage** - Almacenamiento local

---

## 💾 Almacenamiento de Datos

Todos los presupuestos se guardan en el navegador local (LocalStorage). 

**Importante:** 
- Los datos NO se pierden al cerrar el navegador
- Los datos son privados y locales
- Para compartir entre dispositivos, usa la versión de GitHub Pages

---

## 🤝 Soporte

Para dudas o mejoras, contacta al desarrollador.

---

## 📄 Licencia

Este proyecto es de uso privado para la Dra. Karelys Matheus.

---

**Desarrollado con ❤️ para facilitar la gestión de presupuestos odontológicos**

PROBANDO
