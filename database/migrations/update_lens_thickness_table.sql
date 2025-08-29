-- Migration to update lens_thickness table structure
-- Remove price column since each lens_variant will have its own price

-- Drop old columns
ALTER TABLE lens_thickness 
DROP COLUMN IF EXISTS thickness,
DROP COLUMN IF EXISTS unit,
DROP COLUMN IF EXISTS is_active,
DROP COLUMN IF EXISTS price;

-- Add new columns
ALTER TABLE lens_thickness 
ADD COLUMN IF NOT EXISTS index_value DECIMAL(3,2) NOT NULL DEFAULT 1.50;

-- Update existing data or insert sample data
DELETE FROM lens_thickness WHERE 1=1;

-- Insert sample data without price (price will be in lens_variant)
INSERT INTO lens_thickness (name, index_value, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by)
VALUES 
('Standard', 1.56, 'Chiết suất tiêu chuẩn', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1, NULL, NULL),
('Thin', 1.60, 'Chiết suất mỏng', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1, NULL, NULL),
('Extra Thin', 1.67, 'Chiết suất mỏng cao cấp', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1, NULL, NULL),
('Ultra Thin', 1.74, 'Chiết suất siêu mỏng', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1, NULL, NULL);
