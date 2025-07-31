# Loyalty System Deployment Guide

## Overview

This guide will help you deploy the loyalty system functions manually through the Supabase Dashboard since CLI deployment is experiencing issues.

## Project Details

- **Project URL**: <https://flbwqsocnlvsuqgupbra.supabase.co>
- **Project ID**: flbwqsocnlvsuqgupbra

## Step 1: Access Supabase Dashboard

1. Go to <https://supabase.com/dashboard>
2. Sign in to your account
3. Navigate to the project: **flbwqsocnlvsuqgupbra**

## Step 2: Deploy calculate-loyalty-points Function

1. In the Supabase Dashboard, go to **Edge Functions** in the left sidebar
2. Click **Create a new function**
3. Set the function name: `calculate-loyalty-points`
4. Copy and paste the following code into the function editor:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LoyaltyEvent {
  userId: string;
  eventType: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, eventType, metadata = {} }: LoyaltyEvent = await req.json();

    console.log(`Processing loyalty event: ${eventType} for user: ${userId}`);

    // Calculate points based on event type
    let pointsEarned = 0;
    let description = "";

    switch (eventType) {
      case "shipment":
        pointsEarned = 10;
        description = "Package shipment";
        break;
      case "referral":
        pointsEarned = 50;
        description = "Customer referral";
        break;
      case "review":
        pointsEarned = 25;
        description = "Service review";
        break;
      case "social_share":
        pointsEarned = 15;
        description = "Social media share";
        break;
      case "birthday":
        pointsEarned = 100;
        description = "Birthday bonus";
        break;
      case "achievement":
        pointsEarned = metadata.points || 0;
        description = metadata.description || "Achievement unlocked";
        break;
      case "challenge":
        pointsEarned = metadata.points || 0;
        description = metadata.description || "Challenge completed";
        break;
      default:
        return new Response(JSON.stringify({ error: "Unknown event type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (pointsEarned <= 0) {
      return new Response(JSON.stringify({ error: "No points to award" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get current user loyalty data
    const { data: userLoyalty, error: fetchError } = await supabase
      .from("loyalty_accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(`Failed to fetch user loyalty: ${fetchError.message}`);
    }

    let currentPoints = 0;
    let currentTier = "bronze";
    let loyaltyAccountId: string;

    if (!userLoyalty) {
      // Create new loyalty account
      const { data: newAccount, error: createError } = await supabase
        .from("loyalty_accounts")
        .insert({
          user_id: userId,
          points_balance: pointsEarned,
          tier: "bronze",
          total_points_earned: pointsEarned,
          joined_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create loyalty account: ${createError.message}`);
      }

      loyaltyAccountId = newAccount.id;
      currentPoints = pointsEarned;
    } else {
      // Update existing account
      const newPointsBalance = userLoyalty.points_balance + pointsEarned;
      const newTotalPoints = userLoyalty.total_points_earned + pointsEarned;

      // Determine tier based on total points
      let newTier = "bronze";
      if (newTotalPoints >= 1000) newTier = "platinum";
      else if (newTotalPoints >= 500) newTier = "gold";
      else if (newTotalPoints >= 100) newTier = "silver";

      const { error: updateError } = await supabase
        .from("loyalty_accounts")
        .update({
          points_balance: newPointsBalance,
          total_points_earned: newTotalPoints,
          tier: newTier,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userLoyalty.id);

      if (updateError) {
        throw new Error(`Failed to update loyalty account: ${updateError.message}`);
      }

      loyaltyAccountId = userLoyalty.id;
      currentPoints = newPointsBalance;
      currentTier = newTier;
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from("loyalty_transactions")
      .insert({
        loyalty_account_id: loyaltyAccountId,
        user_id: userId,
        event_type: eventType,
        points_earned: pointsEarned,
        description: description,
        metadata: metadata,
        transaction_date: new Date().toISOString(),
      });

    if (transactionError) {
      throw new Error(`Failed to create transaction record: ${transactionError.message}`);
    }

    // Check for tier changes and trigger notifications
    if (userLoyalty && userLoyalty.tier !== currentTier) {
      await supabase
        .from("loyalty_notifications")
        .insert({
          user_id: userId,
          type: "tier_upgrade",
          title: "Tier Upgrade!",
          message: `Congratulations! You have been upgraded to ${currentTier} tier.`,
          metadata: { old_tier: userLoyalty.tier, new_tier: currentTier },
          created_at: new Date().toISOString(),
        });
    }

    // Check for achievement unlocks
    if (eventType === "achievement") {
      await supabase
        .from("loyalty_notifications")
        .insert({
          user_id: userId,
          type: "achievement",
          title: "Achievement Unlocked!",
          message: description,
          metadata: metadata,
          created_at: new Date().toISOString(),
        });
    }

    // Check for challenge progress
    if (eventType === "challenge") {
      await supabase
        .from("loyalty_notifications")
        .insert({
          user_id: userId,
          type: "challenge",
          title: "Challenge Progress!",
          message: description,
          metadata: metadata,
          created_at: new Date().toISOString(),
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        pointsEarned,
        currentBalance: currentPoints,
        currentTier,
        description,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing loyalty event:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

1. Click **Deploy** to deploy the function

## Step 3: Deploy loyalty-webhook Function

1. Click **Create a new function** again
2. Set the function name: `loyalty-webhook`
3. Copy and paste the following code:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.119.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookEvent {
  userId: string;
  eventType: string;
  metadata?: Record<string, any>;
  signature?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, eventType, metadata = {}, signature }: WebhookEvent = await req.json();

    console.log(`Processing webhook event: ${eventType} for user: ${userId}`);

    // Verify webhook signature if provided
    if (signature) {
      const webhookSecret = Deno.env.get("LOYALTY_WEBHOOK_SECRET");
      if (!webhookSecret) {
        throw new Error("Webhook secret not configured");
      }

      const expectedSignature = createHmac("sha256", webhookSecret)
        .update(JSON.stringify({ userId, eventType, metadata }))
        .digest("hex");

      if (signature !== expectedSignature) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Call the calculate-loyalty-points function
    const { data, error } = await supabase.functions.invoke("calculate-loyalty-points", {
      body: { userId, eventType, metadata },
    });

    if (error) {
      throw new Error(`Failed to process loyalty event: ${error.message}`);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

1. Click **Deploy** to deploy the function

## Step 4: Set Webhook Secret

1. In the Supabase Dashboard, go to **Settings** → **Edge Functions**
2. Click **Add a new secret**
3. Set the key: `LOYALTY_WEBHOOK_SECRET`
4. Set the value to a secure random string (you can generate one using an online generator)
5. Click **Save**

## Step 5: Verify Deployment

1. Go to **Edge Functions** in the dashboard
2. You should see both functions listed:
   - `calculate-loyalty-points`
   - `loyalty-webhook`
3. Both should show status as **Active**

## Step 6: Test the Functions

### Test calculate-loyalty-points directly

```bash
curl -X POST https://flbwqsocnlvsuqgupbra.supabase.co/functions/v1/calculate-loyalty-points \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "eventType": "shipment",
    "metadata": {}
  }'
```

### Test loyalty-webhook

```bash
curl -X POST https://flbwqsocnlvsuqgupbra.supabase.co/functions/v1/loyalty-webhook \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "eventType": "social_share",
    "metadata": {}
  }'
```

## Database Tables Required

Make sure the following tables exist in your database (they should be created by the loyalty migration):

- `loyalty_accounts`
- `loyalty_transactions`
- `loyalty_notifications`

## Troubleshooting

1. **Function not found**: Make sure you're in the correct project
2. **Database errors**: Verify the loyalty tables exist
3. **Permission errors**: Check that the service role key is properly configured
4. **CORS errors**: The functions include CORS headers, but you may need to configure your frontend accordingly

## Next Steps

After deployment:

1. Update your frontend to call these functions
2. Set up webhook endpoints for external integrations
3. Configure loyalty point calculations in your business logic
4. Test the complete loyalty flow

## Support

If you encounter issues:

1. Check the function logs in the Supabase Dashboard
2. Verify the database schema matches the expected structure
3. Test with simple events first before complex integrations
