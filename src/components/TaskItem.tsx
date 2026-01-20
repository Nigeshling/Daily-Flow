import { Check, Trash2 } from 'lucide-react';
import { Task } from '@/types/productivity';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isOverdue?: boolean;
}

const priorityStyles = {
  low: 'border-l-muted-foreground/30',
  medium: 'border-l-warning',
  high: 'border-l-primary',
};

export function TaskItem({ task, onToggle, onDelete, isOverdue }: TaskItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-4 bg-card rounded-xl border-l-4 transition-all duration-300',
        'hover:shadow-medium hover:-translate-y-0.5',
        isOverdue ? 'border-l-destructive bg-destructive/5' : priorityStyles[task.priority],
        task.completed && 'opacity-60'
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          'task-checkbox flex-shrink-0',
          task.completed && 'completed'
        )}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
      </button>

      <span
        className={cn(
          'flex-1 text-foreground transition-all duration-200',
          task.completed && 'line-through text-muted-foreground'
        )}
      >
        {task.title}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground 
                   hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
