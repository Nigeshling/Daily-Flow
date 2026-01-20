import { useState } from 'react';
import { Plus, CalendarIcon, Tag } from 'lucide-react';
import { format, isSameDay, startOfDay } from 'date-fns';
import { Task, TaskType } from '@/types/productivity';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateTaskDialogProps {
  taskTypes: TaskType[];
  onAddTask: (task: Task) => void;
  onAddTaskType: (name: string, color: string) => void;
  fullWidth?: boolean;
}

export function CreateTaskDialog({ taskTypes, onAddTask, onAddTaskType, fullWidth }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<string>('');
  const [showNewType, setShowNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#6366f1');

  const today = startOfDay(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      priority,
      createdAt: new Date(),
      dueDate: startOfDay(dueDate),
      taskType: selectedType || undefined,
    };

    onAddTask(task);
    resetForm();
    setOpen(false);
  };

  const handleAddNewType = () => {
    if (!newTypeName.trim()) return;
    onAddTaskType(newTypeName.trim(), newTypeColor);
    setNewTypeName('');
    setNewTypeColor('#6366f1');
    setShowNewType(false);
  };

  const resetForm = () => {
    setTitle('');
    setPriority('medium');
    setDueDate(new Date());
    setSelectedType('');
    setShowNewType(false);
    setNewTypeName('');
    setNewTypeColor('#6366f1');
  };

  const colorOptions = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f43f5e', // rose
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#3b82f6', // blue
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "bg-primary text-primary-foreground rounded-xl hover:shadow-glow transition-all duration-200 hover:-translate-y-0.5",
            fullWidth 
              ? "w-full px-4 py-3 flex items-center justify-center gap-2 font-medium" 
              : "p-3"
          )}
          aria-label="Add task"
        >
          <Plus className="w-5 h-5" />
          {fullWidth && <span>Add a new task!</span>}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task with a date, priority, and type.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full"
              autoFocus
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !isSameDay(dueDate, today) && "text-primary"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isSameDay(dueDate, today) ? 'Today' : format(dueDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200',
                    priority === p
                      ? p === 'high'
                        ? 'bg-primary text-primary-foreground'
                        : p === 'medium'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-muted text-muted-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Task Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Task Type
            </Label>
            {!showNewType ? (
              <div className="flex gap-2">
                <Select
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value === '__none__' ? '' : value)}
                >
                  <SelectTrigger className="flex-1 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {taskTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                          {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowNewType(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <Input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Type name (e.g., Work, Personal)"
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTypeColor(color)}
                      className={cn(
                        'w-6 h-6 rounded-full transition-transform',
                        newTypeColor === color && 'ring-2 ring-offset-2 ring-primary scale-110'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddNewType}
                    disabled={!newTypeName.trim()}
                  >
                    Add Type
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowNewType(false);
                      setNewTypeName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
