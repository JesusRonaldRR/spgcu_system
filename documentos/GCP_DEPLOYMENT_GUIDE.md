# Guía de Despliegue en Google Cloud Platform (GCP) - SPGCU-UNAM

Para desplegar el sistema SPGCU-UNAM en Google Cloud, recomendamos usar **App Engine (Flexible Environment)** o **Cloud Run** con una base de datos **Cloud SQL (MySQL)**. Aquí tienes los pasos para **Cloud Run**, que es la opción más moderna y eficiente en costos.

## 1. Preparación del Proyecto en GCP
1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
2. Habilita las APIs: Cloud Run, Cloud SQL, Cloud Build, y Secret Manager.
3. Instala el [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) en tu máquina local.

## 2. Configuración de la Base de Datos (Cloud SQL)
1. Crea una instancia de **Cloud SQL para MySQL 8.0**.
2. Crea una base de datos llamada `spgcu_db`.
3. Crea un usuario y contraseña para la aplicación.
4. Anota el "Connection Name" de la instancia (ej. `proyecto-id:region:instancia`).

## 3. Preparar el Dockerfile
Laravel requiere un entorno PHP. Asegúrate de tener un `Dockerfile` en la raíz del proyecto. Si no lo tienes, aquí tienes uno básico:

```dockerfile
FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip nginx

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar el código
WORKDIR /var/www
COPY . .

# Instalar dependencias de PHP y JS
RUN composer install --no-dev --optimize-autoloader
# Nota: En producción, corre 'npm run build' localmente o en un step previo de Docker

# Configurar Nginx
COPY ./docker/nginx.conf /etc/nginx/sites-available/default

EXPOSE 8080
CMD ["sh", "-c", "php artisan migrate --force && nginx -g 'daemon off;'"]
```

## 4. Despliegue con un Solo Comando
Desde la terminal en la raíz de tu proyecto:

```bash
gcloud run deploy spgcu-unam \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="APP_ENV=production,APP_KEY=base64:..." \
  --set-env-vars="DB_CONNECTION=mysql,DB_HOST=127.0.0.1,DB_DATABASE=spgcu_db" \
  --set-env-vars="DB_USERNAME=tu_usuario,DB_PASSWORD=tu_password" \
  --add-cloudsql-instances="TU_CONNECTION_NAME"
```

## 5. Consideraciones Finales
* **APP_KEY**: Debes generar una llave única para producción (`php artisan key:generate --show`).
* **Almacenamiento**: Cloud Run es volátil. Para las fotos de los FUTs y firmas, debes usar **Google Cloud Storage** y configurar el driver de Laravel `spatie/laravel-google-cloud-storage`.
* **Migraciones**: El comando de despliegue incluye `php artisan migrate --force` para asegurar que las tablas se creen automáticamente.

Para más detalles, consulta la documentación oficial de [Laravel on Google Cloud](https://cloud.google.com/php/frameworks/laravel).
