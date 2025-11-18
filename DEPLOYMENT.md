# VPS Deployment Guide

This guide will help you deploy the Andromeda Gaming Dashboard to your VPS at `217.182.207.224`.

## Prerequisites

- VPS with Ubuntu/Debian (or similar Linux distribution)
- Root or sudo access
- Your Discord bot token and client credentials
- SQLite database file from your bot

## VPS Setup Commands

### 1. Initial Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install build tools for native modules (required for better-sqlite3)
sudo apt install -y build-essential python3

# Verify installation
node --version
npm --version

# Install PM2 globally (process manager)
sudo npm install -g pm2

# Install Nginx (web server / reverse proxy)
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 2. Create Application Directory

```bash
# Create web directory and set ownership
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
```

### 3. Clone and Setup the Project

```bash
# Clone the repository from GitHub
cd /var/www
git clone https://github.com/Night-Sky-Gaming/dashboard.git
cd dashboard

# Create logs directory
mkdir -p logs

# Fix ownership to ensure you can install packages
sudo chown -R $USER:$USER /var/www/dashboard

# Install dependencies (including dev dependencies needed for build)
npm ci

# Build the Next.js application
npm run build

# Optional: Remove dev dependencies after build to save disk space
npm prune --production
```

### 4. Configure Environment Variables

```bash
# Create .env file from template
cp .env.production .env

# Edit the .env file with your actual credentials
nano .env
```

Fill in these values:
- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `DISCORD_CLIENT_ID`: Your Discord application client ID
- `DISCORD_CLIENT_SECRET`: Your Discord application client secret
- `NEXTAUTH_SECRET`: Generate with: `openssl rand -base64 32`
- `DATABASE_PATH`: Path to your SQLite database file

### 5. Upload Database File

```bash
# From your local machine, upload the database file:
scp /path/to/your/database.sqlite user@217.182.207.224:/var/www/dashboard/database.sqlite

# Or if database is elsewhere on the VPS, copy it:
cp /path/to/database.sqlite /var/www/dashboard/database.sqlite

# Ensure proper permissions
chmod 644 /var/www/dashboard/database.sqlite
```

### 6. Configure Nginx

```bash
# Copy nginx configuration
sudo cp /var/www/dashboard/nginx.conf /etc/nginx/sites-available/dashboard

# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/

# Remove default nginx site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Enable nginx to start on boot
sudo systemctl enable nginx
```

### 7. Start Application with PM2

```bash
# Start the application using PM2
cd /var/www/dashboard
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Copy and run the command that pm2 startup outputs
```

### 8. Configure Firewall

```bash
# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (for future SSL setup)
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

## Verify Deployment

1. Check if the application is running:
```bash
pm2 status
pm2 logs andromeda-dashboard
```

2. Check Nginx status:
```bash
sudo systemctl status nginx
```

3. Access your dashboard:
- Open browser and go to: `http://217.182.207.224`

## Useful PM2 Commands

```bash
# View logs
pm2 logs andromeda-dashboard

# Restart application
pm2 restart andromeda-dashboard

# Stop application
pm2 stop andromeda-dashboard

# Monitor resources
pm2 monit

# View process details
pm2 info andromeda-dashboard
```

## Updating the Application

```bash
# Navigate to directory
cd /var/www/dashboard

# Pull latest changes from GitHub
git pull origin main

# Install any new dependencies (including dev dependencies for build)
npm ci

# Rebuild the application
npm run build

# Optional: Remove dev dependencies after build
npm prune --production

# Restart with PM2
pm2 restart andromeda-dashboard
```

## Optional: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Note: SSL with IP addresses is not supported by Let's Encrypt
# You'll need a domain name pointing to your VPS IP
# If you have a domain:
sudo certbot --nginx -d yourdomain.com

# Then uncomment the HTTPS section in nginx.conf
```

## Troubleshooting

### Check Application Logs
```bash
pm2 logs andromeda-dashboard --lines 100
```

### Check Nginx Error Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check if Port 3000 is Listening
```bash
sudo netstat -tlnp | grep 3000
```

### Restart Everything
```bash
pm2 restart andromeda-dashboard
sudo systemctl restart nginx
```

### Check Database Permissions
```bash
ls -la /var/www/dashboard/database.sqlite
```

The dashboard application needs read access to the database file.

## Important Notes

1. **Server ID**: The dashboard is now configured to use guild ID `1430038605518077964`
2. **Database**: Ensure your database has data for this guild ID
3. **Discord Bot**: Make sure your bot is in the server with ID `1430038605518077964`
4. **Security**: Consider setting up SSL/HTTPS for production use
5. **Backups**: Regularly backup your database file and .env configuration

## Alternative: Using a Different Branch

If you need to deploy from a different branch:

```bash
# Clone specific branch
cd /var/www/dashboard
git clone -b branch-name https://github.com/Night-Sky-Gaming/dashboard.git .

# Or switch branches after cloning
git checkout branch-name
git pull origin branch-name

# Then proceed with npm install and build
npm ci --production
npm run build
```

## Support

If you encounter issues, check:
1. PM2 logs: `pm2 logs andromeda-dashboard`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Database connectivity
4. Discord API credentials in .env
5. Firewall settings
