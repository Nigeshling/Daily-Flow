import { ReactNode, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExpandableCardProps {
  children: ReactNode;
  expandedContent: ReactNode;
  title: string;
  expandedTitle?: string;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
  headerRight?: ReactNode;
}

export function ExpandableCard({
  children,
  expandedContent,
  title,
  expandedTitle,
  isExpanded,
  onExpandChange,
  headerRight,
}: ExpandableCardProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        onExpandChange(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isExpanded, onExpandChange]);

  return (
    <>
      {/* Regular card with expand button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onExpandChange(true)}
          className="absolute top-4 right-4 h-7 w-7 z-10"
          aria-label="Expand"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
        {children}
      </div>

      {/* Expanded modal */}
      <Dialog open={isExpanded} onOpenChange={onExpandChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{expandedTitle || title}</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            {expandedContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
