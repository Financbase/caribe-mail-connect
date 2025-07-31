-- Loyalty System Migration
-- Creates all tables and functions for the comprehensive loyalty program

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Loyalty Points Table
CREATE TABLE loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0,
    total_earned INTEGER NOT NULL DEFAULT 0,
    total_redeemed INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Loyalty Tiers Table
CREATE TABLE loyalty_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    min_points INTEGER NOT NULL,
    max_points INTEGER,
    color VARCHAR(7) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tier Benefits Table
CREATE TABLE tier_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_id UUID REFERENCES loyalty_tiers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    value DECIMAL(10,2),
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed', 'feature')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Tier Assignments
CREATE TABLE user_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tier_id UUID REFERENCES loyalty_tiers(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id)
);

-- Points Transactions Table
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'shipment_earned', 'referral_bonus', 'social_share', 'review_incentive',
        'birthday_bonus', 'achievement_bonus', 'streak_bonus', 'challenge_completion',
        'reward_redemption', 'points_expired', 'admin_adjustment'
    )),
    amount INTEGER NOT NULL,
    balance INTEGER NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Loyalty Rewards Table
CREATE TABLE loyalty_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'shipping_credits', 'service_upgrades', 'partner_rewards', 'gift_cards',
        'charitable_donations', 'exclusive_events', 'premium_features'
    )),
    points_cost INTEGER NOT NULL,
    original_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_limited BOOLEAN DEFAULT false,
    max_redemptions INTEGER,
    current_redemptions INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    partner_id UUID,
    partner_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward Redemptions Table
CREATE TABLE reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES loyalty_rewards(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'active', 'used', 'expired', 'cancelled'
    )),
    activation_code VARCHAR(100),
    expires_at TIMESTAMP WITH TIME ZONE,
    used_at TIMESTAMP WITH TIME ZONE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty Achievements Table
CREATE TABLE loyalty_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'shipments', 'referrals', 'social', 'reviews', 'streaks', 'community', 'special_events'
    )),
    icon VARCHAR(10) NOT NULL,
    points_reward INTEGER NOT NULL DEFAULT 0,
    max_progress INTEGER NOT NULL DEFAULT 1,
    rarity VARCHAR(20) NOT NULL DEFAULT 'common' CHECK (rarity IN (
        'common', 'rare', 'epic', 'legendary'
    )),
    badge_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES loyalty_achievements(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0,
    is_unlocked BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Loyalty Challenges Table
CREATE TABLE loyalty_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'shipment_count', 'referral_count', 'social_shares', 'review_count',
        'streak_days', 'community_contribution'
    )),
    goal INTEGER NOT NULL,
    points_reward INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    max_participants INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Challenge Progress Table
CREATE TABLE user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES loyalty_challenges(id) ON DELETE CASCADE,
    current_progress INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- Loyalty Streaks Table
CREATE TABLE loyalty_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('shipments', 'logins', 'reviews', 'social_shares')),
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_milestone INTEGER NOT NULL DEFAULT 7,
    milestone_reward INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, type)
);

-- Community Goals Table
CREATE TABLE community_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    target INTEGER NOT NULL,
    current_progress INTEGER NOT NULL DEFAULT 0,
    reward_type VARCHAR(20) NOT NULL CHECK (reward_type IN ('points', 'feature', 'event')),
    reward_value INTEGER NOT NULL,
    reward_description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Community Goal Contributions Table
CREATE TABLE user_community_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES community_goals(id) ON DELETE CASCADE,
    contribution INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, goal_id)
);

-- Referral Program Table
CREATE TABLE referral_program (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'registered', 'completed', 'expired'
    )),
    points_earned INTEGER DEFAULT 0,
    referral_code VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Shares Table
CREATE TABLE social_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN (
        'facebook', 'twitter', 'instagram', 'linkedin', 'whatsapp'
    )),
    content TEXT,
    points_earned INTEGER NOT NULL DEFAULT 0,
    engagement_count INTEGER DEFAULT 0,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review Incentives Table
CREATE TABLE review_incentives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN (
        'google', 'facebook', 'yelp', 'trustpilot', 'internal'
    )),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    points_earned INTEGER NOT NULL DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty Settings Table
CREATE TABLE loyalty_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    birthday_reminders BOOLEAN DEFAULT true,
    achievement_alerts BOOLEAN DEFAULT true,
    challenge_reminders BOOLEAN DEFAULT true,
    show_on_leaderboard BOOLEAN DEFAULT true,
    share_achievements BOOLEAN DEFAULT true,
    allow_referrals BOOLEAN DEFAULT true,
    public_profile BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Insert default tiers
