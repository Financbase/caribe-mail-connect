import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, Bug, Lightbulb, Heart, Frown, Camera } from 'lucide-react';
import { useQA } from '@/hooks/useQA';

export const UserFeedbackWidget = () => {
  const { createFeedback } = useQA();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug_report' | 'feature_request' | 'improvement' | 'compliment' | 'complaint'>('improvement');
  const [feedback, setFeedback] = useState({
    title: '',
    description: '',
    category: 'ui_ux' as const
  });

  const feedbackTypes = [
    { value: 'bug_report', label: 'Bug Report', icon: Bug, color: 'text-destructive' },
    { value: 'feature_request', label: 'Feature Request', icon: Lightbulb, color: 'text-warning' },
    { value: 'improvement', label: 'Improvement', icon: Star, color: 'text-primary' },
    { value: 'compliment', label: 'Compliment', icon: Heart, color: 'text-success' },
    { value: 'complaint', label: 'Complaint', icon: Frown, color: 'text-destructive' }
  ];

  const selectedType = feedbackTypes.find(type => type.value === feedbackType);

  const handleSubmit = () => {
    createFeedback({
      ...feedback,
      feedback_type: feedbackType,
      status: 'open' as const,
      page_url: window.location.href,
      browser_info: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    });
    
    setFeedback({
      title: '',
      description: '',
      category: 'ui_ux'
    });
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200"
              aria-label="Open feedback form"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Your Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Feedback Type Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">What type of feedback?</label>
                <div className="grid grid-cols-2 gap-2" aria-label="Feedback type">
                  {feedbackTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFeedbackType(type.value as any)}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          feedbackType === type.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:bg-muted'
                        }`}
                        
                        aria-label={type.label}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${type.color}`} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={feedback.category}
                  onValueChange={(value: unknown) => setFeedback({ ...feedback, category: value })}
                >
                  <SelectTrigger aria-label="Feedback category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ui_ux">UI/UX</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="functionality">Functionality</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={feedback.title}
                  onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
                  placeholder={`Brief summary of your ${selectedType?.label.toLowerCase()}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={feedback.description}
                  onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
                  placeholder="Please provide details..."
                  rows={4}
                />
              </div>

              {/* Screenshot Option */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Camera className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Screenshots can be helpful for bug reports and UI feedback
                </span>
              </div>

              {/* Submit */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!feedback.title || !feedback.description}
                  className="flex-1"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export const UserFeedbackManager = () => {
  const { userFeedback } = useQA();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredFeedback = userFeedback.filter(feedback => {
    if (statusFilter !== 'all' && feedback.status !== statusFilter) return false;
    if (typeFilter !== 'all' && feedback.feedback_type !== typeFilter) return false;
    return true;
  });

  const getTypeBadge = (type: string) => {
    const variants = {
      bug_report: 'destructive',
      feature_request: 'secondary',
      improvement: 'default',
      compliment: 'default',
      complaint: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[type as keyof typeof variants] || 'outline'}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'destructive',
      reviewed: 'secondary',
      in_progress: 'default',
      completed: 'default',
      rejected: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          User Feedback Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" aria-label="Filter feedback by status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40" aria-label="Filter feedback by type">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bug_report">Bug Reports</SelectItem>
              <SelectItem value="feature_request">Feature Requests</SelectItem>
              <SelectItem value="improvement">Improvements</SelectItem>
              <SelectItem value="compliment">Compliments</SelectItem>
              <SelectItem value="complaint">Complaints</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feedback Cards */}
        <div className="space-y-4">
          {filteredFeedback.map((feedback) => (
            <Card key={feedback.id} className="border-l-4 border-l-primary" tabIndex={0} aria-label={`Feedback ${feedback.title}, type ${feedback.feedback_type.replace('_',' ')}, status ${feedback.status}, submitted ${new Date(feedback.created_at).toLocaleDateString()}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const btn = (e.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('button[data-action="view"]');
                  btn?.click();
                  e.preventDefault();
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{feedback.title}</h4>
                      {getTypeBadge(feedback.feedback_type)}
                      {getStatusBadge(feedback.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {feedback.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Category: {feedback.category || 'Other'}</span>
                      <span>Submitted: {new Date(feedback.created_at).toLocaleDateString()}</span>
                      {feedback.page_url && (
                        <span>Page: {new URL(feedback.page_url).pathname}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" data-action="view" aria-label={`View details for ${feedback.title}`}>
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      Respond
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredFeedback.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No feedback found matching the selected filters
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};