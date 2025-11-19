# 🚀 Guía de Inicio Rápido

## ⏱️ En 5 minutos tendrás todo funcionando

### Paso 1: Abre el proyecto (1 min)

#### Opción A - Con Visual Studio Code:
1. Abre VS Code
2. File → Open Folder → Selecciona `Gestor_presupuestos`
3. Instala la extensión "Live Server"
4. Click derecho en `index.html` → "Open with Live Server"
5. ✅ ¡Listo! Se abrirá en tu navegador

#### Opción B - Con Python (si tienes Python instalado):
1. Abre terminal/cmd en la carpeta del proyecto
2. Ejecuta: `python -m http.server 8000`
3. Abre navegador: `http://localhost:8000`
4. ✅ ¡Listo!

#### Opción C - Con Node.js:
1. Abre terminal en la carpeta
2. Ejecuta: `npx http-server`
3. Abre la URL que aparece
4. ✅ ¡Listo!

---

### Paso 2: Personaliza tu clínica (2 min)

Abre: `js/config.js`

Busca esta sección y edítala:

```javascript
CLINIC_INFO: {
    name: 'Clínica Dental Dra. [Tu Nombre]',
    address: 'Calle Principal, 123',
    city: '28001 Madrid',
    phone: '+34 912 345 678',
    email: 'info@tuClinica.com',
    web: 'www.tuClinica.com',
    cif: 'B12345678'
}
```

**Guarda el archivo** y recarga el navegador.

---

### Paso 3: Prueba la aplicación (2 min)

1. **Escribe el nombre de un paciente**
   - Ej: "María García López"

2. **Selecciona tratamientos**
   - Elige "Limpieza Dental Básica"
   - Cantidad: 1
   - Click "Agregar Tratamiento"

3. **Agrega más tratamientos si quieres**
   - Ej: "Empaste de Composite" x2

4. **Observa la magia** ✨
   - La tabla se llena automáticamente
   - Los totales se calculan solos
   - La vista previa del PDF aparece a la derecha

5. **Descarga el PDF**
   - Click en "Descargar PDF"
   - Se descarga: `presupuesto-maria-garcia-lopez-2025-11-14.pdf`

---

## 🎯 Próximos Pasos

### IMPORTANTE: Personaliza tus tratamientos

Abre: `data/tratamientos.json`

**Formato de cada tratamiento:**

```json
{
  "id": "limpieza-basica",
  "nombre": "Limpieza Dental Básica",
  "categoria": "Preventiva",
  "precio": 45.00,
  "descripcion": "Limpieza profesional con eliminación de sarro"
}
```

#### Para agregar un nuevo tratamiento:

1. Copia un tratamiento existente
2. Cambia el `id` (único, sin espacios)
3. Cambia `nombre`, `precio`, etc.
4. Asegúrate de que la sintaxis JSON sea correcta
5. Guarda y recarga

**Ejemplo de nuevo tratamiento:**

```json
{
  "id": "revision-completa",
  "nombre": "Revisión Completa",
  "categoria": "Preventiva",
  "precio": 30.00,
  "descripcion": "Revisión dental completa con radiografías"
}
```

⚠️ **¡No olvides las comas entre tratamientos!**

---

## 🎨 Personalización Rápida de Colores

Si quieres cambiar el color principal (por defecto: azul):

### Cambiar color de la interfaz web:

Abre: `css/main.css`

```css
:root {
    --color-primary: #2c5aa0;  /* Cambia este código HEX */
}
```

### Cambiar color del PDF:

Abre: `js/config.js`

```javascript
COLORS: {
    PRIMARY: { r: 0.2, g: 0.4, b: 0.6 }  // Cambia estos valores
}
```

**Convertir HEX a RGB normalizado:**
- Usa esta web: https://www.w3schools.com/colors/colors_converter.asp
- Convierte tu HEX a RGB (ej: 44, 90, 160)
- Divide cada valor entre 255
- Ej: { r: 44/255, g: 90/255, b: 160/255 }

---

## 📱 Atajos de Teclado

- **Tab**: Navegar entre campos
- **Enter** en cantidad: Agrega tratamiento automáticamente
- **F12**: Abre consola del navegador (para debugging)

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar esto sin internet?

- ⚠️ NO, necesitas internet porque PDF-LIB se carga desde CDN
- Alternativa: Descarga PDF-LIB y úsalo local (ver README.md)

### ¿Funciona en móviles?

- Sí, pero está optimizado para escritorio (portátil/PC)
- Mejor experiencia en pantallas ≥ 13"

### ¿Dónde se guardan los datos?

- Los presupuestos NO se guardan automáticamente
- Solo se descarga el PDF
- Para guardar: implementa localStorage (ver NOTAS_DESARROLLO.md)

### ¿Puedo cambiar el IVA?

- Sí, edita `data/tratamientos.json`:
  ```json
  "configuracion": {
    "iva": 10
  }
  ```

### ¿Puedo agregar un logo?

- Sí, pero requiere modificar código
- Ver sección "Modificar Plantilla PDF" en NOTAS_DESARROLLO.md

---

## 🆘 Algo no funciona?

### El PDF no se genera:
1. ¿Tienes internet? (necesario para PDF-LIB)
2. ¿Completaste nombre del paciente?
3. ¿Agregaste al menos un tratamiento?
4. Abre F12 y mira la consola por errores

### Los tratamientos no aparecen:
1. ¿Estás usando un servidor web? (NO abrir con file://)
2. ¿El archivo JSON es válido? Usa: https://jsonlint.com/
3. Revisa la consola (F12)

### La vista previa no se ve:
1. Espera 1 segundo después de cambiar datos
2. Prueba con otro navegador (Chrome recomendado)
3. Verifica que tengas datos completos

---

## 📚 Recursos Adicionales

- **README.md**: Documentación completa
- **ARQUITECTURA.md**: Cómo funciona el código
- **NOTAS_DESARROLLO.md**: Guía para modificaciones avanzadas

---

## ✅ Checklist de Primera Configuración

- [ ] Aplicación abierta en navegador
- [ ] Información de clínica personalizada
- [ ] Tratamientos personalizados (o al menos revisados)
- [ ] Primer PDF generado exitosamente
- [ ] IVA configurado correctamente
- [ ] Colores ajustados (opcional)

---

¡Ya estás listo para generar presupuestos profesionales! 🎉

**Tiempo estimado total:** 5-10 minutos






