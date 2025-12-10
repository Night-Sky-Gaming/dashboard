#!/bin/bash
set -e

echo "🚀 Starting deployment for Andromeda Gaming Dashboard..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Set build ID to prevent cache issues
export BUILD_ID="andromeda-$(date +%s)"

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🧹 Cleaning Next.js cache...${NC}"
rm -rf .next
rm -rf node_modules/.cache

echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting PM2 process...${NC}"
pm2 delete andromeda-dashboard || true
pm2 start ecosystem.config.js
pm2 save

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Run 'pm2 logs andromeda-dashboard' to view logs"
echo "Run 'pm2 monit' to monitor the application"
