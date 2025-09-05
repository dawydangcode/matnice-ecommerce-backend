-- Create product_3d_model table
CREATE TABLE product_3d_model (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT NOT NULL,
  model_type VARCHAR(50) NOT NULL COMMENT 'Type of 3D model: glb, gltf, obj, fbx, etc.',
  file_type VARCHAR(10) NOT NULL COMMENT 'File extension: .glb, .gltf, .obj, .fbx',
  file_url VARCHAR(500) NOT NULL COMMENT 'URL to the 3D model file',
  file_name VARCHAR(255) NOT NULL COMMENT 'Original filename',
  file_size BIGINT COMMENT 'File size in bytes',
  is_primary BOOLEAN DEFAULT FALSE COMMENT 'Primary 3D model for the product',
  thumbnail_url VARCHAR(500) COMMENT 'Preview thumbnail for the 3D model',
  metadata JSON COMMENT 'Additional metadata like textures, animations, etc.',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by BIGINT,
  deleted_at TIMESTAMP NULL,
  deleted_by BIGINT,
  
  INDEX idx_product_id (product_id),
  INDEX idx_model_type (model_type),
  INDEX idx_is_primary (is_primary),
  INDEX idx_deleted_at (deleted_at),
  
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
