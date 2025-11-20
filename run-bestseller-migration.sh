#!/bin/bash

# =====================================================
# Script để chạy migration qua Docker MySQL
# =====================================================

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Bestseller Table Migration ===${NC}"

# Kiểm tra Docker container đang chạy
echo -e "${YELLOW}Checking MySQL Docker container...${NC}"
CONTAINER_NAME="mysql_container" # Thay bằng tên container của bạn

if ! docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${RED}Error: MySQL container '$CONTAINER_NAME' is not running${NC}"
    echo "Available containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}"
    exit 1
fi

echo -e "${GREEN}✓ MySQL container found${NC}"

# Thông tin database
DB_NAME="your_database_name"     # Thay bằng tên database của bạn
DB_USER="your_username"           # Thay bằng username của bạn
DB_PASSWORD="your_password"       # Thay bằng password của bạn

# Path to SQL file
SQL_FILE="database/manual-migration-bestseller.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}Error: SQL file not found at $SQL_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}Running migration...${NC}"

# Copy SQL file vào container
docker cp $SQL_FILE $CONTAINER_NAME:/tmp/migration.sql

# Chạy SQL trong container
docker exec -i $CONTAINER_NAME mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME < $SQL_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    
    # Verify table creation
    echo -e "${YELLOW}Verifying table creation...${NC}"
    docker exec -i $CONTAINER_NAME mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME -e "DESCRIBE product_bestseller;"
    
    echo -e "${GREEN}✓ Table 'product_bestseller' created!${NC}"
else
    echo -e "${RED}✗ Migration failed${NC}"
    exit 1
fi

# Cleanup
docker exec $CONTAINER_NAME rm /tmp/migration.sql

echo -e "${GREEN}=== Migration Complete ===${NC}"
