-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: mat_nice_ecommerce
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `product_bestseller`
--

DROP TABLE IF EXISTS `product_bestseller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_bestseller` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT '0',
  `custom_priority` int DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `total_sales` int NOT NULL DEFAULT '0',
  `sales_last_30_days` int NOT NULL DEFAULT '0',
  `revenue_generated` decimal(15,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_product_bestseller_product_id` (`product_id`),
  KEY `idx_product_bestseller_active` (`is_active`,`is_pinned`),
  CONSTRAINT `fk_product_bestseller_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_bestseller`
--

LOCK TABLES `product_bestseller` WRITE;
/*!40000 ALTER TABLE `product_bestseller` DISABLE KEYS */;
INSERT INTO `product_bestseller` VALUES (10,9,1,NULL,NULL,0,0,0.00,1,NULL,'2025-11-21 03:32:47',1,'2025-11-21 03:41:51',1),(11,8,1,NULL,NULL,0,0,0.00,1,NULL,'2025-11-21 03:32:51',1,'2025-11-21 03:41:51',1),(12,7,1,NULL,NULL,0,0,0.00,1,NULL,'2025-11-21 03:32:54',1,'2025-11-21 03:41:51',1),(13,6,1,NULL,NULL,0,0,0.00,1,NULL,'2025-11-21 03:32:57',1,'2025-11-21 03:41:51',1),(14,5,1,NULL,NULL,6,0,12000.00,1,NULL,'2025-11-21 03:33:05',1,'2025-11-21 03:41:51',1);
/*!40000 ALTER TABLE `product_bestseller` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 19:02:49
