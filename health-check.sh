#!/usr/bin/env bash
# Bicrypto Health Check Script
# This script checks if the application is running and accessible

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Bicrypto Health Check${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check 1: PM2 Status
echo -e "${CYAN}[1/6]${NC} Checking PM2 processes..."
if command -v pm2 >/dev/null 2>&1; then
    if pm2 list | grep -q "online"; then
        echo -e "  ${GREEN}✓${NC} PM2 processes are running"
        pm2 list
    else
        echo -e "  ${RED}✗${NC} No PM2 processes running"
        echo -e "  ${YELLOW}Run: pm2 start production.config.js --env production${NC}"
    fi
else
    echo -e "  ${RED}✗${NC} PM2 is not installed"
    echo -e "  ${YELLOW}Run: npm install -g pm2${NC}"
fi
echo ""

# Check 2: Port 3000 (Frontend)
echo -e "${CYAN}[2/6]${NC} Checking if port 3000 is listening..."
if ss -tuln 2>/dev/null | grep -q ":3000" || netstat -tuln 2>/dev/null | grep -q ":3000"; then
    echo -e "  ${GREEN}✓${NC} Port 3000 is listening (Frontend)"
else
    echo -e "  ${RED}✗${NC} Port 3000 is not listening"
    echo -e "  ${YELLOW}The frontend server is not running${NC}"
fi
echo ""

# Check 3: Port 4000 (Backend)
echo -e "${CYAN}[3/6]${NC} Checking if port 4000 is listening..."
if ss -tuln 2>/dev/null | grep -q ":4000" || netstat -tuln 2>/dev/null | grep -q ":4000"; then
    echo -e "  ${GREEN}✓${NC} Port 4000 is listening (Backend)"
else
    echo -e "  ${RED}✗${NC} Port 4000 is not listening"
    echo -e "  ${YELLOW}The backend server is not running${NC}"
fi
echo ""

# Check 4: HTTP Response from Frontend
echo -e "${CYAN}[4/6]${NC} Testing HTTP response on port 3000..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "200\|301\|302\|404"; then
    echo -e "  ${GREEN}✓${NC} Frontend is responding to HTTP requests"
else
    echo -e "  ${RED}✗${NC} Frontend is not responding"
    echo -e "  ${YELLOW}Check: pm2 logs frontend${NC}"
fi
echo ""

# Check 5: HTTP Response from Backend
echo -e "${CYAN}[5/6]${NC} Testing HTTP response on port 4000..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4000 2>/dev/null | grep -q "200\|301\|302\|404"; then
    echo -e "  ${GREEN}✓${NC} Backend is responding to HTTP requests"
else
    echo -e "  ${RED}✗${NC} Backend is not responding"
    echo -e "  ${YELLOW}Check: pm2 logs backend${NC}"
fi
echo ""

# Check 6: Systemd Service Status
echo -e "${CYAN}[6/6]${NC} Checking systemd service status..."
if systemctl is-active --quiet bicrypto.service 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Bicrypto systemd service is active"
    systemctl status bicrypto.service --no-pager -l | head -15
elif systemctl list-unit-files | grep -q bicrypto.service 2>/dev/null; then
    echo -e "  ${YELLOW}⚠${NC} Bicrypto systemd service exists but is not active"
    echo -e "  ${YELLOW}Run: sudo systemctl start bicrypto${NC}"
else
    echo -e "  ${YELLOW}⚠${NC} Bicrypto systemd service is not installed"
    echo -e "  ${YELLOW}See: DEPLOYMENT_STARTUP_GUIDE.md for installation${NC}"
fi
echo ""

# Summary
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Summary${NC}"
echo -e "${CYAN}========================================${NC}"

# Count checks
CHECKS_PASSED=0
TOTAL_CHECKS=6

# Recheck everything for summary
if command -v pm2 >/dev/null 2>&1 && pm2 list | grep -q "online"; then
    ((CHECKS_PASSED++))
fi

if ss -tuln 2>/dev/null | grep -q ":3000" || netstat -tuln 2>/dev/null | grep -q ":3000"; then
    ((CHECKS_PASSED++))
fi

if ss -tuln 2>/dev/null | grep -q ":4000" || netstat -tuln 2>/dev/null | grep -q ":4000"; then
    ((CHECKS_PASSED++))
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "200\|301\|302\|404"; then
    ((CHECKS_PASSED++))
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost:4000 2>/dev/null | grep -q "200\|301\|302\|404"; then
    ((CHECKS_PASSED++))
fi

if systemctl is-active --quiet bicrypto.service 2>/dev/null; then
    ((CHECKS_PASSED++))
fi

echo ""
if [ $CHECKS_PASSED -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}✓ All checks passed! ($CHECKS_PASSED/$TOTAL_CHECKS)${NC}"
    echo -e "${GREEN}The application appears to be running correctly.${NC}"
elif [ $CHECKS_PASSED -ge 3 ]; then
    echo -e "${YELLOW}⚠ Some checks passed ($CHECKS_PASSED/$TOTAL_CHECKS)${NC}"
    echo -e "${YELLOW}The application is partially running. Check failed items above.${NC}"
else
    echo -e "${RED}✗ Most checks failed ($CHECKS_PASSED/$TOTAL_CHECKS)${NC}"
    echo -e "${RED}The application is not running properly.${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting steps:${NC}"
    echo -e "  1. Build the application: ${CYAN}pnpm build:all${NC}"
    echo -e "  2. Start the application: ${CYAN}./start-bicrypto.sh${NC}"
    echo -e "  3. Check PM2 logs: ${CYAN}pm2 logs${NC}"
    echo -e "  4. Check systemd service: ${CYAN}sudo systemctl status bicrypto${NC}"
    echo -e "  5. See deployment guide: ${CYAN}cat DEPLOYMENT_STARTUP_GUIDE.md${NC}"
fi
echo ""
