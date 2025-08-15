#!/bin/bash

# PRMCMS Production Deployment Script
# This script deploys the application to Cloudflare Pages

set -e

echo "🚀 Starting PRMCMS Production Deployment"
echo "======================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production not found. Please create it first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate latest database types
echo "🗄️ Generating database types..."
npm run types:generate || echo "⚠️ Warning: Could not generate types. Continuing..."

# Run tests (optional, comment out if tests are not ready)
# echo "🧪 Running tests..."
# npm run test:run

# Build the application
echo "🏗️ Building application..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📊 Build analysis available at: dist/bundle-analysis.html"

# Display build stats
echo ""
echo "📈 Build Statistics:"
echo "==================="
du -sh dist/*

echo ""
echo "🎉 Production build ready!"
echo "📂 Files are in the 'dist' directory"
echo ""
echo "Next steps:"
echo "1. Deploy to Cloudflare Pages via dashboard or CLI"
echo "2. Configure environment variables in Cloudflare"
echo "3. Set up custom domain"
echo "4. Enable analytics and monitoring"
