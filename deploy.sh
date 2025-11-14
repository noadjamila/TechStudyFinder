#!/bin/bash

# This script automates the deployment of the TechStudyFinder application

# Stop execution on error
set -e

DEPLOY_DIR="/home/local/projects/TechStudyFinder"

echo "--- Start deployment $(date) ---"

cd "$DEPLOY_DIR"

echo "Starting git pull..."
git pull origin main

echo "Install node dependencies..."
npm install

echo "Rebuild frontend and backend..."
npm run build

echo "Restart application via PM2..."
pm2 restart TechStudyFinder

echo "--- Deployment finished successfully ---"