INSERT INTO loyalty_tiers (name, display_name, description, min_points, max_points, color, icon) VALUES
('Bronze', 'Bronce', 'Miembro básico con beneficios estándar', 0, 999, '#CD7F32', '🥉'),
('Silver', 'Plata', 'Miembro Silver con beneficios mejorados', 1000, 1999, '#C0C0C0', '🥈'),
('Gold', 'Oro', 'Miembro Gold con beneficios exclusivos', 2000, 4999, '#FFD700', '🥇'),
('Platinum', 'Platino', 'Miembro Platinum con beneficios premium', 5000, NULL, '#E5E4E2', '💎');

-- Insert default tier benefits
INSERT INTO tier_benefits (tier_id, name, description, icon, value, type) 
SELECT 
    t.id,
    CASE 
        WHEN t.name = 'Bronze' THEN 'Envío Estándar'
        WHEN t.name = 'Silver' THEN 'Envío Mejorado'
        WHEN t.name = 'Gold' THEN 'Envío Gratis'
        WHEN t.name = 'Platinum' THEN 'Envío Premium'
    END,
    CASE 
        WHEN t.name = 'Bronze' THEN 'Envío estándar con tiempo normal'
        WHEN t.name = 'Silver' THEN 'Envío con tiempo mejorado'
        WHEN t.name = 'Gold' THEN 'Envío gratis en pedidos superiores a $50'
        WHEN t.name = 'Platinum' THEN 'Envío gratis en todos los pedidos'
    END,
    '🚚',
    CASE 
        WHEN t.name = 'Bronze' THEN NULL
        WHEN t.name = 'Silver' THEN NULL
        WHEN t.name = 'Gold' THEN 50
        WHEN t.name = 'Platinum' THEN NULL
    END,
    CASE 
        WHEN t.name = 'Bronze' THEN 'feature'
        WHEN t.name = 'Silver' THEN 'feature'
        WHEN t.name = 'Gold' THEN 'fixed'
        WHEN t.name = 'Platinum' THEN 'feature'
    END
FROM loyalty_tiers t;

-- Insert default achievements
INSERT INTO loyalty_achievements (name, description, category, icon, points_reward, max_progress, rarity) VALUES
('Primer Envío', 'Completa tu primer envío', 'shipments', '📦', 100, 1, 'common'),
('Envíos Frecuentes', 'Completa 10 envíos', 'shipments', '📦', 500, 10, 'rare'),
('Maestro del Envío', 'Completa 100 envíos', 'shipments', '📦', 2000, 100, 'epic'),
('Referidor Estrella', 'Invita a 5 amigos', 'referrals', '🌟', 500, 5, 'rare'),
('Influencer', 'Invita a 20 amigos', 'referrals', '🌟', 2000, 20, 'epic'),
('Social Butterfly', 'Comparte 10 veces en redes sociales', 'social', '📱', 300, 10, 'rare'),
('Crítico', 'Escribe 5 reseñas', 'reviews', '⭐', 200, 5, 'common'),
('Racha de 7 Días', 'Mantén actividad por 7 días consecutivos', 'streaks', '🔥', 200, 7, 'common'),
('Racha de 30 Días', 'Mantén actividad por 30 días consecutivos', 'streaks', '🔥', 1000, 30, 'epic'),
('Comunidad Activa', 'Participa en 5 metas comunitarias', 'community', '🤝', 500, 5, 'rare');

-- Create indexes for better performance
CREATE INDEX idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX idx_points_transactions_type ON points_transactions(type);
CREATE INDEX idx_points_transactions_created_at ON points_transactions(created_at);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_challenge_progress_user_id ON user_challenge_progress(user_id);
CREATE INDEX idx_user_challenge_progress_challenge_id ON user_challenge_progress(challenge_id);
CREATE INDEX idx_loyalty_streaks_user_id ON loyalty_streaks(user_id);
CREATE INDEX idx_loyalty_streaks_type ON loyalty_streaks(type);
CREATE INDEX idx_reward_redemptions_user_id ON reward_redemptions(user_id);
CREATE INDEX idx_reward_redemptions_reward_id ON reward_redemptions(reward_id);
CREATE INDEX idx_referral_program_referrer_id ON referral_program(referrer_id);
CREATE INDEX idx_referral_program_referral_code ON referral_program(referral_code);

-- Create functions for automatic tier assignment
CREATE OR REPLACE FUNCTION assign_user_tier()
RETURNS TRIGGER AS $$
DECLARE
    new_tier_id UUID;
    current_tier_id UUID;
