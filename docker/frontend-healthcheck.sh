#!/bin/sh

# Healthcheck script for frontend container
# Verifies that nginx is responding

set -e

# Check if nginx is running and responding
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "Frontend is healthy"
    exit 0
else
    echo "Frontend is unhealthy"
    exit 1
fi