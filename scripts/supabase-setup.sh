#!/bin/bash

# PRMCMS Supabase Setup Script
# This script helps set up Supabase for the PRMCMS project

set -e

echo "🚀 PRMCMS Supabase Setup"
echo "========================"

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
check_supabase_cli() {
    print_status "Checking Supabase CLI installation..."
    if command -v supabase &> /dev/null; then
        SUPABASE_VERSION=$(supabase --version)
        print_success "Supabase CLI is installed: $SUPABASE_VERSION"
    else
        print_error "Supabase CLI is not installed"
        print_status "Installing Supabase CLI..."
        brew install supabase/tap/supabase
        print_success "Supabase CLI installed successfully"
    fi
}

# Check if logged in to Supabase
check_supabase_login() {
    print_status "Checking Supabase login status..."
    if supabase status &> /dev/null; then
        print_success "Already logged in to Supabase"
    else
        print_warning "Not logged in to Supabase"
        print_status "Please run: supabase login"
        print_status "Then run this script again"
        exit 1
    fi
}

# Link to project
link_project() {
    print_status "Linking to Supabase project..."
    if supabase link --project-ref flbwqsocnlvsuqgupbra; then
        print_success "Successfully linked to project flbwqsocnlvsuqgupbra"
    else
        print_error "Failed to link to project"
        exit 1
    fi
}

# Create .env file if it doesn't exist
create_env_file() {
    print_status "Checking .env file..."
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://flbwqsocnlvsuqgupbra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYndxc29jbmx2c3VxZ3VwYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzY2NzcsImV4cCI6MjA2ODk1MjY3N30.nhWOR862I

# Google Maps API Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Application Configuration
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_GOOGLE_MAPS=true
VITE_ENABLE_REAL_TIME_TRACKING=true
EOF
        print_success "Created .env file"
    else
        print_success ".env file already exists"
    fi
}

# Deploy functions
deploy_functions() {
    print_status "Deploying Edge Functions..."
    
    # List of functions to deploy
    FUNCTIONS=(
        "calculate-loyalty-points"
        "loyalty-webhook"
        "last-mile-routes"
        "last-mile-partnerships"
        "generate-health-report"
        "execute-report"
        "export-report"
        "send-scheduled-report"
        "sync-integration"
        "sync-accounting-data"
        "sync-carrier-tracking"
        "test-integration"
        "run-billing-cycle"
        "generate-payment-link"
        "run-automated-tests"
        "webhook-handler"
    )
    
    for func in "${FUNCTIONS[@]}"; do
        print_status "Deploying $func..."
        if supabase functions deploy "$func" --no-verify-jwt; then
            print_success "Deployed $func"
        else
            print_warning "Failed to deploy $func (may already be deployed)"
        fi
    done
}

# Generate TypeScript types
generate_types() {
    print_status "Generating TypeScript types..."
    if supabase gen types typescript --project-id flbwqsocnlvsuqgupbra > src/integrations/supabase/types.ts; then
        print_success "Generated TypeScript types"
    else
        print_warning "Failed to generate types (may need to run manually)"
    fi
}

# Test connection
test_connection() {
    print_status "Testing Supabase connection..."
    
    # Create a simple test script
    cat > test-connection.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flbwqsocnlvsuqgupbra.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYndxc29jbmx2c3VxZ3VwYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzY2NzcsImV4cCI6MjA2ODk1MjY3N30.nhWOR862I'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    try {
        const { data, error } = await supabase.from('customers').select('count').limit(1)
        if (error) {
            console.error('Connection test failed:', error.message)
            process.exit(1)
        }
        console.log('✅ Supabase connection successful!')
    } catch (err) {
        console.error('❌ Connection test failed:', err.message)
        process.exit(1)
    }
}

testConnection()
EOF

    if node test-connection.js; then
        print_success "Supabase connection test passed"
        rm test-connection.js
    else
        print_error "Supabase connection test failed"
        rm test-connection.js
        exit 1
    fi
}

# Main setup function
main() {
    echo ""
    print_status "Starting PRMCMS Supabase setup..."
    echo ""
    
    check_supabase_cli
    check_supabase_login
    link_project
    create_env_file
    deploy_functions
    generate_types
    test_connection
    
    echo ""
    print_success "🎉 Supabase setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "  1. Update your Google Maps API key in .env"
    echo "  2. Run 'npm run dev' to start development"
    echo "  3. Test authentication flow"
    echo "  4. Configure real-time subscriptions"
    echo ""
    print_status "For more information, see SUPABASE_SETUP_GUIDE.md"
    echo ""
}

# Run main function
main "$@" 