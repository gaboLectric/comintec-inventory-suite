#!/bin/bash

echo "Starting Verification Process..."

# 1. Check Docker Containers
echo "Checking Docker Containers..."
if [ "$(docker ps -q -f name=inventario-pocketbase)" ] && [ "$(docker ps -q -f name=inventario-frontend)" ]; then
    echo "✅ Containers are running."
else
    echo "❌ Containers are NOT running."
    exit 1
fi

# 2. Check PocketBase Health
echo "Checking PocketBase Health..."
PB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/api/health)
if [ "$PB_STATUS" == "200" ]; then
    echo "✅ PocketBase is healthy (HTTP 200)."
else
    echo "❌ PocketBase is NOT healthy (HTTP $PB_STATUS)."
    exit 1
fi

# 3. Check Frontend Availability
echo "Checking Frontend Availability..."
FE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ "$FE_STATUS" == "200" ]; then
    echo "✅ Frontend is available (HTTP 200)."
else
    echo "❌ Frontend is NOT available (HTTP $FE_STATUS)."
    exit 1
fi

echo "🎉 Verification Completed Successfully!"
