# Configuración de Correo Electrónico (SMTP) - SPGCU-UNAM

Para que la recuperación de contraseña y el envío de notificaciones funcionen en producción, debes configurar un servidor de correo real en tu archivo `.env`.

## Opción 1: Gmail (Recomendado para pruebas/pequeña escala)
1. Entra a tu Cuenta de Google -> Seguridad.
2. Activa la "Verificación en 2 pasos".
3. Busca "Contraseñas de aplicaciones" y genera una nueva para "Correo".
4. Usa los siguientes datos en tu `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=tu-correo@gmail.com
MAIL_PASSWORD=tu-contraseña-de-aplicacion-de-16-digitos
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="tu-correo@gmail.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Opción 2: Outlook / Office 365
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=tu-correo@outlook.com
MAIL_PASSWORD=tu-contraseña
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="tu-correo@outlook.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Opción 3: Mailtrap (Recomendado para Desarrollo/Pruebas)
Si quieres probar que los correos se envían sin mandarlos a personas reales, usa [Mailtrap.io](https://mailtrap.io). El sistema ya viene pre-configurado con las credenciales de sandbox para facilitar las pruebas iniciales:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=53aed33c7538970931ccfce247da41c9
MAIL_PASSWORD=53aed33c7538970931ccfce247da41c9
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="no-reply@unam.edu.pe"
MAIL_FROM_NAME="Comedor UNAM"
```

---
### **¿Cómo probar que funciona?**
1. Ve a la pantalla de Login.
2. Haz clic en "¿Olvidaste tu contraseña?".
3. Ingresa tu correo registrado.
4. Si configuraste `MAIL_MAILER=log`, revisa el archivo `storage/logs/laravel.log` al final del todo; ahí verás el contenido del correo.
5. Si configuraste SMTP real, revisa tu bandeja de entrada (o SPAM).
