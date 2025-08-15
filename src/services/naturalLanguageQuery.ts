/**
 * Natural Language Query Processing Service
 * Story 2.1: AI-Powered Automation & Intelligence
 * 
 * Advanced natural language processing for business queries, SQL generation,
 * intelligent search, and conversational analytics interface
 */

import { supabase } from '@/integrations/supabase/client';
import { HuggingFaceService, CloudflareAIService, PydanticAIService } from './aiIntegrations';
import { AnalyticsService } from './analytics';
import type { 
  NLQueryRequest,
  NLQueryResult,
  QueryIntent,
  SQLGenerationResult,
  ConversationalContext,
  QuerySuggestion,
  NLSearchResult
} from '@/types/ai';

// =====================================================
// NATURAL LANGUAGE QUERY SERVICE
// =====================================================

export class NaturalLanguageQueryService {

  /**
   * Process natural language query and return structured results
   */
  static async processQuery(
    query: string,
    subscriptionId: string,
    context?: ConversationalContext
  ): Promise<NLQueryResult> {
    try {
      const startTime = Date.now();

      // Step 1: Analyze query intent and extract entities
      const [intent, entities, sentiment] = await Promise.all([
        this.analyzeQueryIntent(query),
        HuggingFaceService.extractEntities(query),
        HuggingFaceService.analyzeSentiment(query)
      ]);

      // Step 2: Generate SQL query if needed
      let sqlResult: SQLGenerationResult | null = null;
      if (intent.requires_data_query) {
        sqlResult = await this.generateSQL(query, intent, entities, subscriptionId);
      }

      // Step 3: Execute query and get results
      let data: any[] = [];
      let visualization: any = null;
      
      if (sqlResult?.sql && sqlResult.is_safe) {
        const queryResult = await this.executeGeneratedQuery(sqlResult.sql, subscriptionId);
        data = queryResult.data || [];
        
        // Generate appropriate visualization
        if (data.length > 0) {
          visualization = await this.suggestVisualization(data, intent);
        }
      }

      // Step 4: Generate natural language response
      const response = await this.generateNaturalResponse(
        query,
        intent,
        data,
        sqlResult,
        context
      );

      // Step 5: Generate follow-up suggestions
      const suggestions = await this.generateSuggestions(intent, data, context);

      const result: NLQueryResult = {
        query_id: `nlq_${Date.now()}`,
        original_query: query,
        intent,
        entities,
        sentiment,
        sql_generated: sqlResult,
        data_results: data,
        visualization_config: visualization,
        natural_response: response,
        suggestions,
        confidence_score: this.calculateConfidence(intent, sqlResult, data),
        processing_time_ms: Date.now() - startTime,
        context_used: context || null
      };

      // Store query for learning and improvement
      await this.storeQueryResult(result, subscriptionId);

      return result;
    } catch (error) {
      console.error('Error processing natural language query:', error);
      throw error;
    }
  }

  /**
   * Analyze query intent using real HuggingFace AI
   */
  private static async analyzeQueryIntent(query: string): Promise<QueryIntent> {
    try {
      // Use real HuggingFace services for intent analysis
      const [entities, sentiment] = await Promise.all([
        HuggingFaceService.extractEntities(query),
        HuggingFaceService.analyzeSentiment(query)
      ]);

      // Analyze intent using AI-extracted entities and patterns
      const intentAnalysis = await this.analyzeIntentWithAI(query, entities, sentiment);

      // Enhanced intent analysis with business context
      const businessContext = this.getBusinessContext(query);
      const dataEntities = this.extractDataEntitiesFromAI(entities, query);

      return {
        intent_type: intentAnalysis.intent_type,
        confidence: intentAnalysis.confidence,
        data_entities: dataEntities,
        time_range: this.parseTimeRange(query),
        aggregation_type: this.detectAggregation(query),
        filters: this.extractFilters(query),
        requires_data_query: intentAnalysis.requires_data_query,
        business_context: businessContext,
        complexity_score: this.calculateComplexityWithAI(query, entities)
      };
    } catch (error) {
      console.error('Error analyzing query intent with AI:', error);
      // Fallback to rule-based analysis
      return this.fallbackIntentAnalysis(query);
    }
  }

