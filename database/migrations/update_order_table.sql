-- Migration to update order table structure
-- Add new address fields and remove old address field

-- Add new columns
ALTER TABLE `order` 
ADD COLUMN `full_name` VARCHAR(255) NOT NULL AFTER `delivery_date`,
ADD COLUMN `phone` VARCHAR(20) NOT NULL AFTER `full_name`,
ADD COLUMN `email` VARCHAR(255) NOT NULL AFTER `phone`,
ADD COLUMN `province` VARCHAR(100) NOT NULL AFTER `email`,
ADD COLUMN `district` VARCHAR(100) NOT NULL AFTER `province`,
ADD COLUMN `ward` VARCHAR(100) NOT NULL AFTER `district`,
ADD COLUMN `address_detail` VARCHAR(500) NOT NULL AFTER `ward`,
ADD COLUMN `notes` TEXT NULL AFTER `address_detail`;

-- Copy existing address data to address_detail (if needed)
-- UPDATE `order` SET `address_detail` = `address` WHERE `address` IS NOT NULL;

-- Drop old address column after data migration
-- ALTER TABLE `order` DROP COLUMN `address`;

-- Update column comments
ALTER TABLE `order` 
MODIFY COLUMN `full_name` VARCHAR(255) NOT NULL COMMENT 'Họ và tên người nhận',
MODIFY COLUMN `phone` VARCHAR(20) NOT NULL COMMENT 'Số điện thoại người nhận',
MODIFY COLUMN `email` VARCHAR(255) NOT NULL COMMENT 'Email người nhận',
MODIFY COLUMN `province` VARCHAR(100) NOT NULL COMMENT 'Tỉnh/Thành phố',
MODIFY COLUMN `district` VARCHAR(100) NOT NULL COMMENT 'Quận/Huyện',
MODIFY COLUMN `ward` VARCHAR(100) NOT NULL COMMENT 'Phường/Xã',
MODIFY COLUMN `address_detail` VARCHAR(500) NOT NULL COMMENT 'Địa chỉ chi tiết',
MODIFY COLUMN `notes` TEXT NULL COMMENT 'Ghi chú đơn hàng';
