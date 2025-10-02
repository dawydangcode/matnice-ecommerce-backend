-- Sample Products with different genders and frames
INSERT INTO product (product_name, product_type, brand_id, gender, price, description, is_sustainable, is_new, is_boutique, created_at, created_by, updated_at, updated_by)
VALUES 
-- Female glasses
('Elegant Cat Eye Glasses', 'glasses', 1, 'female', 150.00, 'Stylish cat eye frames perfect for heart-shaped faces', false, true, false, NOW(), 1, NOW(), 1),
('Round Fashion Glasses', 'glasses', 1, 'female', 120.00, 'Classic round frames suitable for square faces', false, false, false, NOW(), 1, NOW(), 1),
('Aviator Style Glasses', 'glasses', 1, 'female', 180.00, 'Trendy aviator frames ideal for oblong faces', false, false, true, NOW(), 1, NOW(), 1),

-- Male glasses
('Square Frame Glasses', 'glasses', 1, 'male', 140.00, 'Bold square frames perfect for round faces', false, false, false, NOW(), 1, NOW(), 1),
('Oval Professional Glasses', 'glasses', 1, 'male', 160.00, 'Professional oval frames suitable for all face shapes', false, true, false, NOW(), 1, NOW(), 1),
('Rectangle Business Glasses', 'glasses', 1, 'male', 200.00, 'Modern rectangle frames for oblong faces', false, false, true, NOW(), 1, NOW(), 1),

-- Unisex glasses
('Classic Browline Glasses', 'glasses', 1, 'unisex', 175.00, 'Timeless browline frames perfect for round and oblong faces', true, false, false, NOW(), 1, NOW(), 1),
('Narrow Minimalist Glasses', 'glasses', 1, 'unisex', 130.00, 'Sleek narrow frames ideal for heart-shaped faces', false, true, false, NOW(), 1, NOW(), 1);

-- Sample Product Details (assuming we have product IDs 1-8 from above)
INSERT INTO product_detail (product_id, bridge_width, frame_width, lens_height, lens_width, temple_length, frame_material, frame_shape, frame_type, bridge_design, style, spring_hinges, weight, multifocal, created_at, created_by, updated_at, updated_by)
VALUES 
-- Cat Eye (product_id: 1)
(1, 18, 135, 42, 52, 145, 'plastic', 'cat_eye', 'full_rim', 'without_nose_pads', 'modern', false, 28.5, false, NOW(), 1, NOW(), 1),
-- Round (product_id: 2)
(2, 20, 140, 45, 48, 140, 'metal', 'round', 'full_rim', 'with_nose_pads', 'classic', true, 32.0, false, NOW(), 1, NOW(), 1),
-- Aviator (product_id: 3)
(3, 16, 142, 50, 58, 148, 'metal', 'aviator', 'full_rim', 'with_nose_pads', 'modern', false, 35.2, false, NOW(), 1, NOW(), 1),
-- Square (product_id: 4)
(4, 19, 138, 44, 50, 142, 'plastic', 'square', 'full_rim', 'without_nose_pads', 'modern', false, 30.1, false, NOW(), 1, NOW(), 1),
-- Oval (product_id: 5)
(5, 17, 136, 41, 49, 143, 'titanium', 'oval', 'full_rim', 'with_nose_pads', 'classic', true, 25.8, false, NOW(), 1, NOW(), 1),
-- Rectangle (product_id: 6)
(6, 18, 145, 38, 55, 150, 'metal', 'rectangle', 'full_rim', 'with_nose_pads', 'classic', false, 33.7, false, NOW(), 1, NOW(), 1),
-- Browline (product_id: 7)
(7, 20, 143, 46, 52, 147, 'composite', 'brow_line', 'half_rim', 'with_nose_pads', 'classic', false, 31.4, false, NOW(), 1, NOW(), 1),
-- Narrow (product_id: 8)
(8, 16, 132, 36, 44, 138, 'titanium', 'narrow', 'full_rim', 'with_nose_pads', 'modern', true, 22.3, false, NOW(), 1, NOW(), 1);

