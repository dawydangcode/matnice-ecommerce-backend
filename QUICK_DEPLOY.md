# 🚀 Hướng dẫn Deploy nhanh

## Bước 1: Build trên máy local (1 lần duy nhất)

```bash
# Tại thư mục matnice-ecommerce-backend trên máy local

# 1. Login Docker Hub
docker login
# Nhập username và password

# 2. Build và push (thay dawydang bằng username Docker Hub của bạn)
./build-and-push.sh dawydang
```

**Thời gian:** ~10-15 phút (chỉ làm 1 lần hoặc khi code thay đổi)

---

## Bước 2: Deploy trên EC2

```bash
# SSH vào EC2
ssh ec2-user@your-ec2-ip

# Di chuyển vào project
cd /home/ec2-user/matnice-ecommerce-backend

# Pull code mới
git pull origin main

# Deploy (thay dawydang bằng username của bạn)
./deploy-on-ec2.sh dawydang
```

**Thời gian:** ~2-3 phút (mỗi lần deploy)

---

## ✅ Kiểm tra sau khi deploy

```bash
# Xem containers đang chạy
sudo docker-compose -f docker-compose.prod.yml ps

# Xem logs
sudo docker-compose -f docker-compose.prod.yml logs -f app

# Test API
curl http://localhost:3000/api/health

# Test Python trong container
sudo docker-compose exec app python3 --version
sudo docker-compose exec app python3 -c "import torch; print(torch.__version__)"
```

---

## 🔧 Troubleshooting

### Image quá lớn (> 2GB)
- Kiểm tra Dockerfile đã dùng PyTorch CPU-only chưa
- Xem dòng: `torch==2.5.1+cpu` và `--index-url https://download.pytorch.org/whl/cpu`

### Build bị lỗi Out of Memory
- Cần máy local có ít nhất 4GB RAM
- Tăng Docker memory trong Docker Desktop Settings

### EC2 không pull được image
```bash
# Kiểm tra kết nối Docker Hub
docker pull hello-world

# Login Docker Hub trên EC2 (nếu image là private)
sudo docker login
```

### Container không start
```bash
# Xem logs chi tiết
sudo docker-compose -f docker-compose.prod.yml logs app

# Kiểm tra port conflict
sudo netstat -tlnp | grep 3000

# Restart containers
sudo docker-compose -f docker-compose.prod.yml restart
```

---

## 📊 Thông tin Image

- **Base image**: node:20-slim
- **Python**: 3.x (system python3)
- **PyTorch**: 2.5.1+cpu (~200MB)
- **Tổng size**: ~800MB - 1.2GB
- **Thời gian build**: 10-15 phút
- **Thời gian pull**: 3-5 phút (tùy tốc độ mạng)

---

## 🔄 Update code trong tương lai

```bash
# Trên máy local
git add .
git commit -m "your changes"
git push origin main

# Build lại image (chỉ khi code backend thay đổi)
./build-and-push.sh dawydang

# Trên EC2
cd /home/ec2-user/matnice-ecommerce-backend
git pull origin main
./deploy-on-ec2.sh dawydang
```

**Lưu ý:** Nếu chỉ thay đổi .env hoặc config, không cần build lại image, chỉ cần restart:
```bash
sudo docker-compose -f docker-compose.prod.yml restart
```