BEGIN
    -- Get the appropriate tier based on points balance
    SELECT id INTO new_tier_id
    FROM loyalty_tiers
    WHERE min_points <= NEW.balance
    AND (max_points IS NULL OR NEW.balance <= max_points)
    ORDER BY min_points DESC
    LIMIT 1;

    -- Check if user already has a tier
    SELECT tier_id INTO current_tier_id
    FROM user_tiers
    WHERE user_id = NEW.user_id;

    -- If no current tier or tier has changed, update it
    IF current_tier_id IS NULL OR current_tier_id != new_tier_id THEN
        -- Delete old tier assignment
        DELETE FROM user_tiers WHERE user_id = NEW.user_id;
        
        -- Insert new tier assignment
        INSERT INTO user_tiers (user_id, tier_id)
        VALUES (NEW.user_id, new_tier_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic tier assignment
CREATE TRIGGER trigger_assign_user_tier
    AFTER UPDATE OF balance ON loyalty_points
    FOR EACH ROW
    EXECUTE FUNCTION assign_user_tier();

-- Create function to initialize loyalty data for new users
CREATE OR REPLACE FUNCTION initialize_loyalty_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert default loyalty points
    INSERT INTO loyalty_points (user_id, balance, total_earned, total_redeemed)
    VALUES (NEW.id, 0, 0, 0);
    
    -- Insert default loyalty settings
    INSERT INTO loyalty_settings (user_id)
    VALUES (NEW.id);
    
    -- Assign Bronze tier
    INSERT INTO user_tiers (user_id, tier_id)
    SELECT NEW.id, id FROM loyalty_tiers WHERE name = 'Bronze';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user initialization
CREATE TRIGGER trigger_initialize_loyalty_data
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_loyalty_data();

-- Create function to calculate user's current tier
CREATE OR REPLACE FUNCTION get_user_tier(user_uuid UUID)
RETURNS TABLE (
    tier_name VARCHAR(50),
    tier_display_name VARCHAR(100),
    tier_description TEXT,
    tier_color VARCHAR(7),
    tier_icon VARCHAR(10),
    min_points INTEGER,
    max_points INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.name,
        t.display_name,
        t.description,
        t.color,
        t.icon,
        t.min_points,
        t.max_points
    FROM loyalty_tiers t
    INNER JOIN user_tiers ut ON t.id = ut.tier_id
    WHERE ut.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_community_contributions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own loyalty data" ON loyalty_points
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own loyalty data" ON loyalty_points
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions" ON points_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" ON user_achievements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own challenge progress" ON user_challenge_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress" ON user_challenge_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own streaks" ON loyalty_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" ON loyalty_streaks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own redemptions" ON reward_redemptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions" ON reward_redemptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own settings" ON loyalty_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON loyalty_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own referrals" ON referral_program
    FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create their own referrals" ON referral_program
    FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can view their own social shares" ON social_shares
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own social shares" ON social_shares
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reviews" ON review_incentives
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reviews" ON review_incentives
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own community contributions" ON user_community_contributions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own community contributions" ON user_community_contributions
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for leaderboard data
CREATE POLICY "Public can view leaderboard data" ON loyalty_points
    FOR SELECT USING (true);

CREATE POLICY "Public can view tiers" ON loyalty_tiers
    FOR SELECT USING (true);

CREATE POLICY "Public can view achievements" ON loyalty_achievements
    FOR SELECT USING (true);

CREATE POLICY "Public can view challenges" ON loyalty_challenges
    FOR SELECT USING (true);

CREATE POLICY "Public can view rewards" ON loyalty_rewards
    FOR SELECT USING (true);

CREATE POLICY "Public can view community goals" ON community_goals
    FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_loyalty_points_updated_at
    BEFORE UPDATE ON loyalty_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_tiers_updated_at
    BEFORE UPDATE ON loyalty_tiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tier_benefits_updated_at
    BEFORE UPDATE ON tier_benefits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_rewards_updated_at
    BEFORE UPDATE ON loyalty_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reward_redemptions_updated_at
    BEFORE UPDATE ON reward_redemptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_achievements_updated_at
    BEFORE UPDATE ON loyalty_achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
    BEFORE UPDATE ON user_achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_challenges_updated_at
    BEFORE UPDATE ON loyalty_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_challenge_progress_updated_at
    BEFORE UPDATE ON user_challenge_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_streaks_updated_at
    BEFORE UPDATE ON loyalty_streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_goals_updated_at
    BEFORE UPDATE ON community_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_community_contributions_updated_at
    BEFORE UPDATE ON user_community_contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_program_updated_at
    BEFORE UPDATE ON referral_program
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_settings_updated_at
    BEFORE UPDATE ON loyalty_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 