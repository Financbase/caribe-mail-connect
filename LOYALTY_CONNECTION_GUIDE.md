# 🎯 Loyalty System Connection Guide

This guide covers the complete integration of the PRMCMS loyalty system frontend with the Supabase backend, including real-time updates, edge functions, and external integrations.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Edge Functions](#edge-functions)
5. [Frontend Integration](#frontend-integration)
6. [Real-time Updates](#real-time-updates)
7. [External Integrations](#external-integrations)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## 🎯 Overview

The loyalty system has been fully connected with the following components:

- **Frontend**: React components with real-time Supabase integration
- **Backend**: Supabase database with comprehensive loyalty tables
- **Edge Functions**: Complex loyalty calculations and webhook handling
- **Real-time Updates**: Live synchronization across all devices
- **External Integrations**: Social media, reviews, referrals, and more

## 📋 Prerequisites

Before proceeding, ensure you have:

- ✅ Supabase project set up
- ✅ Database migration applied (`20250728175158_loyalty_system.sql`)
- ✅ Supabase CLI installed (`npm install -g supabase`)
- ✅ Environment variables configured
- ✅ Frontend components created

## 🗄️ Database Setup

### 1. Apply the Migration

```bash
# Navigate to your project directory
cd caribe-mail-connect

# Apply the loyalty system migration
supabase db push
```

### 2. Verify Tables Created

The following tables should be created:

- `loyalty_points` - User point balances and totals
- `loyalty_tiers` - Tier definitions with min/max points
- `tier_benefits` - Tier benefits and perks
- `user_tiers` - User tier assignments
- `points_transactions` - Point transaction history with types
- `loyalty_rewards` - Available rewards with categories
- `reward_redemptions` - Reward redemption records with status
- `loyalty_achievements` - Achievement definitions with categories
- `user_achievements` - User achievement progress tracking
- `loyalty_challenges` - Challenge definitions with goals
- `user_challenge_progress` - User challenge progress tracking
- `loyalty_streaks` - User streak tracking by type
- `community_goals` - Community goals with progress
- `user_community_contributions` - Community contributions
- `referral_program` - Referral tracking with codes
- `social_shares` - Social media shares with platforms
- `review_incentives` - Review submissions with ratings
- `loyalty_settings` - User preferences and notifications

### 3. Sample Data

The migration automatically includes sample data:

- **Default Tiers**: Bronze, Silver, Gold, Platinum with benefits
- **Sample Achievements**: 10 achievements across different categories
- **Tier Benefits**: Automatic benefits for each tier level

## ⚡ Edge Functions

### 1. Deploy Edge Functions

```bash
# Make the deployment script executable
chmod +x scripts/deploy-loyalty-functions.sh

# Run the deployment script
./scripts/deploy-loyalty-functions.sh
```

### 2. Edge Function Details

#### `calculate-loyalty-points`

- **Purpose**: Handles complex loyalty point calculations
- **Features**:
  - Point awarding based on action type
  - Automatic tier upgrades
  - Achievement unlocking
  - Challenge progress tracking
  - Transaction recording

#### `loyalty-webhook`

- **Purpose**: Processes external loyalty events
- **Features**:
  - Social media share tracking
  - Review submission processing
  - Referral completion handling
  - Birthday bonus automation
  - Streak bonus calculations
  - Community goal contributions

### 3. Environment Variables

Set these in your Supabase project:

```bash
# Set webhook secret
supabase secrets set LOYALTY_WEBHOOK_SECRET=your-secret-here

# Verify secrets
supabase secrets list
```

## 🎨 Frontend Integration

### 1. Updated Components

The following components have been updated with real Supabase integration:

- `useLoyalty.ts` - Main loyalty hook with real-time data
- `LoyaltyDashboard.tsx` - Dashboard with live updates
- `PointsBalanceCard.tsx` - Real-time point display
- `TierStatusCard.tsx` - Live tier status
- `RewardsCatalog.tsx` - Dynamic rewards loading
- `AchievementsGrid.tsx` - Achievement progress tracking
- `ChallengesList.tsx` - Challenge status updates
- `LeaderboardTable.tsx` - Live leaderboard
- `CommunityGoals.tsx` - Community goal tracking

### 2. Key Integration Points

#### Authentication Integration

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useLoyalty } from '@/hooks/useLoyalty';

// The useLoyalty hook automatically uses the authenticated user
const { user } = useAuth();
const { loyaltyState } = useLoyalty();
```

#### Real-time Data Loading

```typescript
import { useEffect } from 'react';

// Data is automatically loaded when user authenticates
useEffect(() => {
  if (user?.id) {
    loadLoyaltyData();
  }
}, [user?.id]);
```

#### Edge Function Integration

```typescript
// Points are awarded via edge functions
try {
  const result = await earnPoints(100, 'shipment_earned', 'Envío completado');
  console.log('Points earned:', result);
} catch (error) {
  console.error('Failed to earn points:', error);
}
```

## 🔄 Real-time Updates

### 1. Supabase Subscriptions

The system uses Supabase real-time subscriptions for live updates:

```typescript
// Subscribe to points changes
const pointsSubscription = supabase
  .channel('loyalty-points')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'loyalty_points',
    filter: `user_id=eq.${user.id}`
  }, () => {
    loadLoyaltyData(); // Refresh data
  })
  .subscribe();
```

### 2. Real-time Features

- **Live Point Updates**: Points change immediately across all devices
- **Tier Upgrades**: Automatic tier upgrades with notifications
- **Achievement Unlocks**: Instant achievement notifications
- **Challenge Progress**: Real-time challenge completion
- **Leaderboard Updates**: Live leaderboard rankings
- **Community Goals**: Live community goal progress

## 🔗 External Integrations

### 1. Social Media Integration

```typescript
import { LoyaltyIntegrations } from '@/services/loyaltyIntegrations';

// Share achievement on social media
const result = await LoyaltyIntegrations.shareOnSocialMedia({
  platform: 'facebook',
  shareType: 'achievement',
  contentUrl: 'https://prmcms.com/loyalty/achievements/123'
});
```

### 2. Review System Integration

```typescript
// Submit review and earn points
const result = await LoyaltyIntegrations.submitReview({
  platform: 'google',
  rating: 5,
  reviewText: 'Excelente servicio!',
  verified: true
});
```

### 3. Referral System

```typescript
// Generate referral link
const { referralCode, referralUrl } = await LoyaltyIntegrations.generateReferralLink();

// Complete referral
const result = await LoyaltyIntegrations.completeReferral({
  referredEmail: 'friend@example.com',
  referralCode: 'REF-ABC123',
  conversionValue: 50
});
```

### 4. Webhook Endpoints

External systems can send events to:

```text
POST /functions/v1/loyalty-webhook
```

Supported events:

- `social_share` - Social media sharing
- `review_submitted` - Review submissions
- `referral_completed` - Referral completions
- `birthday_reminder` - Birthday bonuses
- `streak_bonus` - Streak bonuses
- `community_goal_contribution` - Community contributions
- `external_achievement` - External achievements

## 🧪 Testing

### 1. Test Edge Functions Locally

```bash
# Start Supabase locally
supabase start

# Test calculate-loyalty-points function
curl -X POST "http://localhost:54321/functions/v1/calculate-loyalty-points" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-anon-key" \
  -d '{
    "userId": "test-user-id",
    "action": "shipment_earned",
    "metadata": {
      "shipmentValue": 100
    }
  }'
