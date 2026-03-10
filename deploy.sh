#!/bin/bash

# Navigate to the frontend folder
cd /var/www/dynamic-resume/frontend || exit

# Ensure pnpm is in PATH
export PATH=$PATH:/usr/local/bin/pnpm

# Reset local changes
git reset --hard
git clean -fd

# Pull latest from GitHub
git pull origin main

# Install dependencies
pnpm install

# Build the frontend
pnpm run build

# Restart pm2 process
pm2 restart dynamic-resume-front || pm2 start pnpm --name dynamic-resume-front -- start

# Save pm2 process list
pm2 save

echo "✅ Frontend deployed successfully!"
