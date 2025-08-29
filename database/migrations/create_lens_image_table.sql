-- Create lens_image table
CREATE TABLE `lens_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_id` bigint NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_order` varchar(1) DEFAULT NULL COMMENT 'a=primary, b, c, d, e',
  `is_thumbnail` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_lens_id` (`lens_id`),
  KEY `idx_image_order` (`image_order`),
  KEY `idx_is_thumbnail` (`is_thumbnail`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_deleted_at` (`deleted_at`),
  UNIQUE KEY `unique_lens_image_order` (`lens_id`, `image_order`, `deleted_at`),
  CONSTRAINT `fk_lens_image_lens` FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