```

### 2. Test Webhook Function

```bash
# Test loyalty webhook
curl -X POST "http://localhost:54321/functions/v1/loyalty-webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-anon-key" \
  -d '{
    "event": "social_share",
    "userId": "test-user-id",
    "platform": "facebook",
    "data": {
      "contentUrl": "https://example.com",
      "shareType": "general"
    }
  }'
```

### 3. Frontend Testing

```bash
# Start development server
npm run dev

# Navigate to loyalty dashboard
# http://localhost:5173/#/loyalty
```

## 🚀 Deployment

### 1. Deploy to Production

```bash
# Deploy edge functions
./scripts/deploy-loyalty-functions.sh

# Deploy database changes
supabase db push --db-url your-production-db-url

# Build and deploy frontend
npm run build
```

### 2. Environment Configuration

Ensure these environment variables are set in production:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
LOYALTY_WEBHOOK_SECRET=your-webhook-secret
VITE_LOYALTY_ENABLED=true
```

### 3. Monitoring

Monitor the loyalty system with:

```bash
# Check function logs
supabase functions logs calculate-loyalty-points
supabase functions logs loyalty-webhook

# Check database performance
supabase db logs
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Edge Function Errors

**Problem**: Edge functions return 500 errors
**Solution**: Check function logs and ensure all environment variables are set

```bash
supabase functions logs calculate-loyalty-points --follow
```

#### 2. Real-time Not Working

**Problem**: Real-time updates not appearing
**Solution**: Verify Supabase client configuration and user authentication

```typescript
// Check if Supabase is properly configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('User:', user);
```

#### 3. Database Connection Issues

**Problem**: Database queries failing
**Solution**: Check RLS policies and user permissions

```sql
-- Check if user can access loyalty tables
SELECT * FROM loyalty_points WHERE user_id = auth.uid() LIMIT 1;
```

#### 4. Webhook Failures

**Problem**: External webhooks not working
**Solution**: Verify webhook secret and endpoint URL

```bash
# Test webhook endpoint
curl -X POST "your-webhook-url" \
  -H "x-webhook-signature: your-signature" \
  -d '{"event": "test"}'
