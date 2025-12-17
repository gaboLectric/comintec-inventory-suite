#!/bin/bash

# Deploy script for Portainer setup
# This script prepares the environment for deployment in Portainer

set -e

echo "🚀 Preparing deployment for Portainer..."

# Check required files
REQUIRED_FILES=(
    "docker-compose.prod.yml"
    "Dockerfile.frontend.prod"
    "frontend/nginx.conf"
    "pocketbase/pb_migrations"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ] && [ ! -d "$file" ]; then
        echo "❌ Required file/directory missing: $file"
        exit 1
    fi
done

echo "✅ All required files present"

# Generate PB_ENCRYPTION_KEY if not exists
if ! grep -q "^PB_ENCRYPTION_KEY=" .env.production 2>/dev/null || grep -q "your-32-character-encryption-key-here" .env.production; then
    echo "🔑 Generating new PB_ENCRYPTION_KEY..."
    NEW_KEY=$(openssl rand -hex 32)
    if [ -f .env.production ]; then
        sed -i "s/PB_ENCRYPTION_KEY=.*/PB_ENCRYPTION_KEY=$NEW_KEY/" .env.production
    else
        cat > .env.production << EOF
PB_ENCRYPTION_KEY=$NEW_KEY
VITE_API_URL=http://localhost:8090
POCKETBASE_PORT=8090
FRONTEND_PORT=80
EOF
    fi
    echo "✅ Generated new encryption key"
else
    echo "✅ PB_ENCRYPTION_KEY already configured"
fi

# Validate .env.production
if [ ! -f .env.production ]; then
    echo "❌ .env.production not found. Creating template..."
    cat > .env.production << 'EOF'
# Production Environment Variables for Inventory System
PB_ENCRYPTION_KEY=your-32-character-encryption-key-here
VITE_API_URL=http://localhost:8090
POCKETBASE_PORT=8090
FRONTEND_PORT=80
EOF
    echo "⚠️  Please edit .env.production with your configuration"
fi

echo ""
echo "📋 Deployment Instructions for Portainer:"
echo ""
echo "1. Upload the project files to your OpenMediaVault server"
echo "   Recommended location: /srv/dev-disk-by-uuid-XXX/appdata/inventario"
echo ""
echo "2. Access Portainer web UI"
echo ""
echo "3. Go to Stacks → Add stack"
echo "   - Name: inventario-mod"
echo "   - Build method: Upload"
echo "   - Upload docker-compose.prod.yml"
echo "   - Load environment variables from .env.production"
echo ""
echo "4. Deploy the stack"
echo ""
echo "5. Access the application:"
echo "   - Frontend: http://<server-ip>:<FRONTEND_PORT> (e.g. http://192.168.88.2:8080)"
echo "   - PocketBase Admin: http://<server-ip>:<POCKETBASE_PORT>/_/"
echo ""
echo "✅ Preparation complete!"