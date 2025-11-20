-- =====================================================
-- BESTSELLER HYBRID SYSTEM - SAMPLE DATA
-- =====================================================
-- This script creates sample bestseller data for testing
-- Run this after migration to populate initial bestsellers
-- =====================================================

-- Clear existing data (optional - only for testing)
-- TRUNCATE TABLE product_bestseller;

-- =====================================================
-- PINNED BESTSELLERS (Admin manually set)
-- =====================================================
-- These are strategic products that admin wants to promote
-- They will always appear first in the bestseller list

-- Product ID 1: Premium brand, high priority
INSERT INTO product_bestseller (
  product_id,
  is_pinned,
  custom_priority,
  display_order,
  total_sales,
  sales_last_30_days,
  revenue_generated,
  is_active,
  notes,
  created_at,
  created_by,
  updated_at,
  updated_by
) VALUES (
  1,                        -- product_id (adjust based on your products)
  true,                     -- is_pinned
  1,                        -- custom_priority (highest)
  1,                        -- display_order
  150,                      -- total_sales
  45,                       -- sales_last_30_days
  75000000,                 -- revenue_generated (75M VND)
  true,                     -- is_active
  'Sản phẩm chiến lược - New arrival collection',
  NOW(),
  1,                        -- created_by (admin user id)
  NOW(),
  1                         -- updated_by
)
ON DUPLICATE KEY UPDATE
  is_pinned = true,
  custom_priority = 1,
  updated_at = NOW();

-- Product ID 2: Seasonal promotion
INSERT INTO product_bestseller (
  product_id,
  is_pinned,
  custom_priority,
  display_order,
  total_sales,
  sales_last_30_days,
  revenue_generated,
  is_active,
  notes,
  created_at,
  created_by,
  updated_at,
  updated_by
) VALUES (
  2,
  true,
  2,                        -- Second priority
  2,
  120,
  38,
  60000000,
  true,
  'Summer collection 2025 - Cần promote',
  NOW(),
  1,
  NOW(),
  1
)
ON DUPLICATE KEY UPDATE
  is_pinned = true,
  custom_priority = 2,
  updated_at = NOW();

-- =====================================================
-- AUTO BESTSELLERS (Based on sales data)
-- =====================================================
-- These products are added based on their sales performance
-- They are NOT pinned, so they rank by sales numbers

-- Product ID 5: High sales volume
INSERT INTO product_bestseller (
  product_id,
  is_pinned,
  custom_priority,
  display_order,
  total_sales,
  sales_last_30_days,
  revenue_generated,
  is_active,
  notes,
  created_at,
  created_by,
  updated_at,
  updated_by
) VALUES (
  5,
  false,                    -- NOT pinned
  NULL,                     -- No manual priority
  NULL,                     -- No manual order
  200,                      -- Very high sales
  65,
  100000000,                -- 100M VND revenue
  true,
  'Tự động - Top seller',
  NOW(),
  1,
  NOW(),
  1
)
ON DUPLICATE KEY UPDATE
  total_sales = 200,
  sales_last_30_days = 65,
  revenue_generated = 100000000,
  updated_at = NOW();

-- Product ID 10: Medium sales
INSERT INTO product_bestseller (
  product_id,
  is_pinned,
  custom_priority,
  display_order,
  total_sales,
  sales_last_30_days,
  revenue_generated,
  is_active,
  notes,
  created_at,
  created_by,
  updated_at,
  updated_by
) VALUES (
  10,
  false,
  NULL,
  NULL,
  95,
  28,
  47500000,
  true,
  'Tự động - Popular choice',
  NOW(),
  1,
  NOW(),
  1
)
ON DUPLICATE KEY UPDATE
  total_sales = 95,
  sales_last_30_days = 28,
  updated_at = NOW();

-- Product ID 15: Steady sales
INSERT INTO product_bestseller (
  product_id,
  is_pinned,
  custom_priority,
  display_order,
  total_sales,
  sales_last_30_days,
  revenue_generated,
  is_active,
  notes,
  created_at,
  created_by,
  updated_at,
  updated_by
) VALUES (
  15,
  false,
  NULL,
  NULL,
  80,
  22,
  40000000,
  true,
  'Tự động - Consistent seller',
  NOW(),
  1,
  NOW(),
  1
)
ON DUPLICATE KEY UPDATE
  total_sales = 80,
  sales_last_30_days = 22,
  updated_at = NOW();

-- =====================================================
-- EXPECTED DISPLAY ORDER
-- =====================================================
-- When fetching GET /api/v1/bestsellers?limit=8
-- The order will be:
--
-- 1. Product 1 (Pinned, Priority 1) ⭐
-- 2. Product 2 (Pinned, Priority 2) ⭐
-- 3. Product 5 (Auto, Sales 200)
-- 4. Product 10 (Auto, Sales 95)
-- 5. Product 15 (Auto, Sales 80)
-- ... and more auto products if available
-- =====================================================

-- =====================================================
-- VERIFY DATA
-- =====================================================
-- Run this query to check the data:
/*
SELECT 
  pb.id,
  pb.product_id,
  p.product_name,
  pb.is_pinned,
  pb.custom_priority,
  pb.display_order,
  pb.total_sales,
  pb.sales_last_30_days,
  pb.revenue_generated,
  pb.is_active,
  pb.notes
FROM product_bestseller pb
LEFT JOIN product p ON pb.product_id = p.id
ORDER BY 
  pb.is_pinned DESC,
  pb.custom_priority ASC NULLS LAST,
  pb.display_order ASC NULLS LAST,
  pb.sales_last_30_days DESC,
  pb.total_sales DESC;
*/

-- =====================================================
-- USEFUL ADMIN QUERIES
-- =====================================================

-- Get all pinned bestsellers
/*
SELECT * FROM product_bestseller 
WHERE is_pinned = true 
ORDER BY custom_priority ASC;
*/

-- Get top 10 by sales
/*
SELECT * FROM product_bestseller 
ORDER BY total_sales DESC 
LIMIT 10;
*/

-- Deactivate a bestseller
/*
UPDATE product_bestseller 
SET is_active = false, updated_at = NOW() 
WHERE product_id = 1;
*/

-- Change priority
/*
UPDATE product_bestseller 
SET custom_priority = 3, updated_at = NOW() 
WHERE product_id = 2;
*/

-- Unpin a product (convert to auto bestseller)
/*
UPDATE product_bestseller 
SET is_pinned = false, custom_priority = NULL, updated_at = NOW() 
WHERE product_id = 1;
*/
