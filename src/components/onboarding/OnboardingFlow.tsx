/**
 * Onboarding Flow Component
 * Story 10: Growth Infrastructure - User Onboarding Flow
 * 
 * Main onboarding flow component with step navigation,
 * progress tracking, and interactive tutorials
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Skip,
  Play,
  Clock,
  Gift,
  HelpCircle,
  X,
  Lightbulb,
  Target,
  Users,
  Package,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useSubscription } from '@/contexts/SubscriptionContext';
import type { OnboardingFlow as OnboardingFlowType, OnboardingStep } from '@/services/onboarding';

// =====================================================
// ONBOARDING STEP COMPONENTS
// =====================================================

const WelcomeStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="text-center space-y-6">
    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
      <Target className="h-12 w-12 text-blue-600" />
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-2">Welcome to PRMCMS!</h2>
      <p className="text-muted-foreground">
        Let's get you set up with everything you need to manage your packages and customers effectively.
      </p>
    </div>
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-medium mb-2">What you'll learn:</h3>
      <ul className="text-sm text-left space-y-1">
        <li>• How to set up your business profile</li>
        <li>• Creating your first customer</li>
        <li>• Managing packages efficiently</li>
        <li>• Setting up communications</li>
      </ul>
    </div>
    <Button onClick={onComplete} className="w-full">
      <Play className="h-4 w-4 mr-2" />
      Let's Get Started
    </Button>
  </div>
);

const ProfileSetupStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Complete Your Profile</h2>
      <p className="text-muted-foreground">
        Tell us about your business so we can customize your experience.
      </p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Business Name</label>
        <input 
          type="text" 
          placeholder="Enter your business name"
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Contact Email</label>
        <input 
          type="email" 
          placeholder="business@example.com"
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <input 
          type="tel" 
          placeholder="+1 (555) 123-4567"
          className="w-full p-3 border rounded-lg"
        />
      </div>
    </div>

    <Button onClick={onComplete} className="w-full">
      Save Profile
    </Button>
  </div>
);

const FirstCustomerStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="h-8 w-8 text-purple-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Add Your First Customer</h2>
      <p className="text-muted-foreground">
        Create a customer record to see how the system works.
      </p>
    </div>

    <Alert>
      <Lightbulb className="h-4 w-4" />
      <AlertDescription>
        You can use demo data or real customer information. This helps you understand the workflow.
      </AlertDescription>
    </Alert>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Customer Name</label>
        <input 
          type="text" 
          placeholder="John Doe"
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input 
          type="email" 
          placeholder="john@example.com"
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input 
          type="tel" 
          placeholder="+1 (555) 987-6543"
          className="w-full p-3 border rounded-lg"
        />
      </div>
    </div>

    <Button onClick={onComplete} className="w-full">
      Create Customer
    </Button>
  </div>
);

const FirstPackageStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Create Your First Package</h2>
      <p className="text-muted-foreground">
        Set up a package to understand the core workflow.
      </p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Package Description</label>
        <input 
          type="text" 
          placeholder="Electronics package for John Doe"
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
          <input 
            type="number" 
            placeholder="2.5"
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Value ($)</label>
          <input 
            type="number" 
            placeholder="150"
            className="w-full p-3 border rounded-lg"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Assign to Customer</label>
        <select className="w-full p-3 border rounded-lg">
          <option>John Doe</option>
        </select>
      </div>
    </div>

    <Button onClick={onComplete} className="w-full">
      Create Package
    </Button>
  </div>
);

const CommunicationSetupStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="h-8 w-8 text-blue-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Set Up Communications</h2>
      <p className="text-muted-foreground">
        Configure how you want to communicate with customers.
      </p>
    </div>
    
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="font-medium">Notification Preferences</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" defaultChecked />
            <span>Email notifications for package arrivals</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" defaultChecked />
            <span>SMS notifications for urgent updates</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>WhatsApp notifications (if available)</span>
          </label>
        </div>
      </div>
    </div>

    <Button onClick={onComplete} className="w-full">
      Save Communication Settings
    </Button>
  </div>
);

// =====================================================
// MAIN ONBOARDING FLOW COMPONENT
// =====================================================

interface OnboardingFlowProps {
  flowId: string;
  onComplete?: () => void;
  onClose?: () => void;
}

export function OnboardingFlow({ flowId, onComplete, onClose }: OnboardingFlowProps) {
  const { subscription } = useSubscription();
  const {
    currentFlow,
    progress,
    isLoading,
    error,
    startFlow,
    completeStep,
    skipStep,
    resetFlow
  } = useOnboarding();

  const [stepStartTime, setStepStartTime] = useState<Date>(new Date());

  useEffect(() => {
    if (subscription?.id && flowId) {
      startFlow(flowId);
    }
  }, [subscription?.id, flowId, startFlow]);

  useEffect(() => {
    setStepStartTime(new Date());
  }, [progress?.current_step]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!currentFlow || !progress) {
    return (
      <Alert>
        <AlertDescription>Onboarding flow not found.</AlertDescription>
      </Alert>
    );
  }

  const currentStep = currentFlow.steps.find(step => step.id === progress.current_step);
  const currentStepIndex = currentFlow.steps.findIndex(step => step.id === progress.current_step);
  const isLastStep = currentStepIndex === currentFlow.steps.length - 1;
  const canGoBack = currentStepIndex > 0;

  const handleCompleteStep = async () => {
    if (!currentStep) return;

    const timeSpent = Math.round((new Date().getTime() - stepStartTime.getTime()) / 60000); // minutes
    const success = await completeStep(currentStep.id, timeSpent);
    
    if (success && isLastStep && onComplete) {
      onComplete();
    }
  };

  const handleSkipStep = async () => {
    if (!currentStep || currentStep.required) return;
    await skipStep(currentStep.id);
  };

  const handleGoBack = () => {
    if (canGoBack) {
      const previousStep = currentFlow.steps[currentStepIndex - 1];
      // Remove current step from completed steps and go back
      // This would require additional logic in the service
    }
  };

  const renderStepComponent = () => {
    if (!currentStep) return null;

    const stepProps = { onComplete: handleCompleteStep };

    switch (currentStep.component) {
      case 'WelcomeStep':
        return <WelcomeStep {...stepProps} />;
      case 'ProfileSetupStep':
        return <ProfileSetupStep {...stepProps} />;
      case 'FirstCustomerStep':
        return <FirstCustomerStep {...stepProps} />;
      case 'FirstPackageStep':
        return <FirstPackageStep {...stepProps} />;
      case 'CommunicationSetupStep':
        return <CommunicationSetupStep {...stepProps} />;
      default:
        return (
          <div className="text-center py-8">
            <p>Step component not found: {currentStep.component}</p>
            <Button onClick={handleCompleteStep} className="mt-4">
              Continue
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{currentFlow.name}</h1>
          <p className="text-muted-foreground">{currentFlow.description}</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStepIndex + 1} of {currentFlow.steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {progress.completion_percentage}% Complete
          </span>
        </div>
        <Progress value={progress.completion_percentage} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          {currentFlow.steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress.completed_steps.includes(step.id)
                    ? 'bg-green-500 text-white'
                    : index === currentStepIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {progress.completed_steps.includes(step.id) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-16 truncate">
                  {step.title}
                </span>
              </div>
              {index < currentFlow.steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentStep?.title}
                {currentStep?.required && (
                  <Badge variant="secondary">Required</Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4" />
                Estimated time: {currentStep?.estimated_time} minutes
              </CardDescription>
            </div>
            {currentStep?.help_resources.length > 0 && (
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {renderStepComponent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleGoBack}
          disabled={!canGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {!currentStep?.required && (
            <Button
              variant="ghost"
              onClick={handleSkipStep}
            >
              <Skip className="h-4 w-4 mr-2" />
              Skip
            </Button>
          )}
        </div>
      </div>

      {/* Completion Reward */}
      {currentFlow.completion_reward && (
        <Alert className="mt-6">
          <Gift className="h-4 w-4" />
          <AlertDescription>
            <strong>Completion Reward:</strong> {currentFlow.completion_reward}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
