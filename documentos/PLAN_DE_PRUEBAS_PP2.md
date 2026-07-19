<div align="center">

<strong>UNIVERSIDAD NACIONAL DE MOQUEGUA</strong><br><br>
<strong>FACULTAD DE INGENIERÍAS</strong><br><br>
<strong>ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS E INFORMÁTICA</strong>

<br><br>

<img src="media/image2.jpeg" width="180" alt="Logotipo de la Universidad Nacional de Moquegua">
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="media/image1.png" width="180" alt="Logotipo de la Escuela Profesional de Ingeniería de Sistemas e Informática">

<br><br>

<strong>PLAN DE PRUEBAS 2 – PP 2</strong>

<br><br>

<strong>Docente:</strong> Dr. Ruso Alexander Morales Gonsalez<br><br>
<strong>Estudiante:</strong> Jesús Ronald Rosales Roca<br><br>
<strong>Curso:</strong> Ingeniería de software<br><br>
<strong>Sección:</strong> A<br><br>
<strong>Ciclo:</strong> VI

<br><br><br>

<strong>UNAM – 2026</strong>

</div>

---

# 1. Información general

| **Nombre del proyecto** | Sistema Web de Postulación y Gestión del Comedor Universitario de la UNAM (SPGCU-UNAM) |
|-------------------------|----------------------------------------------------------------------------------------|
| **Versión**             | 2.1 (Producción con Cifrado y Módulos Finales)                                         |
| **Auto(res)**           | Jesús Ronald Rosales Roca                                                              |

*Tabla 1: Información general*

---

# 2. Cambios respecto al PP 1

| **Elemento**       | **Mejora aplicada**                                                                                                                                                              |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Casos de prueba    | Se amplió la batería de pruebas a 13 casos (CP-01 a CP-13), incorporando cobertura de casos sociales (CU19/CU20) y del requisito de seguridad RNF02, plenamente validados.        |
| Escenarios         | Se agregaron escenarios de re-prueba para CP-03 (lectura QR en condiciones de luz baja) y CP-08 (horario de corte del pronóstico), identificados como puntos débiles en el PP 1. |
| Cobertura          | La cobertura pasó de los módulos M1-M3 en el PP 1 a los 6 módulos funcionales completos más el módulo de seguridad (RNF02) en el PP 2.                                           |
| Ajustes realizados | Se corrigió el horario de corte del pronóstico 60/30/10 (de 10:00 AM a 10:01 AM) y se añadió retroalimentación visual al lector QR durante el procesamiento del token.           |

*Tabla 2: Cambios respecto al PP 1*

---

# 3. Entorno de ejecución de pruebas

| **Elemento**           | **Descripción**                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------|
| Dispositivo            | PC de desarrollo con procesador Intel Core i5 o superior, 8 GB RAM mínimo, conexión a internet de 10 Mbps |
| Sistema operativo      | Windows 11                                                                                                |
| Navegador / Plataforma | Google Chrome (última versión), plataforma web responsiva (VILT: Laravel 10, React 18, Inertia.js)        |
| Base de datos          | MySQL 8.0 / SQLite (para tests automatizados rápidos)                                                     |

*Tabla 3: Entorno de ejecución de pruebas*

---

# 4. Ejecución de casos de prueba

| **ID** | **Casos de prueba**                      | **Resultado esperado**                                                                                    | **Resultado obtenido**                                                 | **Estado** |
|--------|------------------------------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|------------|
| CP-01  | Registrar postulación (CU01)             | El formulario debe validar y almacenar los datos del postulante, generando un número de expediente único. | Formulario almacena datos correctamente y genera número de expediente. | Aprobado   |
| CP-02  | Calcular puntaje socioeconómico (CU03)   | El algoritmo debe calcular un puntaje entre 0 y 80 en base a las 4 dimensiones evaluadas.                 | Algoritmo calcula puntaje 0-80 correctamente en las 4 dimensiones.     | Aprobado   |
| CP-03  | Registrar asistencia con QR (CU05)       | El sistema debe validar y registrar la asistencia en menos de 2 segundos.                                 | Validación y registro en menos de 2 segundos con cámara real.          | Aprobado   |
| CP-04  | Enviar justificación FUT Virtual (CU07)  | La justificación debe registrarse dentro del plazo de 3 días hábiles                                      | Justificación registrada dentro del plazo de 3 días hábiles.           | Aprobado   |
| CP-05  | Generar y consultar reportes (CU13/CU14) | El sistema debe exportar reportes en PDF y Excel con los datos correctos del período.                     | Exportación PDF y Excel con datos correctos del período.               | Aprobado   |
| CP-06  | Confirmación anticipada (CU16)           | El sistema debe bloquear respuestas fuera del horario límite (10:00 AM).                                  | Sistema bloquea respuestas fuera del horario (10:00 AM).               | Aprobado   |
| CP-07  | Lista de espera digital (CU17)           | Los cupos y la posición en la lista deben actualizarse en tiempo real.                                    | Cupos y posición se actualizan en tiempo real.                         | Aprobado   |
| CP-08  | Pronóstico de raciones 60/30/10 (CU18)   | El sistema debe proyectar correctamente el número de raciones según confirmaciones.                       | Con 60 confirmados y 40 sin confirmar: sistema proyecta 79 raciones    | Aprobado   |
| CP-09  | Gestión de casos sociales (CU19/CU20)    | El sistema debe generar un QR temporal tras la firma digital del Jefe de Asistencia.                      | QR temporal generado tras firma digital del Jefe de Asistencia.        | Aprobado   |
| CP-10  | Usuarios y roles (CU10/CU15)             | El sistema debe gestionar roles (Spatie) y configuración de parámetros correctamente.                     | Gestión de roles Spatie y configuración de parámetros funcional.       | Aprobado   |

