#!/usr/bin/env bash
# Restores a backup created by backup.sh. Overwrites the current database
# and uploads — stops the app container first so nothing writes to the
# database mid-restore.
#
# Usage:
#   DATA_DIR=/opt/gedosalon/data UPLOADS_DIR=/opt/gedosalon/uploads \
#     ./scripts/restore.sh /opt/gedosalon/backups/20260101-120000

set -euo pipefail

BACKUP_DIR="${1:?Usage: restore.sh <path-to-backup-dir>}"
DATA_DIR="${DATA_DIR:-/opt/gedosalon/data}"
UPLOADS_DIR="${UPLOADS_DIR:-/opt/gedosalon/uploads}"

if [ ! -f "$BACKUP_DIR/app.db" ]; then
  echo "Error: $BACKUP_DIR/app.db not found." >&2
  exit 1
fi

read -r -p "This will overwrite the live database at $DATA_DIR/app.db. Continue? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

echo "Stop the app before restoring, e.g.: docker compose stop app"

mkdir -p "$DATA_DIR"
cp "$BACKUP_DIR/app.db" "$DATA_DIR/app.db"
echo "Restored database from $BACKUP_DIR/app.db"

if [ -f "$BACKUP_DIR/uploads.tar.gz" ]; then
  mkdir -p "$UPLOADS_DIR"
  tar -xzf "$BACKUP_DIR/uploads.tar.gz" -C "$UPLOADS_DIR"
  echo "Restored uploads from $BACKUP_DIR/uploads.tar.gz"
fi

echo "Done. Restart the app, e.g.: docker compose up -d app"
