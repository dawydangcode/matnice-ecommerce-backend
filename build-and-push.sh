#!/bin/bash

# Build and Push Docker Image to Docker Hub
# Usage: ./build-and-push.sh YOUR_DOCKERHUB_USERNAME

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if username provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Docker Hub username not provided${NC}"
    echo "Usage: ./build-and-push.sh YOUR_DOCKERHUB_USERNAME"
    exit 1
fi

DOCKERHUB_USERNAME=$1
IMAGE_NAME="matnice-backend"
TAG="latest"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo -e "${YELLOW}=== Building Docker Image ===${NC}"
echo "Image: ${FULL_IMAGE_NAME}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

# Build the image
echo -e "${GREEN}Step 1: Building production image...${NC}"
docker build \
    -f Dockerfile \
    --target production \
    -t ${FULL_IMAGE_NAME} \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful!${NC}"
else
    echo -e "${RED}✗ Build failed!${NC}"
    exit 1
fi

# Show image size
echo ""
echo -e "${YELLOW}Image size:${NC}"
docker images ${FULL_IMAGE_NAME} --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Ask for confirmation before pushing
echo ""
read -p "Do you want to push to Docker Hub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Step 2: Logging in to Docker Hub...${NC}"
    docker login
    
    echo -e "${GREEN}Step 3: Pushing image to Docker Hub...${NC}"
    docker push ${FULL_IMAGE_NAME}
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Push successful!${NC}"
        echo ""
        echo -e "${YELLOW}Next steps on EC2:${NC}"
        echo "1. docker pull ${FULL_IMAGE_NAME}"
        echo "2. Update docker-compose.prod.yml with image: ${FULL_IMAGE_NAME}"
        echo "3. docker-compose -f docker-compose.prod.yml up -d"
    else
        echo -e "${RED}✗ Push failed!${NC}"
        exit 1
    fi
else
    echo "Push cancelled."
fi
