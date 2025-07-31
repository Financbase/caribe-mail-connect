import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  event: string;
  userId?: string;
  email?: string;
  platform?: string;
  data?: any;
  timestamp: number;
  signature?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify webhook signature if provided
    const signature = req.headers.get('x-webhook-signature')
    const webhookSecret = Deno.env.get('LOYALTY_WEBHOOK_SECRET')
    
    if (signature && webhookSecret) {
      const body = await req.text()
      const expectedSignature = hmac('sha256', webhookSecret, body, 'hex')
      
      if (signature !== expectedSignature) {
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      // Parse the verified body
      const payload: WebhookPayload = JSON.parse(body)
      return await processWebhook(supabaseClient, payload)
    } else {
      // No signature verification, parse body directly
      const payload: WebhookPayload = await req.json()
      return await processWebhook(supabaseClient, payload)
    }

  } catch (error) {
    console.error('Error in loyalty-webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function processWebhook(supabaseClient: any, payload: WebhookPayload) {
  const { event, userId, email, platform, data, timestamp } = payload

  // Validate required fields
  if (!event) {
    return new Response(
      JSON.stringify({ error: 'Missing event type' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  // Find user by email if userId not provided
  let targetUserId = userId
  if (!targetUserId && email) {
    const { data: user } = await supabaseClient.auth.admin.getUserByEmail(email)
    targetUserId = user?.user?.id
  }

  if (!targetUserId) {
    return new Response(
      JSON.stringify({ error: 'User not found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    switch (event) {
      case 'social_share':
        await handleSocialShare(supabaseClient, targetUserId, platform, data)
        break

      case 'review_submitted':
        await handleReviewSubmitted(supabaseClient, targetUserId, platform, data)
        break

      case 'referral_completed':
        await handleReferralCompleted(supabaseClient, targetUserId, data)
        break

      case 'birthday_reminder':
        await handleBirthdayReminder(supabaseClient, targetUserId)
        break

      case 'streak_bonus':
        await handleStreakBonus(supabaseClient, targetUserId, data)
        break

      case 'community_goal_contribution':
        await handleCommunityGoalContribution(supabaseClient, targetUserId, data)
        break

      case 'external_achievement':
        await handleExternalAchievement(supabaseClient, targetUserId, data)
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown event type' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    // Log webhook event
    await supabaseClient
      .from('webhook_events')
      .insert({
        event_type: event,
        user_id: targetUserId,
        platform,
        payload: data,
        processed_at: new Date().toISOString(),
        status: 'success'
      })

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    // Log failed webhook
    await supabaseClient
      .from('webhook_events')
      .insert({
        event_type: event,
        user_id: targetUserId,
        platform,
        payload: data,
        processed_at: new Date().toISOString(),
        status: 'failed',
        error_message: error.message
      })

    throw error
  }
}

async function handleSocialShare(supabaseClient: any, userId: string, platform: string, data: any) {
  // Record social share
  await supabaseClient
    .from('social_shares')
    .insert({
      user_id: userId,
      platform,
      content_url: data?.contentUrl,
      share_type: data?.shareType || 'general',
      engagement_metrics: data?.engagementMetrics || {}
    })

  // Award points via edge function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-loyalty-points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      userId,
      action: 'social_share',
      metadata: {
        platform,
        contentUrl: data?.contentUrl,
        shareType: data?.shareType
      }
    })
  })

  if (!response.ok) {
    throw new Error('Failed to award social share points')
  }
}

async function handleReviewSubmitted(supabaseClient: any, userId: string, platform: string, data: any) {
  // Record review
  await supabaseClient
    .from('review_incentives')
    .insert({
      user_id: userId,
      platform,
      review_id: data?.reviewId,
      rating: data?.rating,
      review_text: data?.reviewText,
      review_url: data?.reviewUrl,
      verified: data?.verified || false
    })

  // Award points via edge function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-loyalty-points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      userId,
      action: 'review',
      metadata: {
        platform,
        rating: data?.rating,
        reviewId: data?.reviewId,
        verified: data?.verified
      }
    })
  })

  if (!response.ok) {
    throw new Error('Failed to award review points')
  }
}

