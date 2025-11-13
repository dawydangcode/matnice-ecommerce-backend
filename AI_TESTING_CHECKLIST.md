# AI Service Testing Checklist

## Sau khi build xong, test các bước sau:

### 1. Kiểm tra container đang chạy
```bash
docker ps
```
✅ Phải thấy: app-1, mysql-1, nginx-1

### 2. Kiểm tra Python dependencies trong container
```bash
docker exec matnice-ecommerce-backend-app-1 python3 -c "import torch, mediapipe, ultralytics; print('✅ All AI packages installed')"
```

### 3. Test Gender AI script
```bash
docker exec matnice-ecommerce-backend-app-1 bash -c '
python3 /app/ai-models/gender-ai-package/gender_classifier.py \
  --source "https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/213/1763020694926-analysis.jpg" \
  --model "/app/ai-models/gender-ai-package/gender_best.pt" \
  --json
'
```
✅ Phải trả về JSON với gender và confidence

### 4. Test Skin Tone AI script
```bash
docker exec matnice-ecommerce-backend-app-1 bash -c '
export MPLCONFIGDIR=/tmp/matplotlib && \
python3 /app/ai-models/skincolor-ai-model/face_skin_analyzer.py \
  --source "https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/213/1763020694926-analysis.jpg" \
  --model "/app/ai-models/skincolor-ai-model/runs/train20/weights/best.pt" \
  --output /tmp/skin-analysis \
  --json
'
```
✅ Phải trả về JSON với skin_type và confidence

### 5. Test Face Shape AI script  
```bash
docker exec matnice-ecommerce-backend-app-1 bash -c '
python3 /app/ai-models/faceshape-ai-package/faceshape_classifier.py \
  --source "https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/213/1763020694926-analysis.jpg" \
  --model "/app/ai-models/faceshape-ai-package/faceshape_best.pt" \
  --json
'
```
✅ Phải trả về JSON với face_shape và confidence

### 6. Test API endpoint (từ frontend)
Upload ảnh qua https://matnice.id.vn/ và kiểm tra response

### 7. Xem logs real-time
```bash
docker-compose -f docker-compose.prod.yml logs -f app | grep AIService
```
✅ Không còn lỗi "Skin tone analysis process failed"

### 8. Kiểm tra kết quả trong database
```bash
docker exec matnice-ecommerce-backend-mysql-1 mysql -u root -p${DB_PASSWORD} -e "
SELECT id, gender_result, skin_tone_result, face_shape_result, status, created_at 
FROM matnice_db.face_analysis 
ORDER BY id DESC 
LIMIT 5;
"
```
✅ Phải thấy results được lưu đầy đủ

## Nếu có lỗi:

### Lỗi Permission Denied
```bash
# Kiểm tra permissions
docker exec matnice-ecommerce-backend-app-1 ls -la /tmp/
```

### Lỗi Module not found
```bash
# Kiểm tra Python packages
docker exec matnice-ecommerce-backend-app-1 pip3 list | grep -E "torch|mediapipe|ultralytics|opencv"
```

### Lỗi File not found
```bash
# Kiểm tra AI models files
docker exec matnice-ecommerce-backend-app-1 ls -la /app/ai-models/
```

## Metrics để theo dõi:

- **Processing time**: Mỗi analysis nên < 30 giây
- **Success rate**: > 95%
- **Memory usage**: < 1.5GB per analysis
- **Image size**: ~3.7GB (acceptable với AI models)
