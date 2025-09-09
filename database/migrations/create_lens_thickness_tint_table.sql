-- Migration script for lens_thickness_tint table
-- This table manages compatibility between lens thicknesses and tints

-- Create lens_thickness_tint table
CREATE TABLE IF NOT EXISTS `lens_thickness_tint` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_thickness_id` bigint NOT NULL,
  `tint_id` bigint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_thickness_tint_active` (`lens_thickness_id`, `tint_id`, `deleted_at`),
  KEY `idx_lens_thickness_tint_thickness_id` (`lens_thickness_id`),
  KEY `idx_lens_thickness_tint_tint_id` (`tint_id`),
  KEY `idx_lens_thickness_tint_deleted_at` (`deleted_at`),
  CONSTRAINT `fk_lens_thickness_tint_thickness` FOREIGN KEY (`lens_thickness_id`) REFERENCES `lens_thickness` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_lens_thickness_tint_tint` FOREIGN KEY (`tint_id`) REFERENCES `lens_tint` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample compatibility data
-- This assumes you have lens_thickness and lens_tint data already
-- Adjust the IDs according to your actual data

-- Standard lens thickness (1.5) compatible with most tints
INSERT INTO `lens_thickness_tint` (`lens_thickness_id`, `tint_id`, `created_by`, `updated_by`) VALUES
(1, 1, 1, 1), -- Standard + No Tint
(1, 2, 1, 1), -- Standard + Polarised
(1, 3, 1, 1), -- Standard + Sunglasses Tint
(1, 4, 1, 1), -- Standard + Gradient Tint
(1, 5, 1, 1); -- Standard + Mirrored

-- Thin lens thickness (1.6) compatible with most tints except heavy ones
INSERT INTO `lens_thickness_tint` (`lens_thickness_id`, `tint_id`, `created_by`, `updated_by`) VALUES
(2, 1, 1, 1), -- Thin + No Tint
(2, 2, 1, 1), -- Thin + Polarised
(2, 3, 1, 1), -- Thin + Sunglasses Tint
(2, 4, 1, 1); -- Thin + Gradient Tint

-- Ultra-thin lens thickness (1.74) compatible with lighter tints only
INSERT INTO `lens_thickness_tint` (`lens_thickness_id`, `tint_id`, `created_by`, `updated_by`) VALUES
(3, 1, 1, 1), -- Ultra-thin + No Tint
(3, 2, 1, 1), -- Ultra-thin + Polarised
(3, 3, 1, 1); -- Ultra-thin + Sunglasses Tint

-- Note: Adjust the IDs above based on your actual lens_thickness and lens_tint data
-- You can check existing IDs with:
-- SELECT id, name FROM lens_thickness;
-- SELECT id, name FROM lens_tint;
