#!/usr/bin/env bash
# Backs up the SQLite database and uploaded images to a timestamped
# directory. Safe to run while the app is up: uses SQLite's own online
# ".backup" command when the sqlite3 CLI is available (a consistent
# snapshot even mid-write), falling back to a plain file copy otherwise.
#
# Usage:
#   DATA_DIR=/opt/gedosalon/data UPLOADS_DIR=/opt/gedosalon/uploads \
#     ./scripts/backup.sh [BACKUP_ROOT]
#
# Defaults match docker-compose.yml's bind-mount paths.

set -euo pipefail

DATA_DIR="${DATA_DIR:-/opt/gedosalon/data}"
UPLOADS_DIR="${UPLOADS_DIR:-/opt/gedosalon/uploads}"
BACKUP_ROOT="${1:-/opt/gedosalon/backups}"

DB_FILE="$DATA_DIR/app.db"
TIMESTAMP="$(date -u +%Y%m%d-%H%M%S)"
DEST="$BACKUP_ROOT/$TIMESTAMP"

if [ ! -f "$DB_FILE" ]; then
  echo "Error: database file not found at $DB_FILE" >&2
  exit 1
fi

mkdir -p "$DEST"

if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB_FILE" ".backup '$DEST/app.db'"
else
  echo "Warning: sqlite3 CLI not found, falling back to a plain file copy." >&2
  echo "Install it (e.g. 'apt-get install sqlite3') for safer online backups." >&2
  cp "$DB_FILE" "$DEST/app.db"
fi

if [ -d "$UPLOADS_DIR" ]; then
  tar -czf "$DEST/uploads.tar.gz" -C "$UPLOADS_DIR" .
else
  echo "Warning: uploads directory not found at $UPLOADS_DIR, skipping." >&2
fi

echo "Backup written to $DEST"
ls -lh "$DEST"

if command -v sqlite3 >/dev/null 2>&1; then
  echo "Verifying backup integrity..."
  sqlite3 "$DEST/app.db" "PRAGMA integrity_check;"
fi
