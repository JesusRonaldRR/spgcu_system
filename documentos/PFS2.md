# PROTOTIPO FUNCIONAL DEL SISTEMA 2 - PFS 2

**Universidad Nacional de Moquegua**
**Facultad de Ingenierías**
**Escuela Profesional de Ingeniería de Sistemas e Informática**

**Ingeniería de Software**
**Docente:** Dr. Alexander Morales Gonzales
**Estudiante:** Jesús Ronald Rosales Roca
**Ciclo:** VI | **Sección:** A
**Año:** 2026

---

## Introducción

El **Prototipo Funcional del Sistema 2 (PFS 2)** representa la consolidación técnica y operativa del sistema **SPGCU-UNAM**. Tras superar la fase inicial de prototipado, esta versión integra la lógica de negocio completa definida en los documentos de requisitos (SRS) y diseño (SDD). Se han implementado algoritmos de focalización socioeconómica, gestión de asistencia mediante visión artificial (QR) y un motor de reportes analíticos. El sistema no solo simula flujos, sino que opera sobre una base de datos normalizada, permitiendo la ejecución de escenarios reales de gestión de bienestar universitario.

---

# 1. Información General

| Elemento | Descripción |
|---|---|
| **Nombre del proyecto** | Sistema Web de Postulación y Gestión del Comedor Universitario de la UNAM (SPGCU-UNAM) |
| **Versión** | 2.0 (Release Candidate) |
| **Autor(es)** | Jesús Ronald Rosales Roca |

---

# 2. Cambios respecto al PFS 1

