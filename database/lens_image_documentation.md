# Lens Image System Documentation

## Tổng quan

Hệ thống `lens_image` được thiết kế để quản lý hình ảnh của các sản phẩm lens theo schema đơn giản. Hệ thống hỗ trợ:

- Quản lý nhiều hình ảnh cho mỗi lens
- Hệ thống ordering với ảnh chính (order 'a')
- Upload và quản lý file trên AWS S3
- Soft delete để bảo toàn dữ liệu
- Thumbnail support

## Cấu trúc Database

### Bảng `lens_image`

```sql
CREATE TABLE `lens_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_id` bigint NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_order` varchar(1) DEFAULT NULL COMMENT 'a=primary, b, c, d, e',
  `is_thumbnail` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_lens_image_order` (`lens_id`, `image_order`, `deleted_at`)
);
```

### Các trường quan trọng:

- **`lens_id`**: ID của lens chính (bắt buộc)
- **`image_url`**: URL của hình ảnh
- **`image_order`**: Thứ tự ảnh ('a' = ảnh chính, 'b', 'c', 'd', 'e')
- **`is_thumbnail`**: Đánh dấu ảnh thumbnail

## API Endpoints

### 1. Tạo lens image

```
POST /lens-images
```

**Body:**

```json
{
  "lensId": 1,
  "imageUrl": "https://s3.amazonaws.com/bucket/lens/image.jpg",
  "imageOrder": "a",
  "isThumbnail": false
}
```

### 2. Upload lens image

```
POST /lens-images/upload
```

**Body (multipart/form-data):**

- `file`: Image file
- `lensId`: ID của lens
- `imageOrder`: Thứ tự ảnh ('a', 'b', 'c', 'd', 'e')

### 3. Lấy danh sách lens images

```
GET /lens-images?page=1&limit=10&lensId=1&search=text
```

### 4. Lấy ảnh theo lens

```
GET /lens-images/lens/1
```

### 5. Lấy ảnh chính của lens

```
GET /lens-images/lens/1/primary
```

### 6. Cập nhật lens image

```
PUT /lens-images/1
```

### 7. Xóa lens image

```
DELETE /lens-images/1
```

## Business Rules

### 1. Image Order System

- **'a'**: Ảnh chính (primary image) - chỉ có 1 ảnh với order 'a' cho mỗi lens
- **'b', 'c', 'd', 'e'**: Ảnh phụ theo thứ tự ưu tiên

### 2. File Upload

- Files được upload lên AWS S3
- Đường dẫn: `lens/{sanitized-lens-name}-{lens-id}/{filename}`
- Tự động tạo filename unique với crypto.randomBytes()

### 3. Unique Constraints

- Mỗi lens chỉ có 1 ảnh với cùng 1 image_order
- Constraint: `(lens_id, image_order, deleted_at)`

## Cách sử dụng

### 1. Thêm ảnh chính cho lens:

```typescript
await lensImageService.createLensImage(
  {
    lensId: 1,
    imageUrl: 'https://example.com/lens1-main.jpg',
    imageOrder: 'a', // Ảnh chính
    isThumbnail: false,
  },
  userId,
);
```

### 2. Lấy ảnh chính của lens:

```typescript
const primaryImage = await lensImageService.getPrimaryImageForLens(1);
```

### 3. Lấy tất cả ảnh của lens:

```typescript
const allImages = await lensImageService.getImagesForLens(1);
```

## Integration với Frontend

### LensImageService (Frontend)

```typescript
// services/lens-image.service.ts
class LensImageService {
  async uploadLensImage(
    file: File,
    lensId: number,
    options?: {
      imageOrder?: string;
    },
  ): Promise<string> {
    // Upload logic
  }

  async getLensImages(lensId: number): Promise<LensImage[]> {
    // Fetch images
  }

  async getPrimaryImage(lensId: number): Promise<LensImage | null> {
    // Get primary image
  }
}
```

## Best Practices

1. **Luôn có ảnh chính**: Đảm bảo mỗi lens có ít nhất 1 ảnh với order 'a'
2. **Tối ưu hình ảnh**: Compress và resize ảnh trước khi upload
3. **Error handling**: Xử lý lỗi khi ảnh không tồn tại hoặc upload failed
4. **Caching**: Cache URL ảnh ở frontend để tăng performance

## Monitoring & Maintenance

- Monitor AWS S3 storage usage
- Định kỳ clean up soft-deleted images
- Monitor API response times cho image endpoints
- Backup S3 bucket định kỳ