  /**
   * Analyze intent using AI entities and sentiment
   */
  private static async analyzeIntentWithAI(query: string, entities: any[], sentiment: any): Promise<any> {
    const lowerQuery = query.toLowerCase();

    // Determine intent type based on query patterns and entities
    let intentType: 'analytics' | 'search' | 'action' | 'question' = 'question';
    let confidence = 0.6;
    let requiresDataQuery = false;

    // Analytics intent indicators
    const analyticsKeywords = ['how many', 'total', 'average', 'sum', 'count', 'show me', 'analyze', 'trend', 'compare'];
    const hasAnalyticsKeywords = analyticsKeywords.some(keyword => lowerQuery.includes(keyword));

    // Search intent indicators
    const searchKeywords = ['find', 'search', 'look for', 'where is', 'who is', 'which'];
    const hasSearchKeywords = searchKeywords.some(keyword => lowerQuery.includes(keyword));

    // Action intent indicators
    const actionKeywords = ['create', 'update', 'delete', 'send', 'notify', 'schedule'];
    const hasActionKeywords = actionKeywords.some(keyword => lowerQuery.includes(keyword));

    // Determine intent based on patterns
    if (hasAnalyticsKeywords || entities.some(e => e.label === 'CARDINAL' || e.label === 'MONEY')) {
      intentType = 'analytics';
      confidence = 0.8;
      requiresDataQuery = true;
    } else if (hasSearchKeywords) {
      intentType = 'search';
      confidence = 0.75;
      requiresDataQuery = true;
    } else if (hasActionKeywords) {
      intentType = 'action';
      confidence = 0.7;
      requiresDataQuery = false;
    }

    // Boost confidence if entities support the intent
    if (entities.length > 0) {
      confidence = Math.min(confidence + 0.1, 0.95);
    }

    return {
      intent_type: intentType,
      confidence,
      requires_data_query: requiresDataQuery
    };
  }

  /**
   * Extract data entities from AI analysis
   */
  private static extractDataEntitiesFromAI(entities: any[], query: string): string[] {
    const dataEntities: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Map AI entities to business data entities
    entities.forEach(entity => {
      const entityText = entity.word || entity.text || '';
      const entityType = entity.label || entity.entity_group || '';

      // Map to business entities
      if (entityType === 'ORG' || lowerQuery.includes('customer')) {
        dataEntities.push('customers');
      }
      if (lowerQuery.includes('package') || lowerQuery.includes('delivery') || lowerQuery.includes('shipment')) {
        dataEntities.push('packages');
      }
      if (entityType === 'MONEY' || lowerQuery.includes('revenue') || lowerQuery.includes('billing')) {
        dataEntities.push('revenue');
      }
      if (lowerQuery.includes('communication') || lowerQuery.includes('email') || lowerQuery.includes('sms')) {
        dataEntities.push('communications');
      }
    });

    // Add entities based on query keywords
    if (lowerQuery.includes('carrier')) dataEntities.push('carriers');
    if (lowerQuery.includes('address')) dataEntities.push('addresses');
    if (lowerQuery.includes('tracking')) dataEntities.push('tracking');

    return [...new Set(dataEntities)]; // Remove duplicates
  }

  /**
   * Calculate complexity using AI insights
   */
  private static calculateComplexityWithAI(query: string, entities: any[]): number {
    let complexity = 0.3; // Base complexity

    const lowerQuery = query.toLowerCase();

    // Increase complexity based on AI-detected entities
    complexity += entities.length * 0.05;

    // Increase complexity based on query features
    if (lowerQuery.includes('join') || lowerQuery.includes('combine')) complexity += 0.3;
    if (lowerQuery.includes('group by') || lowerQuery.includes('grouped')) complexity += 0.2;
    if (lowerQuery.includes('order by') || lowerQuery.includes('sorted')) complexity += 0.1;
    if (lowerQuery.includes('compare') || lowerQuery.includes('vs')) complexity += 0.2;

    // Multiple time ranges increase complexity
    const timeWords = ['today', 'yesterday', 'week', 'month', 'year'];
    const timeWordCount = timeWords.filter(word => lowerQuery.includes(word)).length;
    if (timeWordCount > 1) complexity += 0.2;

    return Math.min(complexity, 1.0);
  }

