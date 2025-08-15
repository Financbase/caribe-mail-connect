/**
 * AI Chat Interface Component
 * Story 2.1: AI-Powered Automation & Intelligence
 * 
 * Advanced AI chat interface powered by LangChain agents, LangGraph workflows,
 * Pydantic AI, Hugging Face models, and Cloudflare AI for intelligent customer support
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  Sparkles, 
  Zap, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  MessageSquare,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useAIIntegrations } from '@/hooks/useAI';
import { useSubscription } from '@/contexts/SubscriptionContext';

// =====================================================
// TYPES
// =====================================================

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    processing_time_ms?: number;
    ai_services_used?: string[];
    sentiment?: { label: string; score: number };
    entities?: any[];
    workflow_executed?: boolean;
  };
}

interface AIProcessingStatus {
  stage: 'analyzing' | 'processing' | 'generating' | 'complete';
  description: string;
  progress: number;
}

// =====================================================
// AI CHAT INTERFACE
// =====================================================

export function AIChatInterface() {
  const { subscription } = useSubscription();
  const { 
    isProcessing, 
    processWithHuggingFace, 
    processWithCloudflare, 
    orchestrateAI 
  } = useAIIntegrations();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Hello! I\'m your AI assistant powered by advanced machine learning models. I can help you with package tracking, customer support, business insights, and more. How can I assist you today?',
      timestamp: new Date(),
      metadata: {
        confidence: 1.0,
        ai_services_used: ['system_initialization']
      }
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<AIProcessingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing || !subscription?.id) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError(null);

    try {
      // Stage 1: Analyzing
      setProcessingStatus({
        stage: 'analyzing',
        description: 'Analyzing your message with AI...',
        progress: 25
      });

      // Stage 2: Processing
      setProcessingStatus({
        stage: 'processing',
        description: 'Processing with multiple AI services...',
        progress: 50
      });

      // Stage 3: Generating
      setProcessingStatus({
        stage: 'generating',
        description: 'Generating intelligent response...',
        progress: 75
      });

      // Use AI Orchestrator for comprehensive processing
      const result = await orchestrateAI(
        userMessage.content,
        'demo_customer_id', // In real app, get from context
        subscription.id
      );

      // Stage 4: Complete
      setProcessingStatus({
        stage: 'complete',
        description: 'Response ready!',
        progress: 100
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.response || result.fallback_response || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date(),
        metadata: {
          confidence: result.confidence || 0,
          processing_time_ms: result.processing_time_ms || 0,
          ai_services_used: result.ai_services_used || [],
          sentiment: result.analysis?.sentiment,
          entities: result.analysis?.entities,
          workflow_executed: result.workflow_executed || false
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err) {
      console.error('Error processing message:', err);
      setError(err instanceof Error ? err.message : 'Failed to process message');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        metadata: {
          confidence: 0,
          processing_time_ms: 0,
          ai_services_used: []
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setProcessingStatus(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
    // For now, just toggle the state
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'system',
        content: 'Chat cleared. How can I assist you today?',
        timestamp: new Date(),
        metadata: {
          confidence: 1.0,
          ai_services_used: ['system_reset']
        }
      }
    ]);
    setError(null);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-muted-foreground';
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Powered by LangChain, Hugging Face, Cloudflare AI & Pydantic AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Multi-AI
          </Badge>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {error && (
          <Alert variant="destructive" className="mx-4 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.type === 'system'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : message.type === 'ai' ? (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Settings className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      
                      {message.metadata && message.type === 'ai' && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <div className="flex items-center gap-4 text-xs">
                            {message.metadata.confidence !== undefined && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span className={getConfidenceColor(message.metadata.confidence)}>
                                  {(message.metadata.confidence * 100).toFixed(0)}% confidence
                                </span>
                              </div>
                            )}
                            
                            {message.metadata.processing_time_ms && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{message.metadata.processing_time_ms}ms</span>
                              </div>
                            )}
                            
                            {message.metadata.workflow_executed && (
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                <span>Workflow executed</span>
                              </div>
                            )}
                          </div>
                          
                          {message.metadata.ai_services_used && message.metadata.ai_services_used.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {message.metadata.ai_services_used.map((service, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {service.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {processingStatus && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-secondary">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <div className="flex-1">
                      <p className="text-sm">{processingStatus.description}</p>
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${processingStatus.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your packages, account, or business insights..."
                disabled={isProcessing}
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={toggleVoiceInput}
                disabled={isProcessing}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isProcessing}
              size="sm"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{messages.length - 1} messages</span>
              </div>
            </div>
            
            {subscription && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Connected</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
