#!/bin/bash

# Pull and Deploy Docker Image on EC2
# Usage: ./deploy-on-ec2.sh YOUR_DOCKERHUB_USERNAME

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if username provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Docker Hub username not provided${NC}"
    echo "Usage: ./deploy-on-ec2.sh YOUR_DOCKERHUB_USERNAME"
    exit 1
fi

DOCKERHUB_USERNAME=$1
IMAGE_NAME="matnice-backend"
TAG="latest"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo -e "${YELLOW}=== Deploying Docker Image on EC2 ===${NC}"
echo "Image: ${FULL_IMAGE_NAME}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

# Pull the image
echo -e "${GREEN}Step 1: Pulling image from Docker Hub...${NC}"
sudo docker pull ${FULL_IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Pull failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Pull successful!${NC}"

# Update docker-compose.prod.yml
echo ""
echo -e "${GREEN}Step 2: Updating docker-compose.prod.yml...${NC}"

# Backup original file
cp docker-compose.prod.yml docker-compose.prod.yml.backup

# Update the image name using sed
sed -i "s|build:|# build:|g" docker-compose.prod.yml
sed -i "s|context: .|# context: .|g" docker-compose.prod.yml
sed -i "s|dockerfile: Dockerfile|# dockerfile: Dockerfile|g" docker-compose.prod.yml
sed -i "s|target: production|# target: production|g" docker-compose.prod.yml

# Add image line if not exists
if ! grep -q "image: ${FULL_IMAGE_NAME}" docker-compose.prod.yml; then
    sed -i "/services:/a\\  app:\n    image: ${FULL_IMAGE_NAME}" docker-compose.prod.yml
fi

echo -e "${GREEN}✓ docker-compose.prod.yml updated!${NC}"

# Stop old containers
echo ""
echo -e "${GREEN}Step 3: Stopping old containers...${NC}"
sudo docker-compose -f docker-compose.prod.yml down

# Start new containers
echo ""
echo -e "${GREEN}Step 4: Starting new containers...${NC}"
sudo docker-compose -f docker-compose.prod.yml up -d

# Wait for containers to start
echo ""
echo -e "${YELLOW}Waiting for containers to start...${NC}"
sleep 10

# Check container status
echo ""
echo -e "${GREEN}Step 5: Checking container status...${NC}"
sudo docker-compose -f docker-compose.prod.yml ps

# Show logs
echo ""
echo -e "${YELLOW}Recent logs:${NC}"
sudo docker-compose -f docker-compose.prod.yml logs --tail=30 app

echo ""
echo -e "${GREEN}✓ Deployment complete!${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  View logs: sudo docker-compose -f docker-compose.prod.yml logs -f app"
echo "  Restart: sudo docker-compose -f docker-compose.prod.yml restart"
echo "  Stop: sudo docker-compose -f docker-compose.prod.yml down"
