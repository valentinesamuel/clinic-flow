import { format } from 'date-fns';
import { FileText, Download, Printer, X, ExternalLink, File, Image as ImageIcon } from 'lucide-react';
import { ClaimDocument } from '@/types/billing.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ClaimDocument | null;
}

function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function getFileIcon(filename: string) {
  const ext = getFileExtension(filename);
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
    return <ImageIcon className="h-12 w-12 text-primary" />;
  }
  return <FileText className="h-12 w-12 text-primary" />;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentPreviewModal({
  open,
  onOpenChange,
  document,
}: DocumentPreviewModalProps) {
  if (!document) return null;

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
    getFileExtension(document.name)
  );
  const isPdf = getFileExtension(document.name) === 'pdf';

  const handleDownload = () => {
    // In production, this would download the actual file
    console.log('Downloading:', document.name);
  };

  const handlePrint = () => {
    // In production, this would print the document
    console.log('Printing:', document.name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Info Card */}
          <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
            <div className="p-3 rounded-lg bg-primary/10">
              {getFileIcon(document.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{document.name}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {document.type}
                </Badge>
                {document.source && (
                  <Badge variant="secondary" className="capitalize">
                    {document.source}
                  </Badge>
                )}
              </div>
              <div className="mt-2 text-sm text-muted-foreground space-y-1">
                <p>
                  Uploaded: {format(new Date(document.uploadedAt), 'dd MMM yyyy, h:mm a')}
                </p>
                {document.size && <p>Size: {formatFileSize(document.size)}</p>}
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="rounded-lg border bg-muted/50 p-8 flex flex-col items-center justify-center min-h-[200px]">
            {isImage ? (
              <div className="text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Image preview would appear here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Connect to storage to view actual images)
                </p>
              </div>
            ) : isPdf ? (
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  PDF preview would appear here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Connect to storage to view actual PDFs)
                </p>
              </div>
            ) : (
              <div className="text-center">
                <File className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Preview not available for this file type
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Note about mock data */}
          <p className="text-xs text-muted-foreground text-center">
            This is a mock preview. In production, actual document content would be displayed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
