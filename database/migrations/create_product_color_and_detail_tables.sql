-- Create product_color table
CREATE TABLE product_color (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    color_code VARCHAR(20),
    stock INTEGER DEFAULT 0,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT NOT NULL,
    deleted_at TIMESTAMP,
    deleted_by BIGINT,
    
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Create product_detail table with new structure
CREATE TABLE product_detail (
    id BIGSERIAL PRIMARY KEY,
    product_color_id BIGINT NOT NULL,
    bridge_width DOUBLE PRECISION,
    frame_width DOUBLE PRECISION,
    lens_height DOUBLE PRECISION,
    lens_width DOUBLE PRECISION,
    temple_length DOUBLE PRECISION,
    product_number INTEGER,
    frame_material VARCHAR(100),
    frame_shape VARCHAR(50),
    frame_type VARCHAR(50),
    bridge_design VARCHAR(50),
    style VARCHAR(50),
    spring_hinges BOOLEAN DEFAULT false,
    weight DOUBLE PRECISION,
    multifocal BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT NOT NULL,
    deleted_at TIMESTAMP,
    deleted_by BIGINT,
    
    FOREIGN KEY (product_color_id) REFERENCES product_color(id)
);

-- Modify product_image table to add product_color_id
ALTER TABLE product_image 
ADD COLUMN product_color_id BIGINT,
ADD FOREIGN KEY (product_color_id) REFERENCES product_color(id);

-- Create indexes for better performance
CREATE INDEX idx_product_color_product_id ON product_color(product_id);
CREATE INDEX idx_product_color_deleted_at ON product_color(deleted_at);
CREATE INDEX idx_product_detail_product_color_id ON product_detail(product_color_id);
CREATE INDEX idx_product_detail_deleted_at ON product_detail(deleted_at);
CREATE INDEX idx_product_image_product_color_id ON product_image(product_color_id);
