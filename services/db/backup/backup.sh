#!/usr/bin/env bash
# Automated database backup script for Caribe Mail Connect (PRMCE).
# Updated: 2025-03-04

set -euo pipefail

BACKUP_DIR="$(dirname "$0")/backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

pg_dump "${DATABASE_URL:-}" > "$FILE"

echo "Backup saved to $FILE"
