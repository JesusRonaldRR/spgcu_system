# Guía Paso a Paso para Despliegue en Google Cloud (GCP) desde Cero

Esta guía te llevará de la mano para poner tu sistema en internet usando **Cloud Run** y **Cloud SQL**.

## Paso 1: Configuración de la Cuenta de Google Cloud
1. Entra a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un **Nuevo Proyecto** y ponle un nombre (ej. `spgcu-unam-2026`).
3. Activa la **Facturación** (GCP requiere una tarjeta, aunque el uso inicial suele entrar en la capa gratuita).

## Paso 2: Habilitar las APIs Necesarias
En el buscador superior de la consola, busca y habilita estas 4 APIs:
*   Cloud Run API
*   Cloud SQL Admin API
*   Cloud Build API
*   Artifact Registry API

## Paso 3: Crear la Base de Datos (Cloud SQL)
1. Ve a **SQL** en el menú lateral.
2. Haz clic en **Crear Instancia** -> **MySQL**.
3. Elige **MySQL 8.0**.
4. Pon un ID de instancia (ej. `db-comedor`) y una **contraseña de root** (guárdala bien).
5. En la sección de "Configuración", elige **Shared Core** (la más barata, ~ $10 USD/mes) para empezar.
6. Una vez creada, entra a la instancia y ve a la pestaña **Bases de datos** -> **Crear base de datos** llamada `spgcu_db`.

## Paso 4: Subir el Código a GitHub
Es la forma más fácil de desplegar.
1. Sube tu proyecto a un repositorio privado en GitHub.

## Paso 5: Desplegar en Cloud Run
1. Ve a **Cloud Run** -> **Crear Servicio**.
2. Selecciona **Desplegar continuamente desde un repositorio**.
3. Haz clic en **Configurar con Cloud Build**.
4. Selecciona tu repositorio de GitHub y la rama `main`.
5. En tipo de compilación, elige **Dockerfile**.
6. En la sección "Variables de entorno", agrega las siguientes (Copiadas de tu `.env` pero para producción):
    *   `APP_ENV`: `production`
    *   `APP_KEY`: Tu llave generada (ej. `base64:xxx...`)
    *   `DB_CONNECTION`: `mysql`
    *   `DB_HOST`: `127.0.0.1` (Se conectará via socket)
    *   `DB_DATABASE`: `spgcu_db`
    *   `DB_USERNAME`: `root`
    *   `DB_PASSWORD`: Tu contraseña de root de Cloud SQL.
7. En la pestaña **Conexiones**, haz clic en **Agregar Instancia** y selecciona tu instancia de Cloud SQL creada en el Paso 3.
8. Haz clic en **Crear**.

## Paso 6: Generar la Llave Maestra
Si no tienes una `APP_KEY` para producción, ejecútalo en tu PC:
```bash
php artisan key:generate --show
```
Copia ese resultado y ponlo en las variables de entorno de Cloud Run.

## Paso 7: Finalización
Google Cloud te dará una URL (ej. `https://spgcu-xxx.a.run.app`). Entra y el sistema debería estar funcionando. El `startup.sh` que configuré se encargará de ejecutar las migraciones automáticamente.

---
**IMPORTANTE:** Para que las imágenes de firmas y FUTs persistan para siempre, Laravel debe configurarse para usar **Google Cloud Storage** en lugar del disco local, ya que Cloud Run borra los archivos temporales cada vez que se reinicia.
