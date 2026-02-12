import { File, X, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClaimDocument } from '@/types/billing.types';

interface DocumentListProps {
  documents: ClaimDocument[];
  onRemove?: (docId: string) => void;
  onPreview?: (doc: ClaimDocument) => void;
  readOnly?: boolean;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function DocumentList({ documents, onRemove, onPreview, readOnly = false }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No documents attached
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
        >
          <File className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{doc.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                {doc.type}
              </Badge>
              {doc.size && <span>{formatFileSize(doc.size)}</span>}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onPreview && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPreview(doc)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
            {!readOnly && onRemove && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onRemove(doc.id)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
