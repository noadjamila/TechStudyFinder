#!/bin/bash

# This script automates the deployment of the TechStudyFinder application

# Stop execution on error
set -e

DEPLOY_DIR="${DEPLOY_DIR:-/home/deployuser/projects/TechStudyFinder}"

echo "--- Start deployment $(date) ---"

cd "$DEPLOY_DIR"
export PATH="$DEPLOY_DIR/server/node_modules/.bin:$PATH"
export PATH="$DEPLOY_DIR/client/node_modules/.bin:$PATH"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: Not on main branch. Current branch: $CURRENT_BRANCH"
  exit 1
fi

echo "Pulling latest changes..."
git pull origin main

echo "Installing root dependencies..."
npm ci --workspaces

echo "Building server and client..."
npm run build --workspaces

echo "Restarting PM2..."
pm2 restart techstudyfinder

echo "--- Deployment finished successfully ---"
