#!/usr/bin/env bash
#
# A convenience script to bring up or down your app with either
# a dev or prod Docker Compose setup.
#
# Usage:
#   ./compose.sh up   dev [clean]
#   ./compose.sh up   prod [clean]
#   ./compose.sh down dev
#   ./compose.sh down prod
#
# If no ENV is specified, defaults to 'dev'.

ACTION=$1      # e.g. up or down
ENV=$2         # e.g. dev or prod
CLEAN=$3       # optional, set to "clean" for a clean build

# Default ENV if not specified
if [ -z "$ENV" ]; then
  ENV="dev"
fi

# Decide which env file and override compose file to use
if [ "$ENV" == "dev" ]; then
  ENV_FILE="frontend/.env.docker"
  COMPOSE_OVERRIDE="docker-compose.dev.yml"
elif [ "$ENV" == "prod" ]; then
  ENV_FILE="frontend/.env.prod"
  COMPOSE_OVERRIDE="docker-compose.prod.yml"
else
  echo "ERROR: Unknown environment: $ENV. Must be 'dev' or 'prod'."
  exit 1
fi

# Base docker compose command
DC_CMD="docker compose --env-file $ENV_FILE -f docker-compose.yml -f $COMPOSE_OVERRIDE"

# Run the appropriate command based on the action
if [ "$ACTION" == "up" ]; then
  echo "Bringing up containers for '$ENV' environment..."
  if [ "$CLEAN" == "clean" ]; then
    echo "Performing a clean build..."
    $DC_CMD up --build --force-recreate -d
  else
    $DC_CMD up -d
  fi
elif [ "$ACTION" == "down" ]; then
  echo "Shutting down containers for '$ENV' environment..."
  $DC_CMD down
else
  echo "ERROR: Unknown action: $ACTION. Must be 'up' or 'down'."
  exit 1
fi
