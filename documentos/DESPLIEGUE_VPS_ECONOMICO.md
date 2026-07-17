# Guía de Despliegue en VPS Económico (Sin Cloud SQL) - SPGCU-UNAM

Esta guía detalla cómo realizar un despliegue profesional, seguro y de bajo costo (entre $0 y $5 USD mensuales) utilizando una única instancia de **Servidor Privado Virtual (VPS)** en proveedores como DigitalOcean, Linode, Hetzner, o la capa gratuita de Google Compute Engine (e2-micro).

En lugar de pagar por servicios administrados costosos como Google Cloud SQL o AWS RDS, instalaremos y configuraremos **MySQL 8.0** de forma soberana dentro del propio servidor utilizando contenedores Docker.

---

## 1. Arquitectura del Despliegue

Utilizaremos **Docker Compose** para levantar tres servicios interconectados en una red privada segura:
1. **Contenedor Nginx (Web Server):** Recibe las peticiones HTTP/HTTPS y actúa como proxy inverso.
2. **Contenedor Laravel (App Server):** Contiene el código de la aplicación corriendo bajo PHP 8.1-FPM.
3. **Contenedor MySQL (Database Server):** Servidor de base de datos local que almacena los datos en un volumen persistente. *No está expuesto a internet, lo que garantiza máxima seguridad.*

---

## 2. Preparación del Servidor (VPS)

Una vez contratado tu VPS con sistema operativo **Ubuntu 22.04 LTS**, conéctate por SSH y ejecuta:

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker y Docker Compose
sudo apt install -y docker.io docker-compose

# Habilitar el servicio de Docker
sudo systemctl enable --now docker
```

---

## 3. Configuración de Archivos del Proyecto

Sube tu proyecto al servidor (vía Git o SFTP) y crea los siguientes archivos de configuración en la raíz:

### A. `docker-compose.yml`
```yaml
version: '3.8'

services:
  # Servidor de Aplicación (Laravel)
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    volumes:
      - ./storage:/var/www/storage
    env_file: .env
    depends_on:
      - mysql

  # Servidor Web (Nginx)
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./storage:/var/www/storage
    depends_on:
      - app

  # Servidor de Base de Datos (MySQL)
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: spgcu_db
      MYSQL_ROOT_PASSWORD: tu_password_seguro_db
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### B. Configuración de Base de Datos en el `.env` del Servidor
Debes apuntar el host de la base de datos al nombre del servicio en Docker (`mysql`):

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=spgcu_db
DB_USERNAME=root
DB_PASSWORD=tu_password_seguro_db
```

---

## 4. Despliegue con un Solo Comando

Para compilar las imágenes e iniciar todos los servicios en segundo plano, ejecuta:

```bash
docker-compose up -d --build
```

### Comandos Útiles de Administración:

- **Ver el estado de los contenedores:**
  ```bash
  docker-compose ps
  ```

- **Ver los logs de la base de datos o aplicación:**
  ```bash
  docker-compose logs -f mysql
  docker-compose logs -f app
  ```

- **Ejecutar migraciones y seeders dentro de la app:**
  ```bash
  docker-compose exec app php artisan migrate --seed
  ```

---

## 5. Copias de Seguridad Automáticas (Backups)

Para respaldar tu base de datos de manera local y gratuita sin depender de herramientas de pago, puedes programar un script en el cron del sistema:

1. Crea el script de backup: `nano ~/backup_db.sh`
```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR
FILENAME="$BACKUP_DIR/spgcu_backup_$(date +%F_%H%M%S).sql"

# Exportar datos usando mysqldump dentro de Docker
docker-compose exec -T mysql mysqldump -u root -ptu_password_seguro_db spgcu_db > $FILENAME

# Opcional: Borrar backups con más de 15 días de antigüedad
find $BACKUP_DIR -type f -mtime +15 -delete
```

2. Hazlo ejecutable:
```bash
chmod +x ~/backup_db.sh
```

3. Agrégalo al Cron para que se ejecute todos los días a las 02:00 AM:
```bash
crontab -e
# Agregar la línea:
0 2 * * * /home/ubuntu/backup_db.sh
```

---

## 6. Ventajas de este Enfoque

- **Costo Fijo Mínimo:** Solo pagas la renta mensual del VPS (desde $4 a $5 USD/mes).
- **Independencia del Proveedor:** Puedes mudar este Docker Compose a cualquier servidor del mundo en minutos.
- **Seguridad:** Al estar en una red Docker interna, la base de datos es totalmente inmune a ataques de fuerza bruta externos por puerto 3306.
