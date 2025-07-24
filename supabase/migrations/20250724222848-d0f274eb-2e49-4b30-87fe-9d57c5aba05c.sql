-- Create document management system tables

-- Document folders for organization
CREATE TABLE public.document_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_folder_id UUID REFERENCES public.document_folders(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id),
  folder_path TEXT NOT NULL, -- For hierarchical queries
  description TEXT,
  folder_type TEXT NOT NULL DEFAULT 'general', -- general, customer, compliance, contracts, etc.
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system_folder BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  file_hash TEXT, -- For duplicate detection
  folder_id UUID REFERENCES public.document_folders(id),
  location_id UUID,
  
  -- Document categorization
  category TEXT NOT NULL DEFAULT 'general', -- customer_docs, compliance, contracts, invoices, policies
  subcategory TEXT,
  tags TEXT[],
  
  -- Document metadata
  document_date DATE,
  expiration_date DATE,
  language TEXT DEFAULT 'en',
  confidentiality_level TEXT NOT NULL DEFAULT 'internal', -- public, internal, confidential, restricted
  
  -- OCR and search
  extracted_text TEXT, -- OCR results
  search_vector tsvector, -- Full-text search
  
  -- Relationships
  customer_id UUID REFERENCES public.customers(id),
  package_id UUID REFERENCES public.packages(id),
  related_documents UUID[],
  
  -- Status and workflow
  status TEXT NOT NULL DEFAULT 'active', -- active, archived, deleted, pending_approval
  approval_status TEXT DEFAULT 'not_required', -- not_required, pending, approved, rejected
  is_template BOOLEAN NOT NULL DEFAULT false,
  requires_signature BOOLEAN NOT NULL DEFAULT false,
  
  -- Compliance
  retention_years INTEGER,
  retention_end_date DATE,
  is_sensitive BOOLEAN NOT NULL DEFAULT false,
  compliance_flags JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID
);

-- Document versions for version control
CREATE TABLE public.document_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  version_label TEXT, -- v1.0, v2.1, etc.
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_hash TEXT NOT NULL,
  change_summary TEXT,
  is_current_version BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Document approvals workflow
CREATE TABLE public.document_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.document_versions(id),
  workflow_name TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  approver_id UUID,
  approver_role TEXT, -- manager, admin, compliance_officer
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, skipped
  approval_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  comments TEXT,
  deadline_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Digital signatures
CREATE TABLE public.document_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.document_versions(id),
  signer_id UUID,
  signer_email TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  signature_type TEXT NOT NULL DEFAULT 'electronic', -- electronic, digital_certificate
  signature_data JSONB, -- signature image, certificate info, etc.
  ip_address INET,
  user_agent TEXT,
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_valid BOOLEAN NOT NULL DEFAULT true,
  verification_code TEXT
);

-- Document access logs for audit trail
CREATE TABLE public.document_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL, -- view, download, upload, edit, delete, share, print
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document shares for external access
CREATE TABLE public.document_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  share_token TEXT NOT NULL UNIQUE,
  share_type TEXT NOT NULL DEFAULT 'view', -- view, download, edit
  expires_at TIMESTAMP WITH TIME ZONE,
  password_hash TEXT,
  download_limit INTEGER,
  download_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  recipient_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create storage buckets for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('documents', 'documents', false),
  ('document-thumbnails', 'document-thumbnails', false);

-- Enable RLS
ALTER TABLE public.document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_folders
CREATE POLICY "Staff can manage document folders" 
ON public.document_folders FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for documents
CREATE POLICY "Staff can manage documents" 
ON public.documents FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Customers can view their own documents" 
ON public.documents FOR SELECT 
USING (
  customer_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.customers c 
    WHERE c.id = documents.customer_id 
    AND c.user_id = auth.uid()
  )
);

-- RLS Policies for document_versions
CREATE POLICY "Staff can manage document versions" 
ON public.document_versions FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for document_approvals
CREATE POLICY "Staff can manage document approvals" 
ON public.document_approvals FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for document_signatures
CREATE POLICY "Staff can manage document signatures" 
ON public.document_signatures FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for document_access_logs
CREATE POLICY "Staff can view access logs" 
ON public.document_access_logs FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create access logs" 
ON public.document_access_logs FOR INSERT 
WITH CHECK (true);

-- RLS Policies for document_shares
CREATE POLICY "Staff can manage document shares" 
ON public.document_shares FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Storage policies for documents bucket
CREATE POLICY "Staff can upload documents" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Staff can view documents" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Staff can update documents" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Staff can delete documents" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'documents' 
  AND auth.uid() IS NOT NULL
);

-- Storage policies for document-thumbnails bucket
CREATE POLICY "Staff can manage thumbnails" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'document-thumbnails' 
  AND auth.uid() IS NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_documents_folder_id ON public.documents(folder_id);
CREATE INDEX idx_documents_customer_id ON public.documents(customer_id);
CREATE INDEX idx_documents_package_id ON public.documents(package_id);
CREATE INDEX idx_documents_category ON public.documents(category);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_expiration_date ON public.documents(expiration_date);
CREATE INDEX idx_documents_file_hash ON public.documents(file_hash);
CREATE INDEX idx_documents_search_vector ON public.documents USING GIN(search_vector);
CREATE INDEX idx_document_folders_parent_id ON public.document_folders(parent_folder_id);
CREATE INDEX idx_document_folders_path ON public.document_folders(folder_path);
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_document_access_logs_document_id ON public.document_access_logs(document_id);
CREATE INDEX idx_document_access_logs_created_at ON public.document_access_logs(created_at);

-- Create triggers for updated_at
CREATE TRIGGER update_document_folders_updated_at
  BEFORE UPDATE ON public.document_folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update search vector when document text changes
CREATE OR REPLACE FUNCTION public.update_document_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.extracted_text, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(coalesce(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_document_search_vector
  BEFORE INSERT OR UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_document_search_vector();

-- Function to generate folder path
CREATE OR REPLACE FUNCTION public.update_folder_path()
RETURNS TRIGGER AS $$
DECLARE
  parent_path TEXT;
BEGIN
  IF NEW.parent_folder_id IS NULL THEN
    NEW.folder_path := NEW.name;
  ELSE
    SELECT folder_path INTO parent_path 
    FROM public.document_folders 
    WHERE id = NEW.parent_folder_id;
    NEW.folder_path := parent_path || '/' || NEW.name;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_folder_path
  BEFORE INSERT OR UPDATE ON public.document_folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_folder_path();

-- Create default system folders
INSERT INTO public.document_folders (name, folder_type, folder_path, is_system_folder) VALUES
('Customer Documents', 'customer', 'Customer Documents', true),
('Compliance Documents', 'compliance', 'Compliance Documents', true),
('Contracts & Agreements', 'contracts', 'Contracts & Agreements', true),
('Invoices & Receipts', 'invoices', 'Invoices & Receipts', true),
('Policy Documents', 'policies', 'Policy Documents', true),
('Templates', 'templates', 'Templates', true);