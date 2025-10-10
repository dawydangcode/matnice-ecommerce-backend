#!/bin/bash

# Deploy script for EC2 AWS
# Make this file executable: chmod +x deploy.sh

set -e

echo "🚀 Starting deployment to EC2..."

# Variables
APP_NAME="matnice-ecommerce-backend"
DOCKER_IMAGE="$APP_NAME:latest"
CONTAINER_NAME="$APP_NAME-container"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    exit 1
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker first."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose first."
fi

# Pull latest code (if using git)
if [ -d ".git" ]; then
    log "Pulling latest code from repository..."
    git pull origin main
fi

# Create necessary directories
log "Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p logs
mkdir -p uploads

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    warn ".env.production file not found. Please create it with your production environment variables."
    cp .env.example .env.production 2>/dev/null || echo "Please create .env.production file manually"
fi

# Build the Docker image
log "Building Docker image..."
docker build -t $DOCKER_IMAGE .

# Stop existing containers
log "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Start new containers
log "Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
log "Waiting for services to be healthy..."
sleep 30

# Check container status
log "Checking container status..."
docker-compose -f docker-compose.prod.yml ps

# Run database migrations (if applicable)
log "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T app npm run migration:run || warn "Migration failed or not configured"

# Test the application
log "Testing application health..."
sleep 10
if curl -f http://localhost:3000/health; then
    log "✅ Application is healthy and running!"
else
    error "❌ Application health check failed"
fi

log "🎉 Deployment completed successfully!"
log "Application is running on: http://your-server-ip:3000"
log "Nginx proxy is running on: http://your-server-ip:80"

# Display useful commands
echo ""
echo "Useful commands:"
echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.prod.yml down"
echo "  Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "  View container status: docker-compose -f docker-compose.prod.yml ps"