async function handleReferralCompleted(supabaseClient: any, userId: string, data: any) {
  // Record referral
  await supabaseClient
    .from('referral_programs')
    .insert({
      referrer_id: userId,
      referred_email: data?.referredEmail,
      referral_code: data?.referralCode,
      conversion_value: data?.conversionValue,
      status: 'completed',
      completed_at: new Date().toISOString()
    })

  // Award points via edge function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-loyalty-points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      userId,
      action: 'referral',
      metadata: {
        referredEmail: data?.referredEmail,
        referralCode: data?.referralCode,
        conversionValue: data?.conversionValue
      }
    })
  })

  if (!response.ok) {
    throw new Error('Failed to award referral points')
  }
}

async function handleBirthdayReminder(supabaseClient: any, userId: string) {
  // Check if birthday bonus already awarded this year
  const currentYear = new Date().getFullYear()
  const startOfYear = new Date(currentYear, 0, 1).toISOString()
  const endOfYear = new Date(currentYear, 11, 31).toISOString()

  const { data: existingBonus } = await supabaseClient
    .from('points_transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('transaction_type', 'birthday')
    .gte('created_at', startOfYear)
    .lte('created_at', endOfYear)
    .single()

  if (existingBonus) {
    return // Already awarded this year
  }

  // Award birthday points via edge function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-loyalty-points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      userId,
      action: 'birthday'
    })
  })

  if (!response.ok) {
    throw new Error('Failed to award birthday points')
  }
}

async function handleStreakBonus(supabaseClient: any, userId: string, data: any) {
  const { streakDays, streakType } = data

  // Update user streak
  await supabaseClient
    .from('user_streaks')
    .upsert({
      user_id: userId,
      streak_type: streakType,
      current_streak: streakDays,
      longest_streak: streakDays, // Will be updated if longer
      last_activity: new Date().toISOString()
    })

  // Award streak bonus points
  const bonusPoints = Math.floor(streakDays / 7) * 100 // 100 points per week

  if (bonusPoints > 0) {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-loyalty-points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({
        userId,
        action: 'streak_bonus',
        metadata: {
          streakDays,
          streakType,
          bonusPoints
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to award streak bonus')
    }
  }
}

async function handleCommunityGoalContribution(supabaseClient: any, userId: string, data: any) {
  const { goalId, contribution } = data

  // Update community goal progress
  const { data: goal } = await supabaseClient
    .from('community_goals')
    .select('*')
    .eq('id', goalId)
    .single()

  if (!goal) {
    throw new Error('Community goal not found')
  }

  // Update goal progress
  await supabaseClient
    .from('community_goals')
    .update({
      current_progress: goal.current_progress + contribution,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)

  // Record user contribution
  await supabaseClient
    .from('community_goal_contributions')
    .insert({
      user_id: userId,
      goal_id: goalId,
      contribution,
      contributed_at: new Date().toISOString()
    })

  // Check if goal is completed
  if (goal.current_progress + contribution >= goal.target) {
    // Award completion bonus to all participants
    const { data: participants } = await supabaseClient
      .from('community_goal_contributions')
      .select('user_id')
      .eq('goal_id', goalId)

    for (const participant of participants) {
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-loyalty-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          userId: participant.user_id,
          action: 'community_goal_completion',
          metadata: {
            goalId,
            goalName: goal.name,
            reward: goal.reward
          }
        })
      })

      if (!response.ok) {
        console.error(`Failed to award community goal bonus to user ${participant.user_id}`)
      }
    }
  }
}

async function handleExternalAchievement(supabaseClient: any, userId: string, data: any) {
  const { achievementId, platform, achievementData } = data

  // Create external achievement record
  await supabaseClient
    .from('external_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievementId,
      platform,
      achievement_data: achievementData,
      unlocked_at: new Date().toISOString()
    })

  // Award points via edge function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-loyalty-points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      userId,
      action: 'achievement',
      metadata: {
        achievementId,
        platform,
        external: true
      }
    })
  })

  if (!response.ok) {
    throw new Error('Failed to award external achievement points')
  }
} 