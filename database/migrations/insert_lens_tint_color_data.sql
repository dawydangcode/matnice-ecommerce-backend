-- Sample data for lens_tint_color table
-- These are common tint colors for glasses lenses

INSERT INTO lens_tint_color (lens_variant_id, name, image_url, color_code, created_at, created_by, updated_at, updated_by)
VALUES 
-- Clear/Transparent (assuming lens_variant_id = 1)
(1, 'Clear', NULL, NULL, '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),
(1, 'Light Gray', NULL, '#D3D3D3', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),
(1, 'Medium Gray', NULL, '#808080', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),
(1, 'Dark Gray', NULL, '#404040', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),

-- Brown tints
(1, 'Light Brown', NULL, '#D2B48C', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),
(1, 'Medium Brown', NULL, '#8B4513', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),
(1, 'Dark Brown', NULL, '#654321', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),

-- Other popular tints
(1, 'Light Blue', NULL, '#87CEEB', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),
(1, 'Light Green', NULL, '#90EE90', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),
(1, 'Light Yellow', NULL, '#FFFFE0', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1),
(1, 'Light Pink', NULL, '#FFB6C1', '2025-08-01 09:00:00', 1, '2025-08-01 09:00:00', 1);
