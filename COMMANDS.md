# VPS Setup Commands - Step by Step

Execute these commands **one by one** on your VPS at `217.182.207.224`

---

## STEP 1: Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

---

## STEP 2: Install Node.js 18.x

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## STEP 3: Install Build Tools for Native Modules

```bash
sudo apt install -y build-essential python3
```

This installs `make`, `g++`, and other tools needed to compile `better-sqlite3`.

---

## STEP 4: Verify Node.js Installation

```bash
node --version
npm --version
```

You should see Node.js v18.x and npm version displayed.

---

## STEP 5: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

---

## STEP 6: Install Nginx (Web Server)

```bash
sudo apt install -y nginx
```

---

## STEP 7: Install Git (Optional)

```bash
sudo apt install -y git
```

---

## STEP 8: Create Application Directory

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
```

---

## STEP 9: Clone Repository from GitHub

```bash
cd /var/www
git clone https://github.com/Night-Sky-Gaming/dashboard.git
cd dashboard
mkdir -p logs
```

This will create `/var/www/dashboard/` with all your project files inside.

---

## STEP 8b: Fix Directory Permissions

```bash
sudo chown -R $USER:$USER /var/www/dashboard
```

This ensures you have proper ownership of all files in the dashboard directory.

---

## STEP 11: Install Node Dependencies

```bash
cd /var/www/dashboard
npm ci
```

Note: We need to install dev dependencies too because Next.js requires them for the build process.

---

## STEP 12: Build Next.js Application

```bash
npm run build
```

After the build completes successfully, you can optionally remove dev dependencies to save space:

```bash
npm prune --production
```

---

## STEP 13: Configure Environment Variables

```bash
cp .env.production .env
nano .env
```

Fill in these values in the `.env` file:

- `DISCORD_BOT_TOKEN` - Your Discord bot token
- `DISCORD_CLIENT_ID` - Your Discord application client ID
- `DISCORD_CLIENT_SECRET` - Your Discord application client secret
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

Press `Ctrl+X`, then `Y`, then `Enter` to save and exit.

---

## STEP 14: Upload Database File

**From your local machine:**

```bash
scp /path/to/your/database.sqlite user@217.182.207.224:/var/www/dashboard/database.sqlite
```

**Then on VPS, set permissions:**

```bash
chmod 644 /var/www/dashboard/database.sqlite
```

---

## STEP 15: Configure Nginx

```bash
sudo cp /var/www/dashboard/nginx.conf /etc/nginx/sites-available/dashboard
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

---

## STEP 16: Test Nginx Configuration

```bash
sudo nginx -t
```

Should output: "nginx: configuration file /etc/nginx/nginx.conf test is successful"

---

## STEP 17: Restart Nginx

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## STEP 18: Start Application with PM2

```bash
cd /var/www/dashboard
pm2 start ecosystem.config.js
```

---

## STEP 19: Save PM2 Process List

```bash
pm2 save
```

---

## STEP 20: Setup PM2 Auto-Start on Boot

```bash
pm2 startup
```

**Important:** PM2 will output a command like:
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u your-user --hp /home/your-user
```

**Copy and run that exact command!**

---

## STEP 21: Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Type `y` when prompted.

---

## STEP 22: Check Status

```bash
# Check firewall
sudo ufw status

# Check PM2 processes
pm2 status

# Check Nginx
sudo systemctl status nginx

# View application logs
pm2 logs andromeda-dashboard --lines 50
```

---

## STEP 21: Test Your Dashboard

Open your browser and visit:

```
http://217.182.207.224
```

Your dashboard should now be live! 🎉

---

## Common Commands You'll Need

### View Application Logs
```bash
pm2 logs andromeda-dashboard
```

### Restart Application
```bash
pm2 restart andromeda-dashboard
```

### Stop Application
```bash
pm2 stop andromeda-dashboard
```

### Monitor Resources
```bash
pm2 monit
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

---

## Updating the Dashboard Later

When you need to update your dashboard with the latest changes from GitHub:

```bash
# Navigate to directory
cd /var/www/dashboard

# Pull latest changes from GitHub
git pull origin main

# Install any new dependencies (including dev dependencies for build)
npm ci

# Rebuild
npm run build

# Optional: Remove dev dependencies after build to save space
npm prune --production

# Restart PM2
pm2 restart andromeda-dashboard

# Check logs
pm2 logs andromeda-dashboard
```

---

## Troubleshooting

### Application won't start?
```bash
pm2 logs andromeda-dashboard --lines 100
```

### Can't access the website?
```bash
# Check if app is running
pm2 status

# Check if port 3000 is listening
sudo netstat -tlnp | grep 3000

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

### Database errors?
```bash
# Check database file exists
ls -la /var/www/dashboard/database.sqlite

# Check .env configuration
cat /var/www/dashboard/.env | grep DATABASE_PATH
```

---

## Important Notes

✅ Server ID is configured to: `1430038605518077964`  
✅ Make sure your Discord bot is in that server  
✅ Ensure your database has data for this guild ID  
✅ Keep your `.env` file secure and backed up  
✅ Consider setting up SSL/HTTPS for production  

---

## Need Help?

Check these in order:
1. PM2 logs: `pm2 logs andromeda-dashboard`
2. Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Application is running: `pm2 status`
4. Port is listening: `sudo netstat -tlnp | grep 3000`
5. Firewall allows traffic: `sudo ufw status`
