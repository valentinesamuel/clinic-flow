import { Button } from '@/components/ui/button';
import { Save, CheckCircle, X } from 'lucide-react';

interface EditModeBannerProps {
  title: string;
  subtitle?: string;
  onCancel: () => void;
  onSaveDraft?: () => void;
  onFinalize?: () => void;
  saveDraftDisabled?: boolean;
  finalizeDisabled?: boolean;
  finalizeLabel?: string;
}

export function EditModeBanner({
  title,
  subtitle,
  onCancel,
  onSaveDraft,
  onFinalize,
  saveDraftDisabled,
  finalizeDisabled,
  finalizeLabel = 'Finalize',
}: EditModeBannerProps) {
  return (
    <div className="sticky top-0 z-30 bg-blue-50 border-b border-blue-200 dark:bg-blue-950 dark:border-blue-800 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold truncate">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          {onSaveDraft && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              disabled={saveDraftDisabled}
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save Draft
            </Button>
          )}
          {onFinalize && (
            <Button
              size="sm"
              onClick={onFinalize}
              disabled={finalizeDisabled}
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              {finalizeLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
