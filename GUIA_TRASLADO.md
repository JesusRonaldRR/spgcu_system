# 📦 Guía de Traslado del Sistema SPGCU

Esta guía te permitirá mover el sistema SPGCU (Sistema de Gestión del Comedor Universitario) a otra computadora.

---

## 📋 Requisitos Previos en la Nueva Computadora

Antes de trasladar, asegúrate de tener instalado:

| Software | Versión Mínima | Descargar |
|----------|---------------|-----------|
| **PHP** | 8.1+ | [php.net](https://windows.php.net/download/) |
| **Composer** | 2.x | [getcomposer.org](https://getcomposer.org/download/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **MySQL** | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/installer/) |
| **Git** (opcional) | - | [git-scm.com](https://git-scm.com/) |

### Verificar Instalaciones

Abre PowerShell y ejecuta:

```powershell
php -v
composer -V
node -v
npm -v
mysql --version
```

---

## 📁 Paso 1: Copiar los Archivos del Proyecto

### Archivos a COPIAR ✅

Copia **toda la carpeta** `spgcu_system` **EXCEPTO** las siguientes:

| Carpeta/Archivo | Razón |
|-----------------|-------|
| `node_modules/` | Se regenera con `npm install` |
| `vendor/` | Se regenera con `composer install` |

### Método Recomendado

**Opción A - ZIP (más fácil):**
1. Elimina las carpetas `node_modules` y `vendor` temporalmente
2. Comprime la carpeta `spgcu_system` en un ZIP
3. Transfiere el ZIP a la nueva computadora (USB, nube, etc.)
4. Descomprime en la ubicación deseada

**Opción B - Git (si está versionado):**
```powershell
git clone [URL_DEL_REPOSITORIO]
```

---

## 💾 Paso 2: Exportar la Base de Datos

### En la computadora ACTUAL

Abre CMD o PowerShell y ejecuta:

```powershell
mysqldump -u root -p spgcu_db > spgcu_backup.sql
```

> **Nota:** Reemplaza `spgcu_db` con el nombre real de tu base de datos y `root` con tu usuario de MySQL.

El archivo `spgcu_backup.sql` contiene toda la estructura y datos. Cópialo junto con el proyecto.

---

## 🔧 Paso 3: Configurar en la Nueva Computadora

### 3.1 Navegar al proyecto

```powershell
cd "C:\ruta\donde\colocaste\spgcu_system"
```

### 3.2 Instalar dependencias de PHP

```powershell
composer install
```

### 3.3 Instalar dependencias de Node.js

```powershell
npm install
```

### 3.4 Configurar el archivo .env

1. Copia `.env.example` a `.env`:
   ```powershell
   copy .env.example .env
   ```

2. Edita `.env` con tu editor preferido y configura:
   ```env
   APP_NAME="SPGCU System"
   APP_ENV=local
   APP_DEBUG=true
   APP_URL=http://127.0.0.1:8000

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=spgcu_db
   DB_USERNAME=root
   DB_PASSWORD=tu_password_aqui
   ```

### 3.5 Generar clave de aplicación

```powershell
php artisan key:generate
```

---

## 🗄️ Paso 4: Restaurar la Base de Datos

### 4.1 Crear la base de datos

Abre MySQL:
```powershell
mysql -u root -p
```

Dentro de MySQL:
```sql
CREATE DATABASE spgcu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4.2 Importar el backup

```powershell
mysql -u root -p spgcu_db < spgcu_backup.sql
```

---

## 🚀 Paso 5: Iniciar el Sistema

### Opción A - Script automático

Edita `start_system.bat` y actualiza la ruta en la línea 3:
```batch
cd /d "C:\tu\nueva\ruta\spgcu_system"
```

Luego ejecuta:
```powershell
.\start_system.bat
```

### Opción B - Manual

Abre **dos terminales** PowerShell:

**Terminal 1 - Laravel:**
```powershell
cd "C:\ruta\spgcu_system"
php artisan serve --host=127.0.0.1 --port=8000
```

**Terminal 2 - Vite:**
```powershell
cd "C:\ruta\spgcu_system"
npm run dev
```

### 5.3 Acceder al sistema

Abre tu navegador en: **http://127.0.0.1:8000**

---

## ✅ Verificación Post-Traslado

| Verificar | Comando/Acción |
|-----------|----------------|
| Conexión a BD | `php artisan migrate:status` |
| Caché limpio | `php artisan config:clear && php artisan cache:clear` |
| Login funciona | Probar con un usuario existente |
| QR Scanner | Probar escaneo de códigos |

---

## 🔥 Solución de Problemas Comunes

### Error: "No application encryption key"
```powershell
php artisan key:generate
```

### Error de conexión a base de datos
- Verifica que MySQL esté corriendo
- Confirma credenciales en `.env`
- Prueba conexión: `php artisan db:show`

### Assets no cargan (CSS/JS)
```powershell
npm run build
# O para desarrollo:
npm run dev
```

### Permisos de carpetas
```powershell
php artisan storage:link
```

---

## 📌 Resumen de Comandos

```powershell
# En la nueva computadora, dentro de la carpeta del proyecto:
composer install
npm install
copy .env.example .env
# (Editar .env con credenciales)
php artisan key:generate
php artisan storage:link
php artisan migrate:status  # Verificar conexión
.\start_system.bat  # Iniciar
```

---

**¿Necesitas ayuda adicional?** Consulta el archivo `README.md` del proyecto.
