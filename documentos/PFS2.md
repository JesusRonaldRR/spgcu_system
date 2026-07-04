# Prototipo Funcional del Sistema 2 – PFS 2

**Universidad Nacional de Moquegua**
**Facultad de Ingenierías**
**Escuela Profesional de Ingeniería de Sistemas e Informática**

- **Docente:** Dr. Ruso Alexander Morales Gonsalez
- **Estudiante:** Jesús Ronald Rosales Roca
- **Curso:** Ingeniería de software
- **Ciclo:** VI
- **Año:** 2026

---

## 1. Información General

| Elemento | Descripción |
| :--- | :--- |
| **Nombre del proyecto** | Sistema Web de Postulación y Gestión del Comedor Universitario de la UNAM (SPGCU-UNAM) |
| **Versión** | 2.0 |
| **Autor(es)** | Jesús Ronald Rosales Roca |

## 2. Cambios respecto al PFS 1

| Elemento | Mejora aplicada |
| :--- | :--- |
| **Funcionalidades** | Se incorporan los módulos M3 (Justificaciones), M4 (Menús y Reservas), M5 (Reportes) y M6 (Administración) completos. Implementación de requisitos RF09-RF12: confirmación de asistencia, lista de espera, pronóstico de raciones y casos sociales. |
| **Interfaces** | Pantallas de Justificaciones, Reportes (PDF/Excel), Administración de usuarios, Confirmación anticipada, Lista de espera digital y Pronóstico para cocina. |
| **Flujo** | Integración del flujo completo: postulación -> asistencia QR real -> justificaciones -> menús -> reportes -> administración. |
| **Datos** | Incorporación de tablas: `justificaciones`, `menus`, `reservas`, `casos_sociales` y `logs_auditoria`. |
| **Errores corregidos** | Validación PDF en cliente (React), envío de correos automáticos, configuración Docker y variables de entorno actualizadas. |

## 3. Alcance del prototipo

| Elemento | Descripción |
| :--- | :--- |
| **Funcionalidades implementadas** | M1 Postulación (Evaluación de puntaje real), M2 Asistencia QR (Cámara real), M3 Justificaciones (FUT virtual), M4 Menús y Reservas, M5 Reportes (Exportación), M6 Administración (Roles Spatie). RF09-RF12 implementados. |
| **Funcionalidades pendientes** | Backups automáticos programados, Cifrado AES-256 completo para QR en producción, Despliegue en GCP con SSL. |
| **Nivel del sistema** | Laravel 10 + React (Inertia) + MySQL 8.0 |

## 4. Prototipo Funcional (Interfaces y Casos de Uso)

| Pantalla | Funcionalidad | Casos de Uso |
| :--- | :--- | :--- |
| **Dashboard Estudiante** | Acceso a postulación, asistencia, justificaciones y confirmación. | CU01, CU05, CU07, CU16 |
| **Formulario de Postulación** | Registro con datos socioeconómicos y PDF adjuntos. | CU01, CU02 |
| **Listado de Postulaciones** | Ver estado, **puntaje calculado** y número de expediente. | CU01, CU03, CU04 |
| **Escaneo de QR (cámara)** | Validación de asistencia mediante cámara real. | CU05, CU06 |
| **Panel de Reportes** | Generación y exportación de asistencia en PDF y Excel. | CU13, CU14 |
| **Dashboard Admin** | Gestión de usuarios, roles, convocatorias y parámetros. | CU09, CU10, CU12, CU15 |

## 5. Implementación de Casos de Uso (Resumen)

- **CU01 Registrar postulación:** Completo. Formulario funcional con almacenamiento.
- **CU03 Calcular puntaje socioeconómico:** **Completo.** Algoritmo implementado en el backend basándose en indicadores de vivienda, salud, alimentación y dependencia.
- **CU05 Registrar asistencia con QR:** Completo. Escaneo con cámara real.
- **CU13 Generar reporte:** Completo. Exportación funcional.
- **CU15 Gestionar usuarios y roles:** Completo. Roles diferenciados (Admin, Estudiante, etc.).

## 6. Implementación del Modelo de Datos

| Tabla | Estado | Observaciones |
| :--- | :--- | :--- |
| `usuarios` | Completo | Autenticación y perfiles extendidos. |
| `postulaciones` | Completo | **Incluye puntaje calculado**, fundamentación, y archivos. |
| `asistencias` | Completo | Registro en tiempo real. |
| `entrevistas` | Completo | Gestión de citas psicológicas para postulantes aptos. |
| `menus` | Completo | Programación de servicios de alimentación. |

## 7. Limitaciones Identificadas

- El cifrado robusto para el QR está en fase beta (usando hash simple actualmente).
- Los backups automáticos dependen del cron job del servidor destino.
- El sistema es 100% responsive, pero no posee notificaciones Push nativas.

---
*Documento generado automáticamente a partir del estado actual del sistema.*