```

### Debug Mode

Enable debug logging:

```typescript
// In your loyalty hook
const DEBUG = true;

if (DEBUG) {
  console.log('Loyalty data:', loyaltyState);
  console.log('User:', user);
}
```

## 📊 Performance Optimization

### 1. Database Indexes

The migration automatically creates these indexes:

```sql
-- Indexes are already created by the migration
-- Verify they exist if needed:
SELECT indexname FROM pg_indexes WHERE tablename = 'loyalty_points';
SELECT indexname FROM pg_indexes WHERE tablename = 'points_transactions';
SELECT indexname FROM pg_indexes WHERE tablename = 'user_achievements';
```

### 2. Caching Strategy

Implement caching for frequently accessed data:

```typescript
// Cache tier information
const tierCache = new Map();

const getTierInfo = async (userId: string) => {
  if (tierCache.has(userId)) {
    return tierCache.get(userId);
  }
  
  const tierInfo = await fetchTierInfo(userId);
  tierCache.set(userId, tierInfo);
  return tierInfo;
};
```

### 3. Batch Operations

Use batch operations for multiple updates:

```typescript
// Batch multiple point transactions
const batchUpdate = async (transactions: PointsTransaction[]) => {
  const { data, error } = await supabase
    .from('points_transactions')
    .insert(transactions);
  
  return { data, error };
};
```

## 🎉 Success Metrics

Track these metrics to measure loyalty system success:

- **User Engagement**: Daily active users on loyalty dashboard
- **Point Redemption Rate**: Percentage of points redeemed
- **Tier Progression**: Users upgrading tiers
- **Achievement Completion**: Achievement unlock rates
- **Referral Conversion**: Referral completion rates
- **Social Sharing**: Social media share engagement
- **Review Submissions**: Review submission rates

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Supabase function logs
3. Check database query performance
4. Verify environment variables
5. Test with the provided test scripts

---

**🎯 The loyalty system is now fully connected and ready for production use!**
