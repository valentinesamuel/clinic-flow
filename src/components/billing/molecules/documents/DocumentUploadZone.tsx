import { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface DocumentUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  multiple?: boolean;
}

export function DocumentUploadZone({
  onFilesSelected,
  acceptedTypes = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  multiple = true,
}: DocumentUploadZoneProps) {
  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList).filter(
        (f) => f.size <= maxSizeMB * 1024 * 1024
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <Card
      className="border-2 border-dashed p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground mb-1">
        Drag and drop files here, or click to browse
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Max {maxSizeMB}MB per file. Accepted: {acceptedTypes}
      </p>
      <Input
        type="file"
        multiple={multiple}
        accept={acceptedTypes}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        id="doc-upload-zone"
      />
      <Button variant="outline" size="sm" asChild>
        <label htmlFor="doc-upload-zone" className="cursor-pointer">
          Browse Files
        </label>
      </Button>
    </Card>
  );
}
