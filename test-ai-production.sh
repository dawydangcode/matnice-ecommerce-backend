#!/bin/bash

# Test AI Service in Production Container
# Usage: ./test-ai-production.sh

set -e

echo "🧪 Testing AI Service in Production Container..."

CONTAINER_NAME="matnice-ecommerce-backend-app-1"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}❌ Container $CONTAINER_NAME is not running${NC}"
    echo "Start it with: docker-compose -f docker-compose.prod.yml up -d"
    exit 1
fi

echo -e "${GREEN}✅ Container is running${NC}"

# Test 1: Python version
echo ""
echo "📌 Test 1: Python version"
docker exec $CONTAINER_NAME /opt/venv/bin/python --version

# Test 2: Check Python packages
echo ""
echo "📌 Test 2: Python packages installation"
docker exec $CONTAINER_NAME /opt/venv/bin/python -c "
import cv2
import torch
import mediapipe
import numpy
print('✅ OpenCV version:', cv2.__version__)
print('✅ PyTorch version:', torch.__version__)
print('✅ MediaPipe installed')
print('✅ NumPy version:', numpy.__version__)
"

# Test 3: Check AI models exist
echo ""
echo "📌 Test 3: AI model files"
docker exec $CONTAINER_NAME ls -lh /app/ai-models/faceshape-ai-package/faceshape_best.pt
docker exec $CONTAINER_NAME ls -lh /app/ai-models/gender-ai-package/gender_best.pt

# Test 4: Test faceshape classifier
echo ""
echo "📌 Test 4: Faceshape classifier"
docker exec $CONTAINER_NAME /opt/venv/bin/python -c "
import sys
sys.path.append('/app/ai-models/faceshape-ai-package')
from faceshape_classifier import FaceShapeClassifier
print('✅ FaceShapeClassifier imported successfully')
"

# Test 5: Test gender classifier
echo ""
echo "📌 Test 5: Gender classifier"
docker exec $CONTAINER_NAME /opt/venv/bin/python -c "
import sys
sys.path.append('/app/ai-models/gender-ai-package')
from gender_classifier import GenderClassifier
print('✅ GenderClassifier imported successfully')
"

# Test 6: Check if app is running
echo ""
echo "📌 Test 6: NestJS application health"
if curl -f http://localhost:3000/health 2>/dev/null; then
    echo -e "${GREEN}✅ Application health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Health endpoint not responding (might not be implemented)${NC}"
fi

# Test 7: Check environment variables
echo ""
echo "📌 Test 7: Environment variables"
docker exec $CONTAINER_NAME printenv | grep PYTHON_PATH || echo "PYTHON_PATH not set"

echo ""
echo -e "${GREEN}🎉 All tests completed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Test AI API endpoint: curl http://localhost:3000/ai-service/analyze-face"
echo "  2. View logs: docker-compose -f docker-compose.prod.yml logs -f app"
echo "  3. Enter container: docker exec -it $CONTAINER_NAME bash"
