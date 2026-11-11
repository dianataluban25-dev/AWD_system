-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: elee
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_10_08_000001_create_store_tables',1),(5,'2026_10_08_014124_create_personal_access_tokens_table',1),(6,'2026_10_14_000001_add_admin_role',2),(7,'2026_10_14_000002_create_store_settings',3),(8,'2026_10_14_120000_add_recommendations_to_products',4),(9,'2026_10_16_060000_allow_text_store_settings',5),(10,'2026_10_16_070000_add_delivery_not_before_to_orders',6);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `quantity` int(10) unsigned NOT NULL,
  `unit_price_centavos` int(10) unsigned NOT NULL,
  `line_total_centavos` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,3,'GI Corrugated 3ft','piece',3,29500,88500),(2,2,2,'Screwdriver Set','set',5,18000,90000),(3,2,4,'Hollow Blocks 4”','piece',20,2500,50000),(4,3,1,'Claw Hammer','piece',10,9000,90000),(5,4,1,'Claw Hammer','piece',1,9000,9000),(6,4,6,'Cement 40kg','bag',5,24500,122500),(7,4,7,'Paint (1L)','can',1,14000,14000),(8,4,8,'Fine Sand (cu. m.)','cu. m.',3,90000,270000),(9,4,10,'PAKO','PER KILO',2,5000,10000),(10,5,9,'Electrical Tape','piece',1,9000,9000),(11,5,10,'PAKO','PER KILO',8,5000,40000),(12,6,3,'GI Corrugated 3ft','piece',1,29500,29500),(13,7,3,'GI Corrugated 3ft','piece',1,29500,29500),(14,8,6,'Cement 40kg','bag',1,24500,24500);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) NOT NULL,
  `access_token_hash` varchar(64) NOT NULL,
  `idempotency_key` varchar(64) NOT NULL,
  `request_hash` varchar(64) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `mobile_number` varchar(30) NOT NULL,
  `address` text DEFAULT NULL,
  `fulfillment_method` varchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'Unpaid',
  `order_status` varchar(255) NOT NULL DEFAULT 'Pending',
  `subtotal_centavos` int(10) unsigned NOT NULL,
  `delivery_fee_centavos` int(10) unsigned NOT NULL,
  `total_centavos` int(10) unsigned NOT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `paid_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `delivery_not_before` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  UNIQUE KEY `orders_idempotency_key_unique` (`idempotency_key`),
  KEY `orders_paid_by_foreign` (`paid_by`),
  KEY `orders_fifo_index` (`created_at`,`id`),
  CONSTRAINT `orders_paid_by_foreign` FOREIGN KEY (`paid_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ELEE-01M4XBD5GK7WPRPRPN0A7NBQF5','d7e022f86932854f6c381b3eb63474ecfd2e89d5e606b23caefc0906725c0ef2','f051535024afd73d5dbe40e18886902b93ac34b1e5ad0dcf','fca9994e42058ddd2a5d16376c63c74325cc98be525e09e7d14ca596ddb02d1d','luna smith','09576845748','69 zone 3, di makausad street','delivery','cash_at_store','Paid','Completed',88500,6000,94500,'2026-10-14 06:00:46',1,'2026-10-14 06:00:06','2026-10-14 06:01:17',NULL),(2,'ELEE-01M51H815W6K28Q84Y0XNTZ6JZ','e0f6e160307abd1d58e655d6658ed73dc589538efe60eac2133ba334f6fa8f78','3c732401716326782970434d78d73431c8d57b890ac9d3a2','94e775ab6d211500d03dcd8c752f245f31b26ea6943b450ab67dd9220a76071e','Jadee','09911113896',NULL,'store_pickup','cash_at_store','Paid','Completed',140000,0,140000,'2026-10-15 21:00:48',1,'2026-10-15 20:59:07','2026-10-15 21:01:24',NULL),(3,'ELEE-01M51H9319N6RMRP2WVS897B3H','653c16bbe3762be2e853d3d2c6d9dcd7343cbc23223dca6235f349adc0fafc47','acc95f792d3a8b488f332fd7d4937472deb8a38deb0630f0','6d7d4f216634d846dcebd9844b707469a1e9fbcf84b7f74161e2b962b908f141','Richelle','09999568344','2 Zone 5, Urdaneta','delivery','cash_on_delivery','Paid','Completed',90000,6000,96000,'2026-10-15 21:01:06',1,'2026-10-15 20:59:42','2026-10-15 21:01:06',NULL),(4,'ELEE-01M51HVD6A08CAKT6BSTWZKWME','ef265ea15eaa22e98afec3360cd89b7cf2eeabeddbb6e78e4285a322a911eda8','131cf165ea9f3a8ca0b6a6b7a78c811201dfd687f93468cf','73811ca17fcc17114aedc3b276b1be6a839200ea655d0ef3443253494d979da9','Anne','09996664441',NULL,'store_pickup','cash_at_store','Paid','Completed',425500,0,425500,'2026-10-15 21:10:48',1,'2026-10-15 21:09:42','2026-10-15 21:11:07',NULL),(5,'ELEE-01M51J16VNPDNWY0PYCCCQDNPY','27d08875db4cfe38822a4bda6732bc0f9c6fb3b1dc61e5f3e52e1cd84e803b31','79c5639efc114ab1a2563d55646029ac25789c00c458dd5f','d3aee588f6fcf585149c9d8bf1622ec0cea44bf8e091b642b179a946018ccdb1','diana','09865643437','45, Dito lang','delivery','cash_on_delivery','Paid','Completed',49000,6000,55000,'2026-10-15 21:13:38',1,'2026-10-15 21:12:52','2026-10-15 21:13:38',NULL),(6,'ELEE-01M51PH1KK2XKX3VCJJ4CWC9KD','5482bc2eb0165af24625bc01aec71773a533a34710f0393ec982b40448de1ca8','cf23b728ccdf4ee451b0971a41df76b563bf50ae2538d07a','26d9449f273a6494a36ce62c86ebe87f38ee82049be3add08b85d22822dc6f25','Diana','09434618337',NULL,'store_pickup','cash_at_store','Paid','Completed',29500,0,29500,'2026-10-15 22:37:09',1,'2026-10-15 22:31:26','2026-10-15 22:37:23',NULL),(7,'ELEE-01M51PP89J09H4H4GK8PN947V4','aa30f91900126a5097075c4dc39f29b5333d096d51a5bc17bc6d22b68deed4d4','ff1964e119f5ce388c5ddb4788a654fd22fe1b7b35ee4693','5c2bd999e5b6c723cfeb81b0bc24b0dc39c57655904ba549d623701b42c1f898','ahm','09765643542','113, villasis','delivery','cash_on_delivery','Paid','Completed',29500,3985,33485,'2026-10-15 22:36:45',1,'2026-10-15 22:34:16','2026-10-15 22:36:45',NULL),(8,'ELEE-01M5DZ5HSTDE8Q3RQWM8H34PBP','e7997de5fc7712fcb39603b3282266a26d378512693d3f1efc8c30be56b3afb3','413b82041e7f78f0436e5d467833d95637d0d9514cb5fd22','965b18c38c571bc66b4e005933a424e758c779aa5600567b64130690e5ab790d','dayang','09467648256','1234, ambot sa imo','delivery','cash_on_delivery','Unpaid','Pending',24500,3985,28485,NULL,NULL,'2026-10-20 16:53:19','2026-10-20 16:53:19',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (5,'App\\Models\\User',1,'staff','21a7c64b27dd99cf7b9c9e6205dcb5ffb9dc23802c4e74c7985a17ca71a3a568','[\"*\"]','2026-10-14 00:25:48','2026-10-14 08:09:53','2026-10-14 00:09:53','2026-10-14 00:25:48'),(6,'App\\Models\\User',1,'staff','816af1181c3b473fd85856c03ff65282382cc522113ec0fc552db3943853792d','[\"*\"]','2026-10-14 01:03:28','2026-10-14 08:41:40','2026-10-14 00:41:40','2026-10-14 01:03:28'),(7,'App\\Models\\User',1,'staff','585472214b353e43c5e017283daf83210df162e1ce3b8572d6e3096353a1478a','[\"*\"]','2026-10-14 06:09:24','2026-10-14 11:33:34','2026-10-14 03:33:34','2026-10-14 06:09:24'),(9,'App\\Models\\User',1,'staff','b4e41fd596492ade65cd083104ad69790870e77bef01230c32beefd7cede2951','[\"*\"]','2026-10-14 06:09:27','2026-10-14 12:36:06','2026-10-14 04:36:06','2026-10-14 06:09:27'),(16,'App\\Models\\User',1,'staff','efd61a9fced7074f8bd1f5de46051c6b51b73bfaab0da50b87535cdc33fb3d3f','[\"*\"]','2026-10-16 00:03:18','2026-10-16 06:40:59','2026-10-15 22:40:59','2026-10-16 00:03:18'),(17,'App\\Models\\User',1,'staff','10cb6fafe516bad0df8b1c9f11b54857e7738b7938f82f5b4a1d3bfd2b1179cd','[\"*\"]','2026-10-20 16:46:27','2026-10-21 00:42:43','2026-10-20 16:42:43','2026-10-20 16:46:27');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL DEFAULT 'piece',
  `description` text DEFAULT NULL,
  `image_url` varchar(2048) DEFAULT NULL,
  `price_centavos` int(10) unsigned NOT NULL,
  `stock` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `recommended_product_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`recommended_product_ids`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_unique` (`sku`),
  KEY `products_category_index` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'HAMMER-01','Claw Hammer','Tools','piece','pamukpok',NULL,9000,19,0,'2026-10-12 17:25:30','2026-10-15 22:28:08','[2,3,4,5]'),(2,'SCREW-01','Screwdriver Set','Tools','set',NULL,NULL,18000,19,1,'2026-10-12 17:25:30','2026-10-15 20:59:07',NULL),(3,'GI-01','GI Corrugated 3ft','Construction','piece',NULL,NULL,29500,19,1,'2026-10-12 17:25:30','2026-10-15 22:34:16','[1,4]'),(4,'BLOCK-01','Hollow Blocks 4”','Building Materials','piece',NULL,NULL,2500,16,1,'2026-10-12 17:25:30','2026-10-15 20:59:38',NULL),(5,'PVC-01','PVC Pipe (1/2”)','Plumbing','piece',NULL,NULL,4300,24,1,'2026-10-12 17:25:30','2026-10-12 17:25:30',NULL),(6,'CEMENT-01','Cement 40kg','Building Materials','bag',NULL,NULL,24500,18,1,'2026-10-12 17:25:30','2026-10-20 16:53:19',NULL),(7,'PAINT-01','Paint (1L)','Paints','can',NULL,NULL,14000,23,1,'2026-10-12 17:25:30','2026-10-15 21:09:42',NULL),(8,'SAND-01','Fine Sand (cu. m.)','Building Materials','cu. m.',NULL,NULL,90000,21,1,'2026-10-12 17:25:30','2026-10-15 21:09:42',NULL),(9,'TAPE-01','Electrical Tape','Electrical','piece',NULL,NULL,9000,23,1,'2026-10-12 17:25:30','2026-10-15 21:12:52',NULL),(10,'PAKO-1IN','PAKO','Building Materials','PER KILO','TUSOK',NULL,5000,50,1,'2026-10-15 21:06:07','2026-10-15 21:12:52',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_settings`
--

DROP TABLE IF EXISTS `store_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `store_settings` (
  `key` varchar(255) NOT NULL,
  `value` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_settings`
--

LOCK TABLES `store_settings` WRITE;
/*!40000 ALTER TABLE `store_settings` DISABLE KEYS */;
INSERT INTO `store_settings` VALUES ('delivery_enabled','1','2026-10-15 21:27:11','2026-10-15 21:27:11'),('delivery_fee_centavos','3985','2026-10-15 21:27:11','2026-10-15 21:27:11'),('pickup_enabled','1','2026-10-15 21:27:11','2026-10-15 21:27:11'),('recommendation_model','{\"algorithm\":\"item-item collaborative filtering (cosine similarity)\",\"trained_at\":\"2026-10-16T06:37:23+00:00\",\"order_count\":7,\"product_count\":9,\"last_order_id\":7,\"scores\":{\"2\":{\"4\":1},\"4\":{\"2\":1},\"1\":{\"6\":0.707107,\"7\":0.707107,\"8\":0.707107,\"10\":0.5},\"6\":{\"7\":1,\"8\":1,\"1\":0.707107,\"10\":0.707107},\"7\":{\"6\":1,\"8\":1,\"1\":0.707107,\"10\":0.707107},\"8\":{\"6\":1,\"7\":1,\"1\":0.707107,\"10\":0.707107},\"10\":{\"6\":0.707107,\"7\":0.707107,\"8\":0.707107,\"9\":0.707107,\"1\":0.5},\"9\":{\"10\":0.707107}}}','2026-10-15 21:23:42','2026-10-15 22:37:23');
/*!40000 ALTER TABLE `store_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_staff` tinyint(1) NOT NULL DEFAULT 0,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ernie Dela Peña','admin@elee.test',NULL,'$2y$12$TWghTx1DAJMgv/Ok.j16jOZiGZz/9h1ifwD1u9XzgWbLkip.1wN6y',NULL,'2026-10-13 23:41:37','2026-10-14 00:09:27',1,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'elee'
--

--
-- Dumping routines for database 'elee'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-21  9:56:30
