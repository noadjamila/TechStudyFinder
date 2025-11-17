#!/bin/bash

# This script automates the deployment of the TechStudyFinder application

# Stop execution on error
set -e

DEPLOY_DIR="${DEPLOY_DIR:-/home/local/projects/TechStudyFinder}"

echo "--- Start deployment $(date) ---"

#echo "Verifying commit signature..."
#git verify-commit HEAD || {
#  echo "Error: Commit signature verification failed"
#  exit 1
#}

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: Not on main branch. Current branch: $CURRENT_BRANCH"
  exit 1
fi

cd "$DEPLOY_DIR"

echo "Starting git pull..."
git pull origin main

echo "Install node dependencies..."
npm ci

echo "Rebuild frontend and backend..."
npm run build

echo "Restart application via PM2..."
pm2 restart TechStudyFinder

echo "--- Deployment finished successfully ---"