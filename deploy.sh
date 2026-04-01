#!/bin/bash
# InfoShield — VPS Deployment Script
# Usage: bash deploy.sh

set -e

echo "========================================="
echo "  InfoShield — Deployment Starting..."
echo "========================================="

# 1. Pull latest code
echo ""
echo "[1/5] Pulling latest code..."
git pull origin main

# 2. Install dependencies
echo ""
echo "[2/5] Installing dependencies..."
pnpm install

# 3. Build frontend
echo ""
echo "[3/5] Building frontend..."
pnpm --filter @workspace/infoshield run build

# 4. Run database migrations
echo ""
echo "[4/5] Running database setup..."
pnpm --filter @workspace/db run push

# 5. Restart API server
echo ""
echo "[5/5] Restarting API server..."
pm2 restart infoshield-api || pm2 start "pnpm --filter @workspace/api-server run dev" --name infoshield-api
pm2 save

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "  API running on port 8080"
echo "  Frontend built to artifacts/infoshield/dist/"
echo "========================================="
