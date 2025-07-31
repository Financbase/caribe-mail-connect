#!/bin/bash

# Deploy Loyalty Edge Functions to Supabase
# This script deploys the loyalty system edge functions

set -e

echo "🚀 Deploying Loyalty Edge Functions to Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory. Please run this from the project root."
    exit 1
fi

# Deploy calculate-loyalty-points function
echo "📦 Deploying calculate-loyalty-points function..."
supabase functions deploy calculate-loyalty-points --project-ref $(grep -o 'project_id = "[^"]*"' supabase/config.toml | cut -d'"' -f2)

# Deploy loyalty-webhook function
echo "📦 Deploying loyalty-webhook function..."
supabase functions deploy loyalty-webhook --project-ref $(grep -o 'project_id = "[^"]*"' supabase/config.toml | cut -d'"' -f2)

# Set environment variables for the functions
echo "🔧 Setting environment variables..."

# Set webhook secret for loyalty webhook
supabase secrets set LOYALTY_WEBHOOK_SECRET=$(openssl rand -hex 32)

echo "✅ Loyalty Edge Functions deployed successfully!"
echo ""
echo "📋 Function URLs:"
echo "   - calculate-loyalty-points: $(supabase functions list | grep calculate-loyalty-points | awk '{print $2}')"
echo "   - loyalty-webhook: $(supabase functions list | grep loyalty-webhook | awk '{print $2}')"
echo ""
echo "🔑 Environment variables set:"
echo "   - LOYALTY_WEBHOOK_SECRET: [hidden]"
echo ""
echo "🎉 Loyalty system is ready to use!" 