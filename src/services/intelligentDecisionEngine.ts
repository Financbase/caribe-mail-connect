/**
 * Intelligent Decision Making Engine
 * Story 2.1: AI-Powered Automation & Intelligence
 * 
 * AI-powered decision making system with rule engines, machine learning models,
 * contextual reasoning, and automated business process decisions
 */

import { supabase } from '@/integrations/supabase/client';
import { HuggingFaceService, CloudflareAIService, LangChainAgentService } from './aiIntegrations';
import { PredictiveAnalyticsService } from './predictiveAnalytics';
import type { 
  DecisionRequest,
  DecisionResult,
  DecisionRule,
  DecisionContext,
  DecisionFactor,
  DecisionExplanation,
  BusinessRule,
  MLDecisionModel
} from '@/types/ai';

// =====================================================
// INTELLIGENT DECISION ENGINE
// =====================================================

export class IntelligentDecisionEngine {

  /**
   * Make intelligent decision based on context and rules
   */
  static async makeDecision(
    request: DecisionRequest,
    subscriptionId: string
  ): Promise<DecisionResult> {
    try {
      const startTime = Date.now();

      // Step 1: Gather decision context
      const context = await this.gatherDecisionContext(request, subscriptionId);

      // Step 2: Apply business rules
      const ruleResults = await this.applyBusinessRules(request, context, subscriptionId);

      // Step 3: Apply ML models if available
      const mlResults = await this.applyMLModels(request, context, subscriptionId);

      // Step 4: Combine results with weighted scoring
      const combinedScore = this.combineDecisionScores(ruleResults, mlResults, context);

      // Step 5: Make final decision
      const decision = this.makeFinalDecision(combinedScore, request.decision_threshold || 0.7);

      // Step 6: Generate explanation
      const explanation = await this.generateDecisionExplanation(
        decision,
        ruleResults,
        mlResults,
        context,
        request
      );

      // Step 7: Determine confidence and risk assessment
      const confidence = this.calculateDecisionConfidence(ruleResults, mlResults, context);
      const riskAssessment = this.assessDecisionRisk(decision, context, confidence);

      const result: DecisionResult = {
        decision_id: `dec_${Date.now()}`,
        request_id: request.request_id,
        subscription_id: subscriptionId,
        decision: decision.value,
        confidence_score: confidence,
        decision_score: combinedScore,
        explanation,
        factors_considered: this.extractDecisionFactors(ruleResults, mlResults, context),
        risk_assessment: riskAssessment,
        alternative_options: this.generateAlternativeOptions(combinedScore, context),
        recommended_actions: this.generateRecommendedActions(decision, context),
        processing_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };

      // Store decision for learning and audit
      await this.storeDecisionResult(result);

      // Execute automated actions if decision confidence is high
      if (confidence > 0.8 && request.auto_execute) {
        await this.executeDecisionActions(result);
      }

      return result;
    } catch (error) {
      console.error('Error making intelligent decision:', error);
      throw error;
    }
  }

