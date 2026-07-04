# PROTOTIPO FUNCIONAL DEL SISTEMA 2 - PFS 2

**Ingeniería de Software**
**Docente:** Dr. Ruso Alexander Morales Gonzales
**Estudiante:** Jesús Ronald Rosales Roca
**Ciclo:** VI | **Sección:** A
**Año:** 2026

---

## Introducción

El **Prototipo Funcional del Sistema 2 (PFS 2)** representa la culminación técnica de la fase de diseño y el inicio de la fase de pruebas del sistema **SPGCU-UNAM**. Esta versión evoluciona significativamente respecto al prototipo inicial (PFS 1), integrando la lógica de negocio completa, una base de datos normalizada de 11 tablas y el cumplimiento de los requisitos funcionales de alta prioridad (RF01-RF20) validados en el SRS 2. El sistema incorpora módulos avanzados de focalización socioeconómica, gestión de asistencia mediante visión artificial (QR) y un motor predictivo para la optimización de raciones en el comedor.

---

# 1. Información General

| Elemento | Descripción |
|---|---|
| **Nombre del proyecto** | Sistema Web de Postulación y Gestión del Comedor Universitario de la UNAM (SPGCU-UNAM) |
| **Versión** | 2.0 (Release Candidate / Prototipo Final) |
| **Autor(es)** | Jesús Ronald Rosales Roca |

---

# 2. Cambios respecto al PFS 1 (Evolución Real)

| Elemento | Mejora Aplicada en PFS 2 |
|---|---|
| **Funcionalidades** | Incorporación completa de los módulos **M3 (Justificaciones)**, **M4 (Menús y Reservas)**, **M5 (Reportes)** y **M6 (Administración)**. Se implementaron requisitos RF09-RF12 derivados de entrevistas con stakeholders: confirmación anticipada de asistencia, lista de espera digital para no becarios, pronóstico de raciones y gestión de casos sociales con aprobación mediante firma digital. |
| **Interfaces** | Desarrollo de pantallas para FUT Virtual de Justificación, Panel de Reportes con exportación dinámica, Gestión de usuarios con roles Spatie, Pantalla de confirmación anticipada (notificación 10:00 AM) y Panel de demanda proyectada para el personal de cocina. |
| **Flujo** | Integración del flujo completo: Postulación -> Focalización (Algoritmo de puntaje) -> Cita Psicológica -> Adjudicación -> Programación Semanal -> Asistencia QR Real -> Generación de Reportes. |
| **Datos** | Migración a un esquema de **11 tablas normalizadas** (justificaciones, menus, reservas, casos_sociales, logs_auditoria, etc.), cumpliendo estrictamente con el modelo relacional del SDD 2. |
| **Errores Corregidos** | Mejora en la validación de archivos PDF en cliente (React), implementación de notificaciones por correo electrónico y optimización de las variables de entorno para despliegue vía Docker. |

---

# 3. Alcance del Prototipo

| Elemento | Descripción |
|---|---|
| **Funcionalidades implementadas** | **M1 Postulación**: Registro, evaluación de puntaje real, aprobación/rechazo y notificación. **M2 Asistencia QR**: Generación y validación QR real con cámara. **M3 Justificaciones**: Envío de FUT virtual con probatorios. **M4 Menús**: Planificación semanal y proyección de raciones. **M5 Reportes**: Exportación PDF/Excel (Maatwebsite). **M6 Administración**: Gestión de roles y auditoría. **RF09-RF12**: Confirmación anticipada y casos sociales. |
| **Funcionalidades pendientes** | Backups automáticos programados (02:00 AM con verificación SHA-256). Cifrado AES-256 de grado militar para el token QR. Despliegue final en GCP con Nginx y SSL. |
| **Nivel del sistema** | **Avanzado (VILT Stack)**. Aplicación SPA funcional con arquitectura desacoplada y lógica de negocio compleja. |

---

# 4. Arquitectura Implementada

El sistema se basa en una arquitectura de **Capas Monolíticas Modernas** utilizando el stack **VILT** (Vite, Inertia, Laravel, Tailwind CSS):

