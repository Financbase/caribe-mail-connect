import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function OfflineIndicator() {
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const [justChanged, setJustChanged] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 2000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 2000);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show a compact banner when offline; briefly show a green banner when coming back online
  if (isOnline && !justChanged) return null;

  const isSpanish = language === 'es';
  const bg = isOnline ? 'bg-emerald-600' : 'bg-red-600';
  const Icon = isOnline ? Wifi : WifiOff;
  const text = isOnline
    ? (isSpanish ? 'Conectado — cambios se sincronizan' : 'Online — changes will sync')
    : (isSpanish ? 'Sin conexión — trabajando sin Internet' : 'Offline — working without Internet');

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${bg} text-white fixed top-0 left-0 right-0 z-50 px-3 py-2 text-xs sm:text-sm shadow-md flex items-center justify-center gap-2`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
