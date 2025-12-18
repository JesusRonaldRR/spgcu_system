# 🎓 SPGCU - Sistema de Procesamiento de Gestión y Comedor Universitario

![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Bash](https://img.shields.io/badge/Bash-Automation-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white)

El **SPGCU** es una plataforma integral diseñada para la gestión académica y operativa del comedor universitario. El sistema automatiza desde la convocatoria de becas y postulaciones hasta el procesamiento analítico de datos mediante módulos de ETL.

---

## 🚀 Módulos Principales

### 📋 Gestión de Becas y Postulaciones
- **Formulario FUT Digital**: Captura de datos socioeconómicos, carga de documentos (PDF/Imágenes) y firma digital en canvas.
- **Evaluación Administrativa**: Panel para aprobar, rechazar o derivar postulaciones a entrevistas.
- **Gestión de Convocatorias**: Control de fechas y requisitos por periodo académico.

### 🧠 Módulo de Entrevistas
- **Citas Psicológicas**: Sistema de reserva de horarios para estudiantes aptos.
- **Evaluación de Resultados**: Registro y seguimiento de entrevistas por el personal de Bienestar Universitario.

### 🍔 Comedor Universitario (Becarios)
- **Generación de QR**: Credenciales dinámicas para el control de acceso al comedor.
- **Control de Asistencias**: Registro en tiempo real de servicios utilizados por los becarios.

### 📊 Análisis de Datos (ETL & Reporting)
- **Proceso ETL Automatizado**: Extracción y transformación de datos para reportes de rendimiento académico y deudores.
- **Dashboard de Reportes**: Visualización web de logs de ejecución y estadísticas clave.

---

## 🛠️ Stack Tecnológico

- **Backend**: PHP 8.1+, Laravel 10.x (Inertia.js + React/Vue).
- **Frontend**: Tailwind CSS, Vite.
- **Base de Datos**: MySQL / MariaDB.
- **Procesamiento de Datos**: Python 3 (Pandas, SQLAlchemy).
- **Automatización**: Bash Scripting + Cron (Linux).

---

## ⚙️ Instalación y Configuración

### 1. Requisitos del Sistema
- PHP 8.1+ y Composer.
- MySQL 8.0+ / MariaDB 10.4+.
- Node.js & NPM.
- Python 3.9+ (para el módulo ETL).

### 2. Configuración del Proyecto Laravel
```bash
# Instalar dependencias
composer install
npm install

# Configurar variables de entorno
cp .env.example .env
php artisan key:generate

# Configurar la base de datos en .env y correr migraciones
php artisan migrate --seed

# Compilar assets
npm run dev
```

### 3. Configuración del Módulo ETL (Ubuntu Server)
```bash
# Ubicar la carpeta etl
cd ~/etl

# Ejecutar el script de automatización para configurar el entorno
chmod +x run_etl.bash
./run_etl.bash
```

### 4. Automatización de Tareas (Cron)
Para programar la generación diaria de reportes a la medianoche:
```bash
crontab -e
# Agregar la siguiente línea:
0 0 * * * /home/vm1/etl/run_etl.bash
```

---

## 📈 Verificación de Datos
El sistema incluye scripts SQL para validación manual:
- `verify_etl.sql`: Consulta los logs y resultados del procesamiento.
- `generate_data.sql`: Genera datos de prueba para simular deudores y rendimiento.

---

## ✒️ Créditos
**Universidad Nacional de Moquegua**  
Facultad de Ingeniería - Escuela Profesional de Ingeniería de Sistemas e Informática.  
*Curso: Analisis y diseño de sistemas*  
*Docente: Ing. Honorio Apaza Alanoca *

Moquegua - Perú | 2025

