#!/bin/bash

set -e

# Ensure Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker is not running"
    exit 1
fi

# Check if running on production branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "production" ]; then
    echo "Error: This script should only run on the production branch"
    exit 1
fi

# Check for required environment variables
if [ -z "$DOCKER_REGISTRY_USERNAME" ] || [ -z "$DOCKER_REGISTRY_PASSWORD" ]; then
    echo "Error: DOCKER_REGISTRY_USERNAME and DOCKER_REGISTRY_PASSWORD must be set"
    exit 1
fi

# Check for Dockerfile existence
for dir in frontend backend image-resizer; do
    if [ ! -f "./$dir/Dockerfile" ]; then
        echo "Error: Dockerfile not found in ./$dir"
        exit 1
    fi
done

# Set up QEMU for multi-platform builds
if ! docker run --rm --privileged tonistiigi/binfmt:latest --install all; then
    echo "Error: Failed to set up QEMU"
    exit 1
fi

# Set up Docker Buildx with a stable Buildkit image
docker buildx rm mybuilder || true
docker buildx create --use --name mybuilder --driver-opt image=moby/buildkit:v0.10.6
docker buildx inspect --bootstrap mybuilder

# Log in to private Docker registry
if ! echo "$DOCKER_REGISTRY_PASSWORD" | docker login docker.goodgermy.com -u "$DOCKER_REGISTRY_USERNAME" --password-stdin; then
    echo "Error: Failed to log in to Docker registry"
    exit 1
fi

# Clean up Buildx builder on exit
trap 'docker buildx rm mybuilder || true' EXIT

# Build and push frontend image
echo "[$(date)] Starting build for recollective-frontend"
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag docker.goodgermy.com/nexus/recollective-frontend:latest \
    --file ./frontend/Dockerfile \
    --push \
    ./frontend

# Build and push backend image
echo "[$(date)] Starting build for recollective-backend"
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag docker.goodgermy.com/nexus/recollective-backend:latest \
    --file ./backend/Dockerfile \
    --push \
    ./backend

# Build and push image-resizer image
echo "[$(date)] Starting build for recollective-image-resizer"
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag docker.goodgermy.com/nexus/recollective-image-resizer:latest \
    --file ./image-resizer/Dockerfile \
    --push \
    ./image-resizer

echo "[$(date)] Successfully built and pushed all Docker images"