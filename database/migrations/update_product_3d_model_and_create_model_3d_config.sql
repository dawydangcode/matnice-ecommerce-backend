-- Migration to update product_3d_model table and create model_3d_config table

-- Update product_3d_model table structure
ALTER TABLE `product_3d_model` 
DROP COLUMN IF EXISTS `file_type`,
DROP COLUMN IF EXISTS `file_url`, 
DROP COLUMN IF EXISTS `file_name`,
DROP COLUMN IF EXISTS `file_size`,
DROP COLUMN IF EXISTS `is_primary`,
DROP COLUMN IF EXISTS `thumbnail_url`,
DROP COLUMN IF EXISTS `metadata`;

ALTER TABLE `product_3d_model`
ADD COLUMN IF NOT EXISTS `model_name` varchar(255) NOT NULL AFTER `product_id`,
ADD COLUMN IF NOT EXISTS `model_file_path` varchar(255) NOT NULL AFTER `model_name`,
ADD COLUMN IF NOT EXISTS `mtl_file_path` varchar(255) NULL AFTER `model_type`,
ADD COLUMN IF NOT EXISTS `texture_base_path` varchar(255) NULL AFTER `mtl_file_path`,
ADD COLUMN IF NOT EXISTS `config_json` text NULL AFTER `texture_base_path`,
ADD COLUMN IF NOT EXISTS `is_active` boolean NOT NULL DEFAULT TRUE AFTER `config_json`;

-- Create model_3d_config table
CREATE TABLE IF NOT EXISTS `model_3d_config` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `model_id` bigint NOT NULL,
  `offset_x` decimal(5,3) NOT NULL DEFAULT 0.5,
  `offset_y` decimal(5,3) NOT NULL DEFAULT 0.5,
  `position_offset_x` decimal(5,3) NOT NULL DEFAULT 0.4,
  `position_offset_y` decimal(5,3) NOT NULL DEFAULT 0.097,
  `position_offset_z` decimal(5,3) NOT NULL DEFAULT -0.4,
  `initial_scale` decimal(5,3) NOT NULL DEFAULT 0.16,
  `rotation_sensitivity` decimal(3,2) NOT NULL DEFAULT 1.0,
  `yaw_limit` decimal(3,2) NOT NULL DEFAULT 0.5,
  `pitch_limit` decimal(3,2) NOT NULL DEFAULT 0.3,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NULL,
  `deleted_at` timestamp NULL,
  `deleted_by` bigint NULL
);

-- Add foreign key constraints
ALTER TABLE `model_3d_config` 
ADD CONSTRAINT `fk_model_3d_config_model_id` 
FOREIGN KEY (`model_id`) REFERENCES `product_3d_model` (`id`) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_product_3d_model_product_id` ON `product_3d_model` (`product_id`);
CREATE INDEX IF NOT EXISTS `idx_product_3d_model_is_active` ON `product_3d_model` (`is_active`);
CREATE INDEX IF NOT EXISTS `idx_model_3d_config_model_id` ON `model_3d_config` (`model_id`);

-- Insert default config for existing models (if any)
INSERT INTO `model_3d_config` (`model_id`, `created_at`)
SELECT `id`, NOW() 
FROM `product_3d_model` 
WHERE `id` NOT IN (SELECT `model_id` FROM `model_3d_config`);
