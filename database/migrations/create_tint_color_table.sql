-- Migration script for tint_color table (standalone)
-- This creates the tint_color table as a separate module

-- Create tint_color table
CREATE TABLE IF NOT EXISTS `tint_color` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tint_id` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tint_color_tint_id` (`tint_id`),
  KEY `idx_tint_color_name` (`name`),
  KEY `idx_tint_color_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for tint_color
-- Note: Make sure corresponding tint_id values exist in your lens_tint table
INSERT INTO `tint_color` (`tint_id`, `name`, `color_code`, `created_by`, `updated_by`) VALUES
(1, 'Clear', '#FFFFFF', 1, 1),
(1, 'Light Tint', '#F5F5F5', 1, 1),
(2, 'Grey', '#808080', 1, 1),
(2, 'Brown', '#8B4513', 1, 1),
(2, 'Dark Grey', '#404040', 1, 1),
(3, 'Grey Polarized', '#696969', 1, 1),
(3, 'Brown Polarized', '#A0522D', 1, 1),
(3, 'Green Polarized', '#228B22', 1, 1),
(4, 'Clear Blue Block', '#F0F8FF', 1, 1),
(4, 'Light Yellow Blue Block', '#FFFACD', 1, 1),
(5, 'Silver Mirror', '#C0C0C0', 1, 1),
(5, 'Gold Mirror', '#FFD700', 1, 1),
(5, 'Blue Mirror', '#4169E1', 1, 1),
(5, 'Green Mirror', '#50C878', 1, 1);
