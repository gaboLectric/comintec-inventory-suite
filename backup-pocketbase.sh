#!/bin/bash

# Backup script for PocketBase data volume
# Creates compressed backup of pb_data volume

set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
PROJECT_NAME="${PROJECT_NAME:-inventario-mod}"
VOLUME_NAME="${PROJECT_NAME}_pb_data"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="pb_data_backup_${TIMESTAMP}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup of PocketBase data volume ($VOLUME_NAME)..."

# Run a temporary container to backup the volume
docker run --rm \
    -v ${VOLUME_NAME}:/pb_data:ro \
    -v "$(pwd)/$BACKUP_DIR":/backup \
    alpine:latest \
    tar czf "/backup/$BACKUP_NAME" -C / pb_data

echo "✅ Backup created: $BACKUP_DIR/$BACKUP_NAME"

# Optional: Clean up old backups (keep last 7)
if command -v find >/dev/null 2>&1; then
    find "$BACKUP_DIR" -name "pb_data_backup_*.tar.gz" -mtime +7 -delete 2>/dev/null || true
    echo "🧹 Cleaned up old backups (kept last 7 days)"
fi

echo "📁 Backup location: $BACKUP_DIR/$BACKUP_NAME"