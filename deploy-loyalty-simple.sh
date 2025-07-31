#!/bin/bash

echo "🚀 Deploying Loyalty Functions..."

# Deploy calculate-loyalty-points
echo "📦 Deploying calculate-loyalty-points..."
supabase functions deploy calculate-loyalty-points

# Deploy loyalty-webhook
echo "📦 Deploying loyalty-webhook..."
supabase functions deploy loyalty-webhook

# Set webhook secret
echo "🔐 Setting webhook secret..."
supabase secrets set LOYALTY_WEBHOOK_SECRET=$(openssl rand -hex 32)

# List functions to verify
echo "✅ Verifying deployment..."
supabase functions list

echo "🎉 Loyalty functions deployment complete!" 