#!/bin/bash

# Supabase Warning Resolution Execution Script
# This script will prompt for the service key and execute the optimization

echo "🎯 SUPABASE WARNING RESOLUTION"
echo "=============================="

# Check if service key is already set
if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "📝 Please enter your Supabase service role key:"
    echo "(This will be used temporarily for the optimization process)"
    read -s SUPABASE_SERVICE_KEY
    export SUPABASE_SERVICE_KEY
    echo ""
fi

# Verify key is set
if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Service key is required to proceed"
    exit 1
fi

echo "✅ Service key configured"
echo "🚀 Starting warning resolution optimization..."
echo ""

# Navigate to the correct directory
cd "$(dirname "$0")"

# Execute the master optimization script
node scripts/resolve-remaining-warnings.js

# Check exit status
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Optimization completed successfully!"
    echo "📊 Check the generated report for detailed results"
else
    echo ""
    echo "❌ Optimization encountered issues"
    echo "📋 Review the error messages above for troubleshooting"
fi
