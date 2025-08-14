/**
 * Payment Method Card Component
 * Story 1.1: Unified Payment Integration
 * 
 * Displays and manages payment methods (Stripe + ATH Móvil)
 * Integrates with existing shadcn/ui design system
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  MapPin, 
  Shield, 
  MoreVertical,
  Trash2,
  Edit,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '@/services/payment';
import { ATHMovilService } from '@/services/ath-movil';
import type { PaymentMethod, StripePaymentMethod, ATHMovilPaymentMethod } from '@/types/payment';

// =====================================================
// PAYMENT METHOD ICON
// =====================================================

interface PaymentMethodIconProps {
  type: PaymentMethod['type'];
  brand?: string;
  className?: string;
}

function PaymentMethodIcon({ type, brand, className = "h-6 w-6" }: PaymentMethodIconProps) {
  switch (type) {
    case 'stripe':
      return <CreditCard className={className} />;
    case 'ath_movil':
      return <Smartphone className={className} />;
    default:
      return <CreditCard className={className} />;
  }
}

// =====================================================
// PAYMENT METHOD DISPLAY
// =====================================================

interface PaymentMethodDisplayProps {
  paymentMethod: PaymentMethod;
}

function PaymentMethodDisplay({ paymentMethod }: PaymentMethodDisplayProps) {
  if (paymentMethod.type === 'stripe') {
    const stripeMethod = paymentMethod as StripePaymentMethod;
    return (
      <div className="flex items-center space-x-3">
        <PaymentMethodIcon type="stripe" brand={stripeMethod.card_brand} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {stripeMethod.card_brand?.toUpperCase()} •••• {stripeMethod.card_last_four}
            </span>
            {stripeMethod.is_default && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Expires {stripeMethod.card_exp_month}/{stripeMethod.card_exp_year}
          </p>
        </div>
      </div>
    );
  }

  if (paymentMethod.type === 'ath_movil') {
    const athMethod = paymentMethod as ATHMovilPaymentMethod;
    const display = ATHMovilService.getPaymentMethodDisplay(athMethod);
    
    return (
      <div className="flex items-center space-x-3">
        <PaymentMethodIcon type="ath_movil" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{display.displayName}</span>
            {athMethod.is_default && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Puerto Rico</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{display.maskedPhone}</p>
            {athMethod.is_verified ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-yellow-600">Pending</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// =====================================================
// MAIN PAYMENT METHOD CARD
// =====================================================

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onEdit?: (paymentMethod: PaymentMethod) => void;
  onDelete?: (paymentMethod: PaymentMethod) => void;
  onSetDefault?: (paymentMethod: PaymentMethod) => void;
  showActions?: boolean;
  className?: string;
}

export function PaymentMethodCard({
  paymentMethod,
  onEdit,
  onDelete,
  onSetDefault,
  showActions = true,
  className
}: PaymentMethodCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetDefault = async () => {
    if (!onSetDefault) return;
    
    setIsLoading(true);
    try {
      await onSetDefault(paymentMethod);
      toast({
        title: "Default payment method updated",
        description: "This payment method is now your default."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default payment method.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsLoading(true);
    try {
      await onDelete(paymentMethod);
      toast({
        title: "Payment method removed",
        description: "The payment method has been successfully removed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove payment method.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <PaymentMethodDisplay paymentMethod={paymentMethod} />
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isLoading}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!paymentMethod.is_default && onSetDefault && (
                  <DropdownMenuItem onClick={handleSetDefault}>
                    <Star className="mr-2 h-4 w-4" />
                    Set as Default
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(paymentMethod)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Security indicator */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>
              {paymentMethod.type === 'stripe' ? 'Secured by Stripe' : 'Secured by ATH Móvil'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// PAYMENT METHODS LIST
// =====================================================

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  onEdit?: (paymentMethod: PaymentMethod) => void;
  onDelete?: (paymentMethod: PaymentMethod) => void;
  onSetDefault?: (paymentMethod: PaymentMethod) => void;
  onAddNew?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function PaymentMethodsList({
  paymentMethods,
  onEdit,
  onDelete,
  onSetDefault,
  onAddNew,
  isLoading = false,
  className
}: PaymentMethodsListProps) {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No Payment Methods</CardTitle>
          <CardDescription>
            Add a payment method to start processing payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onAddNew && (
            <Button onClick={onAddNew} className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {paymentMethods.map((paymentMethod) => (
        <PaymentMethodCard
          key={paymentMethod.id}
          paymentMethod={paymentMethod}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
      
      {onAddNew && (
        <>
          <Separator />
          <Button variant="outline" onClick={onAddNew} className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Add Another Payment Method
          </Button>
        </>
      )}
    </div>
  );
}

// =====================================================
// PAYMENT METHOD SUMMARY
// =====================================================

interface PaymentMethodSummaryProps {
  paymentMethods: PaymentMethod[];
  className?: string;
}

export function PaymentMethodSummary({ paymentMethods, className }: PaymentMethodSummaryProps) {
  const stripeCount = paymentMethods.filter(pm => pm.type === 'stripe').length;
  const athMovilCount = paymentMethods.filter(pm => pm.type === 'ath_movil').length;
  const defaultMethod = paymentMethods.find(pm => pm.is_default);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Payment Methods Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Credit Cards (Stripe)</span>
          <span className="font-medium">{stripeCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">ATH Móvil (Puerto Rico)</span>
          <span className="font-medium">{athMovilCount}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Methods</span>
          <span className="font-medium">{paymentMethods.length}</span>
        </div>
        {defaultMethod && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">Default Method:</p>
            <PaymentMethodDisplay paymentMethod={defaultMethod} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
