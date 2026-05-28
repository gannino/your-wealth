#!/bin/bash

# Deployment Script for Your Wealth
# Builds the app and prepares it for GitHub Pages deployment

set -e  # Exit on error

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Your Wealth Deployment Script ===${NC}"
echo ""

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

echo -e "${GREEN}1. Building application...${NC}"
cd "$PROJECT_ROOT"
npm run build --silent

if [ ! -d "dist" ]; then
  echo -e "${GREEN}❌ Build failed - dist directory not found${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Build complete${NC}"
echo ""

echo -e "${GREEN}2. Clearing deployment-files directory...${NC}"
rm -rf deployment-files/*
mkdir -p deployment-files

echo -e "${GREEN}✓ Deployment directory cleared${NC}"
echo ""

echo -e "${GREEN}3. Copying production files...${NC}"
cp -r dist/* deployment-files/
cp deployment-files/.nojekyll deployment-files/ 2>/dev/null || echo "# .nojekyll" > deployment-files/.nojekyll

echo -e "${GREEN}✓ Files copied${NC}"
echo ""

echo -e "${GREEN}4. Verifying deployment files...${NC}"
if [ ! -f "deployment-files/index.html" ]; then
  echo -e "${GREEN}❌ index.html not found in deployment${NC}"
  exit 1
fi

FILE_COUNT=$(find deployment-files -type f | wc -l | tr -d ' ')
echo -e "${GREEN}✓ Deployment ready: $FILE_COUNT files${NC}"
echo ""

echo -e "${BLUE}=== Deployment Complete ===${NC}"
echo ""
echo "Next steps:"
echo "1. Review changes: ls deployment-files/"
echo "2. Commit and push: git add deployment-files/ && git commit -m 'Update deployment' && git push"
echo ""
