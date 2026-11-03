#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/home/ubuntu/chatify"
BRANCH="main"
FRONTEND_DIR="/var/www/myapp"
COMPOSE_FILE="docker-compose.yaml"

echo "Starting deployment..."

cd "$APP_DIR"

# 1. Pull latest code
echo "Pulling latest code..."
git fetch origin "$BRANCH"
git pull --ff-only origin "$BRANCH"

# 2. Build Vite frontend
echo "Building frontend..."
cd "$APP_DIR/client"

npm ci
npm run build

# 3. Deploy frontend files to Nginx
echo "Deploying frontend..."
sudo mkdir -p "$FRONTEND_DIR"
sudo rsync -a --delete dist/ "$FRONTEND_DIR/"

# 4. Build and deploy backend and Redis
echo "Deploying Docker containers..."
cd "$APP_DIR"

docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans

# 5. Test Nginx configuration
echo "Testing Nginx..."
sudo nginx -t

# 6. Reload Nginx
sudo systemctl reload nginx

# 7. Show running containers
echo "Running containers:"
docker compose -f "$COMPOSE_FILE" ps

echo "Deployment completed successfully!"