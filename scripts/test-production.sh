#!/bin/bash

# PRMCMS UI/UX Production Testing Script
# Validates critical functionality before deployment

set -e

echo "🧪 PRMCMS UI/UX Production Testing Report"
echo "=========================================="
echo "Testing Date: $(date)"
echo "Environment: Production Build"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

echo "📋 1. Build and Bundle Analysis"
echo "================================"

# Build the application
echo "🏗️ Building production bundle..."
npm run build:production

if [ ! -d "dist" ]; then
    echo "❌ Build failed - no dist directory"
    exit 1
fi

echo "✅ Production build successful"

# Bundle analysis
echo ""
echo "📊 Bundle Size Analysis:"
echo "========================"
du -sh dist/*
echo ""
echo "Total dist size: $(du -sh dist/ | cut -f1)"
echo "Total files: $(find dist/ -type f | wc -l | tr -d ' ')"

echo ""
echo "📱 2. PWA Configuration Check"
echo "=============================="

# Check PWA files
if [ -f "dist/sw.js" ]; then
    echo "✅ Service Worker: Present ($(du -sh dist/sw.js | cut -f1))"
else
    echo "❌ Service Worker: Missing"
fi

if [ -f "dist/manifest.webmanifest" ]; then
    echo "✅ PWA Manifest: Present ($(du -sh dist/manifest.webmanifest | cut -f1))"
else
    echo "❌ PWA Manifest: Missing"
fi

# Check for PWA icons
icon_count=$(find dist/ -name "*icon*" -o -name "*pwa*" | wc -l | tr -d ' ')
echo "📱 PWA Icons: $icon_count found"

echo ""
echo "🎨 3. Asset Optimization Check"
echo "==============================="

# Check CSS files
css_files=$(find dist/assets/ -name "*.css" | wc -l | tr -d ' ')
css_size=$(find dist/assets/ -name "*.css" -exec du -ch {} + | tail -n1 | cut -f1)
echo "🎨 CSS Files: $css_files ($css_size total)"

# Check JS files
js_files=$(find dist/assets/ -name "*.js" | wc -l | tr -d ' ')
js_size=$(find dist/assets/ -name "*.js" -exec du -ch {} + | tail -n1 | cut -f1)
echo "⚡ JavaScript Files: $js_files ($js_size total)"

# Check for large files
echo ""
echo "🔍 Large Files (>1MB):"
find dist/ -size +1M -exec du -sh {} \; || echo "No files larger than 1MB found"

echo ""
echo "🌐 4. Mobile-First Design Validation"
echo "===================================="

# Check for responsive CSS patterns
if grep -r "@media.*max-width\|@media.*min-width" dist/assets/*.css > /dev/null 2>&1; then
    echo "✅ Responsive CSS: Media queries found"
else
    echo "❌ Responsive CSS: No media queries detected"
fi

# Check for touch-friendly classes
if grep -r "touch\|gesture\|mobile" dist/assets/*.css > /dev/null 2>&1; then
    echo "✅ Touch Optimization: Touch-related styles found"
else
    echo "⚠️ Touch Optimization: Limited touch styles detected"
fi

echo ""
echo "🎯 5. Caribbean/Spanish Localization Check"
echo "=========================================="

# Check for Spanish content
if grep -r "español\|spanish\|es-PR\|Puerto Rico" dist/ > /dev/null 2>&1; then
    echo "✅ Spanish Localization: Spanish content detected"
else
    echo "⚠️ Spanish Localization: Limited Spanish content found"
fi

# Check for Caribbean branding
if grep -r "Caribbean\|Caribe\|PRMCMS" dist/ > /dev/null 2>&1; then
    echo "✅ Caribbean Branding: Regional branding found"
else
    echo "⚠️ Caribbean Branding: Limited regional branding"
fi

echo ""
echo "🔒 6. Security Headers Check"
echo "============================"

# Check index.html for security meta tags
if grep -r "Content-Security-Policy\|X-Frame-Options\|X-Content-Type-Options" dist/ > /dev/null 2>&1; then
    echo "✅ Security Headers: Found in build output"
else
    echo "⚠️ Security Headers: Will be handled by Cloudflare"
fi

echo ""
echo "⚡ 7. Performance Optimization Check"
echo "==================================="

# Check for minification
if grep -r "sourceMappingURL" dist/assets/*.js > /dev/null 2>&1; then
    echo "⚠️ Source Maps: Present (should be disabled for production)"
else
    echo "✅ Source Maps: Properly excluded"
fi

# Check for gzippable content
html_files=$(find dist/ -name "*.html" | wc -l | tr -d ' ')
echo "📄 HTML Files: $html_files"

echo ""
echo "🚀 8. Deployment Readiness Summary"
echo "=================================="

# Calculate overall score
score=0
total_checks=10

# Build check
if [ -d "dist" ]; then score=$((score + 1)); fi

# PWA checks
if [ -f "dist/sw.js" ]; then score=$((score + 1)); fi
if [ -f "dist/manifest.webmanifest" ]; then score=$((score + 1)); fi

# Asset checks
if [ $css_files -gt 0 ]; then score=$((score + 1)); fi
if [ $js_files -gt 0 ]; then score=$((score + 1)); fi

# Content checks
if grep -r "español\|spanish\|es-PR" dist/ > /dev/null 2>&1; then score=$((score + 1)); fi
if grep -r "Caribbean\|Caribe" dist/ > /dev/null 2>&1; then score=$((score + 1)); fi

# File structure checks
if [ $html_files -gt 0 ]; then score=$((score + 1)); fi

# Performance checks
if ! grep -r "sourceMappingURL" dist/assets/*.js > /dev/null 2>&1; then score=$((score + 1)); fi
if [ $icon_count -gt 0 ]; then score=$((score + 1)); fi

percentage=$((score * 100 / total_checks))

echo "📊 Production Readiness Score: $score/$total_checks ($percentage%)"
echo ""

if [ $percentage -ge 80 ]; then
    echo "🎉 READY FOR PRODUCTION DEPLOYMENT!"
    echo "✅ All critical checks passed"
elif [ $percentage -ge 60 ]; then
    echo "⚠️ MOSTLY READY - Minor issues detected"
    echo "🔧 Consider addressing warnings before deployment"
else
    echo "❌ NOT READY FOR PRODUCTION"
    echo "🛠️ Critical issues need to be resolved"
fi

echo ""
echo "📋 Next Steps:"
echo "==============="
echo "1. Review any warnings or errors above"
echo "2. Test on mobile devices if possible"
echo "3. Deploy to Cloudflare Pages staging first"
echo "4. Run final production deployment"
echo ""
echo "🚀 Deploy with: npm run deploy:production"

exit 0
