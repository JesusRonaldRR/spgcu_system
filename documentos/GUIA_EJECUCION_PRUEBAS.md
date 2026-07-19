# GUÍA DE EJECUCIÓN DE PRUEBAS Y CAPTURA DE EVIDENCIAS (QA)

Esta guía te guiará paso a paso sobre cómo ejecutar las pruebas funcionales en tu entorno local para que puedas realizar las capturas de pantalla necesarias y agregarlas a la sección **5. Evidencias de Prueba** de tu documento final **PP 2**.

---

## 🚀 Paso Inicial: Preparación del Entorno
Antes de empezar, asegúrate de que el sistema esté corriendo en un estado limpio:
```bash
# 1. Regenerar base de datos limpia con datos de prueba
php artisan migrate:fresh --seed

# 2. Iniciar el servidor local
php artisan serve
```
*Abre tu navegador en `http://127.0.0.1:8000` e inicia sesión como Administrador:*
- **Usuario (DNI):** `admin`
- **Contraseña:** `password`

---

## 🎯 Prueba 1: Registro de Postulación (CP-01)
*Objetivo: Registrar un FUT digital con firma y adjuntos cifrados.*

1. Inicia sesión como **Estudiante** (puedes crear un estudiante desde el Panel de Usuarios o usar un usuario becario existente).
2. Ve al módulo **Postulaciones** en la barra lateral y haz clic en **"Iniciar postulación"**.
3. Completa los datos socioeconómicos requeridos:
   - Ingresa los indicadores (Vivienda, Salud, Alimentación, Dependencia).
   - Adjunta archivos PDF de prueba en los 5 campos obligatorios.
   - Realiza un trazo sobre el cuadro de **Firma Digital** utilizando el mouse.
4. Presiona **"Enviar Postulación"**.
5. **Captura de Evidencia 1:** Toma una captura de pantalla de la tabla donde se muestra tu postulación en estado **"PENDIENTE"** con su número de expediente correspondiente.

---

## 🔒 Prueba 2: Verificación de Cifrado AES-256 (CP-11)
*Objetivo: Demostrar que los documentos del estudiante están encriptados y protegidos.*

1. Tras subir la postulación en el paso anterior, dirígete a los archivos de tu servidor local.
2. Abre la carpeta del proyecto y navega hasta: `storage/app/postulaciones/` (puedes revisar subcarpetas como `fichas`, `recibos` o `firmas`).
3. Busca el archivo recién generado (tendrá un nombre aleatorio largo) e intenta abrirlo directamente con un lector de PDFs clásico de tu computadora.
4. Verás que el archivo da error al abrir o está completamente corrupto.
5. **Captura de Evidencia 2:** Toma una captura de pantalla del visor de PDFs mostrando el mensaje de error o del contenido cifrado ilegible para demostrar la robustez del sistema de archivos.

---

## 🍎 Prueba 3: Pronóstico de Raciones 60/30/10 (CP-08)
*Objetivo: Validar el algoritmo predictivo de cocina.*

1. Inicia sesión como **Administrador** (`admin` / `password`).
2. Ve a la sección **Pronóstico** en el menú lateral.
3. El sistema cargará el listado de reservas para el desayuno, almuerzo y cena del día siguiente.
4. El algoritmo calculará automáticamente las raciones bajo la lógica:
   - **100% de Confirmados** (estudiantes que explícitamente confirmaron asistencia en el módulo de horario).
   - **30% de los No Confirmados** (beneficiarios activos que no interactuaron con el portal).
   - **10% de Buffer de Seguridad** sobre el subtotal anterior.
5. **Captura de Evidencia 3:** Captura la pantalla del panel de **Pronóstico de Raciones** donde se muestra el desglose del cálculo y el total sugerido para cocina.

---

## 🤝 Prueba 4: Casos Sociales y Firma Digital (CP-09)
*Objetivo: Otorgar acceso de emergencia mediante flujo de firmas.*

1. Inicia sesión como **Administrador** (o un rol con permisos del área psicológica).
2. Ve al módulo **Casos Sociales** en el menú.
3. Registra una nueva solicitud de caso social para un estudiante que necesite apoyo urgente.
4. El Administrador o Jefe de Bienestar debe revisar la solicitud y **firmar digitalmente** en el canvas interactivo antes de presionar "Aprobar".
5. Una vez aprobado, el sistema genera un QR temporal.
6. **Captura de Evidencia 4:** Toma una captura del listado de Casos Sociales donde se visualiza el registro con estado **"APROBADO"** y la firma plasmada.

---

## 🛠️ Ejecución de la Suite de Pruebas Automatizadas
Para evidenciar que la arquitectura de software no tiene fallos y los controladores responden exactamente como deben, ejecuta el comando de pruebas unitarias en tu consola:
```bash
php artisan test
```
**Captura de Evidencia 5:** Captura el reporte de la terminal mostrando el texto en verde: **`PASS Tests\Feature\PostulacionScoreTest ... 28 passed`** para certificar que el 100% de los tests internos están en perfecto estado.
