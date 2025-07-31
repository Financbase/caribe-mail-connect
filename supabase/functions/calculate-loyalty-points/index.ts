import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalculatePointsRequest {
  userId: string;
  action: 'shipment' | 'referral' | 'review' | 'social_share' | 'birthday' | 'achievement' | 'challenge';
  metadata?: {
    shipmentValue?: number;
    referralEmail?: string;
    reviewRating?: number;
    platform?: string;
    achievementId?: string;
    challengeId?: string;
  };
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

    const { userId, action, metadata }: CalculatePointsRequest = await req.json()

    if (!userId || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId and action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let pointsToAward = 0
    let description = ''

    // Calculate points based on action type
    switch (action) {
      case 'shipment':
        const shipmentValue = metadata?.shipmentValue || 0
        pointsToAward = Math.floor(shipmentValue * 0.1) // 10% of shipment value
        description = `Puntos por envío - Valor: $${shipmentValue}`
        break

      case 'referral':
        pointsToAward = 500 // Fixed referral bonus
        description = `Bono por referido - ${metadata?.referralEmail || 'Nuevo cliente'}`
        break

      case 'review':
        const rating = metadata?.reviewRating || 5
        pointsToAward = rating * 50 // 50 points per star
        description = `Puntos por reseña - ${rating} estrellas`
        break

      case 'social_share':
        pointsToAward = 100 // Fixed social share bonus
        description = `Compartir en ${metadata?.platform || 'red social'}`
        break

      case 'birthday':
        pointsToAward = 1000 // Birthday bonus
        description = '¡Feliz cumpleaños! Bono especial'
        break

      case 'achievement':
        // Get achievement points from database
        if (metadata?.achievementId) {
          const { data: achievement } = await supabaseClient
            .from('loyalty_achievements')
            .select('points_reward')
            .eq('id', metadata.achievementId)
            .single()
          
          pointsToAward = achievement?.points_reward || 0
          description = `Logro desbloqueado`
        }
        break

      case 'challenge':
        // Get challenge points from database
        if (metadata?.challengeId) {
          const { data: challenge } = await supabaseClient
            .from('loyalty_challenges')
            .select('points_reward')
            .eq('id', metadata.challengeId)
            .single()
          
          pointsToAward = challenge?.points_reward || 0
          description = `Desafío completado`
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action type' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    if (pointsToAward <= 0) {
      return new Response(
        JSON.stringify({ error: 'No points to award for this action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get current user points
    const { data: currentPoints, error: pointsError } = await supabaseClient
      .from('user_loyalty_points')
      .select('balance, total_earned')
      .eq('user_id', userId)
      .single()

    if (pointsError && pointsError.code !== 'PGRST116') {
      throw new Error(`Error fetching user points: ${pointsError.message}`)
    }

    const currentBalance = currentPoints?.balance || 0
    const newBalance = currentBalance + pointsToAward

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('points_transactions')
      .insert({
        user_id: userId,
        transaction_type: action,
        amount: pointsToAward,
        balance: newBalance,
        description,
        metadata: metadata || {}
      })

    if (transactionError) {
      throw new Error(`Error creating transaction: ${transactionError.message}`)
    }

    // Update user points
    const { error: updateError } = await supabaseClient
      .from('user_loyalty_points')
      .upsert({
        user_id: userId,
        balance: newBalance,
        total_earned: (currentPoints?.total_earned || 0) + pointsToAward,
        updated_at: new Date().toISOString()
      })

    if (updateError) {
      throw new Error(`Error updating points: ${updateError.message}`)
    }

    // Check for tier upgrade
    const { error: tierError } = await supabaseClient
      .rpc('assign_user_tier', { user_id: userId })

    if (tierError) {
      console.error('Error checking tier upgrade:', tierError)
    }

    // Check for achievement unlocks
    await checkAchievementUnlocks(supabaseClient, userId, action, metadata)

    // Check for challenge progress
    await updateChallengeProgress(supabaseClient, userId, action, metadata)

    return new Response(
      JSON.stringify({
        success: true,
        pointsAwarded: pointsToAward,
        newBalance,
        description
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in calculate-loyalty-points:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function checkAchievementUnlocks(supabaseClient: any, userId: string, action: string, metadata?: any) {
  try {
    // Get all achievements that could be unlocked by this action
    const { data: achievements } = await supabaseClient
      .from('loyalty_achievements')
      .select('*')
      .eq('trigger_type', action)
      .eq('is_active', true)

    if (!achievements) return

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const { data: existingAchievement } = await supabaseClient
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single()

      if (existingAchievement?.is_unlocked) continue

      // Calculate progress based on action
      let progress = existingAchievement?.progress || 0
      let shouldUnlock = false

      switch (achievement.trigger_type) {
        case 'shipment':
          progress += 1
          shouldUnlock = progress >= achievement.max_progress
          break
        case 'referral':
          progress += 1
          shouldUnlock = progress >= achievement.max_progress
          break
        case 'review':
          progress += 1
          shouldUnlock = progress >= achievement.max_progress
          break
        case 'social_share':
          progress += 1
          shouldUnlock = progress >= achievement.max_progress
          break
        case 'points_earned':
          // This would need to be calculated based on total points
          break
        case 'streak_days':
          // This would need to be calculated based on current streak
          break
      }

      if (shouldUnlock) {
        // Unlock achievement
        await supabaseClient
          .from('user_achievements')
          .upsert({
            user_id: userId,
            achievement_id: achievement.id,
            is_unlocked: true,
            unlocked_at: new Date().toISOString(),
            progress: achievement.max_progress
          })

        // Award achievement points
        await supabaseClient
          .from('points_transactions')
          .insert({
            user_id: userId,
            transaction_type: 'achievement_bonus',
            amount: achievement.points_reward,
            description: `Logro: ${achievement.name}`,
            metadata: { achievement_id: achievement.id }
          })
      } else if (progress > 0) {
        // Update progress
        await supabaseClient
          .from('user_achievements')
          .upsert({
            user_id: userId,
            achievement_id: achievement.id,
            progress,
            is_unlocked: false
          })
      }
    }
  } catch (error) {
    console.error('Error checking achievement unlocks:', error)
  }
}

async function updateChallengeProgress(supabaseClient: any, userId: string, action: string, metadata?: any) {
  try {
    // Get active challenges for this user
    const { data: userChallenges } = await supabaseClient
      .from('user_challenges')
      .select(`
        *,
        loyalty_challenges (*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('is_completed', false)

    if (!userChallenges) return

    for (const userChallenge of userChallenges) {
      const challenge = userChallenge.loyalty_challenges
      let progress = userChallenge.current_progress || 0
      let shouldComplete = false

      // Update progress based on challenge type and action
      if (challenge.challenge_type === action) {
        progress += 1
        shouldComplete = progress >= challenge.goal
      }

      if (shouldComplete) {
        // Complete challenge
        await supabaseClient
          .from('user_challenges')
          .update({
            is_completed: true,
            completed_at: new Date().toISOString(),
            current_progress: challenge.goal
          })
          .eq('user_id', userId)
          .eq('challenge_id', challenge.id)

        // Award challenge points
        await supabaseClient
          .from('points_transactions')
          .insert({
            user_id: userId,
            transaction_type: 'challenge_completion',
            amount: challenge.points_reward,
            description: `Desafío: ${challenge.name}`,
            metadata: { challenge_id: challenge.id }
          })
      } else if (progress > userChallenge.current_progress) {
        // Update progress
        await supabaseClient
          .from('user_challenges')
          .update({
            current_progress: progress
          })
          .eq('user_id', userId)
          .eq('challenge_id', challenge.id)
      }
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error)
  }
} 