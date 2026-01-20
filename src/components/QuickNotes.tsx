import { useState } from 'react';
import { Plus, Trash2, StickyNote, Maximize2 } from 'lucide-react';
import { Note } from '@/types/productivity';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const noteColors = [
  'bg-primary/5 border-primary/20',
  'bg-accent/5 border-accent/20',
  'bg-warning/5 border-warning/20',
  'bg-success/5 border-success/20',
];

interface QuickNotesProps {
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export function QuickNotes({ isExpanded = false, onExpandChange }: QuickNotesProps) {
  const [notes, setNotes] = useLocalStorage<Note[]>('productivity-notes', []);
  const [newNote, setNewNote] = useState('');

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note: Note = {
      id: crypto.randomUUID(),
      content: newNote.trim(),
      createdAt: new Date(),
    };

    setNotes((prev) => [note, ...prev]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const NotesContent = ({ expanded = false }: { expanded?: boolean }) => (
    <>
      <form onSubmit={addNote} className="mb-4">
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a quick note..."
            rows={expanded ? 3 : 1}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg 
                       focus-ring text-foreground placeholder:text-muted-foreground
                       transition-all duration-200 resize-none text-sm"
          />
          <button
            type="submit"
            className="p-2 bg-primary text-primary-foreground rounded-lg self-end
                       hover:shadow-glow transition-all duration-200 hover:-translate-y-0.5"
            aria-label="Add note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className={cn(
        "grid gap-2",
        expanded 
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-h-[60vh] overflow-y-auto" 
          : "grid-cols-1 sm:grid-cols-2 max-h-32 overflow-y-auto"
      )}>
        {notes.map((note, index) => (
          <div
            key={note.id}
            className={cn(
              'group relative p-3 rounded-lg border transition-all duration-200 hover:shadow-medium',
              noteColors[index % noteColors.length]
            )}
          >
            <p className={cn(
              "text-foreground pr-5 whitespace-pre-wrap",
              expanded ? "text-sm" : "text-xs line-clamp-2"
            )}>
              {note.content}
            </p>
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                         p-1 rounded text-muted-foreground hover:text-destructive 
                         hover:bg-destructive/10 transition-all duration-200"
              aria-label="Delete note"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {notes.length === 0 && (
          <div className="col-span-full text-center py-6 text-muted-foreground">
            <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No notes yet. Start capturing ideas!</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div className="glass-card p-5 animate-fade-up stagger-3 relative">
        {onExpandChange && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExpandChange(true)}
            className="absolute top-4 right-4 h-7 w-7 z-10"
            aria-label="Expand"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        )}
        
        <div className="flex items-center justify-between mb-4 pr-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Notes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Capture your thoughts
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{notes.length} notes</span>
        </div>

        <NotesContent />
      </div>

      {/* Expanded modal */}
      <Dialog open={isExpanded} onOpenChange={onExpandChange || (() => {})}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5" />
              Quick Notes
              <span className="text-sm font-normal text-muted-foreground">
                ({notes.length} notes)
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <NotesContent expanded />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
