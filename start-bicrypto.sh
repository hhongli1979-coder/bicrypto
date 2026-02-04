#!/usr/bin/env bash
# Bicrypto V5 Startup Script
# This script ensures the application starts correctly with all dependencies

set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Load environment variables if .env exists
if [[ -f ".env" ]]; then
    log_info "Loading environment variables from .env"
    export $(grep -v '^#' .env | xargs -0)
fi

# Set default environment
export NODE_ENV="${NODE_ENV:-production}"

# Check if pnpm is installed
if ! command -v pnpm >/dev/null 2>&1; then
    log_error "pnpm is not installed or not in PATH"
    log_info "Attempting to use npx pnpm..."
    PNPM_CMD="npx pnpm"
else
    PNPM_CMD="pnpm"
fi

# Check if PM2 is installed
if ! command -v pm2 >/dev/null 2>&1; then
    log_warning "PM2 is not installed globally"
    log_info "Installing PM2 globally..."
    npm install -g pm2 || {
        log_error "Failed to install PM2"
        exit 1
    }
fi

# Stop any existing PM2 processes
log_info "Stopping any existing PM2 processes..."
pm2 stop all 2>/dev/null || true

# Delete old PM2 processes
log_info "Deleting old PM2 processes..."
pm2 delete all 2>/dev/null || true

# Wait a moment for processes to clean up
sleep 2

# Start the application using PM2
log_info "Starting Bicrypto V5 application..."
if [[ -f "production.config.js" ]]; then
    pm2 start production.config.js --env production
    log_info "Application started with production.config.js"
else
    log_error "production.config.js not found!"
    exit 1
fi

# Save PM2 process list
log_info "Saving PM2 process list..."
pm2 save --force

# Display status
log_info "PM2 process status:"
pm2 list

log_info "✅ Bicrypto V5 started successfully!"
log_info "Frontend should be available on port 3000"
log_info "Backend should be available on port 4000"
log_info ""
log_info "To view logs, run: pm2 logs"
log_info "To stop the application, run: pm2 stop all"
log_info "To restart the application, run: pm2 restart all"
