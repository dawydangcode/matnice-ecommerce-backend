# AI Service Database Structure

## Overview

Cấu trúc database cho chức năng phân tích màu da và giới tính **tích hợp với session system hiện tại** - hỗ trợ cả anonymous users và registered users.

## Integration với Session System

- ✅ **Tích hợp với `session` table**: Sử dụng session_id từ bảng session hiện tại
- ✅ **Anonymous sessions**: Tạo session mới cho anonymous users
- ✅ **Registered users**: Sử dụng session hiện tại của user đã đăng nhập
- ✅ **Consistent auth**: Đồng nhất với hệ thống auth hiện tại
- ✅ **Session management**: Leverage existing session lifecycle

## Table: face_analysis

### Description

Lưu trữ thông tin phân tích khuôn mặt cho cả **anonymous users** và registered users. Anonymous users được identify bằng session_id và có user_id = NULL.

### Schema

```sql
CREATE TABLE face_analysis (
  -- Primary Key
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  -- Session & User Information (tích hợp với session system hiện tại)
  session_id BIGINT NOT NULL COMMENT 'Foreign key tới bảng session',
  user_id BIGINT NULL COMMENT 'Foreign key tới bảng user (nullable cho anonymous)',  -- Image Information
  image_url VARCHAR(255) NOT NULL COMMENT 'URL của ảnh đã upload',
  image_s3_key VARCHAR(50) NOT NULL COMMENT 'S3 key để truy xuất ảnh',

  -- Gender Analysis Results
  detected_gender ENUM('male', 'female', 'unknown') DEFAULT 'unknown' COMMENT 'Giới tính được phát hiện',
  gender_confidence DECIMAL(5,4) DEFAULT 0 COMMENT 'Độ tin cậy của kết quả giới tính (0-1)',

  -- Skin Tone Analysis Results
  detected_skin_tone ENUM('light', 'medium', 'dark', 'unknown') DEFAULT 'unknown' COMMENT 'Màu da được phát hiện',
  skin_tone_confidence DECIMAL(5,4) DEFAULT 0 COMMENT 'Độ tin cậy của kết quả màu da (0-1)',

  -- Processing Status
  analysis_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending' COMMENT 'Trạng thái xử lý',
  error_message TEXT NULL COMMENT 'Thông báo lỗi nếu có',

  -- Processing Performance
  processing_time_ms INT NULL COMMENT 'Thời gian xử lý tính bằng milliseconds',

  -- Metadata (JSON format)
  analysis_metadata JSON NULL COMMENT 'Metadata bổ sung về quá trình phân tích',

  -- Timestamps (consistent với existing schema)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo record',
  created_by BIGINT NULL COMMENT 'User tạo record (NULL cho system)',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật cuối',
  updated_by BIGINT NULL COMMENT 'User cập nhật record',
  deleted_at TIMESTAMP NULL COMMENT 'Soft delete timestamp',
  deleted_by BIGINT NULL COMMENT 'User xóa record',

  -- Foreign Key Constraints
  FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES user(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES user(id) ON DELETE SET NULL,
  FOREIGN KEY (deleted_by) REFERENCES user(id) ON DELETE SET NULL
);
```

### Indexes

````sql
-- Index for session lookup
CREATE INDEX idx_face_analysis_session_id ON face_analysis(session_id);

-- Index for user lookup
CREATE INDEX idx_face_analysis_user_id ON face_analysis(user_id);

-- Index for created_at (for cleanup and reporting)
CREATE INDEX idx_face_analysis_created_at ON face_analysis(created_at);

-- Composite index for active records
CREATE INDEX idx_face_analysis_active ON face_analysis(deleted_at, analysis_status);

