-- Migration: Add image_order and is_thumbnail columns to product_image table
-- Date: 2025-08-07

-- Add image_order column
ALTER TABLE product_image 
ADD COLUMN image_order VARCHAR(1) NULL COMMENT 'Image order: a, b, c, d, e';

-- Add is_thumbnail column  
ALTER TABLE product_image 
ADD COLUMN is_thumbnail BOOLEAN DEFAULT FALSE COMMENT 'Whether this image is a thumbnail (a or b)';

-- Add index for faster queries
CREATE INDEX idx_product_image_order ON product_image(product_id, product_color_id, image_order);
CREATE INDEX idx_product_image_thumbnail ON product_image(product_id, is_thumbnail);

-- Update existing records to set is_thumbnail for images with order 'a' and 'b'
-- This will be done after manual data migration if needed

-- Comments for future reference:
-- image_order: 'a', 'b', 'c', 'd', 'e' - determines the display order
-- is_thumbnail: true for 'a' and 'b' orders, false for others
-- Structure: product_image/{productNumber}/{productNumber}_a.png
