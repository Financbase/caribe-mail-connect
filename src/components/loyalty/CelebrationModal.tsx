import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  X,
  Sparkles,
  Award,
  Gift
} from 'lucide-react';
import styles from './CelebrationModal.module.css';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    type: 'achievement' | 'tier_upgrade' | 'challenge_completion' | 'milestone';
    title: string;
    description: string;
    icon?: string;
    points?: number;
    color?: string;
  };
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ 
  isOpen, 
  onClose, 
  data 
}) => {
  const { language } = useLanguage();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      setShowConfetti(true);
      setTimeout(() => setShowContent(true), 500);
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
      setShowContent(false);
    }
  }, [isOpen, data, onClose]);

  const getCelebrationIcon = () => {
    if (data?.icon) return data.icon;
    
    switch (data?.type) {
      case 'achievement':
        return <Award className="h-16 w-16 text-yellow-500" />;
      case 'tier_upgrade':
        return <Crown className={`h-16 w-16 ${getCrownColorClass(data?.color)}`} />;
      case 'challenge_completion':
        return <Trophy className="h-16 w-16 text-yellow-500" />;
      case 'milestone':
        return <Star className="h-16 w-16 text-blue-500" />;
      default:
        return <Sparkles className="h-16 w-16 text-purple-500" />;
    }
  };

  const getBackgroundGradient = () => {
    switch (data?.type) {
      case 'achievement':
        return 'bg-gradient-to-br from-yellow-50 to-orange-50';
      case 'tier_upgrade':
        return 'bg-gradient-to-br from-purple-50 to-pink-50';
      case 'challenge_completion':
        return 'bg-gradient-to-br from-green-50 to-blue-50';
      case 'milestone':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50';
      default:
        return 'bg-gradient-to-br from-gray-50 to-white';
    }
  };

  const getTitleColor = () => {
    switch (data?.type) {
      case 'achievement':
        return 'text-yellow-600';
      case 'tier_upgrade':
        return 'text-purple-600';
      case 'challenge_completion':
        return 'text-green-600';
      case 'milestone':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCrownColorClass = (color?: string) => {
    if (!color) return styles.crownGold;
    switch (color.toLowerCase()) {
      case '#ffd700':
      case 'gold':
        return styles.crownGold;
      case '#c0c0c0':
      case 'silver':
        return styles.crownSilver;
      case '#cd7f32':
      case 'bronze':
        return styles.crownBronze;
      case '#8b5cf6':
      case 'purple':
        return styles.crownPurple;
      case '#3b82f6':
      case 'blue':
        return styles.crownBlue;
      default:
        return styles.crownGold;
    }
  };

  const getConfettiClass = (index: number) => {
    return `${styles.confetti} ${styles[`confetti${index}`] || styles.confetti0}`;
  };

  const getConfettiColorClass = (index: number) => {
    const colors = [styles.confettiYellow, styles.confettiRed, styles.confettiBlue, styles.confettiGreen, styles.confettiPurple];
    return colors[index % colors.length];
  };

  const getSparkleClass = (index: number) => {
    return `${styles.sparkle} ${styles[`sparkle${index}`] || styles.sparkle0}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md p-0 overflow-hidden ${getBackgroundGradient()}`}>
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div key={i} className={getConfettiClass(i)}>
                <div className={`${styles.confettiPiece} ${getConfettiColorClass(i)}`} />
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label={language === 'es' ? 'Cerrar modal de celebración' : 'Close celebration modal'}
          title={language === 'es' ? 'Cerrar' : 'Close'}
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Content */}
        <div className={`relative p-8 text-center transition-all duration-500 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {/* Icon */}
          <div className="mb-6 animate-pulse">
            {getCelebrationIcon()}
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold mb-3 ${getTitleColor()}`}>
            {data?.title || (language === 'es' ? '¡Felicidades!' : 'Congratulations!')}
          </h2>

          {/* Description */}
          <p className="text-gray-700 mb-6 text-lg">
            {data?.description || (language === 'es' ? 'Has alcanzado un nuevo hito' : 'You\'ve reached a new milestone')}
          </p>

          {/* Points Badge */}
          {data?.points && (
            <div className="mb-6">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-4 py-2 text-lg">
                <Zap className="h-5 w-5 mr-2" />
                +{data.points} {language === 'es' ? 'puntos' : 'points'}
              </Badge>
            </div>
          )}

          {/* Type Badge */}
          <div className="mb-6">
            <Badge variant="outline" className="text-sm">
              {data?.type === 'achievement' && (language === 'es' ? 'Logro Desbloqueado' : 'Achievement Unlocked')}
              {data?.type === 'tier_upgrade' && (language === 'es' ? 'Nivel Mejorado' : 'Tier Upgraded')}
              {data?.type === 'challenge_completion' && (language === 'es' ? 'Desafío Completado' : 'Challenge Completed')}
              {data?.type === 'milestone' && (language === 'es' ? 'Hito Alcanzado' : 'Milestone Reached')}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              {language === 'es' ? 'Continuar' : 'Continue'}
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                onClose();
                // Navigate to relevant section
                if (data?.type === 'achievement') {
                  window.location.hash = '#loyalty';
                }
              }}
            >
              <Gift className="h-4 w-4 mr-2" />
              {language === 'es' ? 'Ver Más' : 'View More'}
            </Button>
          </div>

          {/* Sparkle Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={getSparkleClass(i)}>
                <Sparkles className={styles.sparkleIcon} />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CelebrationModal; 