-- Index for audit trail
CREATE INDEX idx_face_analysis_created_by ON face_analysis(created_by);
```## Field Details

### Core Fields

| Field      | Type             | Description                      | Example                                |
| ---------- | ---------------- | -------------------------------- | -------------------------------------- |
| id         | BIGINT           | Primary key tự động tăng         | 1, 2, 3...                             |
| session_id | BIGINT           | **FK tới bảng session**          | 123 (từ session.id)                    |
| user_id    | BIGINT (nullable)| **FK tới bảng user**             | 456 (registered) hoặc NULL (anonymous) |

### Image Fields

| Field        | Type         | Description            | Example                                          |
| ------------ | ------------ | ---------------------- | ------------------------------------------------ |
| image_url    | VARCHAR(255) | Public URL của ảnh     | "https://s3.amazonaws.com/bucket/images/abc.jpg" |
| image_s3_key | VARCHAR(50)  | S3 key để quản lý file | "ai-analysis/2025/09/12/abc-123.jpg"             |

### Analysis Results

| Field                | Type         | Description          | Values                               |
| -------------------- | ------------ | -------------------- | ------------------------------------ |
| detected_gender      | ENUM         | Giới tính phát hiện  | 'male', 'female', 'unknown'          |
| gender_confidence    | DECIMAL(5,4) | Độ tin cậy giới tính | 0.0000 - 1.0000                      |
| detected_skin_tone   | ENUM         | Màu da phát hiện     | 'light', 'medium', 'dark', 'unknown' |
| skin_tone_confidence | DECIMAL(5,4) | Độ tin cậy màu da    | 0.0000 - 1.0000                      |

### Status & Processing

| Field              | Type | Description          | Values                                         |
| ------------------ | ---- | -------------------- | ---------------------------------------------- |
| analysis_status    | ENUM | Trạng thái xử lý     | 'pending', 'processing', 'completed', 'failed' |
| error_message      | TEXT | Thông báo lỗi        | "Face not detected in image"                   |
| processing_time_ms | INT  | Thời gian xử lý (ms) | 1500, 2300...                                  |

### Metadata JSON Structure

```json
{
  "imageWidth": 1920,
  "imageHeight": 1080,
  "faceDetected": true,
  "faceCount": 1,
  "modelVersions": {
    "genderModel": "gender_best.pt v1.0",
    "skinToneModel": "best.pt v2.0"
  },
  "detectionBoxes": [
    {
      "x": 100,
      "y": 150,
      "width": 200,
      "height": 250,
      "confidence": 0.95
    }
  ]
}
````

## Usage Patterns

### 1. Tạo Analysis Record

```sql
-- Bước 1: Tạo session cho anonymous user
INSERT INTO session (
  user_id, type, user_agent, ip_address, is_active, created_at
) VALUES (
  NULL, 'anonymous_ai', 'Mozilla/5.0...', '192.168.1.1', true, NOW()
);
SET @session_id = LAST_INSERT_ID();

-- Bước 2: Tạo face analysis record
INSERT INTO face_analysis (
  session_id, user_id, image_url, image_s3_key, analysis_status, created_at
) VALUES (
  @session_id, NULL, 'https://...', 'ai-analysis/...', 'pending', NOW()
);

-- Registered user (sử dụng session hiện tại)
INSERT INTO face_analysis (
  session_id, user_id, image_url, image_s3_key, analysis_status, created_by, created_at
) VALUES (
  @existing_session_id, 123, 'https://...', 'ai-analysis/...', 'pending', 123, NOW()
);
```

### 2. Cập Nhật Kết Quả Phân Tích

```sql
UPDATE face_analysis
SET
  detected_gender = 'female',
  gender_confidence = 0.8945,
  detected_skin_tone = 'medium',
  skin_tone_confidence = 0.7821,
  analysis_status = 'completed',
  processing_time_ms = 1850,
  analysis_metadata = '{"imageWidth": 1920, "imageHeight": 1080, ...}'
WHERE id = ?;
```

### 3. Lấy Kết Quả Theo Session

```sql
-- Lấy kết quả với thông tin session và user
SELECT
  fa.*,
  s.user_agent,
  s.ip_address,
  s.is_active as session_active,
  u.username,
  ud.name as user_name
FROM face_analysis fa
JOIN session s ON fa.session_id = s.id
LEFT JOIN user u ON fa.user_id = u.id
LEFT JOIN user_detail ud ON u.id = ud.user_id
WHERE fa.session_id = ?
  AND fa.deleted_at IS NULL
  AND s.deleted_at IS NULL;
```