  /**
   * Gather comprehensive decision context
   */
  private static async gatherDecisionContext(
    request: DecisionRequest,
    subscriptionId: string
  ): Promise<DecisionContext> {
    try {
      // Get historical data for similar decisions
      const historicalDecisions = await this.getHistoricalDecisions(
        request.decision_type,
        subscriptionId,
        10
      );

      // Get current business metrics
      const businessMetrics = await this.getCurrentBusinessMetrics(subscriptionId);

      // Get customer context if applicable
      let customerContext = null;
      if (request.customer_id) {
        customerContext = await this.getCustomerContext(request.customer_id, subscriptionId);
      }

      // Get external factors (market conditions, etc.)
      const externalFactors = await this.getExternalFactors(request.decision_type);

      // Analyze current system state
      const systemState = await this.getSystemState(subscriptionId);

      return {
        request,
        historical_decisions: historicalDecisions,
        business_metrics: businessMetrics,
        customer_context: customerContext,
        external_factors: externalFactors,
        system_state: systemState,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error gathering decision context:', error);
      return {
        request,
        historical_decisions: [],
        business_metrics: {},
        customer_context: null,
        external_factors: {},
        system_state: {},
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Apply business rules to decision
   */
  private static async applyBusinessRules(
    request: DecisionRequest,
    context: DecisionContext,
    subscriptionId: string
  ): Promise<any> {
    try {
      // Get applicable business rules
      const { data: rules } = await supabase
        .from('business_rules')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('decision_type', request.decision_type)
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (!rules || rules.length === 0) {
        return { score: 0.5, rules_applied: [], confidence: 0.3 };
      }

      let totalScore = 0;
      let totalWeight = 0;
      const rulesApplied: any[] = [];

      for (const rule of rules) {
        const ruleResult = await this.evaluateBusinessRule(rule, context);
        
        if (ruleResult.applies) {
          totalScore += ruleResult.score * rule.weight;
          totalWeight += rule.weight;
          rulesApplied.push({
            rule_id: rule.id,
            rule_name: rule.name,
            score: ruleResult.score,
            weight: rule.weight,
            explanation: ruleResult.explanation
          });
        }
      }

      const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0.5;

      return {
        score: finalScore,
        rules_applied: rulesApplied,
        confidence: Math.min(rulesApplied.length * 0.2, 0.9)
      };
    } catch (error) {
      console.error('Error applying business rules:', error);
      return { score: 0.5, rules_applied: [], confidence: 0.3 };
    }
  }

  /**
   * Apply machine learning models to decision using real AI
   */
  private static async applyMLModels(
    request: DecisionRequest,
    context: DecisionContext,
    subscriptionId: string
  ): Promise<any> {
    try {
      // Use real HuggingFace models for decision making
      const aiAnalysis = await this.analyzeDecisionWithAI(request, context);

      // Get applicable ML models from database
      const { data: models } = await supabase
        .from('ml_decision_models')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('decision_type', request.decision_type)
        .eq('status', 'deployed')
        .order('accuracy', { ascending: false });

      const modelResults: any[] = [];

      // Add AI analysis as a "model" result
      modelResults.push({
        model_id: 'huggingface_ai',
        model_name: 'HuggingFace AI Analysis',
        prediction: aiAnalysis.score,
        confidence: aiAnalysis.confidence,
        feature_importance: aiAnalysis.feature_importance,
        ai_insights: aiAnalysis.insights
      });

      // Run any custom models if available
      if (models && models.length > 0) {
        for (const model of models.slice(0, 2)) { // Use top 2 custom models
          try {
            const prediction = await this.runCustomMLModel(model, context, aiAnalysis);
            modelResults.push({
              model_id: model.id,
              model_name: model.name,
              prediction: prediction.value,
              confidence: prediction.confidence,
              feature_importance: prediction.feature_importance
            });
          } catch (error) {
            console.error(`Error running custom ML model ${model.id}:`, error);
          }
        }
      }

      // Ensemble prediction with AI insights
      const weightedScore = modelResults.reduce((sum, result) =>
        sum + (result.prediction * result.confidence), 0
      ) / modelResults.reduce((sum, result) => sum + result.confidence, 0);

      const avgConfidence = modelResults.reduce((sum, result) =>
        sum + result.confidence, 0
      ) / modelResults.length;

      return {
        score: weightedScore,
        models_used: modelResults,
        confidence: avgConfidence,
        ai_analysis: aiAnalysis
      };
    } catch (error) {
      console.error('Error applying ML models with AI:', error);
      return { score: 0.5, models_used: [], confidence: 0.4 };
    }
  }

  /**
   * Analyze decision using real HuggingFace AI
   */
  private static async analyzeDecisionWithAI(
    request: DecisionRequest,
    context: DecisionContext
  ): Promise<any> {
    try {
      // Use HuggingFace for sentiment and entity analysis
      const [sentiment, entities] = await Promise.all([
        HuggingFaceService.analyzeSentiment(request.description),
        HuggingFaceService.extractEntities(request.description)
      ]);

      // Analyze decision factors
      const decisionFactors = this.extractDecisionFactors(request, context, entities);
      const riskFactors = this.assessRiskFactors(request, context, sentiment);

      // Calculate AI-based decision score
      let score = 0.5; // Base score
      let confidence = 0.6;

      // Sentiment-based scoring
      if (sentiment.label === 'POSITIVE' && sentiment.score > 0.7) {
        score += 0.2;
        confidence += 0.1;
      } else if (sentiment.label === 'NEGATIVE' && sentiment.score > 0.7) {
        score -= 0.2;
        confidence += 0.1;
      }

      // Entity-based scoring
      const hasMoneyEntities = entities.some(e => e.label === 'MONEY' || e.entity_group === 'MONEY');
      const hasPersonEntities = entities.some(e => e.label === 'PERSON' || e.entity_group === 'PER');
      const hasOrgEntities = entities.some(e => e.label === 'ORG' || e.entity_group === 'ORG');

      if (hasMoneyEntities) {
        // Financial decisions need more scrutiny
        score -= 0.1;
        confidence += 0.05;
      }

      if (hasPersonEntities || hasOrgEntities) {
        // Decisions involving specific people/organizations
        confidence += 0.1;
      }

      // Context-based adjustments
      if (context.customer_context) {
        const customerTier = context.customer_context.customer_tier;
        if (customerTier === 'premium') {
          score += 0.15; // More lenient for premium customers
        } else if (customerTier === 'basic') {
          score -= 0.05; // More strict for basic customers
        }
      }

      // Business metrics adjustments
      if (context.business_metrics) {
        const satisfaction = context.business_metrics.customer_satisfaction || 0.5;
        const efficiency = context.business_metrics.operational_efficiency || 0.5;

        score += (satisfaction - 0.5) * 0.2;
        score += (efficiency - 0.5) * 0.1;
      }

      // Normalize score and confidence
      score = Math.max(0, Math.min(1, score));
      confidence = Math.max(0.3, Math.min(0.95, confidence));

      return {
        score,
        confidence,
        feature_importance: {
          sentiment: sentiment.score,
          entities: entities.length / 10, // Normalize entity count
          customer_context: context.customer_context ? 0.3 : 0,
          business_metrics: context.business_metrics ? 0.2 : 0,
          historical_data: context.historical_decisions.length / 20 // Normalize history
        },
        insights: [
          `Sentiment analysis: ${sentiment.label} (${sentiment.score.toFixed(2)})`,
          `Entities detected: ${entities.length}`,
          `Customer tier: ${context.customer_context?.customer_tier || 'unknown'}`,
          `Historical decisions available: ${context.historical_decisions.length}`
        ]
      };
    } catch (error) {
      console.error('Error analyzing decision with AI:', error);
      return {
        score: 0.5,
        confidence: 0.4,
        feature_importance: {},
        insights: ['AI analysis failed, using fallback scoring']
      };
    }
  }

  /**
   * Extract decision factors using AI insights
   */
  private static extractDecisionFactors(
    request: DecisionRequest,
    context: DecisionContext,
    entities: any[]
  ): any[] {
    const factors = [];

    // Add entity-based factors
    entities.forEach(entity => {
      factors.push({
        type: 'entity',
        name: entity.word || entity.text,
        label: entity.label || entity.entity_group,
        confidence: entity.score || 0.5
      });
    });

    // Add context factors
    if (context.customer_context) {
      factors.push({
        type: 'customer',
        name: 'Customer Tier',
        value: context.customer_context.customer_tier,
        impact: context.customer_context.customer_tier === 'premium' ? 0.2 : -0.1
      });
    }

    return factors;
  }

  /**
   * Assess risk factors using AI
   */
  private static assessRiskFactors(
    request: DecisionRequest,
    context: DecisionContext,
    sentiment: any
  ): any[] {
    const risks = [];

    if (sentiment.label === 'NEGATIVE' && sentiment.score > 0.8) {
      risks.push({
        type: 'sentiment_risk',
        description: 'Highly negative sentiment detected',
        severity: 'high',
        mitigation: 'Require additional review'
      });
    }

    if (!context.customer_context) {
      risks.push({
        type: 'data_risk',
        description: 'Limited customer context available',
        severity: 'medium',
        mitigation: 'Gather additional customer information'
      });
    }

    return risks;
  }

  /**
   * Combine decision scores from different sources
   */
  private static combineDecisionScores(
    ruleResults: any,
    mlResults: any,
    context: DecisionContext
  ): number {
    // Weighted combination based on confidence levels
    const ruleWeight = ruleResults.confidence * 0.6; // Business rules get higher weight
    const mlWeight = mlResults.confidence * 0.4;
    
    const totalWeight = ruleWeight + mlWeight;
    
    if (totalWeight === 0) return 0.5; // Default neutral score
    
    return (ruleResults.score * ruleWeight + mlResults.score * mlWeight) / totalWeight;
  }

  /**
   * Make final decision based on combined score
   */
  private static makeFinalDecision(score: number, threshold: number): { value: string; reasoning: string } {
    if (score >= threshold) {
      return {
        value: 'approve',
        reasoning: `Score ${score.toFixed(3)} meets threshold ${threshold}`
      };
    } else if (score >= threshold * 0.7) {
      return {
        value: 'review',
        reasoning: `Score ${score.toFixed(3)} requires human review`
      };
    } else {
      return {
        value: 'reject',
        reasoning: `Score ${score.toFixed(3)} below threshold ${threshold}`
      };
    }
  }

  /**
   * Generate comprehensive decision explanation
   */
  private static async generateDecisionExplanation(
    decision: any,
    ruleResults: any,
    mlResults: any,
    context: DecisionContext,
    request: DecisionRequest
  ): Promise<DecisionExplanation> {
    try {
      // Generate AI explanation
      const prompt = `
        Explain this business decision in clear, professional language:
        
        Decision: ${decision.value}
        Score: ${decision.reasoning}
        
        Business Rules Applied: ${ruleResults.rules_applied.length}
        ML Models Used: ${mlResults.models_used.length}
        
        Context: ${request.decision_type} for ${request.customer_id || 'system'}
        
        Provide a clear explanation of:
        1. Why this decision was made
        2. Key factors that influenced it
        3. Confidence level and reasoning
        4. Any risks or considerations
        
        Keep it professional and actionable.
      `;

      const aiExplanation = await CloudflareAIService.generateText(prompt);

      return {
        summary: `Decision: ${decision.value} - ${decision.reasoning}`,
        detailed_explanation: aiExplanation,
        key_factors: [
          ...ruleResults.rules_applied.map((r: any) => ({
            type: 'business_rule',
            name: r.rule_name,
            impact: r.score,
            explanation: r.explanation
          })),
          ...mlResults.models_used.map((m: any) => ({
            type: 'ml_prediction',
            name: m.model_name,
            impact: m.prediction,
            explanation: `ML model confidence: ${m.confidence.toFixed(2)}`
          }))
        ],
        confidence_breakdown: {
          business_rules: ruleResults.confidence,
          ml_models: mlResults.confidence,
          overall: this.calculateDecisionConfidence(ruleResults, mlResults, context)
        },
        alternative_scenarios: this.generateAlternativeScenarios(decision, context)
      };
    } catch (error) {
      console.error('Error generating decision explanation:', error);
      return {
        summary: `Decision: ${decision.value}`,
        detailed_explanation: 'Decision made based on available rules and models',
        key_factors: [],
        confidence_breakdown: { overall: 0.5 },
        alternative_scenarios: []
      };
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static async getHistoricalDecisions(
    decisionType: string,
    subscriptionId: string,
    limit: number
  ): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('decision_results')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .ilike('request_id', `%${decisionType}%`)
        .order('timestamp', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (error) {
      return [];
    }
  }

  private static async getCurrentBusinessMetrics(subscriptionId: string): Promise<any> {
    try {
      // Get real business metrics from Supabase
      const [healthMetrics, customerMetrics, packageMetrics] = await Promise.all([
        supabase
          .from('subscription_health_metrics')
          .select('*')
          .eq('subscription_id', subscriptionId)
          .order('period_start', { ascending: false })
          .limit(1)
          .single(),

        supabase
          .from('customers')
          .select('customer_tier, created_at, last_activity_at')
          .eq('subscription_id', subscriptionId),

        supabase
          .from('packages')
          .select('status, created_at, delivered_at')
          .eq('subscription_id', subscriptionId)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Calculate metrics from real data
      const metrics: any = {
        customer_satisfaction: 0.75, // Default
        operational_efficiency: 0.70, // Default
        revenue_growth: 0.05, // Default
        cost_per_transaction: 2.50 // Default
      };

      // Calculate from health metrics if available
      if (healthMetrics.data) {
        const health = healthMetrics.data;
        metrics.revenue_growth = health.monthly_recurring_revenue ?
          Math.min(health.monthly_recurring_revenue / 10000, 0.5) : 0.05;
        metrics.customer_satisfaction = health.average_engagement_score || 0.75;
      }

      // Calculate operational efficiency from package data
      if (packageMetrics.data && packageMetrics.data.length > 0) {
        const packages = packageMetrics.data;
        const deliveredPackages = packages.filter(p => p.status === 'delivered' && p.delivered_at);

        if (deliveredPackages.length > 0) {
          const avgDeliveryTime = deliveredPackages.reduce((sum, pkg) => {
            const deliveryTime = new Date(pkg.delivered_at).getTime() - new Date(pkg.created_at).getTime();
            return sum + (deliveryTime / (1000 * 60 * 60 * 24)); // Convert to days
          }, 0) / deliveredPackages.length;

          // Efficiency based on delivery time (lower is better)
          metrics.operational_efficiency = Math.max(0.3, Math.min(0.95, 1 - (avgDeliveryTime / 14))); // 14 days as baseline
        }

        // Calculate cost per transaction based on package volume
        metrics.cost_per_transaction = Math.max(1.50, 5.00 - (packages.length / 100));
      }

      // Calculate customer satisfaction from customer activity
      if (customerMetrics.data && customerMetrics.data.length > 0) {
        const customers = customerMetrics.data;
        const activeCustomers = customers.filter(c => {
          if (!c.last_activity_at) return false;
          const daysSinceActivity = (Date.now() - new Date(c.last_activity_at).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceActivity <= 30;
        });

        const activityRate = activeCustomers.length / customers.length;
        metrics.customer_satisfaction = Math.max(0.3, Math.min(0.95, activityRate * 1.2));
      }

      return metrics;
    } catch (error) {
      console.error('Error getting business metrics:', error);
      // Return fallback metrics
      return {
        customer_satisfaction: 0.75,
        operational_efficiency: 0.70,
        revenue_growth: 0.05,
        cost_per_transaction: 2.50
      };
    }
  }

  private static async getCustomerContext(customerId: string, subscriptionId: string): Promise<any> {
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .eq('subscription_id', subscriptionId)
        .single();

      return customer;
    } catch (error) {
      return null;
    }
  }

  private static async getExternalFactors(decisionType: string): Promise<any> {
    // Mock external factors - would integrate with external APIs
    return {
      market_conditions: 'stable',
      seasonal_factor: 1.0,
      competitive_pressure: 'medium'
    };
  }

  private static async getSystemState(subscriptionId: string): Promise<any> {
    // Mock system state - would get from monitoring systems
    return {
      system_load: 0.65,
      error_rate: 0.02,
      response_time: 150
    };
  }

  private static async evaluateBusinessRule(rule: any, context: DecisionContext): Promise<any> {
    // Evaluate business rule conditions
    try {
      const conditions = rule.conditions || [];
      let score = 0.5;
      let applies = true;
      let explanation = '';

      for (const condition of conditions) {
        const conditionResult = this.evaluateCondition(condition, context);
        if (!conditionResult.met) {
          applies = false;
          break;
        }
        score = Math.max(score, conditionResult.score);
      }

      if (applies) {
        explanation = `Rule "${rule.name}" applied with score ${score.toFixed(2)}`;
      }

      return { applies, score, explanation };
    } catch (error) {
      return { applies: false, score: 0.5, explanation: 'Rule evaluation failed' };
    }
  }

  private static evaluateCondition(condition: any, context: DecisionContext): any {
    // Simple condition evaluation - would be more sophisticated in production
    return { met: true, score: 0.7 };
  }

  private static async runMLModel(model: any, context: DecisionContext): Promise<any> {
    // Mock ML model execution - would use actual ML inference
    return {
      value: Math.random() * 0.4 + 0.3, // Random score between 0.3-0.7
      confidence: Math.random() * 0.3 + 0.7, // Random confidence 0.7-1.0
      feature_importance: {
        customer_history: 0.3,
        business_metrics: 0.4,
        external_factors: 0.3
      }
    };
  }

  private static calculateDecisionConfidence(ruleResults: any, mlResults: any, context: DecisionContext): number {
    const ruleConfidence = ruleResults.confidence * 0.6;
    const mlConfidence = mlResults.confidence * 0.4;
    
    return Math.min(ruleConfidence + mlConfidence, 1.0);
  }

  private static assessDecisionRisk(decision: any, context: DecisionContext, confidence: number): any {
    let riskLevel = 'low';
    const riskFactors: string[] = [];

    if (confidence < 0.6) {
      riskLevel = 'high';
      riskFactors.push('Low confidence in decision');
    } else if (confidence < 0.8) {
      riskLevel = 'medium';
      riskFactors.push('Moderate confidence in decision');
    }

    if (decision.value === 'approve' && confidence < 0.9) {
      riskFactors.push('Approval with moderate confidence');
    }

    return {
      level: riskLevel,
      factors: riskFactors,
      mitigation_strategies: this.generateMitigationStrategies(riskLevel, riskFactors)
    };
  }

  private static generateMitigationStrategies(riskLevel: string, factors: string[]): string[] {
    const strategies: string[] = [];

    if (riskLevel === 'high') {
      strategies.push('Require human review before execution');
      strategies.push('Implement additional monitoring');
    }

    if (factors.includes('Low confidence in decision')) {
      strategies.push('Gather additional data before deciding');
      strategies.push('Consider alternative decision approaches');
    }

    return strategies;
  }

  private static extractDecisionFactors(ruleResults: any, mlResults: any, context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];

    // Add rule factors
    ruleResults.rules_applied.forEach((rule: any) => {
      factors.push({
        name: rule.rule_name,
        type: 'business_rule',
        weight: rule.weight,
        impact: rule.score,
        description: rule.explanation
      });
    });

    // Add ML factors
    mlResults.models_used.forEach((model: any) => {
      factors.push({
        name: model.model_name,
        type: 'ml_prediction',
        weight: model.confidence,
        impact: model.prediction,
        description: `ML model prediction with ${(model.confidence * 100).toFixed(1)}% confidence`
      });
    });

    return factors;
  }

  private static generateAlternativeOptions(score: number, context: DecisionContext): any[] {
    return [
      {
        option: 'Lower threshold',
        impact: 'More approvals, higher risk',
        score_change: score + 0.1
      },
      {
        option: 'Higher threshold',
        impact: 'Fewer approvals, lower risk',
        score_change: score - 0.1
      },
      {
        option: 'Manual review',
        impact: 'Human oversight, slower process',
        score_change: score
      }
    ];
  }

  private static generateRecommendedActions(decision: any, context: DecisionContext): string[] {
    const actions: string[] = [];

    if (decision.value === 'approve') {
      actions.push('Execute approved action');
      actions.push('Monitor outcome for learning');
    } else if (decision.value === 'review') {
      actions.push('Schedule human review');
      actions.push('Gather additional information');
    } else {
      actions.push('Document rejection reason');
      actions.push('Provide feedback to requester');
    }

    return actions;
  }

  private static generateAlternativeScenarios(decision: any, context: DecisionContext): any[] {
    return [
      {
        scenario: 'If threshold was 10% lower',
        outcome: decision.value === 'reject' ? 'review' : decision.value,
        probability: 0.3
      },
      {
        scenario: 'If additional data was available',
        outcome: 'Higher confidence in current decision',
        probability: 0.6
      }
    ];
  }

  private static async storeDecisionResult(result: DecisionResult): Promise<void> {
    try {
      await supabase
        .from('decision_results')
        .insert({
          decision_id: result.decision_id,
          request_id: result.request_id,
          subscription_id: result.subscription_id,
          decision: result.decision,
          confidence_score: result.confidence_score,
          decision_score: result.decision_score,
          processing_time_ms: result.processing_time_ms,
          timestamp: result.timestamp
        });
    } catch (error) {
      console.error('Error storing decision result:', error);
    }
  }

  private static async executeDecisionActions(result: DecisionResult): Promise<void> {
    // Execute automated actions based on decision
    for (const action of result.recommended_actions) {
      try {
        console.log(`Executing decision action: ${action}`);
        // Would integrate with actual business systems
      } catch (error) {
        console.error(`Error executing action: ${action}`, error);
      }
    }
  }
}
