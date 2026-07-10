# PLAN DE PRUEBAS 1 -- PP 1 (ENRIQUECIDO)

**Universidad Nacional de Moquegua**
**Facultad de Ingenierías**
**Escuela Profesional de Ingeniería de Sistemas e Informática**

| | |
|---|---|
| **Docente** | Dr. Ruso Alexander Morales Gonsalez |
| **Estudiante** | Jesús Ronald Rosales Roca |
| **Curso** | Ingeniería de software |
| **Sección** | A |
| **Ciclo** | VI |
| **Institución** | UNAM -- 2026 |

---

## 1. Información general

| Campo | Descripción |
|---|---|
| Nombre del proyecto | Sistema Web de Postulación y Gestión del Comedor Universitario de la UNAM (SPGCU-UNAM) |
| Versión del plan | 1.1 (Actualizado con Cifrado y Módulos Finales) |
| Autor(es) | Jesús Ronald Rosales Roca |
| Fecha | Julio 2026 |
| Basado en | PFS 2, SRS 2, CU 2, SEGURIDAD_ALMACENAMIENTO.md |

---

## 2. Objetivo del plan de pruebas

Verificar que el sistema SPGCU-UNAM cumple con los requisitos funcionales RF01–RF12 y los casos de uso CU01–CU20, validando especialmente la integridad de los datos mediante cifrado AES-256, el algoritmo de pronóstico 60/30/10 y el flujo de aprobación de casos sociales.

---

## 3. Alcance de las pruebas

| Elemento | Descripción |
|---|---|
| **Incluye** | Pruebas funcionales de los módulos M1-M6. **NUEVO:** Verificación de cifrado AES-256 en archivos sensibles. Validación del algoritmo de pronóstico 60/30/10. Pruebas de firma digital en Casos Sociales y Postulaciones. |
| **Excluye** | Pruebas de carga masiva (simulación de >1000 usuarios concurrentes). Pruebas de hardware físico de molinetes. |
| **Nivel de prueba** | Pruebas de sistema e integración en entorno local y staging. |

---

## 4. Tipos de prueba (Enriquecidos)

| Tipo | Descripción |
|---|---|
| **Prueba de Seguridad (Cifrado)** | Verifica que los archivos subidos (PDFs, firmas) se almacenen cifrados en el disco/S3 y solo sean legibles a través de la aplicación. |
| **Prueba Algorítmica** | Valida la exactitud del pronóstico de raciones siguiendo la fórmula: (100% Confirmados) + (30% No Confirmados) + (10% Buffer). |
| **Prueba de Flujo de Trabajo** | Verifica el ciclo de vida de un Caso Social desde la solicitud del Psicólogo hasta la firma del Jefe de Bienestar. |

---

## 5. Identificación de casos de prueba

| Código | Descripción | Prioridad |
|---|---|---|
| **CP-01** | Registro de postulación con firma digital. | Alta |
| **CP-02** | Cálculo automático del puntaje (0–80). | Alta |
| **CP-03** | Validación QR y auto-asistencia para becarios. | Alta |
| **CP-08** | **Pronóstico 60/30/10:** Cálculo a las 10:01 AM basado en confirmaciones. | Alta |
| **CP-09** | **Caso Social:** Registro, firma digital y generación de QR temporal. | Alta |
| **CP-11** | **Seguridad AES-256:** Cifrado de documentos y firmas en el servidor. | Crítica |

---

## 6. Especificación de casos de prueba (Nuevos/Enriquecidos)

### CP-08 -- Pronóstico de raciones (60/30/10)

| Campo | Detalle |
|---|---|
| **Precondición** | 100 beneficiarios activos. 60 han confirmado asistencia para mañana. |
| **Pasos** | 1. Login como Cocina/Admin.<br>2. Acceder a "Pronóstico".<br>3. Verificar el cálculo para el día siguiente. |
| **Resultado esperado** | Total = 60 (100% confirmados) + 12 (30% de los 40 no confirmados) + 7 (10% de margen) = **79 raciones**. |

### CP-09 -- Gestión de Casos Sociales con Firma

| Campo | Detalle |
|---|---|
| **Precondición** | Estudiante con vulnerabilidad extrema no becario. |
| **Pasos** | 1. Psicólogo registra caso social.<br>2. Jefe de Bienestar Universitario accede, revisa y **firma digitalmente** en el canvas.<br>3. Estudiante consulta su QR. |
| **Resultado esperado** | QR temporal generado. La firma se guarda como archivo cifrado. El estado cambia a "Aprobado". |

### CP-11 -- Seguridad y Cifrado AES-256

| Campo | Detalle |
|---|---|
| **Objetivo** | Garantizar que los documentos sensibles no sean accesibles si el almacenamiento es comprometido. |
| **Pasos** | 1. Estudiante sube FUT (PDF).<br>2. Localizar el archivo en `storage/app/encrypted/`.<br>3. Intentar abrir el archivo manualmente con un visor de PDF. |
| **Resultado esperado** | El visor de PDF debe indicar que el archivo está corrupto o protegido (ilegible). La aplicación debe permitir visualizarlo correctamente tras la descarga segura. |

---

## 7. Criterios de Aceptación Técnicos

1. **Latencia QR:** El escaneo y validación debe procesarse en < 1.5 segundos.
2. **Seguridad de Archivos:** El 100% de los archivos en la carpeta `encrypted/` deben estar cifrados con AES-256-CBC.
3. **Firma Digital:** El sistema debe capturar trazos vectoriales y convertirlos a imagen cifrada para prevenir sustracción.
4. **Resiliencia:** El sistema debe funcionar correctamente incluso si el disco S3 está configurado (compatibilidad multicloud).

---

## 8. Trazabilidad Caso de Prueba -- Requisito

| Caso de Prueba | Requisito (SRS) | Módulo |
|---|---|---|
| CP-01 | RF01 (Postulación) | M1 |
| CP-03 | RF04 (Asistencia QR) | M2 |
| CP-08 | RF11 (Pronóstico) | M4 |
| CP-09 | RF12 (Casos Sociales) | M6 |
| CP-11 | RNF01 (Seguridad/Privacidad) | Core |

---

## 9. Firma de Aprobación del Plan

| Responsabilidad | Nombre | Firma | Fecha |
|---|---|---|---|
| **Autor** | Jesús Ronald Rosales Roca | [Digital Signature] | 05/07/2026 |
| **Revisor** | Dr. Ruso Alexander Morales G. | | |
| **Aprobador** | Jefe de Bienestar UNAM | | |
