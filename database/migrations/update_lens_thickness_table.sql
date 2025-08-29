-- Migration to update lens_thickness table structure
-- Remove old columns and add new ones

-- Drop old columns
ALTER TABLE lens_thickness 
DROP COLUMN IF EXISTS thickness,
DROP COLUMN IF EXISTS unit,
DROP COLUMN IF EXISTS is_active;

-- Add new columns
ALTER TABLE lens_thickness 
ADD COLUMN IF NOT EXISTS index_value DECIMAL(3,2) NOT NULL DEFAULT 1.50,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Update existing data or insert sample data
DELETE FROM lens_thickness WHERE 1=1;

-- Insert sample data based on provided SQL
INSERT INTO lens_thickness (name, index_value, price, description, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by)
VALUES 
('Standard', 1.56, 100.00, 'Chiết suất tiêu chuẩn', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1, NULL, NULL),
('Extra Thin', 1.74, 150.00, 'Chiết suất mỏng cao cấp', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1, NULL, NULL);
