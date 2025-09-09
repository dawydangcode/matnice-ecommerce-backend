-- Migration script for lens_tint and tint_color tables

-- Create lens_tint table
CREATE TABLE IF NOT EXISTS `lens_tint` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_lens_tint_name` (`name`),
  KEY `idx_lens_tint_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create tint_color table
CREATE TABLE IF NOT EXISTS `tint_color` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tint_id` bigint NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_code` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tint_color_tint_id` (`tint_id`),
  KEY `idx_tint_color_name` (`name`),
  KEY `idx_tint_color_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_tint_color_lens_tint` FOREIGN KEY (`tint_id`) REFERENCES `lens_tint` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for lens_tint
INSERT INTO `lens_tint` (`name`, `price`, `description`, `created_by`, `updated_by`) VALUES
('Standard Clear', 0.00, 'Basic clear lenses with no tint', 1, 1),
('Photochromic', 89.95, 'Adaptive lenses that darken in sunlight', 1, 1),
('Polarized', 79.95, 'Reduces glare and enhances visual clarity', 1, 1),
('Blue Light Filter', 49.95, 'Protects against blue light from digital screens', 1, 1),
('Mirror Coating', 59.95, 'Reflective coating for style and sun protection', 1, 1);

-- Insert sample data for tint_color (assuming lens_tint IDs 1-5 exist)
INSERT INTO `tint_color` (`tint_id`, `name`, `color_code`, `created_by`, `updated_by`) VALUES
(1, 'Clear', '#FFFFFF', 1, 1),
(2, 'Grey', '#808080', 1, 1),
(2, 'Brown', '#8B4513', 1, 1),
(3, 'Grey Polarized', '#696969', 1, 1),
(3, 'Brown Polarized', '#A0522D', 1, 1),
(3, 'Green Polarized', '#228B22', 1, 1),
(4, 'Clear Blue Block', '#F0F8FF', 1, 1),
(5, 'Silver Mirror', '#C0C0C0', 1, 1),
(5, 'Gold Mirror', '#FFD700', 1, 1),
(5, 'Blue Mirror', '#4169E1', 1, 1);
