# Product Color & Detail Management Documentation

## Overview

Hệ thống quản lý sản phẩm đã được cập nhật để hỗ trợ nhiều màu sắc cho mỗi sản phẩm, với mỗi màu có thể có chi tiết kỹ thuật và hình ảnh riêng biệt.

## Database Schema Changes

### New Tables

#### 1. product_color

Bảng quản lý các màu sắc của sản phẩm.

| Column                                      | Type                  | Description                      |
| ------------------------------------------- | --------------------- | -------------------------------- |
| id                                          | BIGSERIAL             | Primary key                      |
| product_id                                  | BIGINT                | Foreign key to product table     |
| color_name                                  | VARCHAR(100)          | Tên màu (VD: "Đen", "Xanh Navy") |
| color_code                                  | VARCHAR(20)           | Mã màu hex (VD: "#000000")       |
| stock                                       | INTEGER               | Số lượng tồn kho cho màu này     |
| price_adjustment                            | DECIMAL(10,2)         | Điều chỉnh giá cho màu đặc biệt  |
| is_available                                | BOOLEAN               | Màu có sẵn hay không             |
| created_at/by, updated_at/by, deleted_at/by | Standard audit fields |

#### 2. product_detail (Updated)

Bảng chi tiết kỹ thuật được liên kết với product_color thay vì product.

| Column           | Type         | Description                  |
| ---------------- | ------------ | ---------------------------- |
| id               | BIGSERIAL    | Primary key                  |
| product_color_id | BIGINT       | Foreign key to product_color |
| bridge_width     | DOUBLE       | Chiều rộng cầu mũi           |
| frame_width      | DOUBLE       | Chiều rộng gọng              |
| lens_height      | DOUBLE       | Chiều cao tròng              |
| lens_width       | DOUBLE       | Chiều rộng tròng             |
| temple_length    | DOUBLE       | Chiều dài càng               |
| product_number   | INTEGER      | Số hiệu sản phẩm             |
| frame_material   | VARCHAR(100) | Chất liệu gọng               |
| frame_shape      | VARCHAR(50)  | Hình dạng gọng               |
| frame_type       | VARCHAR(50)  | Loại gọng                    |
| bridge_design    | VARCHAR(50)  | Thiết kế cầu mũi             |
| style            | VARCHAR(50)  | Phong cách                   |
| spring_hinges    | BOOLEAN      | Có bản lề lò xo              |
| weight           | DOUBLE       | Trọng lượng                  |
| multifocal       | BOOLEAN      | Có đa tiêu cự                |

### Modified Tables

#### product_image

- Thêm cột `product_color_id` để liên kết với màu cụ thể
- Giữ `product_id` để backward compatibility

## API Endpoints

### Product Color Management

```
GET /products/{productId}/colors - Lấy danh sách màu của sản phẩm
GET /products/{productId}/colors/{colorId} - Lấy thông tin màu cụ thể
POST /products/{productId}/colors - Tạo màu mới cho sản phẩm
PUT /products/{productId}/colors/{colorId} - Cập nhật thông tin màu
DELETE /products/{productId}/colors/{colorId} - Xóa màu
```

### Product Detail Management (by Color)

```
GET /products/{productId}/colors/{colorId}/details - Lấy chi tiết kỹ thuật của màu
POST /products/{productId}/colors/{colorId}/details - Tạo chi tiết kỹ thuật
PUT /products/{productId}/colors/{colorId}/details - Cập nhật chi tiết kỹ thuật
DELETE /products/{productId}/colors/{colorId}/details - Xóa chi tiết kỹ thuật
```

## Business Logic Changes

### Stock Management

- **Trước**: Stock được quản lý ở level product
- **Sau**: Stock được quản lý ở level product_color
- Product.stock = tổng stock của tất cả màu available

### Price Management

- Base price ở product level
- Mỗi màu có thể có price_adjustment (VD: +50000 cho màu vàng gold)
- Final price = product.price + product_color.price_adjustment

### Image Management

- Hình ảnh có thể liên kết với:
  - Product (hình ảnh chung)
  - Product Color (hình ảnh cụ thể cho màu)

## Usage Examples

### 1. Tạo sản phẩm kính mắt

```typescript
// 1. Tạo product cơ bản
const product = await productService.createProduct({
  productName: 'Gọng kính Ray-Ban Aviator',
  price: 2500000,
  // ... other fields
});

// 2. Thêm các màu
const blackColor = await productColorService.createProductColor(
  product.id,
  'Đen',
  '#000000',
  50, // stock
  0, // no price adjustment
  true,
);

const goldColor = await productColorService.createProductColor(
  product.id,
  'Vàng Gold',
  '#FFD700',
  20, // stock
  200000, // +200k cho màu gold
  true,
);

// 3. Thêm chi tiết kỹ thuật cho từng màu
await productDetailService.createProductDetail(blackColor.id, {
  bridgeWidth: 14,
  frameWidth: 140,
  lensHeight: 51,
  lensWidth: 58,
  templeLength: 135,
  frameMaterial: 'Metal',
  frameShape: 'Aviator',
  weight: 31.5,
});

await productDetailService.createProductDetail(goldColor.id, {
  bridgeWidth: 14,
  frameWidth: 140,
  lensHeight: 51,
  lensWidth: 58,
  templeLength: 135,
  frameMaterial: 'Gold Plated Metal',
  frameShape: 'Aviator',
  weight: 33.2,
});
```

### 2. Query sản phẩm với màu sắc

```typescript
// Lấy tất cả màu của sản phẩm
const colors = await productColorService.getProductColors(productId);

// Lấy chi tiết của màu cụ thể
const colorDetail =
  await productDetailService.getProductDetailByColorId(colorId);

// Tính tổng stock
const totalStock =
  await productColorService.getTotalStockByProductId(productId);
```

## Migration Guide

### Database Migration

1. Chạy script `create_product_color_and_detail_tables.sql`
2. Migrate dữ liệu cũ từ product_detail sang product_color_id structure
3. Update product_image records để link với product_color nếu cần

### Code Migration

1. Update frontend để hiển thị color options
2. Update product forms để quản lý màu sắc
3. Update inventory management để track stock by color
4. Update order processing để handle color selection

## Benefits

1. **Tính linh hoạt**: Mỗi màu có thể có thông số kỹ thuật khác nhau
2. **Quản lý kho**: Track stock chính xác theo từng màu
3. **Trải nghiệm người dùng**: Khách hàng thấy rõ màu nào còn hàng
4. **Marketing**: Có thể định giá khác nhau cho màu đặc biệt
5. **Hình ảnh**: Mỗi màu có bộ ảnh riêng, trực quan hơn

## Notes

- Backward compatibility được đảm bảo qua việc giữ product_id trong product_image
- Stock ở product level được tự động cập nhật từ tổng stock các màu
- Tất cả operations đều có soft delete support
- API có JWT authentication và proper error handling
