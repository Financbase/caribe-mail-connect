import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDocuments } from '@/hooks/useDocuments';
import type { DocumentFolder } from '@/hooks/useDocuments';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: DocumentFolder[];
  selectedFolder?: string | null;
}

interface FileWithMetadata {
  file: File;
  title: string;
  category: string;
  tags: string[];
  isTemplate: boolean;
  isSensitive: boolean;
  requiresSignature: boolean;
  expirationDate?: string;
  retentionYears?: number;
}

export function UploadDocumentDialog({ 
  open, 
  onOpenChange, 
  folders, 
  selectedFolder 
}: UploadDocumentDialogProps) {
  const { language } = useLanguage();
  const { uploadDocument } = useDocuments();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [folderId, setFolderId] = useState(selectedFolder || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newTag, setNewTag] = useState('');

  const isSpanish = language === 'es';

  const categories = [
    { value: 'general', label: isSpanish ? 'General' : 'General' },
    { value: 'customer_docs', label: isSpanish ? 'Documentos de Cliente' : 'Customer Documents' },
    { value: 'compliance', label: isSpanish ? 'Cumplimiento' : 'Compliance' },
    { value: 'contracts', label: isSpanish ? 'Contratos' : 'Contracts' },
    { value: 'invoices', label: isSpanish ? 'Facturas' : 'Invoices' },
    { value: 'policies', label: isSpanish ? 'Políticas' : 'Policies' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      file,
      title: file.name,
      category: 'general',
      tags: [],
      isTemplate: false,
      isSensitive: false,
      requiresSignature: false,
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const newFiles = droppedFiles.map(file => ({
      file,
      title: file.name,
      category: 'general',
      tags: [],
      isTemplate: false,
      isSensitive: false,
      requiresSignature: false,
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const updateFileMetadata = (index: number, updates: Partial<FileWithMetadata>) => {
    setFiles(files.map((file, i) => i === index ? { ...file, ...updates } : file));
  };

  const addTag = (index: number) => {
    if (newTag.trim()) {
      const file = files[index];
      updateFileMetadata(index, {
        tags: [...file.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (fileIndex: number, tagIndex: number) => {
    const file = files[fileIndex];
    updateFileMetadata(fileIndex, {
      tags: file.tags.filter((_, i) => i !== tagIndex)
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        
        await uploadDocument(fileData.file, {
          title: fileData.title,
          category: fileData.category,
          folder_id: folderId || undefined,
          tags: fileData.tags,
          is_template: fileData.isTemplate,
          is_sensitive: fileData.isSensitive,
          requires_signature: fileData.requiresSignature,
          expiration_date: fileData.expirationDate,
          retention_years: fileData.retentionYears,
        });

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      toast({
        title: isSpanish ? 'Éxito' : 'Success',
        description: isSpanish 
          ? `${files.length} documento(s) subido(s) exitosamente`
          : `${files.length} document(s) uploaded successfully`,
      });

      // Reset form
      setFiles([]);
      setFolderId(selectedFolder || '');
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: isSpanish ? 'Error' : 'Error',
        description: isSpanish 
          ? 'Error al subir documentos'
          : 'Failed to upload documents',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isSpanish ? 'Subir Documentos' : 'Upload Documents'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Drop Zone */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isSpanish ? 'Arrastra archivos aquí' : 'Drag files here'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isSpanish 
                ? 'O haz clic para seleccionar archivos'
                : 'Or click to select files'
              }
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              {isSpanish ? 'Seleccionar Archivos' : 'Select Files'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
            />
          </div>

          {/* Global Settings */}
          {files.length > 0 && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">
                {isSpanish ? 'Configuración General' : 'Global Settings'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="folder">
                    {isSpanish ? 'Carpeta de Destino' : 'Target Folder'}
                  </Label>
                  <Select value={folderId} onValueChange={setFolderId}>
                    <SelectTrigger>
                      <SelectValue placeholder={isSpanish ? 'Seleccionar carpeta' : 'Select folder'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        {isSpanish ? 'Raíz' : 'Root'}
                      </SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.folder_path}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">
                {isSpanish ? 'Archivos Seleccionados' : 'Selected Files'} ({files.length})
              </h4>
              
              {files.map((fileData, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{fileData.file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${index}`}>
                        {isSpanish ? 'Título' : 'Title'}
                      </Label>
                      <Input
                        id={`title-${index}`}
                        value={fileData.title}
                        onChange={(e) => updateFileMetadata(index, { title: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`category-${index}`}>
                        {isSpanish ? 'Categoría' : 'Category'}
                      </Label>
                      <Select
                        value={fileData.category}
                        onValueChange={(value) => updateFileMetadata(index, { category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`tags-${index}`}>
                        {isSpanish ? 'Etiquetas' : 'Tags'}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`tags-${index}`}
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder={isSpanish ? 'Agregar etiqueta' : 'Add tag'}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag(index);
                            }
                          }}
                        />
                        <Button size="sm" onClick={() => addTag(index)}>
                          {isSpanish ? 'Agregar' : 'Add'}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {fileData.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                            <button
                              onClick={() => removeTag(index, tagIndex)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`expiration-${index}`}>
                        {isSpanish ? 'Fecha de Vencimiento' : 'Expiration Date'}
                      </Label>
                      <Input
                        id={`expiration-${index}`}
                        type="date"
                        value={fileData.expirationDate || ''}
                        onChange={(e) => updateFileMetadata(index, { expirationDate: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Switches */}
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`template-${index}`}
                        checked={fileData.isTemplate}
                        onCheckedChange={(checked) => updateFileMetadata(index, { isTemplate: checked })}
                      />
                      <Label htmlFor={`template-${index}`}>
                        {isSpanish ? 'Es Plantilla' : 'Is Template'}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`sensitive-${index}`}
                        checked={fileData.isSensitive}
                        onCheckedChange={(checked) => updateFileMetadata(index, { isSensitive: checked })}
                      />
                      <Label htmlFor={`sensitive-${index}`}>
                        {isSpanish ? 'Información Sensible' : 'Sensitive Information'}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`signature-${index}`}
                        checked={fileData.requiresSignature}
                        onCheckedChange={(checked) => updateFileMetadata(index, { requiresSignature: checked })}
                      />
                      <Label htmlFor={`signature-${index}`}>
                        {isSpanish ? 'Requiere Firma' : 'Requires Signature'}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isSpanish ? 'Subiendo...' : 'Uploading...'}</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
              {isSpanish ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={files.length === 0 || uploading}
            >
              {uploading 
                ? (isSpanish ? 'Subiendo...' : 'Uploading...')
                : (isSpanish ? `Subir ${files.length} archivo(s)` : `Upload ${files.length} file(s)`)
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}