| Elemento | Mejora aplicada |
|---|---|
| **Funcionalidades** | **Implementación del M3, M4, M5 y M6**: Justificaciones, Menús, Reportes y Administración. Se activó el requisito crítico de **Focalización Automática** (RF03) que calcula el nivel de prioridad de cada becario basándose en una rúbrica de 4 dimensiones. |
| **Interfaces** | **Branding UNAM Institucional**: Rediseño bajo la identidad visual de la Universidad Nacional de Moquegua. Uso de la paleta de colores oficial (#0f4c9b). Dashboards interactivos con componentes dinámicos de React. |
| **Flujo** | **Ciclo de Vida de Postulación Completo**: Integración del flujo end-to-end: Postulación -> Evaluación -> Entrevista Psicológica -> Adjudicación de Beca -> Control de Asistencia QR. |
| **Datos** | **Modelo Relacional Finalizado**: Incorporación de tablas para `entrevistas`, `programaciones_comedor`, `menus` y `asistencias`. Implementación de tipos de datos JSON para indicadores socioeconómicos y almacenamiento dinámico de archivos. |
| **Errores corregidos** | Se resolvió el error de persistencia en la fundamentación del estudiante. Mejora en la validación de archivos PDF tanto en cliente como en servidor para asegurar la integridad de los anexos. |

---

# 3. Alcance del Prototipo

| Elemento | Descripción |
|---|---|
| **Funcionalidades implementadas** | M1 Postulación (Completo), M2 Asistencia QR (Completo), M3 Justificaciones (Completo), M4 Menús y Reservas (Completo), M5 Reportes (Completo), M6 Administración (Completo). RF09-RF12 (Confirmación anticipada, lista de espera digital). |
| **Funcionalidades pendientes** | Integración con pasarela de pagos externos; Cifrado AES-256 de nivel bancario para el token QR (actualmente basado en Hash SHA-256). |
| **Nivel del sistema** | **Avanzado**. Aplicación SPA funcional con arquitectura desacoplada y lógica de negocio compleja. |

---

# 4. Arquitectura Implementada

El sistema implementa una arquitectura **VILT (Vite, Inertia, Laravel, Tailwind)** basada en el patrón de **Single Page Application (SPA)**:

-   **Frontend:** React 18 gestionando el estado de la interfaz. La reactividad permite que procesos como el escaneo de QR sean instantáneos.
-   **Backend:** Laravel 10 como proveedor de servicios de datos y lógica de negocio. Maneja la seguridad (Middleware), validación y orquestación de flujos.
-   **Capa de Datos:** MySQL 8.0 con un modelo de datos optimizado para consultas rápidas de asistencia y reportes de prioridad.
-   **Comunicación:** Inertia.js permite que el backend "renderice" componentes React pasando props directamente, eliminando la necesidad de una API pública y reforzando la seguridad de los datos sensibles de los estudiantes.

---

# 5. Prototipo Funcional

## 5.1 Interfaces del Sistema

| Pantalla | Funcionalidad | Caso de Uso |
|---|---|---|
| **Mesa de Partes Virtual** | Llenado del FUT con indicadores de vivienda, salud y dependencia. Captura de firma digital. | CU01, CU02 |
| **Panel de Focalización** | Ranking de estudiantes basado en puntaje calculado automáticamente (0-80). | CU03 (Cálculo) |
| **Agenda de Citas** | Selección de horarios para entrevistas psicológicas por parte de los aptos. | CU07 (Entrevistas) |
| **Control de Acceso QR** | Interfaz de escaneo que utiliza la cámara del dispositivo para validar beneficiarios. | CU05, CU06 |
| **Reportes Analíticos** | Exportación de asistencias y deudores en formatos CSV/PDF para Bienestar. | CU13, CU14 |

## 5.2 Flujo Completo del Sistema

El flujo de navegación principal es el siguiente:
1.  **Estudiante:** Inicia sesión, accede a "Nueva Postulación", completa el FUT Digital y firma en el canvas. El sistema calcula su **Puntaje Socioeconómico** (Ej. 65 pts).
2.  **Administrativo:** Revisa el listado de "Postulaciones Pendientes", visualiza el FUT y, si el puntaje es alto, cambia el estado a "Apto para Entrevista".
3.  **Estudiante:** Desde su Dashboard, ve su nuevo estado y accede al módulo de "Citas" para reservar un slot con el psicólogo.
4.  **Psicólogo/Admin:** Tras la entrevista, marca el resultado como "Aprobado". El estudiante se convierte en "Becario".
5.  **Beneficiario:** Genera su código QR único y programa sus servicios semanales (Desayuno/Almuerzo/Cena).
6.  **Comedor:** El personal de comedor escanea el QR del becario. El sistema valida la reserva del turno y registra la asistencia en tiempo real.

## 5.3 Evidencias Funcionales

-   **Capturas:** El proyecto incluye vistas detalladas para cada módulo (Dashboard, Postulaciones, Reportes).
-   **Ejecución:** El sistema valida archivos PDF, firmas digitales y genera hashes únicos para cada QR de asistencia.
-   **Puntaje Automatizado:** Se implementó la lógica de puntaje:
    - **Vivienda:** Quinta (20), Alquilada (15), Cedida (10), Propia (5).
    - **Salud:** Crónica (20), Frecuente (15), Estable (10), Buena (5).
    - **Alimentación:** Deficiente (20), Irregular (15), Completa (10).
    - **Dependencia:** Total (20), Parcial (15), Independiente (10).

---

# 6. Implementación de Casos de Uso

| Caso de Uso | Estado | Evidencia |
|---|---|---|
| **CU01: Postulación** | Implementado | Formulario funcional con almacenamiento persistente y generación de expediente. |
| **CU03: Puntaje** | Implementado | Algoritmo en `PostulacionController` que pondera las 4 dimensiones socioeconómicas. |
| **CU06: Validación QR** | Implementado | Validación en tiempo real de identidad, vigencia de beca y reserva horaria. |
| **CU13: Reportes** | Implementado | Módulo de reportes con exportación funcional y filtros por período académico. |

---

# 7. Implementación del Modelo de Datos

| Entidad / Tabla | Estado | Observaciones |
|---|---|---|
| `usuarios` | Completo | Soporta roles de sistema (Admin, Estudiante, Psicólogo, Administrativo). |
| `postulaciones` | Completo | Almacena puntajes, fundamentación y rutas de archivos JSON. |
| `entrevistas` | Completo | Gestiona la relación entre postulantes, horarios y resultados psicológicos. |
| `asistencias` | Completo | Registro transaccional de consumos por turno de servicio. |

---

# 8. Integración del Sistema

Se ha verificado la integración total entre:
-   **Interfaz y Lógica:** Los formularios React envían datos que son procesados y validados por Laravel.
-   **Base de Datos:** Persistencia correcta de tipos de datos complejos y relaciones.
-   **Archivos:** Los anexos subidos son almacenados de forma segura en `storage/app/public` y visualizados correctamente mediante el visualizador integrado.

---

# 9. Escenarios Funcionales

-   **Escenario A (Estudiante Foráneo):** Un estudiante postula indicando vivienda alquilada y alimentación deficiente. El sistema le otorga 40 puntos solo en esas dos categorías, colocándolo en el top del ranking de prioridad.
-   **Escenario B (Control de Acceso):** Un estudiante intenta ingresar al comedor fuera de su horario reservado o en un día no programado. El escáner emite una alerta visual roja y bloquea el registro.
-   **Escenario C (Justificación):** Un estudiante falta al comedor y envía su justificación vía FUT virtual. El administrativo aprueba la justificación, evitando la suspensión automática de la beca.

---

# 10. Problemas y Mejoras Identificadas

| Problema | Impacto | Solución |
|---|---|---|
| **Firma Digital Legible** | Bajo | Se añadió un botón de limpieza al canvas de firma para permitir re-intentos de trazo. |
| **Orden de Prioridad** | Medio | Se implementó un ranking basado en puntaje descendente en el panel de focalización para agilizar la selección de beneficiarios. |

---

# 11. Limitaciones del Sistema

1.  **Conectividad:** El escáner QR requiere latencia baja para la validación del becario contra la base de datos centralizada.
2.  **Validación Académica:** La verificación del PPA (Promedio Ponderado Acumulado) aún es manual, se planea integrar la API de servicios académicos en la versión 3.0.

---

# 12. Validación del Prototipo

- ✅ **Funcionalidad:** Todos los requisitos funcionales de alta prioridad (RF01-RF08) están operativos.
- ✅ **Flujo:** El flujo end-to-end (desde postulación hasta reporte) se ejecuta sin errores en el entorno de pruebas.
- ✅ **Coherencia:** El prototipo cumple estrictamente con el diseño técnico definido en el SDD 2 y los manuales de usuario de la UNAM.
