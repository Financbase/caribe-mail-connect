import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-8 w-16 text-xs font-medium"
      aria-label={`Switch to ${language === 'es' ? 'English' : 'Spanish'}`}
      data-testid="language-toggle"
    >
      <Globe className="h-3 w-3 mr-1" />
      {language.toUpperCase()}
    </Button>
  );
}