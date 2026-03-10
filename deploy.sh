#!/bin/bash

# Navigate to the frontend folder
cd /var/www/dynamic-resume/frontend || exit

# Source nvm if available (needed when running via SSH non-login shell)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Add common pnpm install locations to PATH
export PATH="$HOME/.local/share/pnpm:$PATH:/usr/local/bin"

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
