import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

export function ActionCard({ title, icon: Icon, onClick, className }: ActionCardProps) {
  return (
    <Card 
      className={`
        p-6 cursor-pointer transition-all duration-300 transform 
        hover:scale-105 hover:shadow-elegant 
        bg-gradient-to-br from-white to-accent/20 
        border-2 border-primary/10 hover:border-primary/30
        active:scale-95 min-h-[120px] flex flex-col items-center justify-center
        ${className}
      `}
      onClick={onClick}
    >
      <Icon className="h-8 w-8 text-primary mb-3" />
      <h3 className="text-sm font-semibold text-center text-foreground leading-tight">
        {title}
      </h3>
    </Card>
  );
}