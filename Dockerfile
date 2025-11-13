# Multi-stage build for production
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    dumb-init \
    bash \
    python3 \
    python3-pip \
    python3-dev \
    # OpenCV dependencies
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglib2.0-0 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Create app user (Debian syntax)
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nestjs

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy AI models directory
COPY --chown=nestjs:nodejs ai-models ./ai-models

# Copy other necessary files
COPY --chown=nestjs:nodejs .env.production .env

# Install Python dependencies for AI models
RUN pip3 install --no-cache-dir --break-system-packages \
    ultralytics>=8.0.0 \
    opencv-python-headless>=4.5.0 \
    numpy>=1.21.0 \
    pillow>=8.0.0 \
    torch>=1.11.0 \
    torchvision>=0.12.0 \
    requests>=2.25.0 \
    mediapipe>=0.10.0

# Create uploads directory
RUN mkdir -p uploads && chown -R nestjs:nodejs uploads

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/src/main"]
