import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Package, FileText, Clock, AlertCircle, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FixedSizeList as List } from 'react-window';
import { formatDate } from '@/lib/utils';
import type { MailPiece } from '@/hooks/useVirtualMailbox';
import { CachedImage } from '@/components/offline/CachedImage';

interface MailPieceListProps {
  mailPieces: MailPiece[];
  loading: boolean;
  onActionRequest: (pieceId: string) => void;
}

export function MailPieceList({ mailPieces, loading, onActionRequest }: MailPieceListProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  const getMailTypeIcon = (type: string) => {
    switch (type) {
      case 'letter':
        return <Mail className="h-4 w-4" />;
      case 'package':
        return <Package className="h-4 w-4" />;
      case 'magazine':
        return <FileText className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      received: { label: isSpanish ? 'Recibido' : 'Received', variant: 'secondary' as const },
      notified: { label: isSpanish ? 'Notificado' : 'Notified', variant: 'default' as const },
      action_pending: { label: isSpanish ? 'Acción Pendiente' : 'Action Pending', variant: 'destructive' as const },
      scanning: { label: isSpanish ? 'Escaneando' : 'Scanning', variant: 'default' as const },
      forwarded: { label: isSpanish ? 'Enviado' : 'Forwarded', variant: 'default' as const },
      completed: { label: isSpanish ? 'Completado' : 'Completed', variant: 'default' as const },
      shredded: { label: isSpanish ? 'Triturado' : 'Shredded', variant: 'outline' as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.received;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getPriorityIcon = (priority: number) => {
    if (priority >= 3) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    } else if (priority === 2) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (mailPieces.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isSpanish ? 'No hay correo' : 'No mail pieces'}
            </h3>
            <p className="text-muted-foreground">
              {isSpanish 
                ? 'No se encontraron piezas de correo con los filtros actuales'
                : 'No mail pieces found with current filters'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const itemCount = mailPieces.length;
  const itemSize = 56; // approximate row height

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const piece = mailPieces[index];
    return (
      <TableRow key={piece.id} className="cursor-pointer hover:bg-muted/50" style={style}>
        <TableCell>
          <div className="flex items-center gap-1">
            {getMailTypeIcon(piece.mail_type)}
            {getPriorityIcon(piece.priority_level)}
          </div>
        </TableCell>
        <TableCell className="font-medium">{piece.piece_number}</TableCell>
        <TableCell>
          <div>
            <div className="font-medium">{piece.sender_name || 'Unknown'}</div>
            {piece.sender_address && (
              <div className="text-sm text-muted-foreground line-clamp-1">
                {piece.sender_address}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {getMailTypeIcon(piece.mail_type)}
            <span className="capitalize">{piece.mail_type}</span>
            {piece.size_category !== 'standard' && (
              <Badge variant="outline" className="text-xs">
                {piece.size_category}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell>{formatDate(piece.received_date)}</TableCell>
        <TableCell>{getStatusBadge(piece.status)}</TableCell>
        <TableCell>
          {piece.photo_exterior_url ? (
            <div className="flex items-center gap-2">
              <CachedImage
                src={piece.photo_thumbnail_url || piece.photo_exterior_url}
                alt="Mail exterior"
                className="w-12 h-8 object-cover rounded border"
              />
              <Button variant="ghost" size="sm">
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Badge variant="outline" className="text-xs">
              {isSpanish ? 'Sin foto' : 'No photo'}
            </Badge>
          )}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onActionRequest(piece.id)}>
                {isSpanish ? 'Crear Acción' : 'Create Action'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {isSpanish ? 'Ver Detalles' : 'View Details'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {isSpanish ? 'Editar' : 'Edit'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {isSpanish ? 'Piezas de Correo' : 'Mail Pieces'} ({mailPieces.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>{isSpanish ? 'Número' : 'Number'}</TableHead>
              <TableHead>{isSpanish ? 'Remitente' : 'Sender'}</TableHead>
              <TableHead>{isSpanish ? 'Tipo' : 'Type'}</TableHead>
              <TableHead>{isSpanish ? 'Recibido' : 'Received'}</TableHead>
              <TableHead>{isSpanish ? 'Estado' : 'Status'}</TableHead>
              <TableHead>{isSpanish ? 'Foto' : 'Photo'}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <List
              height={Math.min(480, itemCount * itemSize)}
              width={'100%'}
              itemCount={itemCount}
              itemSize={itemSize}
            >
              {({ index, style }) => <Row index={index} style={style} />}
            </List>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}