# Troubleshooting nginx Connection Refused Errors

This document provides solutions for the specific nginx error:
```
connect() failed (111: Connection refused) while connecting to upstream
```

## Understanding the Error

This error occurs when nginx tries to proxy requests to your application server (running on port 3000) but cannot connect because:
1. The application is not running
2. The application crashed or was stopped
3. The application is running but on a different port
4. Firewall is blocking the connection

## Quick Fix (Immediate Solution)

### Step 1: Check if the application is running
```bash
# Check if ports are listening
ss -tuln | grep -E ':3000|:4000'
# or
netstat -tuln | grep -E ':3000|:4000'

# Check PM2 processes
pm2 list

# Check systemd service
sudo systemctl status bicrypto
```

### Step 2: Start the application if not running
```bash
# Option A: Use the startup script (recommended)
./start-bicrypto.sh

# Option B: Use systemd service
sudo systemctl start bicrypto

# Option C: Start manually with PM2
pm2 start production.config.js --env production
pm2 save
```

### Step 3: Verify the application started
```bash
# Run health check
./health-check.sh

# Test the endpoints
curl http://localhost:3000
curl http://localhost:4000

# Check logs
pm2 logs
# or
sudo journalctl -u bicrypto -f
```

## Permanent Fix (Auto-start on Boot)

To ensure the application starts automatically after server reboots:

### Option 1: Using systemd (Recommended)

1. Copy the service file:
```bash
sudo cp bicrypto.service /etc/systemd/system/
```

2. Update the service file paths if needed:
```bash
sudo nano /etc/systemd/system/bicrypto.service
# Update User, Group, and WorkingDirectory
```

3. Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable bicrypto.service
sudo systemctl start bicrypto.service
```

4. Verify it's running:
```bash
sudo systemctl status bicrypto.service
```

### Option 2: Using PM2 startup

1. Build the application first:
```bash
pnpm build:all
```

2. Start with PM2:
```bash
pm2 start production.config.js --env production
pm2 save
```

3. Setup PM2 to start on boot:
```bash
pm2 startup
# Run the command it outputs
pm2 save
```

## Common Issues and Solutions

### Issue: Application starts but immediately crashes

**Check the logs:**
```bash
pm2 logs --lines 100
# or
sudo journalctl -u bicrypto -n 100
```

**Common causes:**
1. Missing dependencies - Run: `pnpm install`
2. Not built - Run: `pnpm build:all`
3. Missing .env file - Copy from `.env.example`
4. Database connection issues - Check database credentials in .env
5. Port already in use - Check: `lsof -i :3000` and `lsof -i :4000`

### Issue: Port 3000 is already in use

**Find what's using the port:**
```bash
lsof -i :3000
```

**Kill the process:**
```bash
kill -9 <PID>
# Replace <PID> with the process ID from lsof output
```

### Issue: PM2 not found or not installed

**Install PM2:**
```bash
npm install -g pm2
```

### Issue: Permission denied errors

**Fix ownership:**
```bash
# Replace 'username' with your actual username
sudo chown -R username:username /path/to/bicrypto
```

**For systemd service:**
```bash
# Make sure the User in bicrypto.service matches your username
sudo nano /etc/systemd/system/bicrypto.service
```

### Issue: Environment variables not loaded

**Verify .env file exists:**
```bash
ls -la .env
```

**If missing, create from example:**
```bash
cp .env.example .env
nano .env
# Update the values
```

**Make sure PM2 loads .env:**
```bash
# Stop current processes
pm2 delete all

# Start fresh
pm2 start production.config.js --env production
pm2 save
```

## Nginx Configuration Check

Verify nginx is properly configured to proxy to your application:

```bash
# Check nginx configuration
sudo nginx -t

# View your site's nginx config
sudo cat /etc/nginx/sites-available/your-site.conf

# Reload nginx after any changes
sudo systemctl reload nginx
```

Your nginx configuration should have something like:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Monitoring and Logs

### Watch application logs in real-time:
```bash
# PM2 logs
pm2 logs

# Systemd logs
sudo journalctl -u bicrypto -f

# nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Check application status regularly:
```bash
# Use the health check script
./health-check.sh

# Or manually
pm2 list
systemctl status bicrypto
```

## Prevention

1. **Always use systemd or PM2 startup** to ensure auto-restart after reboot
2. **Monitor logs regularly** to catch issues early
3. **Set up monitoring/alerting** for production environments
4. **Keep backups** of your configuration files
5. **Test after server reboots** to ensure auto-start works

## Additional Resources

- Full deployment guide: `DEPLOYMENT_STARTUP_GUIDE.md`
- Health check script: `./health-check.sh`
- Startup script: `./start-bicrypto.sh`

## Still Having Issues?

If you're still experiencing problems:

1. Run the health check: `./health-check.sh`
2. Collect relevant logs: `pm2 logs > app-logs.txt`
3. Check system resources: `free -h && df -h`
4. Verify all dependencies are installed: `pnpm install`
5. Try a clean rebuild: `rm -rf backend/dist frontend/.next && pnpm build:all`

For production issues, consider:
- Check server resources (CPU, memory, disk)
- Review application logs for errors
- Verify database connectivity
- Check firewall rules
- Ensure all required services (MySQL, Redis) are running
