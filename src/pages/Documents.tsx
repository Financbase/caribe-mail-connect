import { useState } from 'react';
import { ArrowLeft, Upload, Search, Filter, FolderPlus, Grid, List, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentList } from '@/components/documents/DocumentList';
import { FolderTree } from '@/components/documents/FolderTree';
import { UploadDocumentDialog } from '@/components/documents/UploadDocumentDialog';
import { CreateFolderDialog } from '@/components/documents/CreateFolderDialog';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { DocumentSearch } from '@/components/documents/DocumentSearch';
import { ComplianceDashboard } from '@/components/documents/ComplianceDashboard';

interface DocumentsProps {
  onNavigate: (page: string) => void;
}

export default function Documents({ onNavigate }: DocumentsProps) {
  const { language } = useLanguage();
  const {
    documents,
    folders,
    loading,
    searchResults,
    searchLoading,
    fetchDocuments,
    searchDocuments,
    fullTextSearch,
    getExpiringDocuments,
    getDocumentsByCategory
  } = useDocuments();

  const [activeTab, setActiveTab] = useState('browse');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const isSpanish = language === 'es';

  const categories = [
    { id: 'customer_docs', label: isSpanish ? 'Documentos de Cliente' : 'Customer Documents' },
    { id: 'compliance', label: isSpanish ? 'Cumplimiento' : 'Compliance' },
    { id: 'contracts', label: isSpanish ? 'Contratos' : 'Contracts' },
    { id: 'invoices', label: isSpanish ? 'Facturas' : 'Invoices' },
    { id: 'policies', label: isSpanish ? 'Políticas' : 'Policies' },
    { id: 'general', label: isSpanish ? 'General' : 'General' },
  ];

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      await fullTextSearch(term);
    }
  };

  const handleCategoryFilter = async (category: string | null) => {
    setCategoryFilter(category);
    if (category) {
      await getDocumentsByCategory(category);
    } else {
      await fetchDocuments();
    }
  };

  const currentDocuments = searchTerm ? searchResults : 
                           categoryFilter ? documents.filter(d => d.category === categoryFilter) : 
                           documents;

  const stats = {
    total: documents.length,
    recent: documents.filter(d => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(d.created_at) > oneWeekAgo;
    }).length,
    expiring: 0, // This would be calculated from expiring documents
    sensitive: documents.filter(d => d.is_sensitive).length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isSpanish ? 'Volver' : 'Back'}
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isSpanish ? 'Centro de Documentos' : 'Document Center'}
            </h1>
            <p className="text-muted-foreground">
              {isSpanish 
                ? 'Gestione documentos, carpetas y cumplimiento'
                : 'Manage documents, folders, and compliance'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCreateFolderDialog(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            {isSpanish ? 'Nueva Carpeta' : 'New Folder'}
          </Button>
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isSpanish ? 'Subir Documento' : 'Upload Document'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Total de Documentos' : 'Total Documents'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Recientes (7 días)' : 'Recent (7 days)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.recent}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Por Vencer' : 'Expiring Soon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.expiring}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isSpanish ? 'Confidenciales' : 'Confidential'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.sensitive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">
            {isSpanish ? 'Explorar' : 'Browse'}
          </TabsTrigger>
          <TabsTrigger value="search">
            {isSpanish ? 'Buscar' : 'Search'}
          </TabsTrigger>
          <TabsTrigger value="compliance">
            {isSpanish ? 'Cumplimiento' : 'Compliance'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-1/4 space-y-4">
              {/* Folder Tree */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {isSpanish ? 'Carpetas' : 'Folders'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FolderTree
                    folders={folders}
                    selectedFolder={selectedFolder}
                    onFolderSelect={setSelectedFolder}
                  />
                </CardContent>
              </Card>

              {/* Category Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {isSpanish ? 'Categorías' : 'Categories'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={categoryFilter === null ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleCategoryFilter(null)}
                  >
                    {isSpanish ? 'Todas' : 'All'}
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={categoryFilter === category.id ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleCategoryFilter(category.id)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {categoryFilter && (
                    <Badge variant="secondary">
                      {categories.find(c => c.id === categoryFilter)?.label}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {currentDocuments.length} {isSpanish ? 'documentos' : 'documents'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Document Display */}
              {viewMode === 'grid' ? (
                <DocumentGrid
                  documents={currentDocuments}
                  loading={loading}
                  onDocumentSelect={setSelectedDocument}
                />
              ) : (
                <DocumentList
                  documents={currentDocuments}
                  loading={loading}
                  onDocumentSelect={setSelectedDocument}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <DocumentSearch
            onSearch={handleSearch}
            searchResults={searchResults}
            loading={searchLoading}
            onDocumentSelect={setSelectedDocument}
          />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceDashboard
            documents={documents}
            onDocumentSelect={setSelectedDocument}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <UploadDocumentDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        folders={folders}
        selectedFolder={selectedFolder}
      />

      <CreateFolderDialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
        folders={folders}
      />

      {selectedDocument && (
        <DocumentViewer
          documentId={selectedDocument}
          open={!!selectedDocument}
          onOpenChange={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}