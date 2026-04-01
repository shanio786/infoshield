#!/bin/bash
set -e

echo "=== InfoShield Setup ==="

# Fix PATH for BT Panel Node
export PATH=/www/server/nodejs/v20.20.2/bin:$PATH

# 1. Create .env if not exists
if [ ! -f .env ]; then
  echo "Creating .env..."
  cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://infoshielduser:StrongPass123@localhost:5432/infoshield
SESSION_SECRET=infoshield-secret-2026-onfact-uc
NODE_ENV=production
PORT=8080
ENVEOF
  echo ".env created"
fi

# 2. PostgreSQL setup
echo "Setting up database..."
sudo -u postgres psql << 'SQLEOF' 2>/dev/null || true
CREATE DATABASE infoshield;
CREATE USER infoshielduser WITH PASSWORD 'StrongPass123';
GRANT ALL PRIVILEGES ON DATABASE infoshield TO infoshielduser;
ALTER DATABASE infoshield OWNER TO infoshielduser;
GRANT ALL ON SCHEMA public TO infoshielduser;
SQLEOF

# Also try fixing privileges if db already existed
sudo -u postgres psql -d infoshield -c "GRANT ALL ON SCHEMA public TO infoshielduser;" 2>/dev/null || true

# 3. Install dependencies
echo "Installing packages..."
pnpm config set registry https://registry.npmjs.org 2>/dev/null || true
pnpm install

# Load .env variables
set -a
source .env
set +a

# 4. Database tables
echo "Creating tables..."
pnpm --filter @workspace/db run push

# 5. Seed data
echo "Seeding data..."
npm install -g tsx 2>/dev/null || true
pnpm exec tsx scripts/seed.ts

# 6. Build frontend
echo "Building frontend..."
pnpm --filter @workspace/infoshield run build

echo ""
echo "=== Setup Complete! ==="
echo "Now start the project from BT Panel > Node > infoshield > Start"
