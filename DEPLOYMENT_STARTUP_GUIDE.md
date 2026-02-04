# Bicrypto Service Installation and Startup Guide

This guide explains how to fix the "Connection refused" errors and ensure the Bicrypto application starts automatically.

## Problem

The nginx error logs show:
```
connect() failed (111: Connection refused) while connecting to upstream
```

This occurs when nginx is configured to proxy to `http://127.0.0.1:3000/` but the application server is not running.

## Solution

### Option 1: Using systemd service (Recommended for production)

1. Copy the service file to systemd directory:
```bash
sudo cp bicrypto.service /etc/systemd/system/
```

2. Update the service file with correct user and paths if needed:
```bash
sudo nano /etc/systemd/system/bicrypto.service
```
Update `User`, `Group`, and `WorkingDirectory` to match your environment.

3. Reload systemd to recognize the new service:
```bash
sudo systemctl daemon-reload
```

4. Enable the service to start on boot:
```bash
sudo systemctl enable bicrypto.service
```

5. Start the service:
```bash
sudo systemctl start bicrypto.service
```

6. Check service status:
```bash
sudo systemctl status bicrypto.service
```

7. View logs:
```bash
sudo journalctl -u bicrypto.service -f
```

### Option 2: Using the startup script manually

1. Run the startup script:
```bash
./start-bicrypto.sh
```

This script will:
- Install PM2 if not present
- Stop any existing PM2 processes
- Start the application using PM2 with production.config.js
- Display the application status

### Option 3: Using PM2 directly

1. Install dependencies (if not already done):
```bash
pnpm install
```

2. Build the application:
```bash
pnpm build:all
```

3. Start with PM2:
```bash
pnpm start
```

Or directly:
```bash
pm2 start production.config.js --env production
pm2 save
```

4. Set up PM2 to start on boot:
```bash
pm2 startup
# Follow the instructions printed by the command
pm2 save
```

## Verification

After starting the application, verify it's running:

1. Check if the application is listening on port 3000:
```bash
netstat -tuln | grep :3000
# or
ss -tuln | grep :3000
```

2. Check PM2 processes:
```bash
pm2 list
```

3. Test the application:
```bash
curl http://localhost:3000
```

4. Check nginx can connect:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Port Configuration

- **Frontend**: Port 3000 (configured in production.config.js)
- **Backend**: Port 4000 (configured in production.config.js)

Make sure these ports are:
- Not blocked by firewall
- Not used by other applications
- Configured correctly in nginx

## Troubleshooting

### Application won't start

1. Check if required dependencies are built:
```bash
ls -la backend/dist/
ls -la frontend/.next/
```

If missing, build them:
```bash
pnpm build:all
```

2. Check if ports are already in use:
```bash
lsof -i :3000
lsof -i :4000
```

3. Check environment variables:
```bash
cat .env
```

Ensure `.env` file exists with proper configuration.

### PM2 issues

1. Clear PM2 processes:
```bash
pm2 delete all
pm2 kill
```

2. Restart PM2:
```bash
pm2 start production.config.js --env production
pm2 save
```

### Permission issues

Ensure the application user has proper permissions:
```bash
# Example for user 'runner'
sudo chown -R runner:runner /home/runner/work/bicrypto/bicrypto
```

## Maintenance

### Restart the application
```bash
sudo systemctl restart bicrypto.service
# or
pm2 restart all
```

### Stop the application
```bash
sudo systemctl stop bicrypto.service
# or
pm2 stop all
```

### View logs
```bash
# Systemd logs
sudo journalctl -u bicrypto.service -f

# PM2 logs
pm2 logs

# Specific process logs
pm2 logs backend
pm2 logs frontend
```

### Update application
```bash
# Stop the application
sudo systemctl stop bicrypto.service

# Pull updates
git pull

# Install dependencies
pnpm install

# Build
pnpm build:all

# Start
sudo systemctl start bicrypto.service
```
