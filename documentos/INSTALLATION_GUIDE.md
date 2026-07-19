# Guía de Instalación y Configuración - SPGCU-UNAM

Esta guía detalla los pasos para poner en marcha el **Sistema Web de Postulación y Gestión del Comedor Universitario de la UNAM**.

## Requisitos Previos

- **PHP 8.1+** (con extensiones: bcmath, ctype, fileinfo, json, mbstring, openssl, pdo, tokenizer, xml, gd).
- **Composer** (Gestor de dependencias de PHP).
- **Node.js (18+) y NPM**.
- **MySQL 8.0+** o MariaDB.
- **Git**.

---

## Pasos de Instalación

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd spgcu_system
```

### 2. Instalar Dependencias de Backend (Laravel)
```bash
composer install
```

### 3. Instalar Dependencias de Frontend (React/Vite)
```bash
npm install
```

### 4. Configurar el Entorno
Copia el archivo de ejemplo y genera la clave de la aplicación:
```bash
cp .env.example .env
php artisan key:generate
```

Edita el archivo `.env` para configurar tu base de datos:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=spgcu_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 5. Preparar la Base de Datos
Crea la base de datos en MySQL y luego ejecuta las migraciones y seeders:
```bash
php artisan migrate --seed
```

### 6. Enlace de Almacenamiento
Para que las imágenes y PDFs subidos sean accesibles:
```bash
php artisan storage:link
```

---

## Ejecución del Proyecto

Para el desarrollo local, necesitas ejecutar dos servidores simultáneamente:

### Terminal 1: Backend Laravel
```bash
php artisan serve
```
El sistema estará disponible en `http://localhost:8000`.

### Terminal 2: Frontend Vite
```bash
npm run dev
```

---

## Credenciales de Prueba (Seeders)

Si ejecutaste el comando `migrate --seed`, puedes ingresar con:

- **Administrador:**
  - Correo: `admin@unam.edu.pe`
  - Contraseña: `password`

---

## Mantenimiento y Comandos Útiles

- **Limpiar Caché:** `php artisan optimize:clear`
- **Refrescar Base de Datos:** `php artisan migrate:fresh --seed`
- **Compilar para Producción:** `npm run build`
