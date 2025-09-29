-- Add selected_color_id column to cart_frame table
ALTER TABLE cart_frame 
ADD COLUMN selected_color_id BIGINT NULL 
AFTER discount;

-- Add comment for the new column
ALTER TABLE cart_frame 
MODIFY COLUMN selected_color_id BIGINT NULL 
COMMENT 'Selected color ID for the product frame';