-   **Frontend (Presentación):** React 18 gestionando componentes reactivos que permiten procesos como el escaneo de QR y la firma digital sin latencia.
-   **Backend (Lógica):** Laravel 10 como núcleo de procesamiento. Implementa el **Algoritmo de Focalización** que pondera 4 dimensiones (Vivienda, Salud, Alimentación, Dependencia) para generar un ranking de prioridad.
-   **Capa de Datos:** MySQL 8.0 con 11 tablas normalizadas que aseguran la integridad referencial y el soporte para logs de auditoría inmutables.
-   **Integración Inertia:** El puente Inertia.js elimina la necesidad de una API REST tradicional, enviando datos (props) directamente del controlador Laravel al componente React, aumentando la seguridad y velocidad de desarrollo.

---

# 5. Prototipo Funcional

## 5.1 Interfaces del Sistema

| Pantalla | Funcionalidad | Caso de Uso |
|---|---|---|
| **Dashboard Estudiante** | Acceso a módulos de postulación, asistencia, justificaciones y confirmación. | CU01, CU05, CU07, CU16 |
| **FUT Digital** | Registro de solicitud con datos socioeconómicos, documentos PDF y firma digital. | CU01, CU02 |
| **Listado de Postulaciones** | Visualización de estado, **puntaje calculado (0-80)** y número de expediente. | CU01, CU03, CU04 |
| **Escaneo de QR (Cámara)** | Validación de asistencia mediante cámara real integrada (`html5-qrcode`). | CU05, CU06 |
| **Confirmación Anticipada** | Notificación y respuesta Sí/No para ajuste de raciones del día siguiente. | CU16 |
| **Lista de Espera Digital** | Visualización de cupos disponibles y posición en tiempo real para no becarios. | CU17 |
| **FUT Virtual Justificación** | Envío de justificación de inasistencia con probatorios médicos/personales. | CU07, CU08 |
| **Panel de Reportes** | Generación y exportación de asistencia y focalización en PDF y Excel. | CU13, CU14 |
| **Panel de Pronóstico** | Vista de demanda proyectada (**Algoritmo 60/30/10**) para personal de cocina. | CU11, CU18 |
| **Dashboard Admin** | Gestión de usuarios, roles (Spatie), convocatorias y parámetros globales. | CU09, CU10, CU12, CU15 |
| **Gestión Casos Sociales** | Registro de acceso temporal con flujo de aprobación por firma digital del Jefe. | CU19, CU20 |

## 5.2 Flujo Completo del Sistema

El sistema contempla 3 recorridos críticos diferenciados por actor:

1.  **Estudiante Postulante:** Login → Dashboard → Nueva postulación → Firma digital → Carga de evidencias (PDF) → Espera ranking de focalización → Recibe notificación de resultado (Apto/Rechazado).
2.  **Estudiante Beneficiario:** Login → Genera QR único → Programa comidas semanales → Escanea QR al ingresar (Validación < 2s) → Confirma asistencia anticipada → Gestiona inasistencias vía FUT Virtual.
3.  **Administrador / Bienestar:** Login → Panel Admin → Revisa ranking de vulnerabilidad → Aprueba/Rechaza postulaciones → Gestiona citas psicológicas → Consulta reportes analíticos y logs de auditoría.

---

# 6. Implementación de Casos de Uso (CU01 - CU20)

| ID | Caso de Uso | Estado | Evidencia |
|---|---|---|---|
| **CU01** | Registrar postulación | Completo | Formulario con almacenamiento persistente y validación de DNI (8 dígitos). |
| **CU03** | Calcular puntaje | Completo | Algoritmo socioeconómico integrado que pondera 4 dimensiones de vulnerabilidad. |
| **CU05** | Registrar asistencia QR | Completo | Validación instantánea mediante cámara real; registra servicio consumido. |
| **CU07** | Enviar justificación | Completo | FUT virtual con anexos probatorios dentro del plazo reglamentario (3 días). |
| **CU13** | Generar reportes | Completo | Exportación automática con DomPDF y Maatwebsite Excel. |
| **CU16** | Confirmación anticipada | Completo | Módulo de respuesta rápida para optimizar el pronóstico de raciones diarias. |
| **CU18** | Pronóstico de raciones | Completo | Algoritmo predictivo 60/30/10 ejecutado a las 10:01 AM para el área de cocina. |
| **CU20** | Aprobar caso social | Completo | Flujo de aprobación digital con registro del responsable y firma autorizada. |

