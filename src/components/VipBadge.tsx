import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface VipBadgeProps {
  isAct60?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'icon' | 'full';
  className?: string;
}

export function VipBadge({ isAct60 = false, size = 'md', variant = 'badge', className }: VipBadgeProps) {
  if (!isAct60) return null;

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }[size];

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];

  if (variant === 'icon') {
    return (
      <Crown 
        className={cn(iconSize, "text-yellow-600", className)} 
        aria-label="Act 60 VIP Customer"
      />
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn("flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full border border-yellow-300", className)}>
        <Crown className={cn(iconSize, "text-yellow-700")} />
        <span className={cn(textSize, "font-medium text-yellow-800")}>Act 60 VIP</span>
      </div>
    );
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn("bg-yellow-100 text-yellow-800 border-yellow-300", className)}
    >
      <Crown className={cn(iconSize, "mr-1")} />
      <span className={textSize}>VIP</span>
    </Badge>
  );
}