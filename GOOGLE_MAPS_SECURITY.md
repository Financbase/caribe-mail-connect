# Google Maps API Security Guide

## 🔐 API Key Security Best Practices

### 1. Environment Variable Setup

**Create your `.env` file:**

```bash
# Copy the example file
cp env.example .env

# Edit with your actual API key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD39QQ8P4A1RwH9ZWTpNOvaizFK1yLeBeU
```

### 2. Google Cloud Console Restrictions

**Set up API key restrictions in Google Cloud Console:**

1. **Go to Google Cloud Console** → APIs & Services → Credentials
2. **Find your API key** and click "Edit"
3. **Set Application restrictions:**
   - HTTP referrers (web sites): `*.yourdomain.com/*`
   - IP addresses: Your server IPs
   - Android apps: Your app package name
   - iOS apps: Your app bundle ID

4. **Set API restrictions:**
   - ✅ Maps JavaScript API
   - ✅ Places API
   - ✅ Directions API
   - ✅ Geocoding API
   - ❌ Unrestricted (avoid this)

### 3. Production Security Checklist

- [ ] API key is in `.env` file (not committed to git)
- [ ] `.env` is in `.gitignore`
- [ ] HTTP referrer restrictions set
- [ ] API restrictions enabled
- [ ] Billing alerts configured
- [ ] Usage quotas set
- [ ] Monitoring enabled

### 4. Environment-Specific Configuration

**Development:**

```bash
VITE_GOOGLE_MAPS_API_KEY=your_dev_key_here
VITE_APP_ENV=development
```

**Production:**

```bash
VITE_GOOGLE_MAPS_API_KEY=your_prod_key_here
VITE_APP_ENV=production
```

### 5. Usage Monitoring

**Set up billing alerts:**

- $10/day limit
- $50/month limit
- Email notifications

**Monitor usage in Google Cloud Console:**

- APIs & Services → Dashboard
- Check daily/monthly usage
- Review API quotas

### 6. Emergency Procedures

**If API key is compromised:**

1. Immediately disable the key in Google Cloud Console
2. Create a new API key with proper restrictions
3. Update all environment files
4. Deploy the new key
5. Monitor for unauthorized usage

### 7. Cost Optimization

**Enable billing alerts and quotas:**

- Set daily spending limit
- Configure email notifications
- Monitor usage patterns
- Use caching where possible

### 8. Legal Compliance

**Ensure compliance with:**

- Google Maps Platform Terms of Service
- Data privacy regulations (GDPR, CCPA)
- Local Puerto Rico regulations
- USPS CMRA requirements

## 🚀 Implementation Notes

The Google Maps integration includes:

1. **Secure API Key Loading** - Only loads from environment variables
2. **Error Handling** - Graceful fallbacks if API fails
3. **Bilingual Support** - Spanish/English interface
4. **Real-time Features** - Live tracking and route optimization
5. **Mobile Responsive** - Works on all device sizes

## 📞 Support

For API key issues:

- Google Cloud Console Support
- Google Maps Platform Documentation
- PRMCMS Development Team
