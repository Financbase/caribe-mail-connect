import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Printer, Send, DollarSign, Search } from 'lucide-react';
import { useBilling } from '@/hooks/useBilling';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface InvoiceListProps {
  limit?: number;
  variant?: 'full' | 'summary';
}

export function InvoiceList({ limit, variant = 'full' }: InvoiceListProps) {
  const { invoices, loading } = useBilling();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices
    .filter(invoice => 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, limit);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Borrador', variant: 'secondary' as const },
      sent: { label: 'Enviada', variant: 'default' as const },
      paid: { label: 'Pagada', variant: 'default' as const },
      partial: { label: 'Parcial', variant: 'secondary' as const },
      overdue: { label: 'Vencida', variant: 'destructive' as const },
      cancelled: { label: 'Cancelada', variant: 'outline' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (variant === 'summary') {
    return (
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{invoice.invoice_number}</p>
              <p className="text-sm text-muted-foreground">{invoice.customer_name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(invoice.total_amount)}</p>
              {getStatusBadge(invoice.status)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Gestión de Facturas</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar facturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Por Cobrar</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No se encontraron facturas
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    tabIndex={0}
                    aria-label={`Factura ${invoice.invoice_number} ${invoice.customer_name} ${format(new Date(invoice.issue_date), 'dd/MM/yyyy', { locale: es })}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        const btn = (e.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('button[data-action="view"]');
                        btn?.click();
                        e.preventDefault();
                      }
                    }}
                  >
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.customer_name}</TableCell>
                    <TableCell>
                      {format(new Date(invoice.issue_date), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                    <TableCell>
                      <span className={invoice.amount_due > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                        {formatCurrency(invoice.amount_due)}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" data-action="view" aria-label={`Ver factura ${invoice.invoice_number}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Printer className="h-4 w-4" />
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {invoice.amount_due > 0 && (
                          <Button variant="ghost" size="sm">
                            <DollarSign className="h-4 w-4" />
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