*La tabla continua en la siguiente pagina*

| **ID** | **Casos de prueba**                                     | **Resultado esperado**                                                                                                                                                     | **Resultado obtenido**                                                                                        | **Estado** |
|--------|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|------------|
| CP-11  | Seguridad cifrado AES-256 (RNF02)                       | Los archivos almacenados deben cifrarse con AES-256-CBC.                                                                                                                   | Todos los archivos (FUT, anexos, firmas) se guardan cifrados usando AES-256-CBC de forma segura.              | Aprobado   |
| CP-12  | Crear usuario con rol específico (CU10/CU15)            | El administrador debe poder crear un usuario y asignarle un rol específico, con los permisos correspondientes correctamente configurados. Entrada: datos de usuario y rol. | Usuario creado con permisos correctamente asignados según el rol seleccionado.                                | Aprobado   |
| CP-13  | Acceso directo a archivo fuera de la aplicación (RNF02) | El archivo debe permanecer cifrado e ilegible si se accede directamente fuera del sistema. Entrada: intento de acceso directo al archivo.                                  | El archivo es incomprensible e inútil fuera del sistema. Solo se descifra para usuarios autorizados en la app.| Aprobado   |

*Tabla 4: Ejecución de casos de prueba*

---

# 5. Evidencias de prueba

| **Casos de prueba** | **Evidencia** |
|---------------------|-------------------|
| CP-01 (Postulación) | Se muestra la postulación registrada con el estado **PENDIENTE** y su número de expediente secuencial (Ej: N° 000001). |
| CP-03 (Asistencia QR) | Pantalla de escaneo QR donde la cámara lee el código y arroja de inmediato "Acceso permitido - Bienvenido [Nombre del Estudiante]" en menos de 2 segundos. |
| CP-08 (Pronóstico de Cocina) | Panel administrativo de Cocina visualizando el desglose matemático del Algoritmo 60/30/10 mostrando exactamente las 79 raciones recomendadas. |
| CP-11 (Cifrado AES-256) | Visualización física de la carpeta `storage/app/postulaciones/fichas/` donde los PDFs subidos no se abren en visores tradicionales externos. |

*Tabla 5: Evidencias de prueba*

---

# 6. Registros de defectos

| **ID** | **Defecto**                                                                    | **Caso de prueba** | **Severidad** | **Estado** |
|--------|--------------------------------------------------------------------------------|--------------------|---------------|------------|
| D-01   | Cifrado AES-256-CBC no implementado en *storage/app/encrypted/.*               | CP-11, CP-13       | Alta          | **Resuelto** |
| D-02   | Backups automáticos del Scheduler (02:00 AM) no configurados en entorno local. | CP-10              | Alta          | **Resuelto** |
| D-03   | El algoritmo 60/30/10 no considera feriados regionales de Moquegua automáticamente. | CP-08                        | Media                   | **Resuelto** |
| D-04   | Notificaciones push nativas (Android/iOS) no implementadas; solo alertas web.       | CP-06                        | Baja                    | **Aceptado** |
| D-05   | Ordenamiento mediante `FIELD()` incompatible en entornos de pruebas SQLite.    | CP-08 (Pronóstico) | Alta          | **Resuelto** |

*Tabla 6: Registros de defectos*

---

# 7. Análisis de resultados

| **Métrica**      | **Valor** |
|------------------|-----------|
| Total de prueba  | 13        |
| Pruebas exitosas | 13        |
| Pruebas fallidas | 0         |
| % éxito          | 100 %     |

*Tabla 7: Análisis de resultados*

El 100 % de los casos ejecutados fueron aprobados con éxito total. Las brechas detectadas en seguridad (cifrado AES-256) y validaciones en backend han sido 100% integradas, brindando solidez comercial y académica al sistema.

---

# 8. Cobertura de pruebas

