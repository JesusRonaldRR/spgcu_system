# Seguridad y Almacenamiento (SPGCU-UNAM)

Este sistema implementa una arquitectura de seguridad de nivel bancario para la protección de datos sensibles de los estudiantes.

## 1. Cifrado de Archivos (AES-256)
Todos los documentos subidos (FUTs, DNI, Recibos, Firmas Digitales) pasan por un proceso de cifrado simétrico antes de ser almacenados en el disco o en la nube.

- **Algoritmo:** `AES-256-CBC`.
- **Clave:** Utiliza la `APP_KEY` de la aplicación.
- **Proceso:**
  - Al subir: El archivo se lee en memoria, se genera un IV aleatorio, se cifra y se guarda como `IV + ContenidoCifrado`.
  - Al leer: El sistema extrae el IV, descifra el contenido en tiempo real y lo entrega al navegador del personal autorizado.
- **Ventaja:** Incluso si el almacenamiento (S3/GCP) es vulnerado, los archivos son ilegibles sin la clave maestra del servidor.

## 2. Configuración de Object Storage (S3 Compatible)
Para producción, se recomienda usar un servicio de almacenamiento de objetos. El sistema está pre-configurado para el disco `encrypted_s3`.

### Variables de Entorno (.env)
Configura las siguientes variables para conectar con AWS S3, Google Cloud Storage o DigitalOcean Spaces:

```env
FILESYSTEM_DISK=encrypted_s3
AWS_ACCESS_KEY_ID=tu_key
AWS_SECRET_ACCESS_KEY=tu_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=nombre_del_bucket
AWS_ENDPOINT=https://storage.googleapis.com # Para GCP
AWS_USE_PATH_STYLE_ENDPOINT=true
```

## 3. Despliegue en Netlify (Limitaciones)
Netlify **NO** soporta aplicaciones Laravel Monolíticas de forma nativa porque requiere un entorno de ejecución PHP y base de datos persistente.

### Alternativas de Despliegue Sugeridas:
1. **Google Cloud Run (Recomendado):** Bajo costo, escalable y soporta contenedores Docker.
2. **Railway.app:** Muy fácil de configurar para Laravel.
3. **Heroku:** Opción clásica para apps PHP.
4. **DigitalOcean (App Platform o Droplet):** Excelente rendimiento.

*Si insiste en usar Netlify, deberá separar el proyecto: React en Netlify y Laravel en otro servidor, lo cual aumentará la complejidad de la comunicación Inertia.*
