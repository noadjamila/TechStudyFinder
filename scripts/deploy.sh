#!/bin/bash

# This script automates the deployment of the TechStudyFinder application

# Stop execution on error
set -e

DEPLOY_DIR="${DEPLOY_DIR:-/home/deployuser/projects/TechStudyFinder}"

echo "--- Start deployment $(date) ---"

#echo "Verifying commit signature..."
#git verify-commit HEAD || {
#  echo "Error: Commit signature verification failed"
#  exit 1
#}

cd "$DEPLOY_DIR"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: Not on main branch. Current branch: $CURRENT_BRANCH"
  exit 1
fi

echo "Pulling latest changes..."
git pull origin main

echo "Installing root dependencies..."
npm ci

echo "Installing server workspace dependencies..."
npm --workspace server install

echo "Building server..."
npm --workspace server run build

echo "Restarting PM2..."
pm2 restart techstudyfinder

echo "--- Deployment finished successfully ---"
