# =====================================================

# DOCKER MYSQL MIGRATION COMMANDS

# =====================================================

# 1. Tìm MySQL container name

docker ps | grep mysql

# 2. Kiểm tra container đang chạy

docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

# 3. Chạy SQL trực tiếp trong Docker (Interactive)

docker exec -it <CONTAINER_NAME> mysql -u<USERNAME> -p<PASSWORD> <DATABASE_NAME>

# Sau khi vào MySQL prompt, paste SQL:

# CREATE TABLE product_bestseller ( ... );

# 4. Chạy SQL từ file

docker exec -i <CONTAINER_NAME> mysql -u<USERNAME> -p<PASSWORD> <DATABASE_NAME> < database/manual-migration-bestseller.sql

# 5. Verify table đã tạo

docker exec -it <CONTAINER_NAME> mysql -u<USERNAME> -p<PASSWORD> <DATABASE_NAME> -e "SHOW TABLES LIKE 'product_bestseller';"

# 6. Xem cấu trúc bảng

docker exec -it <CONTAINER_NAME> mysql -u<USERNAME> -p<PASSWORD> <DATABASE_NAME> -e "DESCRIBE product_bestseller;"

# =====================================================

# EXAMPLES với thông tin cụ thể

# =====================================================

# Ví dụ: Container name = mysql_matnice, User = root, DB = matnice_db

docker exec -i mysql_matnice mysql -uroot -pYourPassword matnice_db < database/manual-migration-bestseller.sql

# Verify

docker exec -it mysql_matnice mysql -uroot -pYourPassword matnice_db -e "SELECT COUNT(\*) FROM product_bestseller;"

# =====================================================

# DOCKER-COMPOSE

# =====================================================

# Nếu bạn dùng docker-compose, có thể exec vào service

docker-compose exec mysql mysql -u<USERNAME> -p<PASSWORD> <DATABASE_NAME> < database/manual-migration-bestseller.sql

# Ví dụ:

docker-compose exec mysql mysql -uroot -ppassword matnice_db < database/manual-migration-bestseller.sql

# =====================================================

# TROUBLESHOOTING

# =====================================================

# Nếu báo lỗi "No such file or directory"

# Copy file vào container trước:

docker cp database/manual-migration-bestseller.sql <CONTAINER_NAME>:/tmp/
docker exec -i <CONTAINER_NAME> mysql -u<USERNAME> -p<PASSWORD> <DATABASE_NAME> < /tmp/manual-migration-bestseller.sql

# Xóa file sau khi chạy

docker exec <CONTAINER_NAME> rm /tmp/manual-migration-bestseller.sql
