import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Play, Pause, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface BillingRunsProps {
  variant?: 'full' | 'upcoming';
}

interface BillingRun {
  id: string;
  run_date: string;
  billing_period_start: string;
  billing_period_end: string;
  status: string;
  total_customers: number;
  total_invoices: number;
  total_amount: number;
  notes?: string;
}

export function BillingRuns({ variant = 'full' }: BillingRunsProps) {
  const [billingRuns, setBillingRuns] = useState<BillingRun[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBillingRuns = async () => {
    try {
      const { data, error } = await supabase
        .from('billing_runs')
        .select('*')
        .order('run_date', { ascending: false });

      if (error) throw error;
      setBillingRuns(data || []);
    } catch (error) {
      console.error('Error fetching billing runs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingRuns();
  }, [fetchBillingRuns]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const, icon: AlertCircle },
      running: { label: 'Ejecutando', variant: 'default' as const, icon: Play },
      completed: { label: 'Completado', variant: 'default' as const, icon: CheckCircle },
      failed: { label: 'Fallido', variant: 'destructive' as const, icon: AlertCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (variant === 'upcoming') {
    // Show upcoming billing dates for customer renewals
    const upcomingDates = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(new Date(), i);
      return {
        date: date.toISOString().split('T')[0],
        formatted: format(date, 'dd/MM/yyyy', { locale: es }),
        customers: Math.floor(Math.random() * 15) + 5, // Mock data
      };
    });

    return (
      <div className="space-y-4">
        {upcomingDates.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{item.formatted}</p>
              <p className="text-sm text-muted-foreground">
                {item.customers} renovaciones programadas
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Procesar
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Ejecuciones de Facturación</CardTitle>
          <Button className="bg-primary hover:bg-primary-dark">
            <Play className="w-4 h-4 mr-2" />
            Nueva Ejecución
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Facturas</TableHead>
                <TableHead>Monto Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : billingRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron ejecuciones de facturación
                  </TableCell>
                </TableRow>
              ) : (
                billingRuns.map((run) => (
                  <TableRow
                    key={run.id}
                    tabIndex={0}
                    aria-label={`Ejecución ${format(new Date(run.run_date), 'dd/MM/yyyy', { locale: es })} ${run.status}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        const btn = (e.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('button[data-action="details"]');
                        btn?.click();
                        e.preventDefault();
                      }
                    }}
                  >
                    <TableCell>
                      {format(new Date(run.run_date), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(run.billing_period_start), 'dd/MM', { locale: es })} - {' '}
                      {format(new Date(run.billing_period_end), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>{run.total_customers}</TableCell>
                    <TableCell>{run.total_invoices}</TableCell>
                    <TableCell>{formatCurrency(run.total_amount)}</TableCell>
                    <TableCell>{getStatusBadge(run.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" data-action="details" aria-label={`Ver detalles ejecución ${format(new Date(run.run_date), 'dd/MM/yyyy', { locale: es })}`}>
                          Ver Detalles
                        </Button>
                        {run.status === 'failed' && (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}