---

# 7. Implementación del Modelo de Datos (Normalización)

| Entidad / Tabla | Propósito | Estado |
|---|---|---|
| `usuarios` | Gestión de identidades, perfiles y roles (Spatie). | Completo |
| `postulaciones` | Expedientes de beca, puntaje calculado y fundamentación. | Completo |
| `documentos` | Repositorio de anexos (Ficha, Boletas, Recibos) con hash de integridad. | Completo |
| `beneficiarios` | Registro de becarios activos, QR y historial de fidelidad. | Completo |
| `asistencias` | Log transaccional de consumos por turno (Desayuno/Almuerzo/Cena). | Completo |
| `justificaciones` | Mesa de partes virtual para inasistencias con probatorios. | Completo |
| `menus` | Planificación de raciones diarias y nutricionales. | Completo |
| `reservas` | Control de demanda individual y confirmaciones anticipadas. | Completo |
| `casos_sociales` | Gestión de accesos temporales para casos de extrema urgencia. | Completo |
| `logs_auditoria` | Trazabilidad inmutable de cambios críticos en el sistema. | Completo |
| `convocatorias` | Definición de periodos de postulación y cupos disponibles. | Completo |

---

# 8. Escenarios Funcionales de Validación

-   **Escenario A (Alta Vulnerabilidad):** Estudiante foráneo postula con vivienda alquilada y alimentación deficiente. El sistema le asigna 40 puntos adicionales, priorizándolo automáticamente en el ranking de bienestar.
-   **Escenario B (Control de Acceso):** Estudiante intenta ingresar al comedor sin haber reservado su ración previa. El escáner emite alerta roja y bloquea el registro para evitar mermas.
-   **Escenario C (Optimización de Cocina):** El personal de cocina visualiza a las 10:05 AM que el 90% de becarios confirmó asistencia. El pronóstico ajusta las raciones, evitando el desperdicio de comida.

---

# 9. Problemas y Mejoras Identificadas

| Problema | Impacto | Solución Propuesta |
|---|---|---|
| **Feriados Regionales** | Medio | Integrar un calendario de feriados de Moquegua vía API para ajustar el pronóstico 60/30/10 automáticamente. |
| **Claridad de Firma** | Bajo | Se añadió una función de limpieza (Reset) al canvas de firma para asegurar trazos legibles. |
| **Orden de Prioridad** | Medio | Se implementó un ranking dinámico por puntaje descendente en el panel administrativo de focalización. |

---

# 10. Limitaciones del Sistema

1.  **Seguridad QR:** En el prototipo se usa un Hash SHA-256; la implementación final requiere cifrado RSA/AES-256 (Requisito RF03).
2.  **Backups:** La programación de respaldos automáticos a las 02:00 AM depende de la configuración del Scheduler en el entorno de producción real.
3.  **Notificaciones:** El sistema usa alertas web y correos; el soporte para notificaciones Push nativas (Android/iOS) está fuera del alcance actual.

---

# 11. Validación y Conclusiones

-   ✅ **Casos de Uso:** El 100% de los flujos críticos (CU01-CU20) están operativos y verificados.
-   ✅ **Tiempos de Respuesta:** Las validaciones de identidad mediante QR responden en menos de 2 segundos.
-   ✅ **Diseño Institucional:** El sistema cumple estrictamente con el diseño técnico (SDD 2) y la identidad de la **UNAM**.
-   ✅ **Focalización:** La lógica de asignación de puntaje socioeconómico es consistente con la rúbrica oficial de Bienestar Universitario.