### 4. Lấy Lịch Sử Của User

```sql
-- Lấy tất cả analysis của user (qua tất cả sessions)
SELECT
  fa.*,
  s.created_at as session_created_at,
  s.user_agent,
  s.ip_address
FROM face_analysis fa
JOIN session s ON fa.session_id = s.id
WHERE fa.user_id = ?
  AND fa.deleted_at IS NULL
  AND s.deleted_at IS NULL
ORDER BY fa.created_at DESC
LIMIT 10;
```

### 5. Cleanup Dữ Liệu

```sql
-- Xóa analysis của anonymous sessions cũ (30 ngày)
UPDATE face_analysis fa
JOIN session s ON fa.session_id = s.id
SET fa.deleted_at = NOW(), fa.deleted_by = NULL
WHERE s.user_id IS NULL
  AND s.type = 'anonymous_ai'
  AND fa.created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Xóa failed analysis (7 ngày)
UPDATE face_analysis
SET deleted_at = NOW(), deleted_by = NULL
WHERE analysis_status = 'failed'
  AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Cleanup inactive anonymous sessions
UPDATE session
SET deleted_at = NOW(), deleted_by = NULL
WHERE user_id IS NULL
  AND type = 'anonymous_ai'
  AND is_active = false
  AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);
```

## Data Retention Policy

1. **Anonymous Records**: Tự động xóa sau 30 ngày
2. **Failed Records**: Xóa sau 7 ngày
3. **Anonymous Sessions**: Xóa sau 30 ngày
4. **User Sessions**: Giữ theo user preference hoặc 1 năm

## Performance Considerations

1. **Partitioning**: Có thể partition theo tháng nếu volume lớn
2. **Archiving**: Move old records sang archive table
3. **Indexing**: Đảm bảo có index cho các query pattern chính
4. **JSON Fields**: Sử dụng JSON functions của MySQL 8.0+ để query metadata

## Security & Privacy

1. **Image URLs**: Sử dụng signed URLs với expiration
2. **S3 Keys**: Encrypt at rest
3. **User Data**: Tuân thủ GDPR/privacy laws
4. **Soft Delete**: Sử dụng soft delete để có thể recover

## Migration Script

```sql
-- Create face_analysis table (tích hợp với session system)
CREATE TABLE face_analysis (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id BIGINT NOT NULL,
  user_id BIGINT NULL,
  image_url VARCHAR(255) NOT NULL,
  image_s3_key VARCHAR(50) NOT NULL,
  detected_gender ENUM('male', 'female', 'unknown') DEFAULT 'unknown',
  gender_confidence DECIMAL(5,4) DEFAULT 0,
  detected_skin_tone ENUM('light', 'medium', 'dark', 'unknown') DEFAULT 'unknown',
  skin_tone_confidence DECIMAL(5,4) DEFAULT 0,
  analysis_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  error_message TEXT NULL,
  processing_time_ms INT NULL,
  analysis_metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by BIGINT NULL,
  deleted_at TIMESTAMP NULL,
  deleted_by BIGINT NULL,

  -- Foreign Key Constraints
  FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES user(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES user(id) ON DELETE SET NULL,
  FOREIGN KEY (deleted_by) REFERENCES user(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_face_analysis_session_id ON face_analysis(session_id);
CREATE INDEX idx_face_analysis_user_id ON face_analysis(user_id);
CREATE INDEX idx_face_analysis_created_at ON face_analysis(created_at);
CREATE INDEX idx_face_analysis_active ON face_analysis(deleted_at, analysis_status);
CREATE INDEX idx_face_analysis_created_by ON face_analysis(created_by);
```

## New Session Types

```sql
-- Thêm session types cho AI service (nếu chưa có)
-- Có thể thêm vào enum existing hoặc dùng VARCHAR
-- Ví dụ session.type values:
-- 'web_login', 'mobile_login', 'anonymous_ai', 'api_token'
```
