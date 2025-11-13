# Build và Deploy Docker Image

## ✨ Phương án khuyến nghị: Sử dụng Script tự động

### Trên máy local:

```bash
# 1. Đảm bảo đã login Docker Hub
docker login

# 2. Chạy script build và push (thay YOUR_USERNAME bằng Docker Hub username của bạn)
./build-and-push.sh YOUR_DOCKERHUB_USERNAME

# Ví dụ: ./build-and-push.sh dawydang
```

**Script sẽ tự động:**
- ✅ Build production image với PyTorch CPU-only
- ✅ Hiển thị kích thước image
- ✅ Hỏi xác nhận trước khi push
- ✅ Push lên Docker Hub
- ✅ Hiển thị lệnh deploy tiếp theo

### Trên EC2 Server:

```bash
# SSH vào EC2
ssh ec2-user@your-ec2-ip

# Di chuyển vào thư mục project
cd /home/ec2-user/matnice-ecommerce-backend

# Pull code mới nhất
git pull origin main

# Chạy script deploy (thay YOUR_USERNAME)
./deploy-on-ec2.sh YOUR_DOCKERHUB_USERNAME

# Ví dụ: ./deploy-on-ec2.sh dawydang
```

**Script sẽ tự động:**
- ✅ Pull image từ Docker Hub
- ✅ Backup và update docker-compose.prod.yml
- ✅ Stop containers cũ
- ✅ Start containers mới
- ✅ Hiển thị logs và status

---

## 📝 Phương án thủ công (nếu script không chạy)

### Bước 1: Chuẩn bị trên máy local

1. **Clone repository về máy local:**
```bash
git clone https://github.com/dawydangcode/matnice-ecommerce-backend.git
cd matnice-ecommerce-backend
```

2. **Login vào Docker Hub:**
```bash
docker login
# Nhập username và password Docker Hub của bạn
```

### Bước 2: Build Docker Image

3. **Build production image:**
```bash
# Thay YOUR_DOCKERHUB_USERNAME bằng username Docker Hub của bạn
docker build -f Dockerfile --target production -t YOUR_DOCKERHUB_USERNAME/matnice-backend:latest .

# Ví dụ: docker build -f Dockerfile --target production -t johndoe/matnice-backend:latest .
```

**Lưu ý:** Quá trình build sẽ mất 10-20 phút do cần cài đặt PyTorch và các AI libraries.

### Bước 3: Push Image lên Docker Hub

4. **Push image:**
```bash
docker push YOUR_DOCKERHUB_USERNAME/matnice-backend:latest
```

### Bước 4: Deploy trên EC2 Server

5. **SSH vào EC2 server và pull image:**
```bash
# Trên EC2 server
cd /home/ec2-user/matnice-ecommerce-backend

# Pull image từ Docker Hub
docker pull YOUR_DOCKERHUB_USERNAME/matnice-backend:latest
```

6. **Cập nhật docker-compose.prod.yml:**

Sửa file `docker-compose.prod.yml`, thay thế section `build` bằng `image`:

```yaml
services:
  app:
    image: YOUR_DOCKERHUB_USERNAME/matnice-backend:latest
    restart: unless-stopped
    # ... phần còn lại giữ nguyên
```

7. **Start services:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

8. **Kiểm tra logs:**
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

---

## Phương án thay thế: Sử dụng GitHub Actions (CI/CD)

Tạo file `.github/workflows/docker-build.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        file: ./Dockerfile
        push: true
        tags: ${{ secrets.DOCKERHUB_USERNAME }}/matnice-backend:latest
        target: production
```

Sau đó mỗi lần push code lên GitHub, image sẽ tự động build và push lên Docker Hub.

---

## Troubleshooting

### Lỗi: Out of memory khi build
- Build trên máy có ít nhất 4GB RAM
- Hoặc tăng Docker memory limit trong Docker Desktop

### Lỗi: Image quá lớn
- Image sẽ khoảng 2-3GB do PyTorch
- Đảm bảo có đủ dung lượng trên server

### Kiểm tra image đã tồn tại
```bash
docker images | grep matnice-backend
```
