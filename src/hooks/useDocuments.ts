import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Database } from '@/integrations/supabase/types';

type DocumentFolder = Database['public']['Tables']['document_folders']['Row'];
type Document = Database['public']['Tables']['documents']['Row'];
type DocumentVersion = Database['public']['Tables']['document_versions']['Row'];
type DocumentApproval = Database['public']['Tables']['document_approvals']['Row'];

type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
type DocumentFolderInsert = Database['public']['Tables']['document_folders']['Insert'];

export type { DocumentFolder, Document, DocumentVersion, DocumentApproval };

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [approvals, setApprovals] = useState<DocumentApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();

  // Fetch documents
  const fetchDocuments = async (folderId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('documents')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (folderId) {
        query = query.eq('folder_id', folderId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: unknown) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch folders
  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('document_folders')
        .select('*')
        .order('folder_path');

      if (error) throw error;
      setFolders(data || []);
    } catch (error: unknown) {
      console.error('Error fetching folders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch folders',
        variant: 'destructive',
      });
    }
  };

  // Search documents
  const searchDocuments = async (searchTerm: string) => {
    try {
      setSearchLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .or(`title.ilike.%${searchTerm}%, extracted_text.ilike.%${searchTerm}%, tags.cs.{${searchTerm}}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: unknown) {
      console.error('Error searching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to search documents',
        variant: 'destructive',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Full-text search using PostgreSQL
  const fullTextSearch = async (searchTerm: string) => {
    try {
      setSearchLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .textSearch('search_vector', searchTerm)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: unknown) {
      console.error('Error in full-text search:', error);
      // Fallback to regular search
      searchDocuments(searchTerm);
    } finally {
      setSearchLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (
    file: File,
    metadata: Partial<Document>
  ): Promise<string | null> => {
    try {
      setLoading(true);

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const documentData = {
        title: metadata.title || file.name,
        file_name: file.name,
        file_path: uploadData.path,
        file_size_bytes: file.size,
        content_type: file.type,
        category: metadata.category || 'general',
        confidentiality_level: metadata.confidentiality_level || 'internal',
        language: metadata.language || 'en',
        is_template: metadata.is_template || false,
        requires_signature: metadata.requires_signature || false,
        is_sensitive: metadata.is_sensitive || false,
        folder_id: metadata.folder_id,
        customer_id: metadata.customer_id,
        package_id: metadata.package_id,
        tags: metadata.tags || [],
        document_date: metadata.document_date,
        expiration_date: metadata.expiration_date,
        retention_years: metadata.retention_years,
        compliance_flags: metadata.compliance_flags || {},
      };

      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (docError) throw docError;

      // Log access
      await logDocumentAccess(docData.id, 'upload');

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });

      // Refresh documents
      await fetchDocuments();
      return docData.id;
    } catch (error: unknown) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create folder
  const createFolder = async (folderData: DocumentFolderInsert): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('document_folders')
        .insert(folderData);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Folder created successfully',
      });

      await fetchFolders();
      return true;
    } catch (error: unknown) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Update document
  const updateDocument = async (id: string, updates: Partial<Document>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await logDocumentAccess(id, 'edit');
      await fetchDocuments();
      
      toast({
        title: 'Success',
        description: 'Document updated successfully',
      });

      return true;
    } catch (error: unknown) {
      console.error('Error updating document:', error);
      toast({
        title: 'Error',
        description: 'Failed to update document',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete document
  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      // Soft delete by updating status
      const { error } = await supabase
        .from('documents')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) throw error;

      await logDocumentAccess(id, 'delete');
      await fetchDocuments();
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });

      return true;
    } catch (error: unknown) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Get document URL for viewing/downloading
  const getDocumentUrl = async (filePath: string, download = false): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600, { download }); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error: unknown) {
      console.error('Error getting document URL:', error);
      return null;
    }
  };

  // Log document access
  const logDocumentAccess = async (documentId: string, action: string, details?: unknown) => {
    try {
      await supabase
        .from('document_access_logs')
        .insert({
          document_id: documentId,
          action,
          details: details || {},
          ip_address: '127.0.0.1', // In a real app, get actual IP
          user_agent: navigator.userAgent,
        });
    } catch (error) {
      console.error('Error logging document access:', error);
    }
  };

  // Get documents expiring soon
  const getExpiringDocuments = async (days = 30) => {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('status', 'active')
        .not('expiration_date', 'is', null)
        .lte('expiration_date', futureDate.toISOString().split('T')[0])
        .order('expiration_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: unknown) {
      console.error('Error fetching expiring documents:', error);
      return [];
    }
  };

  // Get documents by category
  const getDocumentsByCategory = async (category: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('category', category)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: unknown) {
      console.error('Error fetching documents by category:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get documents for customer
  const getCustomerDocuments = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('customer_id', customerId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: unknown) {
      console.error('Error fetching customer documents:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchFolders();
    fetchDocuments();
  }, [fetchFolders, fetchDocuments]);

  return {
    documents,
    folders,
    versions,
    approvals,
    loading,
    searchResults,
    searchLoading,
    fetchDocuments,
    fetchFolders,
    searchDocuments,
    fullTextSearch,
    uploadDocument,
    createFolder,
    updateDocument,
    deleteDocument,
    getDocumentUrl,
    logDocumentAccess,
    getExpiringDocuments,
    getDocumentsByCategory,
    getCustomerDocuments,
  };
}