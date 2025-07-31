import { supabase } from '@/integrations/supabase/client';

export interface SocialShareData {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp';
  contentUrl?: string;
  shareType: 'general' | 'achievement' | 'reward' | 'milestone';
  engagementMetrics?: {
    likes?: number;
    shares?: number;
    comments?: number;
  };
}

export interface ReviewData {
  platform: 'google' | 'facebook' | 'yelp' | 'trustpilot';
  rating: number;
  reviewText?: string;
  reviewUrl?: string;
  verified: boolean;
}

export interface ReferralData {
  referredEmail: string;
  referralCode: string;
  conversionValue?: number;
}

export class LoyaltyIntegrations {
  private static webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/loyalty-webhook`;

  /**
   * Share content on social media and earn loyalty points
   */
  static async shareOnSocialMedia(data: SocialShareData): Promise<{ success: boolean; pointsAwarded?: number }> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          event: 'social_share',
          platform: data.platform,
          data: {
            contentUrl: data.contentUrl,
            shareType: data.shareType,
            engagementMetrics: data.engagementMetrics
          },
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process social share');
      }

      const result = await response.json();
      return { success: true, pointsAwarded: result.pointsAwarded };
    } catch (error) {
      console.error('Error sharing on social media:', error);
      return { success: false };
    }
  }

  /**
   * Submit a review and earn loyalty points
   */
  static async submitReview(data: ReviewData): Promise<{ success: boolean; pointsAwarded?: number }> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          event: 'review_submitted',
          platform: data.platform,
          data: {
            rating: data.rating,
            reviewText: data.reviewText,
            reviewUrl: data.reviewUrl,
            verified: data.verified
          },
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process review submission');
      }

      const result = await response.json();
      return { success: true, pointsAwarded: result.pointsAwarded };
    } catch (error) {
      console.error('Error submitting review:', error);
      return { success: false };
    }
  }

  /**
   * Complete a referral and earn loyalty points
   */
  static async completeReferral(data: ReferralData): Promise<{ success: boolean; pointsAwarded?: number }> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          event: 'referral_completed',
          data: {
            referredEmail: data.referredEmail,
            referralCode: data.referralCode,
            conversionValue: data.conversionValue
          },
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process referral completion');
      }

      const result = await response.json();
      return { success: true, pointsAwarded: result.pointsAwarded };
    } catch (error) {
      console.error('Error completing referral:', error);
      return { success: false };
    }
  }

  /**
   * Generate a referral link for the current user
   */
  static async generateReferralLink(): Promise<{ success: boolean; referralCode?: string; referralUrl?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate unique referral code
      const referralCode = `REF-${user.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36)}`;
      
      // Store referral code in database
      const { error } = await supabase
        .from('referral_programs')
        .insert({
          referrer_id: user.id,
          referral_code: referralCode,
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (error) {
        throw new Error('Failed to create referral code');
      }

      const referralUrl = `${window.location.origin}/referral/${referralCode}`;
      
      return { 
        success: true, 
        referralCode, 
        referralUrl 
      };
    } catch (error) {
      console.error('Error generating referral link:', error);
      return { success: false };
    }
  }

  /**
   * Get user's referral statistics
   */
  static async getReferralStats(): Promise<{
    success: boolean;
    stats?: {
      totalReferrals: number;
      completedReferrals: number;
      totalEarnings: number;
      pendingReferrals: number;
    };
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: referrals, error } = await supabase
        .from('referral_programs')
        .select('*')
        .eq('referrer_id', user.id);

      if (error) {
        throw new Error('Failed to fetch referral stats');
      }

      const stats = {
        totalReferrals: referrals.length,
        completedReferrals: referrals.filter(r => r.status === 'completed').length,
        totalEarnings: referrals
          .filter(r => r.status === 'completed')
          .reduce((sum, r) => sum + (r.conversion_value || 0), 0),
        pendingReferrals: referrals.filter(r => r.status === 'pending').length
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return { success: false };
    }
  }

  /**
   * Share achievement on social media
   */
  static async shareAchievement(achievementId: string, platform: SocialShareData['platform']): Promise<{ success: boolean }> {
    try {
      // Get achievement details
      const { data: achievement } = await supabase
        .from('loyalty_achievements')
        .select('*')
        .eq('id', achievementId)
        .single();

      if (!achievement) {
        throw new Error('Achievement not found');
      }

      // Share on social media
      const shareResult = await this.shareOnSocialMedia({
        platform,
        shareType: 'achievement',
        contentUrl: `${window.location.origin}/loyalty/achievements/${achievementId}`,
        engagementMetrics: {}
      });

      if (shareResult.success) {
        // Update achievement share count
        await supabase
          .from('user_achievements')
          .update({
            shares_count: (achievement.shares_count || 0) + 1
          })
          .eq('achievement_id', achievementId);
      }

      return shareResult;
    } catch (error) {
      console.error('Error sharing achievement:', error);
      return { success: false };
    }
  }

  /**
   * Track social media engagement
   */
  static async trackEngagement(platform: string, engagementType: string, contentId?: string): Promise<void> {
    try {
      await supabase
        .from('social_engagement')
        .insert({
          platform,
          engagement_type: engagementType,
          content_id: contentId,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  }

  /**
   * Get social media sharing options
   */
  static getSharingOptions(content: {
    title: string;
    description: string;
    url: string;
    image?: string;
  }) {
    const encodedUrl = encodeURIComponent(content.url);
    const encodedTitle = encodeURIComponent(content.title);
    const encodedDescription = encodeURIComponent(content.description);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
    };
  }

  /**
   * Open social media share dialog
   */
  static openShareDialog(platform: string, content: {
    title: string;
    description: string;
    url: string;
    image?: string;
  }): void {
    const sharingOptions = this.getSharingOptions(content);
    const shareUrl = sharingOptions[platform as keyof typeof sharingOptions];
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }
} 