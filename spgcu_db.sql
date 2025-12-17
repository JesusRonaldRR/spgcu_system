-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para spgcu_system
CREATE DATABASE IF NOT EXISTS `spgcu_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `spgcu_system`;

-- Volcando estructura para tabla spgcu_system.asistencias
CREATE TABLE IF NOT EXISTS `asistencias` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `fecha_hora_escaneo` datetime NOT NULL,
  `tipo_menu` enum('desayuno','almuerzo','cena') COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('presente','tarde','rechazado') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asistencias_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `asistencias_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.asistencias: ~3 rows (aproximadamente)
DELETE FROM `asistencias`;
INSERT INTO `asistencias` (`id`, `usuario_id`, `fecha_hora_escaneo`, `tipo_menu`, `estado`, `created_at`, `updated_at`) VALUES
	(2, 4, '2025-12-16 22:42:13', 'almuerzo', 'presente', '2025-12-17 03:42:13', '2025-12-17 03:42:13'),
	(3, 4, '2025-12-16 22:44:00', 'desayuno', 'presente', '2025-12-17 03:44:00', '2025-12-17 03:44:00'),
	(6, 4, '2025-12-16 18:19:43', 'cena', 'presente', '2025-12-16 23:19:43', '2025-12-16 23:19:43');

