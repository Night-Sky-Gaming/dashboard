#!/bin/bash

# VPS Deployment Script for Andromeda Gaming Dashboard
# Target VPS: 217.182.207.224
# Execute these commands one by one on your VPS

echo "===== STEP 1: Update System Packages ====="
sudo apt update && sudo apt upgrade -y

echo ""
echo "===== STEP 2: Install Node.js 18.x ====="
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

echo ""
echo "===== STEP 3: Verify Node.js Installation ====="
node --version
npm --version

echo ""
echo "===== STEP 4: Install PM2 (Process Manager) ====="
sudo npm install -g pm2

echo ""
echo "===== STEP 5: Install Nginx ====="
sudo apt install -y nginx

echo ""
echo "===== STEP 6: Install Git ====="
sudo apt install -y git

echo ""
echo "===== STEP 7: Create Web Directory ====="
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

echo ""
echo "===== STEP 8: Clone Repository from GitHub ====="
cd /var/www
git clone https://github.com/Night-Sky-Gaming/dashboard.git
cd dashboard
mkdir -p logs
echo "Repository cloned successfully!"

echo ""
echo "===== STEP 8b: Fix Directory Permissions ====="
sudo chown -R $USER:$USER /var/www/dashboard
echo "Permissions set correctly!"

echo ""
echo "===== STEP 9: Install Node Dependencies ====="
npm ci

echo ""
echo "===== STEP 10: Build Next.js Application ====="
npm run build

echo ""
echo "===== STEP 11: Configure Environment Variables ====="
cp .env.production .env
echo "Opening .env file for editing..."
echo "Fill in these required values:"
echo "  - DISCORD_BOT_TOKEN"
echo "  - DISCORD_CLIENT_ID"
echo "  - DISCORD_CLIENT_SECRET"
echo "  - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo ""
nano .env

echo ""
echo "===== MANUAL STEP: Upload Database File ====="
echo "You need to upload your database.sqlite file"
echo ""
echo "From your local machine, run:"
echo "  scp /path/to/your/database.sqlite user@217.182.207.224:/var/www/dashboard/database.sqlite"
echo ""
read -p "Press Enter after you've uploaded the database file to continue..."

echo ""
echo "===== STEP 12: Set Database Permissions ====="
chmod 644 /var/www/dashboard/database.sqlite

echo ""
echo "===== STEP 13: Configure Nginx ====="
sudo cp /var/www/dashboard/nginx.conf /etc/nginx/sites-available/dashboard
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo ""
echo "===== STEP 14: Test Nginx Configuration ====="
sudo nginx -t

echo ""
echo "===== STEP 15: Restart Nginx ====="
sudo systemctl restart nginx
sudo systemctl enable nginx

echo ""
echo "===== STEP 16: Start Application with PM2 ====="
pm2 start ecosystem.config.js

echo ""
echo "===== STEP 17: Save PM2 Process List ====="
pm2 save

echo ""
echo "===== STEP 18: Setup PM2 Auto-Start on Boot ====="
pm2 startup
echo ""
echo "IMPORTANT: Copy and run the command that PM2 outputs above!"
read -p "Press Enter after running the PM2 startup command to continue..."

echo ""
echo "===== STEP 19: Configure Firewall ====="
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo ""
echo "===== STEP 20: Check Firewall Status ====="
sudo ufw status

echo ""
echo "===== DEPLOYMENT COMPLETE ====="
echo ""
echo "Verify your deployment:"
echo "  1. Check PM2: pm2 status"
echo "  2. Check logs: pm2 logs andromeda-dashboard"
echo "  3. Check Nginx: sudo systemctl status nginx"
echo "  4. Visit: http://217.182.207.224"
echo ""
echo "Useful commands:"
echo "  - View logs: pm2 logs andromeda-dashboard"
echo "  - Restart app: pm2 restart andromeda-dashboard"
echo "  - Monitor: pm2 monit"
