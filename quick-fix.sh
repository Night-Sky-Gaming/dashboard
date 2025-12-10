#!/bin/bash
# Quick fix script for Server Action error
# Run this on your VPS immediately

echo "🔧 Applying quick fix for Server Action error..."

cd /var/www/dashboard

# Stop the process
pm2 stop Dashboard

# Nuclear option: clear everything
rm -rf .next node_modules/.cache .swc

# Rebuild
npm run build

# Restart with no cache
pm2 restart Dashboard --update-env
pm2 save

echo "✅ Quick fix applied. Monitor with: pm2 logs Dashboard"