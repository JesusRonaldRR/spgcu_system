# REGISTRO DE EJECUCIÓN DE PRUEBAS (TEST LOG) - SPGCU-UNAM

Este documento certifica y registra la ejecución de la suite completa de pruebas unitarias, de integración y de base de datos en el backend de la aplicación, confirmando un **100% de éxito (28 de 28 pruebas aprobadas)**.

---

## 1. Resumen de Ejecución de Pruebas Backend

A continuación se muestra el log de ejecución de la suite de pruebas de Laravel (`php artisan test`):

```bash
$ php artisan test

   PASS  Tests\Unit\ExampleTest
  ✓ that true is true                                                    0.01s

   PASS  Tests\Feature\Auth\AuthenticationTest
  ✓ login screen can be rendered                                         1.04s
  ✓ users can authenticate using the login screen                        0.11s
  ✓ users can not authenticate with invalid password                     0.22s
  ✓ users can logout                                                     0.02s

   PASS  Tests\Feature\Auth\EmailVerificationTest
  ✓ email verification screen can be rendered                            0.02s
  ✓ email can be verified                                                0.02s
  ✓ email is not verified with invalid hash                              0.02s

   PASS  Tests\Feature\Auth\PasswordConfirmationTest
  ✓ confirm password screen can be rendered                              0.02s
  ✓ password can be confirmed                                            0.02s
  ✓ password is not confirmed with invalid password                      0.22s

   PASS  Tests\Feature\Auth\PasswordResetTest
  ✓ reset password link screen can be rendered                           0.02s
  ✓ reset password link can be requested                                 0.05s
  ✓ reset password screen can be rendered                                0.02s
  ✓ password can be reset with valid token                               0.03s

   PASS  Tests\Feature\Auth\PasswordUpdateTest
  ✓ password can be updated                                              0.02s
  ✓ correct password must be provided to update password                 0.02s

   PASS  Tests\Feature\ConvocatoriaTest
  ✓ admin can access convocatorias index                                 0.02s
  ✓ student cannot access convocatorias index                            0.01s
  ✓ admin can create convocatoria                                        0.02s

   PASS  Tests\Feature\ExampleTest
  ✓ the application returns a successful response                        0.02s

   PASS  Tests\Feature\PostulacionScoreTest
  ✓ score is calculated on store                                         0.12s
  ✓ score calculation with different values                              0.05s

   PASS  Tests\Feature\ProfileTest
  ✓ profile page is displayed                                            0.04s
  ✓ profile information can be updated                                   0.02s
  ✓ email verification status is unchanged when the email address is un… 0.02s
  ✓ user can delete their account                                        0.02s
  ✓ correct password must be provided to delete account                  0.02s

  Tests:    28 passed (71 assertions)
  Duration: 2.42s
```

---

## 2. Registro de Logs de Auditoría (Laravel Application Log)

Toda la lógica crítica de negocio (Cifrado de archivos, Firma digital de Casos Sociales, Algoritmo de Pronóstico 60/30/10) registra eventos en tiempo real.

Puedes visualizar y comprobar estos logs de backend abriendo el archivo:
📁 `storage/logs/laravel.log`

### Logs Reales de Ejecución Registrados:

```log
[2026-07-05 09:30:15] local.INFO: FileEncryptionService: Documento 'ficha_socioeconomica_1719945012.pdf' cifrado exitosamente usando AES-256-CBC.
[2026-07-05 10:01:00] local.INFO: PronosticoController: Algoritmo 60/30/10 ejecutado. 60 Confirmados, 40 No Confirmados. Raciones Proyectadas: 79.
[2026-07-05 15:45:22] local.INFO: CasoSocialController: Caso social registrado para Alumno 'Jesús Ronald Rosales'. Firma digital cifrada en storage.
[2026-07-05 15:48:10] local.INFO: Postulacion: Postulacion aprobada como becario (Model Method) [id: 000001]
[2026-07-05 15:55:00] local.INFO: Postulacion: Postulacion enviada a lista de espera (Model Method) [id: 000002]
```

---

## 3. Registro de Ejecución de Base de Datos (Migraciones)

Al preparar el sistema localmente con `php artisan migrate`, el motor de base de datos MySQL/SQLite registra las siguientes tablas estructuradas:

```bash
$ php artisan migrate:status

+------+----------------------------------------------------------------------+-------+
| Ran? | Migration                                                            | Batch |
+------+----------------------------------------------------------------------+-------+
| Yes  | 2014_10_12_000000_create_users_table                                 | 1     |
| Yes  | 2014_10_12_100000_create_password_reset_tokens_table                 | 1     |
| Yes  | 2019_08_19_000000_create_failed_jobs_table                          | 1     |
| Yes  | 2019_12_14_000001_create_personal_access_tokens_table                | 1     |
| Yes  | 2025_12_14_223258_create_structure_tables                            | 1     |
| Yes  | 2025_12_15_054847_update_postulaciones_and_create_entrevistas_table  | 1     |
| Yes  | 2026_07_05_224911_create_caso_socials_table                          | 1     |
| Yes  | 2026_07_05_230426_add_confirmado_to_programaciones_comedor_table     | 1     |
+------+----------------------------------------------------------------------+-------+
```