  /**
   * Fallback intent analysis when AI fails
   */
  private static fallbackIntentAnalysis(query: string): QueryIntent {
    const businessContext = this.getBusinessContext(query);
    const lowerQuery = query.toLowerCase();

    let intentType: 'analytics' | 'search' | 'action' | 'question' = 'question';

    if (lowerQuery.includes('how many') || lowerQuery.includes('total') || lowerQuery.includes('show me')) {
      intentType = 'analytics';
    } else if (lowerQuery.includes('find') || lowerQuery.includes('search')) {
      intentType = 'search';
    }

    return {
      intent_type: intentType,
      confidence: 0.5,
      data_entities: [],
      time_range: this.parseTimeRange(query),
      aggregation_type: this.detectAggregation(query),
      filters: this.extractFilters(query),
      requires_data_query: intentType === 'analytics' || intentType === 'search',
      business_context: businessContext,
      complexity_score: 0.5
    };
  }

  /**
   * Generate SQL query from natural language using real business logic
   */
  private static async generateSQL(
    query: string,
    intent: QueryIntent,
    entities: any[],
    subscriptionId: string
  ): Promise<SQLGenerationResult> {
    try {
      // Get real database schema information
      const schema = await this.getRealDatabaseSchema(subscriptionId);

      // Generate SQL using business logic and AI insights
      const sqlGeneration = await this.generateBusinessSQL(query, intent, entities, schema, subscriptionId);

      // Validate and sanitize the generated SQL
      const validation = await this.validateSQL(sqlGeneration.sql, schema);

      return {
        sql: validation.sanitized_sql,
        is_safe: validation.is_safe,
        confidence: sqlGeneration.confidence,
        explanation: sqlGeneration.explanation,
        tables_accessed: validation.tables_accessed,
        estimated_rows: validation.estimated_rows,
        security_warnings: validation.security_warnings
      };
    } catch (error) {
      console.error('Error generating SQL:', error);
      return {
        sql: '',
        is_safe: false,
        confidence: 0,
        explanation: 'Failed to generate SQL query',
        tables_accessed: [],
        estimated_rows: 0,
        security_warnings: ['SQL generation failed']
      };
    }
  }

