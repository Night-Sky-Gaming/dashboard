#!/bin/bash
set -e

echo "🚀 Starting deployment for Andromeda Gaming Dashboard..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set build ID to prevent cache issues
export BUILD_ID="andromeda-$(date +%s)"

echo -e "${YELLOW}🔄 Stopping PM2 process...${NC}"
pm2 stop Dashboard || true

echo -e "${YELLOW}🧹 Deep cleaning caches and dependencies...${NC}"
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

echo -e "${YELLOW}📦 Installing dependencies (this locks Next.js to 14.2.18)...${NC}"
npm install

echo -e "${YELLOW}🔨 Building application with fresh cache...${NC}"
npm run build

echo -e "${YELLOW}🚀 Starting PM2 process...${NC}"
pm2 delete Dashboard || true
pm2 start ecosystem.config.js
pm2 save

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Checking process status..."
pm2 list
echo ""
echo "💡 Useful commands:"
echo "   pm2 logs Dashboard --lines 50"
echo "   pm2 monit"
echo "   pm2 restart Dashboard"

