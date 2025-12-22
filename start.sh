#!/bin/bash

# Master Start Script for Comintec Inventory Suite
# Handles different environments and configurations

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Comintec Inventory Suite Launcher ===${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "Error: Docker daemon is not running."
    exit 1
fi

echo "Select running mode:"
echo "1) Development (HTTP) - Fast, local only"
echo "2) Development (HTTPS) - For mobile testing/camera access"
echo "3) Production Simulation (HTTPS + Nginx) - Test production build locally"
echo "4) Stop all containers"
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo -e "${GREEN}Starting in Development (HTTP) mode...${NC}"
        docker-compose -f docker-compose.yml up -d --build
        echo -e "${GREEN}App running at http://localhost:5173${NC}"
        echo -e "${GREEN}PocketBase running at http://localhost:8090${NC}"
        ;;
    2)
        echo -e "${GREEN}Starting in Development (HTTPS) mode...${NC}"
        # Use existing logic from start-https.sh
        ./start-https.sh
        ;;
    3)
        echo -e "${GREEN}Starting in Production (HTTPS) mode...${NC}"
        # Ensure certs exist
        if [ ! -f "./docker/ssl/server.crt" ]; then
            echo -e "${YELLOW}Generating SSL certificates...${NC}"
            ./generate-ssl-cert.sh
        fi
        
        # Check for encryption key
        if [ -z "$PB_ENCRYPTION_KEY" ]; then
            echo -e "${YELLOW}Warning: PB_ENCRYPTION_KEY not set. Using default for demo.${NC}"
            export PB_ENCRYPTION_KEY="demo_key_123456789012345678901234"
        fi

        docker-compose -f docker-compose.prod.https.yml up -d --build
        echo -e "${GREEN}App running at https://localhost (Port 443)${NC}"
        echo -e "${GREEN}PocketBase running at http://localhost:8090${NC}"
        ;;
    4)
        echo -e "${YELLOW}Stopping all containers...${NC}"
        docker-compose -f docker-compose.yml down 2>/dev/null || true
        docker-compose -f docker-compose.https.yml down 2>/dev/null || true
        docker-compose -f docker-compose.dev.https.yml down 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        docker-compose -f docker-compose.prod.https.yml down 2>/dev/null || true
        echo "All containers stopped."
        ;;
    *)
        echo "Invalid choice."
        exit 1
        ;;
esac
