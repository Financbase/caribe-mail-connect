import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, FileText, Shield, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate } from '@/lib/utils';
import type { Document } from '@/hooks/useDocuments';

interface ComplianceDashboardProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
}

export function ComplianceDashboard({ documents, onDocumentSelect }: ComplianceDashboardProps) {
  const { language } = useLanguage();
  const [expiringDocuments, setExpiringDocuments] = useState<Document[]>([]);
  const [complianceDocuments, setComplianceDocuments] = useState<Document[]>([]);
  const [sensitiveDocuments, setSensitiveDocuments] = useState<Document[]>([]);

  const isSpanish = language === 'es';

  useEffect(() => {
    // Calculate expiring documents (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiring = documents.filter(doc => {
      if (!doc.expiration_date) return false;
      const expirationDate = new Date(doc.expiration_date);
      return expirationDate >= now && expirationDate <= thirtyDaysFromNow;
    });

    // Get compliance documents
    const compliance = documents.filter(doc => doc.category === 'compliance');

    // Get sensitive documents
    const sensitive = documents.filter(doc => doc.is_sensitive);

    setExpiringDocuments(expiring);
    setComplianceDocuments(compliance);
    setSensitiveDocuments(sensitive);
  }, [documents]);

  const complianceStats = {
    totalCompliance: complianceDocuments.length,
    expiring: expiringDocuments.length,
    sensitive: sensitiveDocuments.length,
    pendingApproval: documents.filter(doc => doc.approval_status === 'pending').length,
    requiresSignature: documents.filter(doc => doc.requires_signature).length,
  };

  const complianceScore = Math.round(
    ((complianceDocuments.length - expiringDocuments.length) / Math.max(complianceDocuments.length, 1)) * 100
  );

  const getUrgencyLevel = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration <= 7) return 'critical';
    if (daysUntilExpiration <= 14) return 'high';
    if (daysUntilExpiration <= 30) return 'medium';
    return 'low';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return isSpanish ? 'Crítico' : 'Critical';
      case 'high': return isSpanish ? 'Alto' : 'High';
      case 'medium': return isSpanish ? 'Medio' : 'Medium';
      default: return isSpanish ? 'Bajo' : 'Low';
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              {isSpanish ? 'Puntuación de Cumplimiento' : 'Compliance Score'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{complianceScore}%</div>
              <Progress value={complianceScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {complianceScore >= 90 
                  ? (isSpanish ? 'Excelente cumplimiento' : 'Excellent compliance')
                  : complianceScore >= 70 
                  ? (isSpanish ? 'Buen cumplimiento' : 'Good compliance')
                  : (isSpanish ? 'Necesita mejoras' : 'Needs improvement')
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {isSpanish ? 'Por Vencer' : 'Expiring Soon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{complianceStats.expiring}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Próximos 30 días' : 'Next 30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              {isSpanish ? 'Documentos Sensibles' : 'Sensitive Documents'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{complianceStats.sensitive}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Requieren protección especial' : 'Require special protection'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              {isSpanish ? 'Aprobaciones Pendientes' : 'Pending Approvals'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{complianceStats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">
              {isSpanish ? 'Requieren revisión' : 'Require review'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Tabs defaultValue="expiring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expiring">
            {isSpanish ? 'Documentos por Vencer' : 'Expiring Documents'}
            {complianceStats.expiring > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {complianceStats.expiring}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sensitive">
            {isSpanish ? 'Documentos Sensibles' : 'Sensitive Documents'}
          </TabsTrigger>
          <TabsTrigger value="compliance">
            {isSpanish ? 'Documentos de Cumplimiento' : 'Compliance Documents'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                {isSpanish ? 'Documentos que Vencen Pronto' : 'Documents Expiring Soon'}
              </CardTitle>
              <CardDescription>
                {isSpanish 
                  ? 'Documentos que vencen en los próximos 30 días'
                  : 'Documents expiring in the next 30 days'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expiringDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {isSpanish ? 'Sin Documentos por Vencer' : 'No Expiring Documents'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isSpanish 
                      ? 'Todos los documentos están al día'
                      : 'All documents are up to date'
                    }
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isSpanish ? 'Documento' : 'Document'}</TableHead>
                      <TableHead>{isSpanish ? 'Categoría' : 'Category'}</TableHead>
                      <TableHead>{isSpanish ? 'Vence' : 'Expires'}</TableHead>
                      <TableHead>{isSpanish ? 'Urgencia' : 'Urgency'}</TableHead>
                      <TableHead>{isSpanish ? 'Acciones' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringDocuments.map((document) => {
                      const urgency = getUrgencyLevel(document.expiration_date!);
                      return (
                        <TableRow 
                          key={document.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => onDocumentSelect(document.id)}
                          tabIndex={0}
                          aria-label={`${isSpanish ? 'Documento' : 'Document'} ${document.title} ${isSpanish ? 'vence' : 'expires'} ${formatDate(document.expiration_date!)}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              onDocumentSelect(document.id);
                              e.preventDefault();
                            }
                          }}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium">{document.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {document.file_name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{document.category}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(document.expiration_date!)}</TableCell>
                          <TableCell>
                            <Badge className={getUrgencyColor(urgency)}>
                              {getUrgencyLabel(urgency)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              {isSpanish ? 'Renovar' : 'Renew'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensitive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                {isSpanish ? 'Documentos Sensibles' : 'Sensitive Documents'}
              </CardTitle>
              <CardDescription>
                {isSpanish 
                  ? 'Documentos que contienen información confidencial'
                  : 'Documents containing confidential information'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isSpanish ? 'Documento' : 'Document'}</TableHead>
                    <TableHead>{isSpanish ? 'Categoría' : 'Category'}</TableHead>
                    <TableHead>{isSpanish ? 'Nivel de Confidencialidad' : 'Confidentiality Level'}</TableHead>
                    <TableHead>{isSpanish ? 'Último Acceso' : 'Last Accessed'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sensitiveDocuments.map((document) => (
                    <TableRow 
                      key={document.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onDocumentSelect(document.id)}
                      tabIndex={0}
                      aria-label={`${isSpanish ? 'Documento' : 'Document'} ${document.title} confidencialidad ${document.confidentiality_level}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onDocumentSelect(document.id);
                          e.preventDefault();
                        }
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-red-500" />
                          <div>
                            <div className="font-medium">{document.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {document.file_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{document.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{document.confidentiality_level}</Badge>
                      </TableCell>
                      <TableCell>
                        {document.last_accessed_at 
                          ? formatDate(document.last_accessed_at)
                          : (isSpanish ? 'Nunca' : 'Never')
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                {isSpanish ? 'Documentos de Cumplimiento' : 'Compliance Documents'}
              </CardTitle>
              <CardDescription>
                {isSpanish 
                  ? 'Todos los documentos relacionados con cumplimiento normativo'
                  : 'All documents related to regulatory compliance'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isSpanish ? 'Documento' : 'Document'}</TableHead>
                    <TableHead>{isSpanish ? 'Subcategoría' : 'Subcategory'}</TableHead>
                    <TableHead>{isSpanish ? 'Estado' : 'Status'}</TableHead>
                    <TableHead>{isSpanish ? 'Última Actualización' : 'Last Updated'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceDocuments.map((document) => (
                    <TableRow 
                      key={document.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onDocumentSelect(document.id)}
                      tabIndex={0}
                      aria-label={`${isSpanish ? 'Documento' : 'Document'} ${document.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onDocumentSelect(document.id);
                          e.preventDefault();
                        }
                      }}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{document.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {document.file_name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {document.subcategory && (
                          <Badge variant="outline">{document.subcategory}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {document.expiration_date && new Date(document.expiration_date) < new Date() ? (
                            <Badge variant="destructive">
                              {isSpanish ? 'Vencido' : 'Expired'}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              {isSpanish ? 'Vigente' : 'Current'}
                            </Badge>
                          )}
                          {document.approval_status === 'pending' && (
                            <Badge variant="outline">
                              {isSpanish ? 'Pendiente' : 'Pending'}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(document.updated_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}