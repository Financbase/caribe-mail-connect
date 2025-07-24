import { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DocumentFolder } from '@/hooks/useDocuments';

interface FolderTreeProps {
  folders: DocumentFolder[];
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

interface FolderNodeProps {
  folder: DocumentFolder;
  children: DocumentFolder[];
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (folderId: string) => void;
  onToggle: (folderId: string) => void;
  level: number;
}

function FolderNode({ 
  folder, 
  children, 
  isSelected, 
  isExpanded, 
  onSelect, 
  onToggle, 
  level 
}: FolderNodeProps) {
  const hasChildren = children.length > 0;
  const paddingLeft = level * 16;

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "w-full justify-start h-8 px-2 font-normal",
          isSelected && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
        onClick={() => onSelect(folder.id)}
      >
        {hasChildren && (
          <button
            className="mr-1 p-0.5 hover:bg-muted rounded"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(folder.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        
        {isExpanded || isSelected ? (
          <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
        ) : (
          <Folder className="h-4 w-4 mr-2 text-blue-500" />
        )}
        
        <span className="truncate">{folder.name}</span>
        
        {folder.is_system_folder && (
          <span className="ml-auto text-xs text-muted-foreground">🔒</span>
        )}
      </Button>
      
      {isExpanded && hasChildren && (
        <div>
          {children.map((childFolder) => (
            <FolderTreeNode
              key={childFolder.id}
              folder={childFolder}
              folders={[]}
              selectedFolder={null}
              onFolderSelect={() => {}}
              expandedFolders={new Set()}
              onToggleFolder={() => {}}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeNodeProps {
  folder: DocumentFolder;
  folders: DocumentFolder[];
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (folderId: string) => void;
  level: number;
}

function FolderTreeNode({
  folder,
  folders,
  selectedFolder,
  onFolderSelect,
  expandedFolders,
  onToggleFolder,
  level
}: FolderTreeNodeProps) {
  const children = folders.filter(f => f.parent_folder_id === folder.id);
  const isSelected = selectedFolder === folder.id;
  const isExpanded = expandedFolders.has(folder.id);

  return (
    <FolderNode
      folder={folder}
      children={children}
      isSelected={isSelected}
      isExpanded={isExpanded}
      onSelect={onFolderSelect}
      onToggle={onToggleFolder}
      level={level}
    />
  );
}

export function FolderTree({ folders, selectedFolder, onFolderSelect }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleToggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Get root folders (no parent)
  const rootFolders = folders.filter(f => !f.parent_folder_id);

  return (
    <div className="space-y-1">
      {/* All Documents option */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "w-full justify-start h-8 px-2 font-normal",
          selectedFolder === null && "bg-accent text-accent-foreground"
        )}
        onClick={() => onFolderSelect(null)}
      >
        <Folder className="h-4 w-4 mr-2 text-blue-500" />
        All Documents
      </Button>

      {/* Folder tree */}
      {rootFolders.map((folder) => (
        <FolderTreeNode
          key={folder.id}
          folder={folder}
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={onFolderSelect}
          expandedFolders={expandedFolders}
          onToggleFolder={handleToggleFolder}
          level={0}
        />
      ))}
    </div>
  );
}