-- Volcando estructura para tabla spgcu_system.cita_servicios
CREATE TABLE IF NOT EXISTS `cita_servicios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `servicio` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modalidad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` enum('solicitado','programada','completada','cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'solicitado',
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cita_servicios_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `cita_servicios_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.cita_servicios: ~1 rows (aproximadamente)
DELETE FROM `cita_servicios`;
INSERT INTO `cita_servicios` (`id`, `usuario_id`, `servicio`, `modalidad`, `fecha`, `hora`, `estado`, `motivo`, `admin_notes`, `created_at`, `updated_at`) VALUES
	(1, 4, 'Asesoría Nutricional', 'Presencial', '2025-12-20', '17:40:00', 'completada', '4333', NULL, '2025-12-17 03:37:33', '2025-12-17 03:38:22');

-- Volcando estructura para tabla spgcu_system.convocatorias
CREATE TABLE IF NOT EXISTS `convocatorias` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `esta_activa` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.convocatorias: ~1 rows (aproximadamente)
DELETE FROM `convocatorias`;
INSERT INTO `convocatorias` (`id`, `nombre`, `fecha_inicio`, `fecha_fin`, `esta_activa`, `created_at`, `updated_at`) VALUES
	(1, 'Convocatoria Comedor 2025-I', '2025-12-15', '2030-12-31', 1, '2025-12-17 03:16:45', '2025-12-17 03:16:45');

-- Volcando estructura para tabla spgcu_system.entrevistas
CREATE TABLE IF NOT EXISTS `entrevistas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `postulacion_id` bigint unsigned NOT NULL,
  `psicologo_id` bigint unsigned DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `lugar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Consultorio Psicológico UNAM',
  `tipo` enum('presencial','virtual') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'presencial',
  `link_reunion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('pendiente','programada','completada','no_asistio') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `resultado` enum('apto','no_apto') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entrevistas_postulacion_id_foreign` (`postulacion_id`),
  KEY `entrevistas_psicologo_id_foreign` (`psicologo_id`),
  CONSTRAINT `entrevistas_postulacion_id_foreign` FOREIGN KEY (`postulacion_id`) REFERENCES `postulaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `entrevistas_psicologo_id_foreign` FOREIGN KEY (`psicologo_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.entrevistas: ~2 rows (aproximadamente)
DELETE FROM `entrevistas`;
INSERT INTO `entrevistas` (`id`, `postulacion_id`, `psicologo_id`, `fecha`, `hora`, `lugar`, `tipo`, `link_reunion`, `estado`, `resultado`, `observaciones`, `created_at`, `updated_at`) VALUES
	(1, 3, 2, '2025-12-19', '03:32:00', 'Consultorio Bienestar Universitario', 'presencial', NULL, 'completada', 'apto', '23323223', '2025-12-17 03:36:43', '2025-12-17 03:37:10'),
	(2, 4, 2, '2025-12-17', '21:02:00', 'Consultorio Bienestar Universitario', 'presencial', NULL, 'completada', 'apto', 'ssa', '2025-12-17 04:01:00', '2025-12-17 04:01:11');

-- Volcando estructura para tabla spgcu_system.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.failed_jobs: ~0 rows (aproximadamente)
DELETE FROM `failed_jobs`;

-- Volcando estructura para tabla spgcu_system.justificaciones
CREATE TABLE IF NOT EXISTS `justificaciones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `fecha_a_justificar` date NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruta_archivo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('pendiente','aprobado','rechazado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `justificaciones_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `justificaciones_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.justificaciones: ~1 rows (aproximadamente)
DELETE FROM `justificaciones`;
INSERT INTO `justificaciones` (`id`, `usuario_id`, `fecha_a_justificar`, `motivo`, `ruta_archivo`, `estado`, `created_at`, `updated_at`) VALUES
	(1, 4, '2025-12-17', 'dsdsas', 'justificaciones/D7mguTBQMKUu3p4lvC1k08WDdmh20NaHMGpnsrm1.pdf', 'rechazado', '2025-12-17 03:47:39', '2025-12-17 03:48:16');

-- Volcando estructura para tabla spgcu_system.menus
CREATE TABLE IF NOT EXISTS `menus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `tipo` enum('desayuno','almuerzo','cena') COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora_inicio` time NOT NULL DEFAULT '07:00:00',
  `hora_fin` time NOT NULL DEFAULT '09:00:00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `menus_fecha_tipo_unique` (`fecha`,`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.menus: ~2 rows (aproximadamente)
DELETE FROM `menus`;
INSERT INTO `menus` (`id`, `fecha`, `tipo`, `descripcion`, `hora_inicio`, `hora_fin`, `created_at`, `updated_at`) VALUES
	(6, '2025-12-16', 'almuerzo', 'saadssa', '18:00:00', '18:09:00', '2025-12-17 04:01:49', '2025-12-16 23:13:28'),
	(7, '2025-12-16', 'cena', 'assa', '18:00:00', '20:00:00', '2025-12-17 04:09:09', '2025-12-17 04:11:19');

-- Volcando estructura para tabla spgcu_system.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.migrations: ~13 rows (aproximadamente)
DELETE FROM `migrations`;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2014_10_12_000000_create_users_table', 1),
	(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
	(3, '2019_08_19_000000_create_failed_jobs_table', 1),
	(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(5, '2025_12_14_223258_create_structure_tables', 1),
	(6, '2025_12_14_233000_add_profile_fields_to_usuarios_table', 1),
	(7, '2025_12_15_054847_update_postulaciones_and_create_entrevistas_table', 1),
	(8, '2025_12_15_204508_add_virtual_fields_to_entrevistas_table', 1),
	(9, '2025_12_15_215549_create_menus_table', 1),
	(10, '2025_12_16_030538_create_cita_servicios_table', 1),
	(11, '2025_12_16_032723_add_modalidad_to_cita_servicios_table', 1),
	(12, '2025_12_16_044642_add_academic_fields_to_usuarios_table', 1),
	(13, '2025_12_16_051113_create_programaciones_comedor_table', 1);

-- Volcando estructura para tabla spgcu_system.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.password_reset_tokens: ~0 rows (aproximadamente)
DELETE FROM `password_reset_tokens`;

-- Volcando estructura para tabla spgcu_system.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.personal_access_tokens: ~0 rows (aproximadamente)
DELETE FROM `personal_access_tokens`;

-- Volcando estructura para tabla spgcu_system.postulaciones
CREATE TABLE IF NOT EXISTS `postulaciones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `convocatoria_id` bigint unsigned NOT NULL,
  `ingreso_familiar` decimal(10,2) NOT NULL,
  `numero_miembros` int NOT NULL,
  `condicion_vivienda` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruta_archivos` json DEFAULT NULL,
  `puntaje` int NOT NULL DEFAULT '0',
  `estado` enum('pendiente','aprobado','rechazado','apto_entrevista','entrevista_programada','becario') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `hash_qr` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `postulaciones_hash_qr_unique` (`hash_qr`),
  KEY `postulaciones_usuario_id_foreign` (`usuario_id`),
  KEY `postulaciones_convocatoria_id_foreign` (`convocatoria_id`),
  CONSTRAINT `postulaciones_convocatoria_id_foreign` FOREIGN KEY (`convocatoria_id`) REFERENCES `convocatorias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `postulaciones_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.postulaciones: ~5 rows (aproximadamente)
DELETE FROM `postulaciones`;
INSERT INTO `postulaciones` (`id`, `usuario_id`, `convocatoria_id`, `ingreso_familiar`, `numero_miembros`, `condicion_vivienda`, `ruta_archivos`, `puntaje`, `estado`, `hash_qr`, `created_at`, `updated_at`) VALUES
	(1, 4, 1, 233232.00, 2323, 'propia', '"{\\"ficha_socioeconomica\\":\\"postulaciones\\\\/fichas\\\\/qgsYPY1JvzfjUejGx4ixiDQlA8FLvlwg6o2X42l2.pdf\\",\\"boletas_pago\\":\\"postulaciones\\\\/boletas\\\\/cmGXhJVqL7AqvTfdON9KTwvhqeaNoB1LeQba60b5.pdf\\",\\"recibo_luz\\":\\"postulaciones\\\\/recibos\\\\/ZkFhMeEVuwfdZ62LFxy49490QTjzCKUsilk6K3R4.pdf\\",\\"croquis\\":\\"postulaciones\\\\/croquis\\\\/Y53q6vYCbCft9bmMawDFgi1yJkFLYQNeTIxcJr3g.pdf\\",\\"dj_pronabec\\":\\"postulaciones\\\\/dj\\\\/1QWnvPC2jsNvhVG1rfwHX3DzBF7zjrm39ShJAcC2.pdf\\",\\"firma_digital\\":\\"postulaciones\\\\/firmas\\\\/kKUc0jSNvB2n7rZAOquHX2TuOUa7XzOm2nxg27Q2.jpg\\",\\"especificos\\":[{\\"tipo\\":\\"INDEPENDIENTE\\",\\"path\\":\\"postulaciones\\\\/especificos\\\\/U6Cfk0dmhp6PnnmFpd2EwllTP3V9RB38p73CFSGW.pdf\\"}]}"', 0, 'rechazado', 'EVGYGnU9W6CTMJXe8OjWb4eMKcd6X1hPvYHXGgTE', '2025-12-17 03:26:33', '2025-12-16 23:21:14'),
	(2, 4, 1, 34334.00, 334343, 'propia', '"{\\"ficha_socioeconomica\\":\\"postulaciones\\\\/fichas\\\\/PbJ9heKTIDq1vs6DuMxQ2Webz9nM98onyiqLR4oB.pdf\\",\\"boletas_pago\\":\\"postulaciones\\\\/boletas\\\\/J0MpAZYGO1Q8NnJlY2jed6QB84lBIZUcC2k1p4Qt.pdf\\",\\"recibo_luz\\":\\"postulaciones\\\\/recibos\\\\/m6C4RBl6LiMq2IWnlStxPh86Urs2n8IerKtYvrYI.pdf\\",\\"croquis\\":\\"postulaciones\\\\/croquis\\\\/VtRJ2p4l61j3BHwLu5UtBvEtUmdgLJvIyuXhsjd4.pdf\\",\\"dj_pronabec\\":\\"postulaciones\\\\/dj\\\\/RCvWl1Yzfn9CZeHBKf7VVkMQ1dWtCEZzn1TmmbXv.pdf\\",\\"firma_digital\\":\\"postulaciones\\\\/firmas\\\\/PemJBvIo3s2cSbNFmB4KJmAsxePAk5ytPNS4Pjx2.jpg\\",\\"especificos\\":[{\\"tipo\\":\\"CARGA_FAMILIAR\\",\\"path\\":\\"postulaciones\\\\/especificos\\\\/cwycC5wm3gaPRd61oRFxMAMoQBlHjotYpvRoPqAQ.pdf\\"}]}"', 0, 'rechazado', NULL, '2025-12-17 03:31:34', '2025-12-17 03:34:40'),
	(3, 4, 1, 11233.00, 23, 'propia', '"{\\"ficha_socioeconomica\\":\\"postulaciones\\\\/fichas\\\\/a6nF8mHOafvUTIcX6zLeu3bydaiCExRNklxcpU4y.pdf\\",\\"boletas_pago\\":\\"postulaciones\\\\/boletas\\\\/oGSqgni2yJJJJbxNuWuTI4xW3u4NfzLMbnD43YHp.pdf\\",\\"recibo_luz\\":\\"postulaciones\\\\/recibos\\\\/DrCADUWhWRhA9El3YyrnGID5ZLYF1fLsL1jaPygy.pdf\\",\\"croquis\\":\\"postulaciones\\\\/croquis\\\\/RTX6XJwgrDi8xIs61qpKszQV1bkZovM3iiet36XG.pdf\\",\\"dj_pronabec\\":\\"postulaciones\\\\/dj\\\\/DaaifW0XdflWVildZVdhK1jzsbk0AAVPC1wVGy3q.pdf\\",\\"firma_digital\\":\\"postulaciones\\\\/firmas\\\\/yQCatNuOvR6wwnl3plpXjHN8so2MErpBvOQv9Pd7.jpg\\",\\"especificos\\":[{\\"tipo\\":\\"FORANEO\\",\\"path\\":\\"postulaciones\\\\/especificos\\\\/VeLoSFTrc3CnxsJnysot2AFwnh7eNZTsMqcMbjlm.pdf\\"}]}"', 0, 'rechazado', '2ff054d6d6f938393e8b5bf52528c50c10ecd170af0e26b1efa907c14603c68c', '2025-12-17 03:35:14', '2025-12-17 03:55:02'),
	(4, 4, 1, 0.00, 1, 'propia', '"{\\"ficha_socioeconomica\\":\\"postulaciones\\\\/fichas\\\\/JQqyDfO0OgtVcMuCR0EzvPzE2SoIeTdgtKBPXiga.pdf\\",\\"boletas_pago\\":\\"postulaciones\\\\/boletas\\\\/1u1PcsOdTcvJfbvv4UAObWWsxRaZlIgXv0LRhHsY.pdf\\",\\"recibo_luz\\":\\"postulaciones\\\\/recibos\\\\/Lp6jFfcRaOKffHOnDfzwvInGI2DFtZkcthfT744h.pdf\\",\\"croquis\\":\\"postulaciones\\\\/croquis\\\\/b26ZyOo7MvJL6LPGqka1ZofB7FkremR445fcjtSC.pdf\\",\\"dj_pronabec\\":\\"postulaciones\\\\/dj\\\\/vihYxThAR9nkdnLhBYVwOt5HrG6B6imoN8fHvzXZ.pdf\\",\\"firma_digital\\":\\"postulaciones\\\\/firmas\\\\/1nexLLmYPWqGR54tOLPPbLwRO3trB7yFuVi3kXJp.jpg\\"}"', 0, 'rechazado', '60405ab49cd3330fa1ee4b9913f5f6d12d4f46990279173d304631bcb4d30f80', '2025-12-17 04:00:40', '2025-12-16 23:21:04'),
	(5, 4, 1, 0.00, 1, 'propia', '"{\\"ficha_socioeconomica\\":\\"postulaciones\\\\/fichas\\\\/l338mMLRuNDB29eVmHpUdZIqedwFNJzs15c8ZnZn.pdf\\",\\"boletas_pago\\":\\"postulaciones\\\\/boletas\\\\/vnujHvTxE1aumB6HW8k9RSWSe9SxaZBwxSSQKMQh.pdf\\",\\"recibo_luz\\":\\"postulaciones\\\\/recibos\\\\/xzmkqvDNneIB9ExP5ktfbdS50HSeVsEXgxe0Uoqz.pdf\\",\\"croquis\\":\\"postulaciones\\\\/croquis\\\\/7n1WWP3PqGlrM13wB4XqdaArybaZZxdN3PrDkhc9.pdf\\",\\"dj_pronabec\\":\\"postulaciones\\\\/dj\\\\/wsfx2G3WdtUpA5NoASdsp8tO2cRrukSNsnEUsPfu.pdf\\",\\"firma_digital\\":\\"postulaciones\\\\/firmas\\\\/u2fGzHdqKzNGLNlZXXKvFh62N8CEQ9UbvrFoXtmu.jpg\\",\\"especificos\\":[{\\"tipo\\":\\"FORANEO\\",\\"path\\":\\"postulaciones\\\\/especificos\\\\/AGXVZWinUVtOlw3EwPxiPSeFOOt9KL80HIdXeU8X.pdf\\"}]}"', 0, 'pendiente', NULL, '2025-12-16 23:21:59', '2025-12-16 23:21:59');

-- Volcando estructura para tabla spgcu_system.programaciones_comedor
CREATE TABLE IF NOT EXISTS `programaciones_comedor` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `menu_id` bigint unsigned NOT NULL,
  `estado` enum('programado','asistio','falta','justificado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'programado',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `programaciones_comedor_usuario_id_menu_id_unique` (`usuario_id`,`menu_id`),
  KEY `programaciones_comedor_menu_id_foreign` (`menu_id`),
  CONSTRAINT `programaciones_comedor_menu_id_foreign` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  CONSTRAINT `programaciones_comedor_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.programaciones_comedor: ~2 rows (aproximadamente)
DELETE FROM `programaciones_comedor`;
INSERT INTO `programaciones_comedor` (`id`, `usuario_id`, `menu_id`, `estado`, `created_at`, `updated_at`) VALUES
	(4, 4, 6, 'programado', '2025-12-17 04:01:56', '2025-12-16 23:16:22'),
	(5, 4, 7, 'asistio', '2025-12-16 23:13:12', '2025-12-16 23:19:43');

-- Volcando estructura para tabla spgcu_system.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sexo` enum('M','F') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `ubigeo_nacimiento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_civil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellidos` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_paterno` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido_materno` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `escuela` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facultad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','coordinador','administrativo','estudiante','cocina') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'estudiante',
  `codigo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dni` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_actual` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ubigeo_actual` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_colegio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ubigeo_colegio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_colegio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anio_termino_colegio` year DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `contacto_emergencia_nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto_emergencia_telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datos_pide` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_email_unique` (`email`),
  UNIQUE KEY `usuarios_dni_unique` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla spgcu_system.usuarios: ~6 rows (aproximadamente)
DELETE FROM `usuarios`;
INSERT INTO `usuarios` (`id`, `nombres`, `sexo`, `fecha_nacimiento`, `ubigeo_nacimiento`, `estado_civil`, `apellidos`, `apellido_paterno`, `apellido_materno`, `email`, `escuela`, `facultad`, `email_verified_at`, `password`, `rol`, `codigo`, `dni`, `telefono`, `direccion_actual`, `ubigeo_actual`, `nombre_colegio`, `ubigeo_colegio`, `tipo_colegio`, `anio_termino_colegio`, `estado`, `remember_token`, `created_at`, `updated_at`, `contacto_emergencia_nombre`, `contacto_emergencia_telefono`, `datos_pide`) VALUES
	(1, 'Admin', NULL, NULL, NULL, NULL, 'Sistema', NULL, NULL, 'admin@unam.edu.pe', NULL, NULL, '2025-12-17 03:01:54', '$2y$12$VUuVcvQ1dvvfdMeke9RjXu2wJ/FKapTN4JjkDNFnw5Y54.jbeoBO2', 'admin', NULL, '12345678', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '9F1hVBWA20', '2025-12-17 03:01:54', '2025-12-17 03:01:54', NULL, NULL, NULL),
	(2, 'Administrador', NULL, NULL, NULL, NULL, 'Principal', NULL, NULL, 'admin_test@unam.edu.pe', NULL, NULL, NULL, '$2y$12$ie8Uo3lw7/hD.eTx9A7y8Ow9F9BVO8PtXot0gWZapghDmw6Sf/OVe', 'admin', NULL, '10000001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-12-17 03:07:25', '2025-12-17 03:07:25', NULL, NULL, NULL),
	(3, 'Personal', NULL, NULL, NULL, NULL, 'Administrativo', NULL, NULL, 'administrativo@unam.edu.pe', NULL, NULL, NULL, '$2y$12$6oZynCnju3DcfeVu.Ubq9ORIcoGP0I8VGHMzpsoKVSrvzyHju7p76', 'administrativo', NULL, '20000002', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-12-17 03:07:26', '2025-12-17 03:07:26', NULL, NULL, NULL),
	(4, 'Alumno', NULL, NULL, NULL, NULL, 'Estudiante', NULL, NULL, 'estudiante@unam.edu.pe', NULL, NULL, NULL, '$2y$12$iczGc7zDlqCc6qPYNU98WeDz.TdAe91r1y1TwSTPPAsgEU5JvzGpK', 'estudiante', NULL, '30000003', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-12-17 03:07:27', '2025-12-17 03:07:27', NULL, NULL, NULL),
	(5, 'adssd', 'M', NULL, 'dsaasd', 'asd332', 'sdsdsd', '2112sdaas', 'asdsa', 'carlosenriquemirandapauro@gmail.com', NULL, NULL, NULL, '$2y$12$zD.0xdl7vJMF7UbrUnWHOezil8SeLIPwbHZIeSgvzjpBqQZSNrYnq', 'estudiante', '322323323223', '11111111', '11211212', '3223', 'sdaasdsda', NULL, NULL, 'Nacional', NULL, 1, NULL, '2025-12-17 03:54:38', '2025-12-17 03:54:38', '3232', '212', NULL),
	(6, 'ssas', 'M', '2024-01-01', '1331', '113', 'aswe22w', '12123', '121231', '3wasasas@gmail.com', NULL, NULL, NULL, '$2y$12$KApOGk/Jd3GFfnDsQXENHOPbsm2S.NU0rayISXeO1XiphlOqXkGIy', 'coordinador', '122131', '12121212', '122121', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-12-17 03:56:07', '2025-12-17 03:56:45', '1221', '122112', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
