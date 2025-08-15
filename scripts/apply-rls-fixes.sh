#!/bin/bash

# Apply RLS Security Fixes Script
# This script applies the RLS migration and verifies the fixes

set -e

echo "🔒 Starting RLS Security Fixes Application..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    print_error "Not in a Supabase project directory. Please run this script from the project root."
    exit 1
fi

print_status "Checking Supabase project status..."

# Check if Supabase is running locally
if ! supabase status &> /dev/null; then
    print_warning "Supabase is not running locally. Starting Supabase..."
    supabase start
else
    print_success "Supabase is running locally"
fi

print_status "Applying RLS security migration..."

# Apply the migration
if supabase db push; then
    print_success "Migration applied successfully"
else
    print_error "Failed to apply migration"
    exit 1
fi

print_status "Waiting for migration to complete..."
sleep 3

print_status "Running verification checks..."

# Run verification script if it exists
if [ -f "scripts/verify-rls-fixes.sql" ]; then
    print_status "Running RLS verification script..."
    
    # Get the database URL
    DB_URL=$(supabase status | grep "DB URL" | awk '{print $3}')
    
    if [ -n "$DB_URL" ]; then
        # Run verification script
        if psql "$DB_URL" -f scripts/verify-rls-fixes.sql > verification_results.txt 2>&1; then
            print_success "Verification script completed"
            
            # Check for any remaining issues
            if grep -q "❌" verification_results.txt; then
                print_warning "Some issues may still exist. Check verification_results.txt for details."
            elif grep -q "✅ ALL WARNINGS FIXED" verification_results.txt; then
                print_success "All RLS warnings have been fixed!"
            else
                print_warning "Verification completed but status unclear. Check verification_results.txt"
            fi
            
            # Show summary
            echo ""
            echo "📊 VERIFICATION SUMMARY:"
            echo "========================"
            grep -E "(✅|❌|⚠️)" verification_results.txt | head -20
            
        else
            print_warning "Verification script failed to run. Manual verification recommended."
        fi
    else
        print_warning "Could not get database URL. Manual verification recommended."
    fi
else
    print_warning "Verification script not found. Manual verification recommended."
fi

print_status "Checking for any remaining Supabase warnings..."

# Try to run Supabase linter if available
if supabase db lint 2>/dev/null; then
    print_success "Database linting completed"
else
    print_warning "Database linting not available or failed"
fi

echo ""
echo "🎉 RLS Security Fixes Application Complete!"
echo "==========================================="
echo ""
echo "Next steps:"
echo "1. Review verification_results.txt for detailed results"
echo "2. Test your application to ensure all functionality works"
echo "3. Monitor for any performance impacts"
echo "4. Run 'supabase db lint' periodically to check for new warnings"
echo ""

# Clean up
if [ -f "verification_results.txt" ]; then
    print_status "Verification results saved to: verification_results.txt"
fi

print_success "Script completed successfully!"