-- Sample Product Colors
INSERT INTO product_color (product_id, color_name, color_code, stock, product_number, created_at, created_by, updated_at, updated_by)
VALUES 
-- Colors for each product
(1, 'Black', '#000000', 50, 'CAT-001-BLK', NOW(), 1, NOW(), 1),
(1, 'Tortoise', '#8B4513', 30, 'CAT-001-TOR', NOW(), 1, NOW(), 1),
(2, 'Gold', '#FFD700', 40, 'RND-002-GLD', NOW(), 1, NOW(), 1),
(2, 'Silver', '#C0C0C0', 35, 'RND-002-SLV', NOW(), 1, NOW(), 1),
(3, 'Rose Gold', '#E8B4B8', 25, 'AVI-003-RSG', NOW(), 1, NOW(), 1),
(3, 'Black', '#000000', 45, 'AVI-003-BLK', NOW(), 1, NOW(), 1),
(4, 'Matte Black', '#2C3E50', 60, 'SQR-004-MBK', NOW(), 1, NOW(), 1),
(4, 'Navy Blue', '#1E3A8A', 20, 'SQR-004-NVY', NOW(), 1, NOW(), 1),
(5, 'Gunmetal', '#2A3439', 40, 'OVL-005-GMT', NOW(), 1, NOW(), 1),
(5, 'Brown', '#8B4513', 30, 'OVL-005-BRN', NOW(), 1, NOW(), 1),
(6, 'Silver', '#C0C0C0', 35, 'RCT-006-SLV', NOW(), 1, NOW(), 1),
(6, 'Black', '#000000', 45, 'RCT-006-BLK', NOW(), 1, NOW(), 1),
(7, 'Wood Brown', '#8B4513', 25, 'BRW-007-WDB', NOW(), 1, NOW(), 1),
(7, 'Black Gold', '#1C1C1C', 30, 'BRW-007-BLG', NOW(), 1, NOW(), 1),
(8, 'Rose Gold', '#E8B4B8', 15, 'NAR-008-RSG', NOW(), 1, NOW(), 1),
(8, 'Silver', '#C0C0C0', 20, 'NAR-008-SLV', NOW(), 1, NOW(), 1);

-- Sample Color Skin Recommendations
INSERT INTO color_skin_recommendation (product_color_id, skin_color_type, created_at, created_by, updated_at, updated_by)
VALUES 
-- Black colors - suitable for all skin types
(1, 'light', NOW(), 1, NOW(), 1),
(1, 'medium', NOW(), 1, NOW(), 1),
(1, 'dark', NOW(), 1, NOW(), 1),
(6, 'light', NOW(), 1, NOW(), 1),
(6, 'medium', NOW(), 1, NOW(), 1),
(6, 'dark', NOW(), 1, NOW(), 1),
(12, 'light', NOW(), 1, NOW(), 1),
(12, 'medium', NOW(), 1, NOW(), 1),
(12, 'dark', NOW(), 1, NOW(), 1),

-- Tortoise/Brown colors - better for medium to dark skin
(2, 'medium', NOW(), 1, NOW(), 1),
(2, 'dark', NOW(), 1, NOW(), 1),
(10, 'medium', NOW(), 1, NOW(), 1),
(10, 'dark', NOW(), 1, NOW(), 1),
(13, 'medium', NOW(), 1, NOW(), 1),
(13, 'dark', NOW(), 1, NOW(), 1),

-- Gold/Rose Gold colors - good for light to medium skin
(3, 'light', NOW(), 1, NOW(), 1),
(3, 'medium', NOW(), 1, NOW(), 1),
(5, 'light', NOW(), 1, NOW(), 1),
(5, 'medium', NOW(), 1, NOW(), 1),
(15, 'light', NOW(), 1, NOW(), 1),
(15, 'medium', NOW(), 1, NOW(), 1),

-- Silver/Gunmetal - versatile for all skin types
(4, 'light', NOW(), 1, NOW(), 1),
(4, 'medium', NOW(), 1, NOW(), 1),
(4, 'dark', NOW(), 1, NOW(), 1),
(9, 'light', NOW(), 1, NOW(), 1),
(9, 'medium', NOW(), 1, NOW(), 1),
(9, 'dark', NOW(), 1, NOW(), 1),
(11, 'light', NOW(), 1, NOW(), 1),
(11, 'medium', NOW(), 1, NOW(), 1),
(11, 'dark', NOW(), 1, NOW(), 1),
(16, 'light', NOW(), 1, NOW(), 1),
(16, 'medium', NOW(), 1, NOW(), 1),
(16, 'dark', NOW(), 1, NOW(), 1),

-- Navy Blue/Matte Black - good for medium to dark skin
(7, 'medium', NOW(), 1, NOW(), 1),
(7, 'dark', NOW(), 1, NOW(), 1),
(8, 'medium', NOW(), 1, NOW(), 1),
(8, 'dark', NOW(), 1, NOW(), 1),

-- Black Gold - suitable for dark skin
(14, 'dark', NOW(), 1, NOW(), 1);
