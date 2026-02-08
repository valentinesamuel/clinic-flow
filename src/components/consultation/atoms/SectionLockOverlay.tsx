import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionLockOverlayProps {
  locked: boolean;
  message?: string;
  children: React.ReactNode;
}

export function SectionLockOverlay({ locked, message = 'Add at least one diagnosis to unlock this section', children }: SectionLockOverlayProps) {
  return (
    <div className="relative">
      {children}
      {locked && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] rounded-lg flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center gap-2 text-muted-foreground bg-background/80 px-4 py-2 rounded-md border">
            <Lock className="h-4 w-4" />
            <span className="text-sm">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
