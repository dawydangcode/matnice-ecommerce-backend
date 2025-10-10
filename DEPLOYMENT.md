# 🚀 Hướng dẫn Deploy Backend lên EC2 AWS

## 📋 Bước 1: Chuẩn bị EC2 Instance

### 1.1 Tạo EC2 Instance

```bash
# Chọn AMI: Amazon Linux 2 hoặc Ubuntu 20.04+
# Instance Type: t3.medium trở lên (2 vCPU, 4GB RAM)
# Security Group: Mở port 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (API)
```

### 1.2 Cài đặt Docker và Docker Compose

```bash
# Kết nối SSH vào EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Cập nhật hệ thống
sudo yum update -y  # Amazon Linux
# hoặc sudo apt update && sudo apt upgrade -y  # Ubuntu

# Cài đặt Docker
sudo yum install -y docker  # Amazon Linux
# hoặc sudo apt install -y docker.io  # Ubuntu

# Khởi động Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker $USER

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout và login lại để áp dụng group changes
exit
```

## 🗄️ Bước 2: Tạo Database

### Option 1: Sử dụng RDS (Khuyến nghị cho Production)

```bash
# Tạo RDS MySQL instance trên AWS Console
# - Engine: MySQL 8.0
# - Instance Class: db.t3.micro (free tier) hoặc db.t3.small
# - Storage: 20GB
# - Multi-AZ: No (cho dev), Yes (cho production)
# - VPC: Cùng VPC với EC2
# - Security Group: Cho phép kết nối từ EC2 (port 3306)

# Ghi chú thông tin kết nối:
# Endpoint: your-rds-endpoint.amazonaws.com
# Port: 3306
# Username: admin
# Password: your-strong-password
# Database: matnice_ecommerce
```

### Option 2: Sử dụng MySQL trên EC2 (Docker)

```bash
# Database sẽ chạy trong Docker container theo docker-compose.prod.yml
# Dữ liệu được lưu trong Docker volume mysql_data
```

## 📁 Bước 3: Upload Code lên EC2

### 3.1 Sử dụng Git (Khuyến nghị)

```bash
# Trên EC2
sudo yum install -y git  # Amazon Linux
# hoặc sudo apt install -y git  # Ubuntu

# Clone repository
git clone https://github.com/your-username/matnice-ecommerce-backend.git
cd matnice-ecommerce-backend
```

### 3.2 Hoặc sử dụng SCP

```bash
# Từ máy local
scp -i your-key.pem -r /path/to/matnice-ecommerce-backend ec2-user@your-ec2-ip:~/
```

## ⚙️ Bước 4: Cấu hình Environment

### 4.1 Tạo file .env.production

```bash
# Trên EC2
cd matnice-ecommerce-backend
cp .env.production .env

# Chỉnh sửa file .env với thông tin thực tế
nano .env.production
```

### 4.2 Cấu hình cho RDS (nếu sử dụng)

```bash
# Trong file .env.production
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your-rds-password
DB_NAME=matnice_ecommerce
```

### 4.3 Cấu hình cho Docker MySQL (nếu sử dụng)

```bash
# Trong file .env.production
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-strong-password
DB_NAME=matnice_ecommerce
```

## 🚀 Bước 5: Deploy Application

### 5.1 Sử dụng Deploy Script

```bash
# Chạy script deploy
./deploy.sh
```

### 5.2 Hoặc Deploy Manual

```bash
# Build và start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Kiểm tra status
docker-compose -f docker-compose.prod.yml ps

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔧 Bước 6: Cấu hình Domain và SSL (Optional)

### 6.1 Cấu hình Domain

```bash
# Point domain DNS A record to EC2 public IP
# Example: api.yourdomain.com -> 3.x.x.x
```

### 6.2 Cấu hình SSL với Let's Encrypt

```bash
# Cài đặt Certbot
sudo yum install -y certbot  # Amazon Linux
# hoặc sudo apt install -y certbot  # Ubuntu

# Tạo SSL certificate
sudo certbot certonly --standalone -d api.yourdomain.com

# Copy certificates to nginx folder
sudo cp /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/api.yourdomain.com/privkey.pem nginx/ssl/
sudo chown $USER:$USER nginx/ssl/*

# Restart nginx container
docker-compose -f docker-compose.prod.yml restart nginx
```

## 📊 Bước 7: Database Migration và Seeding

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec app npm run migration:run

# Seed initial data (nếu có)
docker-compose -f docker-compose.prod.yml exec app npm run seed:run
```

## 🔍 Bước 8: Verification

### 8.1 Health Check

```bash
# Test application
curl http://your-ec2-ip:3000/health
curl https://api.yourdomain.com/health  # nếu có SSL
```

### 8.2 Test API Endpoints

```bash
# Test một số endpoints
curl http://your-ec2-ip:3000/api/products
curl http://your-ec2-ip:3000/api/auth/profile
```

## 🔄 Bước 9: Monitoring và Maintenance

### 9.1 Auto-restart Setup

```bash
# Tạo systemd service để auto-restart
sudo nano /etc/systemd/system/matnice-backend.service

# Content của file:
[Unit]
Description=Matnice E-commerce Backend
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ec2-user/matnice-ecommerce-backend
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target

# Enable service
sudo systemctl enable matnice-backend.service
sudo systemctl start matnice-backend.service
```

### 9.2 Log Rotation

```bash
# Setup log rotation
sudo nano /etc/logrotate.d/matnice-backend

# Content:
/home/ec2-user/matnice-ecommerce-backend/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
```

## 📝 Useful Commands

```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# View database logs
docker-compose -f docker-compose.prod.yml logs -f mysql

# Restart specific service
docker-compose -f docker-compose.prod.yml restart app

# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build app

# Backup database
docker-compose -f docker-compose.prod.yml exec mysql mysqldump -u root -p matnice_ecommerce > backup.sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -i mysql mysql -u root -p matnice_ecommerce < backup.sql
```

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Configure firewall (Security Groups)
- [ ] Enable SSL/HTTPS
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] API rate limiting configured
- [ ] Environment variables secured
- [ ] Regular backups scheduled

## 📞 Support

Nếu gặp vấn đề trong quá trình deploy:

1. Kiểm tra logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Kiểm tra network connectivity
3. Verify environment variables
4. Check security group settings
5. Ensure sufficient disk space and memory
