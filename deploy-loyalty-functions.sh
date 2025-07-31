#!/bin/bash

echo "Deploying Loyalty Functions..."

# Deploy calculate-loyalty-points
echo "Deploying calculate-loyalty-points..."
supabase functions deploy calculate-loyalty-points

# Deploy loyalty-webhook
echo "Deploying loyalty-webhook..."
supabase functions deploy loyalty-webhook

# Set webhook secret
echo "Setting webhook secret..."
supabase secrets set LOYALTY_WEBHOOK_SECRET="loyalty-secret-key-2024"

echo "Deployment complete!" 