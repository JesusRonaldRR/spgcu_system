#!/bin/bash

# SPGCU Deployment Script
# Run this inside the project directory (e.g., /var/www/spgcu)

set -e

echo "--- 🚀 Starting Deployment ---"

# 1. Install PHP Dependencies
echo "--- 🎼 Installing Composer Dependencies ---"
composer install --no-dev --optimize-autoloader

# 2. Install Node Dependencies & Build
echo "--- 📦 Installing NPM dependencies & Building ---"
npm install
npm run build

# 3. Set Permissions
echo "--- 🔐 Setting Permissions ---"
# Assumes the directory is owned by the current user, but web server needs write access to storage/bootstrap
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# 4. Migrate Database
echo "--- 🗄 Running Migrations ---"
php artisan migrate --force

# 5. Clear & Cache Config
echo "--- 🧹 Clearing and Caching Config ---"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "--- ✅ Deployment Complete! ---"
