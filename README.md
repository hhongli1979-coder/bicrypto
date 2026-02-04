# Bicrypto V5 - Cryptocurrency Exchange Platform

A comprehensive cryptocurrency exchange platform built with Next.js and Node.js.

## Quick Start

### Installation

Run the automated installer:
```bash
chmod +x installer.sh
./installer.sh
```

### Starting the Application

```bash
# Option 1: Use the startup script (recommended)
./start-bicrypto.sh

# Option 2: Use systemd service
sudo systemctl start bicrypto

# Option 3: Use PM2 directly
pm2 start production.config.js --env production
```

### Health Check

Verify the application is running properly:
```bash
./health-check.sh
```

## Architecture

- **Frontend**: Next.js application (Port 3000)
- **Backend**: Node.js REST API (Port 4000)
- **Database**: MySQL/MariaDB
- **Cache**: Redis
- **Process Manager**: PM2
- **Web Server**: nginx (reverse proxy)

## Documentation

### Deployment & Operations
- [📚 Deployment and Startup Guide](DEPLOYMENT_STARTUP_GUIDE.md) - Complete guide for deploying and starting the application
- [🔧 Troubleshooting Connection Errors](TROUBLESHOOTING_CONNECTION_ERRORS.md) - Fix nginx connection refused errors
- [💻 Health Check Script](health-check.sh) - Verify application status
- [🚀 Startup Script](start-bicrypto.sh) - Automated application startup

### System Service

The application includes a systemd service file (`bicrypto.service`) for automatic startup on boot. To install:

```bash
sudo cp bicrypto.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable bicrypto
sudo systemctl start bicrypto
```

### Development
- [Frontend Documentation](frontend/README.md)
- [Scripts Documentation](scripts/README.md)
- [Tools Documentation](tools/README.md)

## Common Commands

```bash
# Development
pnpm dev              # Start both frontend and backend in development mode
pnpm dev:frontend     # Start only frontend
pnpm dev:backend      # Start only backend

# Building
pnpm build:all        # Build both frontend and backend
pnpm build:frontend   # Build only frontend
pnpm build:backend    # Build only backend

# Production
pnpm start            # Start with PM2 (production)
pnpm stop             # Stop all PM2 processes

# Database
pnpm seed             # Seed the database

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

## Troubleshooting

### Application Not Responding

If you see nginx connection errors, the application may not be running. Check:

1. **Application Status**:
   ```bash
   ./health-check.sh
   ```

2. **View Logs**:
   ```bash
   pm2 logs
   # or
   sudo journalctl -u bicrypto -f
   ```

3. **Restart Application**:
   ```bash
   ./start-bicrypto.sh
   # or
   sudo systemctl restart bicrypto
   ```

For detailed troubleshooting, see [TROUBLESHOOTING_CONNECTION_ERRORS.md](TROUBLESHOOTING_CONNECTION_ERRORS.md).

### Port Conflicts

Check if ports are in use:
```bash
ss -tuln | grep -E ':3000|:4000'
lsof -i :3000
lsof -i :4000
```

### Build Issues

Try a clean rebuild:
```bash
rm -rf backend/dist frontend/.next node_modules
pnpm install
pnpm build:all
```

## Configuration

Configuration is managed through environment variables in the `.env` file. Copy from the example:

```bash
cp .env.example .env
nano .env
```

Key configuration variables:
- `NEXT_PUBLIC_SITE_URL` - Your site URL
- `NEXT_PUBLIC_FRONTEND_PORT` - Frontend port (default: 3000)
- `NEXT_PUBLIC_BACKEND_PORT` - Backend port (default: 4000)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database credentials
- See `.env.example` for all available options

## Security

⚠️ **Important Security Notes**:
1. Change default admin credentials after first login
2. Configure SSL/TLS certificates for production
3. Review and update firewall settings
4. Keep system and dependencies updated
5. Use strong database passwords
6. Enable 2FA for admin accounts

## Support

- **Documentation**: https://docs.bicrypto.com
- **Support**: https://support.mash3div.com

## License

Proprietary - All rights reserved

## Version

Current version: 6.0.2
