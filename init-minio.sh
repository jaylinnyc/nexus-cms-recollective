#!/bin/bash
set -e

# Download MinIO Client
curl https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc
chmod +x /usr/local/bin/mc

# Wait for MinIO server to be ready (run in background)
minio server /data --console-address ':9001' &
MINIO_PID=$!

# Wait until MinIO is accessible
until curl -s http://localhost:9000 >/dev/null; do
  echo "Waiting for MinIO to start..."
  sleep 1
done

# Configure MinIO Client
mc alias set myminio http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

# Create public bucket
mc mb myminio/public || echo "Bucket 'public' already exists"

# Set public read access
mc anonymous set download myminio/public

# Shut down temporary MinIO process
kill $MINIO_PID
wait $MINIO_PID 2>/dev/null || true