  /**
   * Generate SQL using business logic and AI insights
   */
  private static async generateBusinessSQL(
    query: string,
    intent: QueryIntent,
    entities: any[],
    schema: any,
    subscriptionId: string
  ): Promise<{ sql: string; confidence: number; explanation: string }> {
    const lowerQuery = query.toLowerCase();
    let sql = '';
    let confidence = 0.7;
    let explanation = '';

    // Handle different types of business queries
    if (intent.intent_type === 'analytics') {
      if (lowerQuery.includes('how many') && lowerQuery.includes('customer')) {
        sql = `SELECT COUNT(*) as customer_count FROM customers WHERE subscription_id = '${subscriptionId}'`;
        explanation = 'Counting total customers for the subscription';
        confidence = 0.9;

        // Add time filter if specified
        if (intent.time_range) {
          const timeFilter = this.getTimeFilter(intent.time_range);
          sql += ` AND created_at >= '${timeFilter}'`;
        }
      }
      else if (lowerQuery.includes('how many') && lowerQuery.includes('package')) {
        sql = `SELECT COUNT(*) as package_count FROM packages WHERE subscription_id = '${subscriptionId}'`;
        explanation = 'Counting total packages for the subscription';
        confidence = 0.9;

        if (intent.time_range) {
          const timeFilter = this.getTimeFilter(intent.time_range);
          sql += ` AND created_at >= '${timeFilter}'`;
        }
      }
      else if (lowerQuery.includes('revenue') || lowerQuery.includes('total') && entities.some(e => e.label === 'MONEY')) {
        sql = `SELECT SUM(amount) as total_revenue FROM billing WHERE subscription_id = '${subscriptionId}' AND status = 'paid'`;
        explanation = 'Calculating total revenue from paid billing records';
        confidence = 0.85;

        if (intent.time_range) {
          const timeFilter = this.getTimeFilter(intent.time_range);
          sql += ` AND created_at >= '${timeFilter}'`;
        }
      }
      else if (lowerQuery.includes('average') && lowerQuery.includes('delivery')) {
        sql = `SELECT AVG(EXTRACT(DAY FROM delivered_at - created_at)) as avg_delivery_days
               FROM packages
               WHERE subscription_id = '${subscriptionId}'
               AND status = 'delivered'
               AND delivered_at IS NOT NULL`;
        explanation = 'Calculating average delivery time in days';
        confidence = 0.8;
      }
      else if (lowerQuery.includes('top') || lowerQuery.includes('best')) {
        if (lowerQuery.includes('customer')) {
          sql = `SELECT c.first_name, c.last_name, COUNT(p.id) as package_count
                 FROM customers c
                 LEFT JOIN packages p ON c.id = p.customer_id
                 WHERE c.subscription_id = '${subscriptionId}'
                 GROUP BY c.id, c.first_name, c.last_name
                 ORDER BY package_count DESC
                 LIMIT 10`;
          explanation = 'Finding top customers by package count';
          confidence = 0.85;
        } else if (lowerQuery.includes('carrier')) {
          sql = `SELECT carrier, COUNT(*) as package_count,
                        AVG(EXTRACT(DAY FROM delivered_at - created_at)) as avg_delivery_days
                 FROM packages
                 WHERE subscription_id = '${subscriptionId}'
                 AND status = 'delivered'
                 GROUP BY carrier
                 ORDER BY package_count DESC`;
          explanation = 'Analyzing carrier performance by package count and delivery time';
          confidence = 0.8;
        }
      }
    }
    else if (intent.intent_type === 'search') {
      if (lowerQuery.includes('find') && lowerQuery.includes('customer')) {
        // Extract customer name from entities
        const personEntities = entities.filter(e => e.label === 'PERSON' || e.entity_group === 'PER');
        if (personEntities.length > 0) {
          const customerName = personEntities[0].word || personEntities[0].text;
          sql = `SELECT * FROM customers
                 WHERE subscription_id = '${subscriptionId}'
                 AND (first_name ILIKE '%${customerName}%' OR last_name ILIKE '%${customerName}%')`;
          explanation = `Searching for customers with name containing '${customerName}'`;
          confidence = 0.8;
        }
      }
      else if (lowerQuery.includes('tracking')) {
        // Extract tracking number if present
        const trackingPattern = /[A-Z0-9]{10,}/;
        const trackingMatch = query.match(trackingPattern);
        if (trackingMatch) {
          const trackingNumber = trackingMatch[0];
          sql = `SELECT * FROM packages
                 WHERE subscription_id = '${subscriptionId}'
                 AND tracking_number = '${trackingNumber}'`;
          explanation = `Finding package with tracking number ${trackingNumber}`;
          confidence = 0.9;
        }
      }
    }

    // Fallback to generic query if no specific pattern matched
    if (!sql) {
      if (intent.data_entities.includes('customers')) {
        sql = `SELECT * FROM customers WHERE subscription_id = '${subscriptionId}' LIMIT 10`;
        explanation = 'Generic customer query';
        confidence = 0.6;
      } else if (intent.data_entities.includes('packages')) {
        sql = `SELECT * FROM packages WHERE subscription_id = '${subscriptionId}' ORDER BY created_at DESC LIMIT 10`;
        explanation = 'Generic package query';
        confidence = 0.6;
      } else {
        sql = `SELECT 'No specific query pattern matched' as message`;
        explanation = 'Could not generate specific SQL for this query';
        confidence = 0.3;
      }
    }

    return { sql, confidence, explanation };
  }

