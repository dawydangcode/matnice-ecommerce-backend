-- =====================================================
-- MANUAL MIGRATION: CREATE PRODUCT BESTSELLER TABLE
-- =====================================================
-- Run this SQL in DBeaver to create the bestseller table
-- =====================================================

-- Step 1: Create the product_bestseller table
CREATE TABLE IF NOT EXISTS `product_bestseller` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `custom_priority` int DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `total_sales` int NOT NULL DEFAULT 0,
  `sales_last_30_days` int NOT NULL DEFAULT 0,
  `revenue_generated` decimal(15,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_product_bestseller_product_id` (`product_id`),
  KEY `idx_product_bestseller_active` (`is_active`, `is_pinned`),
  CONSTRAINT `fk_product_bestseller_product` 
    FOREIGN KEY (`product_id`) 
    REFERENCES `product` (`id`) 
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Step 2: Verify table creation
SELECT 
  TABLE_NAME,
  TABLE_ROWS,
  CREATE_TIME,
  UPDATE_TIME,
  TABLE_COLLATION
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'product_bestseller';

-- Step 3: Verify table structure
DESCRIBE product_bestseller;

-- Step 4: Verify indexes
SHOW INDEXES FROM product_bestseller;

-- =====================================================
-- OPTIONAL: Insert sample data for testing
-- =====================================================
-- Uncomment below to insert test data

/*
-- Sample pinned bestseller
INSERT INTO product_bestseller (
  product_id, is_pinned, custom_priority, display_order, 
  total_sales, sales_last_30_days, revenue_generated,
  is_active, notes, created_by, updated_by
) VALUES (
  1, 1, 1, 1, 150, 45, 75000000.00, 1, 
  'Top priority product', 1, 1
);

-- Sample auto bestseller (based on sales)
INSERT INTO product_bestseller (
  product_id, is_pinned, custom_priority, display_order,
  total_sales, sales_last_30_days, revenue_generated,
  is_active, notes, created_by, updated_by
) VALUES (
  5, 0, NULL, NULL, 200, 65, 100000000.00, 1,
  'Auto bestseller - top sales', 1, 1
);
*/

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if data inserted successfully
-- SELECT * FROM product_bestseller;

-- Check bestseller with product details
/*
SELECT 
  pb.id,
  pb.product_id,
  p.product_name,
  pb.is_pinned,
  pb.custom_priority,
  pb.total_sales,
  pb.sales_last_30_days,
  pb.is_active
FROM product_bestseller pb
LEFT JOIN product p ON pb.product_id = p.id
ORDER BY 
  pb.is_pinned DESC,
  pb.custom_priority ASC,
  pb.total_sales DESC;
*/

-- =====================================================
-- ROLLBACK (if needed)
-- =====================================================
-- Uncomment to drop the table
-- DROP TABLE IF EXISTS product_bestseller;
