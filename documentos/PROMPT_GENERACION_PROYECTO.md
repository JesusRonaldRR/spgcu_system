# PROMPT DE GENERACIÓN DE PROYECTO: SPGCU-UNAM

Utiliza la siguiente especificación detallada para generar o reconstruir el **Sistema Web de Postulación y Gestión del Comedor Universitario de la UNAM (SPGCU-UNAM)**.

---

## 1. Visión General y Propósito
El sistema está diseñado para automatizar el ciclo completo de bienestar universitario en la Universidad Nacional de Moquegua (UNAM), desde la postulación socioeconómica hasta el control de asistencia diario en el comedor mediante códigos QR. El objetivo principal es la **Focalización Efectiva** de recursos y la **Reducción de Mermas** en cocina.

## 2. Stack Tecnológico (VILT Stack)
- **Backend:** Laravel 10+ (PHP 8.2).
- **Frontend:** React 18 con Inertia.js (SPA sin API REST tradicional).
- **Estilos:** Tailwind CSS (Diseño Responsivo e Institucional).
- **Build Tool:** Vite.
- **Base de Datos:** MySQL 8.0 (12+ tablas normalizadas).
- **Contenedores:** Docker (PHP-FPM + Nginx + MySQL).

## 3. Reglas de Negocio Críticas
- **Identidad Universitaria:** Los códigos de estudiante siguen el patrón `[Año][CódigoRol:2040][CorrelativoAnual]` (ej. 20262040001).
- **Algoritmo de Focalización (Max 80 pts):**
  - Vivienda (Quinta/Choza: 20, Alquilada: 15, Cedida: 10, Propia: 5).
  - Salud (Crónica: 20, Frecuente: 15, Estable: 10, Buena: 5).
  - Alimentación (Deficiente <2 comidas: 20, Irregular: 15, Completa: 10).
  - Dependencia (Total: 20, Parcial: 15, Independiente: 10).
- **Algoritmo de Pronóstico (60/30/10):**
  - Demanda = (100% Confirmados) + (30% No Confirmados Históricos) + (10% Buffer de Seguridad).
- **Gestión de Faltas:**
  - El sistema marca inasistencias automáticamente tras el cierre de cada turno.
  - Al acumular 3 faltas injustificadas, el beneficio se suspende automáticamente.
- **Auto-Suscripción:** Al ser declarado "Becario", el sistema inscribe automáticamente al alumno en todos los menús futuros, permitiéndole desmarcarse si no asistirá.

## 4. Módulos Implementados
- **M1: Autenticación & Perfil:** Login/Registro/Recuperación. Perfil con campos de identidad bloqueados y campos de contacto editables.
- **M2: Mesa de Partes Virtual (FUT):** Postulación con carga de 5 PDFs obligatorios, firma digital en canvas y anexos para casos especiales (orfandad, foráneo, etc.).
- **M3: Gestión de Beneficiarios:** Ranking dinámico por puntaje, gestión de estados (Pendiente -> Apto -> Becario).
- **M4: Asistencia QR:** Generación de QR único por becario. Escáner web con identificación visual de nombre y validación de turnos (Desayuno/Almuerzo/Cena).
- **M5: Casos Sociales:** Registro de acceso temporal para vulnerabilidades extremas con firma de aprobación del Jefe de Bienestar.
- **M6: Planificación de Menús:** Calendario interactivo para programar raciones semanales.
- **M7: Reportes Analíticos:** Exportación en Excel/PDF de focalización y asistencia diaria.

## 5. Diseño e Interfaz (UI/UX)
- **Colores Institucionales:** Azul UNAM (`#0f4c9b`, `#1e3a5f`), Blanco, Gris suave.
- **Sidebar:** Navegación por iconos grandes con estados activos.
- **Dashboard:** Widgets de resumen para cada rol (Admin, Cocina, Estudiante).
- **Móvil:** Totalmente optimizado para tablets (cocina) y smartphones (estudiantes).

## 6. Guía de Despliegue (GCP)
- Utilizar **Google Cloud Run** para el servidor web.
- **Google Cloud SQL** (MySQL) para persistencia.
- Configurar variables de entorno (APP_KEY, DB_SOCKET) y habilitar APIs de Cloud Build y Artifact Registry.
