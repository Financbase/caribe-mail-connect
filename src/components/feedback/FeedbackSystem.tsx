import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star, MessageSquare, Bug, Lightbulb, Send, X } from 'lucide-react';

export interface FeedbackData {
  id: string;
  type: 'bug' | 'feature' | 'general' | 'performance';
  title: string;
  description: string;
  userEmail?: string;
  userAgent: string;
  url: string;
  timestamp: number;
  rating?: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'new' | 'in-progress' | 'resolved' | 'closed';
  metadata?: Record<string, any>;
}

interface FeedbackSystemProps {
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
  showFloatingButton?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({
  onFeedbackSubmit,
  showFloatingButton = true,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'performance'>('general');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackData[]>([]);

  useEffect(() => {
    // Load previously submitted feedback from localStorage
    const saved = localStorage.getItem('prmcms-feedback');
    if (saved) {
      try {
        setSubmittedFeedback(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved feedback:', error);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const feedback: FeedbackData = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: feedbackType,
      title: title.trim(),
      description: description.trim(),
      userEmail: userEmail.trim() || undefined,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      rating: rating > 0 ? rating : undefined,
      priority: getPriority(feedbackType, description),
      status: 'new',
      metadata: {
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        timeOnPage: getTimeOnPage(),
        previousFeedback: submittedFeedback.length
      }
    };

    try {
      // Save to localStorage
      const updatedFeedback = [...submittedFeedback, feedback];
      setSubmittedFeedback(updatedFeedback);
      localStorage.setItem('prmcms-feedback', JSON.stringify(updatedFeedback));

      // Send to server
      await sendFeedbackToServer(feedback);

      // Call callback if provided
      if (onFeedbackSubmit) {
        onFeedbackSubmit(feedback);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setUserEmail('');
      setRating(0);
      setFeedbackType('general');
      setIsOpen(false);

      // Show success message
      showSuccessMessage();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriority = (type: string, description: string): 'low' | 'medium' | 'high' | 'critical' => {
    const criticalKeywords = ['crash', 'broken', 'error', 'fail', 'not working'];
    const highKeywords = ['issue', 'problem', 'bug', 'slow'];
    const mediumKeywords = ['improvement', 'suggestion', 'feature'];

    const desc = description.toLowerCase();
    
    if (criticalKeywords.some(keyword => desc.includes(keyword))) return 'critical';
    if (highKeywords.some(keyword => desc.includes(keyword))) return 'high';
    if (mediumKeywords.some(keyword => desc.includes(keyword))) return 'medium';
    return 'low';
  };

  const getTimeOnPage = (): number => {
    // This would be more sophisticated in a real implementation
    return Math.floor(Math.random() * 300); // Mock time in seconds
  };

  const sendFeedbackToServer = async (feedback: FeedbackData): Promise<void> => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send feedback to server:', error);
      // Don't throw - we still want to save locally
    }
  };

  const showSuccessMessage = () => {
    // Create a temporary success message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
    message.textContent = 'Thank you for your feedback!';
    document.body.appendChild(message);

    setTimeout(() => {
      document.body.removeChild(message);
    }, 3000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Lightbulb className="w-4 h-4" />;
      case 'performance': return <Star className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'performance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <>
      {/* Floating Feedback Button */}
      {showFloatingButton && !isOpen && (
        <div className={`fixed ${positionClasses[position]} z-50`}>
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700"
            title="Send Feedback"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Send Feedback</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Feedback Type Selection */}
              <div className="space-y-2">
                <Label>Feedback Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['bug', 'feature', 'general', 'performance'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={feedbackType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFeedbackType(type)}
                      className="justify-start"
                    >
                      {getTypeIcon(type)}
                      <span className="ml-2 capitalize">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="feedback-title">Title *</Label>
                <Input
                  id="feedback-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of your feedback"
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="feedback-description">Description *</Label>
                <Textarea
                  id="feedback-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information..."
                  rows={4}
                  maxLength={1000}
                />
              </div>

              {/* Email (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="feedback-email">Email (Optional)</Label>
                <Input
                  id="feedback-email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              {/* Rating (for general feedback) */}
              {feedbackType === 'general' && (
                <div className="space-y-2">
                  <Label>How would you rate your experience?</Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !description.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback History */}
      {submittedFeedback.length > 0 && (
        <div className="fixed bottom-4 left-4 z-40">
          <Card className="w-80 max-h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-sm">Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {submittedFeedback.slice(-3).reverse().map((feedback) => (
                <div key={feedback.id} className="border rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={getTypeColor(feedback.type)}>
                      {getTypeIcon(feedback.type)}
                      <span className="ml-1 capitalize">{feedback.type}</span>
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(feedback.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-medium text-sm">{feedback.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {feedback.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

// Hook for using feedback system
export const useFeedback = () => {
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('prmcms-feedback');
    if (saved) {
      try {
        setFeedbackHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load feedback history:', error);
      }
    }
  }, []);

  const submitFeedback = async (feedback: Omit<FeedbackData, 'id' | 'timestamp' | 'userAgent' | 'url'>) => {
    const newFeedback: FeedbackData = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const updatedHistory = [...feedbackHistory, newFeedback];
    setFeedbackHistory(updatedHistory);
    localStorage.setItem('prmcms-feedback', JSON.stringify(updatedHistory));

    // Send to server
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback)
      });
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  return { feedbackHistory, submitFeedback };
}; 