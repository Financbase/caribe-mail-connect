#!/usr/bin/env bash
# Restore database from backup for Caribe Mail Connect (PRMCE).
# Updated: 2025-03-04

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 path/to/backup.sql" >&2
  exit 1
fi

psql "${DATABASE_URL:-}" < "$1"

echo "Restore completed from $1"
