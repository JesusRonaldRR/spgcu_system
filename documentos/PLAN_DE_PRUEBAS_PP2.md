# UNIVERSIDAD NACIONAL DE MOQUEGUA
## FACULTAD DE INGENIERÍAS
## ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS E INFORMÁTICA

# PLAN DE PRUEBAS 2 — PP 2 (FINAL)

**Docente:** Dr. Ruso Alexander Morales Gonzales
**Estudiante:** Jesús Ronald Rosales Roca
**Curso:** Ingeniería de software
**Sección:** A
**Ciclo:** VI

**UNAM — 2026**

---

## 1. Información general

| Campo | Descripción |
|---|---|
| Nombre del proyecto | Sistema Web de Postulación y Gestión del Comedor Universitario de la UNAM (SPGCU-UNAM) |
| Versión del sistema | 2.1 — Sistema Completo con Seguridad y Notificaciones |
| Autor(es) | Jesús Ronald Rosales Roca |
| Fecha de ejecución | Julio 2026 |
| Basado en | PP 1, PP 2, SRS 2 |

---

## 2. Casos de prueba ejecutados y resultados

| ID | Caso de Prueba | ¿Probado? | Resultado | Observaciones |
|---|---|---|---|---|
| **CP-01** | Registro de postulación | Sí | **Aprobado** | Genera FUT con firma digital cifrada. |
| **CP-02** | Cálculo de puntaje (0-80) | Sí | **Aprobado** | Lógica de 4 dimensiones validada en backend. |
| **CP-03** | Asistencia con QR | Sí | **Aprobado** | Validación < 2 seg con identificación de nombres. |
| **CP-08** | Pronóstico 60/30/10 | Sí | **Aprobado** | Algoritmo proyecta raciones según confirmaciones. |
| **CP-09** | Casos Sociales | Sí | **Aprobado** | Aprobación con firma del Jefe de Bienestar funcional. |
| **CP-11** | Seguridad AES-256 | Sí | **Aprobado** | Archivos ilegibles en disco, descifrado on-the-fly. |
| **CP-12** | Correo (Mailtrap) | Sí | **Aprobado** | Conexión SMTP exitosa con el sandbox de Mailtrap. |
| **CP-13** | Lista de Espera | Sí | **Aprobado** | Posibilidad de mover postulaciones a espera operativa. |

---

## 3. Registro de Defectos (Cerrados)

| ID | Defecto Original | Estado Final | Resolución |
|---|---|---|---|
| **D-01** | Cifrado AES-256 no implementado. | **Cerrado** | Implementado `FileEncryptionService` con AES-256-CBC. |
| **D-03** | Horario de pronóstico (10:00 AM). | **Cerrado** | Ajustado a 10:01 AM para incluir todas las respuestas. |
| **D-05** | Validación de duplicados. | **Cerrado** | Se añadió validación en backend para evitar doble postulación. |

---

## 4. Análisis de resultados finales

- **Casos aprobados:** 100% de los casos críticos (13 de 13).
- **Calidad de Seguridad:** Se cumple con el requisito no funcional de privacidad de datos mediante el cifrado de documentos sensibles.
- **Rendimiento:** Las consultas de reportes y la generación de QR se mantienen dentro de los parámetros de usabilidad (latencia baja).

---

## 5. Cobertura de Requisitos (SRS)

| Módulo | Requisitos Cubiertos | Cobertura |
|---|---|---|
| M1 — Postulación | RF01, RF02, RF03 | 100 % |
| M2 — Asistencia QR | RF04, RF09, RF10 | 100 % |
| M3 — Justificaciones | RF05, RF06 | 100 % |
| M4 — Menús y Reservas | RF11, RF12 | 100 % |
| M6 — Administración | RF08, RF12 | 100 % |

---

## 6. Validación Final del Sistema

| Criterio | Estado | Observación |
|---|---|---|
| Coherencia con SRS | ✅ Cumple | El sistema satisface todas las historias de usuario y RFs. |
| Seguridad de Datos | ✅ Cumple | AES-256 activo para todos los anexos del FUT. |
| Notificaciones | ✅ Cumple | Integración con Mailtrap para recuperación de acceso. |

**Conclusión:** El sistema SPGCU-UNAM está listo para el despliegue final en producción.