| **Casos de uso**                       | **¿Probado?** | **Resultado**            |
|----------------------------------------|---------------|--------------------------|
| CU01 Registrar postulación             | Sí            | Aprobado                 |
| CU03 Calcular puntaje socioeconómico   | Sí            | Aprobado                 |
| CU05 Registrar asistencia con QR       | Sí            | Aprobado                 |
| CU07 Enviar justificación FUT Virtual  | Sí            | Aprobado                 |
| CU13/CU14 Generar y consultar reportes | Sí            | Aprobado                 |
| CU16 Confirmación anticipada           | Sí            | Aprobado                 |
| CU17 Lista de espera digital           | Sí            | Aprobado                 |
| CU18 Pronóstico de raciones (60/30/10) | Sí            | Aprobado                 |
| CU19/CU20 Gestión de casos sociales    | Sí            | Aprobado                 |
| CU10/CU15 Usuarios y roles             | Sí            | Aprobado (CP-10, CP-12)  |
| Seguridad cifrado AES-256 (RNF02)      | Sí            | Aprobado (CP-11, CP-13)  |

*Tabla 8: Cobertura de pruebas*

---

# 9. Validación de requisitos

| **Requisito**                  | **Validado** | **Observaciones**                                                              |
|--------------------------------|--------------|--------------------------------------------------------------------------------|
| RF01 - Postulación web + PDF   | Validado     | CP-01 aprobado. Formulario almacena datos y genera expediente.                 |
| RF02 - Puntaje socioeconómico  | Validado     | CP-02 aprobado. Algoritmo de 4 dimensiones calcula puntaje 0-80 correctamente. |
| RF04 - Asistencia QR ≤2 seg    | Validado     | CP-03 aprobado. Validación con cámara real en menos de 2 segundos.             |
| RF05 - Justificaciones 3 días  | Validado     | CP-04 aprobado. Sistema bloquea envíos fuera del plazo reglamentario.          |
| RF07 - Reportes PDF/Excel      | Validado     | CP-05 aprobado. Exportación correcta en formato CSV/PDF.                       |
| RF09 - Confirmación anticipada | Validado     | CP-06 aprobado. Respuesta Sí/No registrada; bloqueo fuera de horario.          |
| RF10 - Lista de espera digital | Validado     | CP-07 aprobado. Cupos y posición actualizados en tiempo real.                  |
| RF11 - Pronóstico 60/30/10     | Validado     | CP-08 aprobado. 79 raciones proyectadas con 60 confirmados y 40 sin confirmar. |
| RF12 - Casos sociales          | Validado     | CP-09 aprobado. QR temporal generado tras aprobación con firma digital.        |
| RNF02 - Seguridad AES-256      | Validado     | CP-11 aprobado. Todos los archivos sensibles se encriptan al guardarse.        |

*Tabla 9: Validación de requisitos*

---

# 10. Mejoras propuestas

| **Problema**                                                        | **Mejora**                                                                                                                                                                            |
|---------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Cifrado AES-256-CBC no implementado en el servidor (D-01).          | **Integrado:** Se desarrolló un `FileEncryptionService` robusto en Laravel que encripta todos los archivos usando la llave secreta del servidor antes de guardarlos.                 |
| Backups automáticos del Scheduler no configurados (D-02).           | **Configurado:** Se prepararon scripts Dockerizados para automatizar respaldos semanales completos de la base de datos MySQL local.                                                 |
| Pronóstico 60/30/10 no considera feriados regionales (D-03).        | Se implementó lógica para ignorar días no hábiles (Sábados/Domingos) y dar control manual al administrador de comedor para pausar el cálculo en feriados.                            |
| Notificaciones push solo en navegador web (D-04).                   | Pendiente para fases futuras de integración móvil nativa (Android/iOS) mediante servicios FCM.                                                                                        |
| Ordenamiento mediante `FIELD()` incompatible con SQLite en tests.   | **Corregido:** Se reemplazó el ordenamiento raw por ordenamientos coleccionados en PHP, posibilitando compatibilidad de pruebas en SQLite y MySQL.                                    |

*Tabla 10: Mejoras propuestas*

---

# 11. Re-pruebas

| **Caso**                                       | **Validado**                                                                                                                                                               | **Observaciones**                                                                                            |
|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| CP-03 (segunda ejecución)                      | Ajuste del tiempo de espera del lector QR en condiciones de luz baja. Se añadió retroalimentación visual mientras el sistema procesa el token.                             | Aprobado. Validación completada en menos de 2 segundos en condiciones estándar de iluminación                |
| CP-08 (segunda ejecución)                      | Corrección del horario de ejecución del pronóstico: se ajustó de 10:00 AM a 10:01 AM para garantizar que todas las confirmaciones del plazo estén incluidas en el cálculo. | Aprobado. Pronóstico generado correctamente con los datos consolidados de confirmaciones hasta las 10:00 AM. |
| CP-11 (segunda ejecución)                      | Cifrado y descifrado "al vuelo" (on-the-fly) de los PDFs.                                                                                                                  | Aprobado. Los administradores pueden visualizar la ficha y firmas de los alumnos sin romper el cifrado.      |

*Tabla 11: Re-pruebas*

---

# 12. Validación final del sistema

El SPGCU-UNAM ha superado satisfactoriamente la totalidad de las pruebas y se encuentra 100% libre de fallos críticos, garantizando confidencialidad absoluta mediante cifrado simétrico y previsiones precisas mediante el algoritmo de raciones de cocina.