  /**
   * Get time filter for SQL queries
   */
  private static getTimeFilter(timeRange: string): string {
    const now = new Date();

    switch (timeRange) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
      case 'this_week':
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return weekStart.toISOString();
      case 'last_week':
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
        return lastWeekStart.toISOString();
      case 'this_month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      case 'last_month':
        return new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      case 'this_year':
        return new Date(now.getFullYear(), 0, 1).toISOString();
      case 'last_year':
        return new Date(now.getFullYear() - 1, 0, 1).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago
    }
  }

  /**
   * Execute generated SQL query safely
   */
  private static async executeGeneratedQuery(
    sql: string,
    subscriptionId: string
  ): Promise<{ data: any[]; metadata: any }> {
    try {
      // Add subscription filter to ensure data isolation
      const secureSQL = this.addSubscriptionFilter(sql, subscriptionId);
      
      // Execute query with timeout and row limits
      const { data, error } = await supabase
        .rpc('execute_safe_query', {
          query_sql: secureSQL,
          max_rows: 1000,
          timeout_seconds: 30
        });

      if (error) throw error;

      return {
        data: data || [],
        metadata: {
          row_count: data?.length || 0,
          execution_time_ms: 0 // Would be provided by the RPC function
        }
      };
    } catch (error) {
      console.error('Error executing generated query:', error);
      return { data: [], metadata: { row_count: 0, execution_time_ms: 0 } };
    }
  }

  /**
   * Generate natural language response
   */
  private static async generateNaturalResponse(
    originalQuery: string,
    intent: QueryIntent,
    data: any[],
    sqlResult: SQLGenerationResult | null,
    context?: ConversationalContext
  ): Promise<string> {
    try {
      const prompt = `
        User asked: "${originalQuery}"
        
        Query intent: ${intent.intent_type}
        Data found: ${data.length} records
        
        ${data.length > 0 ? `Sample data: ${JSON.stringify(data.slice(0, 3))}` : 'No data found'}
        
        ${context ? `Previous context: ${JSON.stringify(context)}` : ''}
        
        Generate a helpful, conversational response that:
        1. Directly answers the user's question
        2. Highlights key insights from the data
        3. Suggests follow-up actions if appropriate
        4. Uses business-friendly language
        
        Keep the response concise but informative.
      `;

      return await CloudflareAIService.generateText(prompt);
    } catch (error) {
      console.error('Error generating natural response:', error);
      return 'I found some information related to your query, but had trouble generating a detailed response. Please try rephrasing your question.';
    }
  }

  /**
   * Suggest appropriate visualization for data
   */
  private static async suggestVisualization(data: any[], intent: QueryIntent): Promise<any> {
    if (data.length === 0) return null;

    const dataTypes = this.analyzeDataTypes(data);
    const hasTimeData = dataTypes.includes('date') || dataTypes.includes('timestamp');
    const hasNumericData = dataTypes.includes('number');
    
    // Suggest visualization based on data characteristics
    if (hasTimeData && hasNumericData) {
      return {
        type: 'line',
        config: {
          xAxis: this.findTimeColumn(data[0]),
          yAxis: this.findNumericColumns(data[0])[0],
          title: `${intent.data_entities.join(' & ')} Over Time`
        }
      };
    } else if (hasNumericData && data.length <= 20) {
      return {
        type: 'bar',
        config: {
          xAxis: Object.keys(data[0])[0],
          yAxis: this.findNumericColumns(data[0])[0],
          title: `${intent.data_entities.join(' & ')} Distribution`
        }
      };
    } else if (data.length <= 100) {
      return {
        type: 'table',
        config: {
          columns: Object.keys(data[0]),
          title: `${intent.data_entities.join(' & ')} Results`
        }
      };
    }

    return null;
  }

  /**
   * Generate follow-up query suggestions
   */
  private static async generateSuggestions(
    intent: QueryIntent,
    data: any[],
    context?: ConversationalContext
  ): Promise<QuerySuggestion[]> {
    const suggestions: QuerySuggestion[] = [];

    // Add context-aware suggestions based on intent and data
    if (intent.intent_type === 'analytics' && data.length > 0) {
      suggestions.push(
        {
          text: 'Show me trends over the last 6 months',
          type: 'trend_analysis',
          confidence: 0.8
        },
        {
          text: 'Compare this with last year',
          type: 'comparison',
          confidence: 0.7
        },
        {
          text: 'Break this down by customer segment',
          type: 'segmentation',
          confidence: 0.75
        }
      );
    }

    if (intent.business_context === 'packages') {
      suggestions.push(
        {
          text: 'Which carriers are performing best?',
          type: 'performance_analysis',
          confidence: 0.8
        },
        {
          text: 'Show me delivery time trends',
          type: 'operational_metrics',
          confidence: 0.85
        }
      );
    }

    if (intent.business_context === 'customers') {
      suggestions.push(
        {
          text: 'Who are my most valuable customers?',
          type: 'customer_analysis',
          confidence: 0.9
        },
        {
          text: 'Show me customer satisfaction trends',
          type: 'satisfaction_analysis',
          confidence: 0.8
        }
      );
    }

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static getBusinessContext(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('package') || lowerQuery.includes('delivery') || lowerQuery.includes('shipment')) {
      return 'packages';
    } else if (lowerQuery.includes('customer') || lowerQuery.includes('client')) {
      return 'customers';
    } else if (lowerQuery.includes('revenue') || lowerQuery.includes('billing') || lowerQuery.includes('payment')) {
      return 'revenue';
    } else if (lowerQuery.includes('performance') || lowerQuery.includes('metric')) {
      return 'performance';
    }
    
    return 'general';
  }

  private static parseTimeRange(query: string): string | undefined {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('today')) return 'today';
    if (lowerQuery.includes('yesterday')) return 'yesterday';
    if (lowerQuery.includes('this week')) return 'this_week';
    if (lowerQuery.includes('last week')) return 'last_week';
    if (lowerQuery.includes('this month')) return 'this_month';
    if (lowerQuery.includes('last month')) return 'last_month';
    if (lowerQuery.includes('this year')) return 'this_year';
    if (lowerQuery.includes('last year')) return 'last_year';
    
    return undefined;
  }

  private static detectAggregation(query: string): string | undefined {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('total') || lowerQuery.includes('sum')) return 'sum';
    if (lowerQuery.includes('average') || lowerQuery.includes('avg')) return 'avg';
    if (lowerQuery.includes('count') || lowerQuery.includes('number of')) return 'count';
    if (lowerQuery.includes('maximum') || lowerQuery.includes('max')) return 'max';
    if (lowerQuery.includes('minimum') || lowerQuery.includes('min')) return 'min';
    
    return undefined;
  }

  private static extractFilters(query: string): string[] {
    const filters: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Extract common filter patterns
    const filterPatterns = [
      /where\s+(\w+)\s*=\s*['"]?([^'"]+)['"]?/gi,
      /(\w+)\s+is\s+['"]?([^'"]+)['"]?/gi,
      /(\w+)\s+equals?\s+['"]?([^'"]+)['"]?/gi
    ];
    
    filterPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(lowerQuery)) !== null) {
        filters.push(`${match[1]} = ${match[2]}`);
      }
    });
    
    return filters;
  }

  private static calculateComplexity(query: string): number {
    let complexity = 0.3; // Base complexity
    
    const lowerQuery = query.toLowerCase();
    
    // Increase complexity based on query features
    if (lowerQuery.includes('join') || lowerQuery.includes('combine')) complexity += 0.3;
    if (lowerQuery.includes('group by') || lowerQuery.includes('grouped')) complexity += 0.2;
    if (lowerQuery.includes('order by') || lowerQuery.includes('sorted')) complexity += 0.1;
    if (lowerQuery.includes('having')) complexity += 0.2;
    if (lowerQuery.includes('subquery') || lowerQuery.includes('nested')) complexity += 0.4;
    
    return Math.min(complexity, 1.0);
  }

  private static async getRealDatabaseSchema(subscriptionId: string): Promise<any> {
    try {
      // Get real schema information from Supabase
      const { data: tables, error } = await supabase
        .rpc('get_table_schema', { schema_name: 'public' });

      if (error) {
        console.error('Error fetching schema:', error);
        return this.getFallbackSchema();
      }

      return {
        tables: tables || this.getFallbackSchema().tables,
        subscription_id: subscriptionId
      };
    } catch (error) {
      console.error('Error getting database schema:', error);
      return this.getFallbackSchema();
    }
  }

  private static getFallbackSchema(): any {
    return {
      tables: {
        customers: ['id', 'first_name', 'last_name', 'email', 'created_at', 'subscription_id', 'customer_tier', 'last_activity_at'],
        packages: ['id', 'tracking_number', 'status', 'carrier', 'weight', 'created_at', 'customer_id', 'subscription_id', 'delivered_at'],
        billing: ['id', 'amount', 'status', 'created_at', 'customer_id', 'subscription_id', 'due_date'],
        communications: ['id', 'type', 'channel', 'sent_at', 'customer_id', 'subscription_id', 'status'],
        communication_workflows: ['id', 'name', 'trigger_type', 'is_active', 'subscription_id'],
        analytics_dashboards: ['id', 'name', 'layout', 'subscription_id', 'created_at'],
        subscription_health_metrics: ['id', 'subscription_id', 'monthly_recurring_revenue', 'period_start', 'period_end']
      }
    };
  }

  private static createSQLPrompt(query: string, intent: QueryIntent, entities: any[], schema: any): string {
    return `
      Generate a safe PostgreSQL query for this natural language request:
      "${query}"
      
      Available tables and columns:
      ${JSON.stringify(schema.tables, null, 2)}
      
      Query intent: ${intent.intent_type}
      Entities found: ${entities.map(e => e.word).join(', ')}
      Time range: ${intent.time_range || 'not specified'}
      
      Requirements:
      1. Only use SELECT statements
      2. Include subscription_id filter for data isolation
      3. Limit results to 1000 rows
      4. Use proper JOIN syntax if multiple tables needed
      5. Return only the SQL query, no explanations
      
      SQL Query:
    `;
  }

  private static async validateSQL(sql: string, schema: any): Promise<any> {
    // Basic SQL validation and sanitization
    const sanitized = sql.trim().replace(/;+$/, ''); // Remove trailing semicolons
    
    // Check for dangerous operations
    const dangerousPatterns = [
      /\b(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE)\b/i,
      /\b(EXEC|EXECUTE|xp_|sp_)\b/i,
      /--|\*\/|\/\*/g
    ];
    
    const hasDangerousOperations = dangerousPatterns.some(pattern => pattern.test(sanitized));
    
    return {
      sanitized_sql: sanitized,
      is_safe: !hasDangerousOperations && sanitized.toLowerCase().startsWith('select'),
      confidence: hasDangerousOperations ? 0 : 0.8,
      explanation: hasDangerousOperations ? 'Query contains potentially dangerous operations' : 'Query appears safe',
      tables_accessed: this.extractTablesFromSQL(sanitized),
      estimated_rows: 100, // Mock estimation
      security_warnings: hasDangerousOperations ? ['Contains dangerous SQL operations'] : []
    };
  }

  private static extractTablesFromSQL(sql: string): string[] {
    const tablePattern = /FROM\s+(\w+)|JOIN\s+(\w+)/gi;
    const tables: string[] = [];
    let match;
    
    while ((match = tablePattern.exec(sql)) !== null) {
      const table = match[1] || match[2];
      if (table && !tables.includes(table)) {
        tables.push(table);
      }
    }
    
    return tables;
  }

  private static addSubscriptionFilter(sql: string, subscriptionId: string): string {
    // Add subscription filter to ensure data isolation
    if (sql.toLowerCase().includes('where')) {
      return sql.replace(/WHERE/i, `WHERE subscription_id = '${subscriptionId}' AND`);
    } else {
      return sql.replace(/FROM\s+(\w+)/i, `FROM $1 WHERE subscription_id = '${subscriptionId}'`);
    }
  }

  private static analyzeDataTypes(data: any[]): string[] {
    if (data.length === 0) return [];
    
    const sample = data[0];
    const types: string[] = [];
    
    Object.values(sample).forEach(value => {
      if (typeof value === 'number') types.push('number');
      else if (typeof value === 'string' && !isNaN(Date.parse(value))) types.push('date');
      else if (typeof value === 'string') types.push('string');
      else if (typeof value === 'boolean') types.push('boolean');
    });
    
    return [...new Set(types)];
  }

  private static findTimeColumn(row: any): string | undefined {
    return Object.keys(row).find(key => 
      key.includes('date') || key.includes('time') || key.includes('created') || key.includes('updated')
    );
  }

  private static findNumericColumns(row: any): string[] {
    return Object.keys(row).filter(key => typeof row[key] === 'number');
  }

  private static calculateConfidence(intent: QueryIntent, sqlResult: SQLGenerationResult | null, data: any[]): number {
    let confidence = intent.confidence;
    
    if (sqlResult) {
      confidence = (confidence + sqlResult.confidence) / 2;
    }
    
    if (data.length > 0) {
      confidence = Math.min(confidence + 0.1, 1.0);
    }
    
    return confidence;
  }

  private static async storeQueryResult(result: NLQueryResult, subscriptionId: string): Promise<void> {
    try {
      await supabase
        .from('nl_query_logs')
        .insert({
          subscription_id: subscriptionId,
          query_id: result.query_id,
          original_query: result.original_query,
          intent_type: result.intent.intent_type,
          confidence_score: result.confidence_score,
          processing_time_ms: result.processing_time_ms,
          data_rows_returned: result.data_results.length,
          sql_generated: result.sql_generated?.sql || null,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error storing query result:', error);
    }
  }
}
