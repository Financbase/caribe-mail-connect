import { useEffect } from 'react';
import { mockCustomers } from '@/data/mockData';
import { sendLifecycleEmail } from '@/lib/emails';
import { Button } from '@/components/ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

// Demonstration onboarding flow using sample data
// Implemented on 2025-02-14
const Onboarding = ({ onComplete }: OnboardingProps) => {
  const demoUser = mockCustomers[0];

  useEffect(() => {
    sendLifecycleEmail('welcome', demoUser.email);
  }, [demoUser.email]);

  const handleFinish = async () => {
    await sendLifecycleEmail('onboarding_complete', demoUser.email);
    try {
      await sendLifecycleEmail('onboarding_complete', demoUser.email);
      onComplete();
    } catch (error) {
      alert('Failed to send onboarding completion email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-2xl font-bold">Bienvenid@, {demoUser.name}</h1>
        <p>
          This guided tour uses demo data to showcase Caribe Mail Connect's core
          features.
        </p>
        <div className="space-y-2 text-left">
          <p className="font-semibold">Mailbox: {demoUser.mailboxNumber}</p>
          <p>Email: {demoUser.email}</p>
          <p>Packages awaiting pickup: {demoUser.activePackages}</p>
        </div>
        <Button onClick={handleFinish}>Complete Onboarding</Button>
      </div>
    </div>
  );
};

export default Onboarding;
