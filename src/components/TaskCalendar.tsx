import { useState, useMemo } from 'react';
import { format, isSameDay, startOfDay, parseISO } from 'date-fns';
import { CalendarDays, X, Plus, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Task, TaskType } from '@/types/productivity';
import { usHolidays, isHoliday } from '@/data/holidays';
import { cn } from '@/lib/utils';

interface TaskCalendarProps {
  tasks: Task[];
  taskTypes: TaskType[];
  onAddTaskType: (name: string, color: string) => void;
  onDeleteTaskType: (id: string) => void;
}

const defaultColors = [
  'hsl(var(--primary))',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(262, 83%, 58%)',
  'hsl(199, 89%, 48%)',
];

export function TaskCalendar({ tasks, taskTypes, onAddTaskType, onDeleteTaskType }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newTypeName, setNewTypeName] = useState('');
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);
  const [showTypeForm, setShowTypeForm] = useState(false);

  const tasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter(task => isSameDay(new Date(task.dueDate), selectedDate));
  }, [tasks, selectedDate]);

  const holidayForSelectedDate = useMemo(() => {
    if (!selectedDate) return undefined;
    return isHoliday(selectedDate);
  }, [selectedDate]);

  const taskDates = useMemo(() => {
    return tasks.map(task => startOfDay(new Date(task.dueDate)));
  }, [tasks]);

  const holidayDates = useMemo(() => {
    return usHolidays.map(h => parseISO(h.date));
  }, []);

  const handleAddType = () => {
    if (!newTypeName.trim()) return;
    onAddTaskType(newTypeName.trim(), selectedColor);
    setNewTypeName('');
    setShowTypeForm(false);
  };

  const getTaskTypeInfo = (typeId?: string) => {
    if (!typeId) return null;
    return taskTypes.find(t => t.id === typeId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <CalendarDays className="w-4 h-4" />
          <span className="hidden sm:inline">Calendar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Task Calendar</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Calendar */}
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasTask: taskDates,
                holiday: holidayDates,
              }}
              modifiersStyles={{
                hasTask: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationColor: 'hsl(var(--primary))',
                  textUnderlineOffset: '3px',
                },
                holiday: {
                  color: 'hsl(0, 84%, 60%)',
                },
              }}
            />
          </div>

          {/* Selected Date Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
              </h3>
              
              {holidayForSelectedDate && (
                <Badge variant="destructive" className="mb-2">
                  🎉 {holidayForSelectedDate.name}
                </Badge>
              )}

              <ScrollArea className="h-[150px]">
                {tasksForSelectedDate.length > 0 ? (
                  <div className="space-y-2">
                    {tasksForSelectedDate.map(task => {
                      const typeInfo = getTaskTypeInfo(task.taskType);
                      return (
                        <div
                          key={task.id}
                          className={cn(
                            "p-2 rounded-lg border text-sm",
                            task.completed && "opacity-50 line-through"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {typeInfo && (
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: typeInfo.color }}
                              />
                            )}
                            <span className="flex-1">{task.title}</span>
                            <Badge
                              variant={
                                task.priority === 'high' ? 'destructive' :
                                task.priority === 'medium' ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          {typeInfo && (
                            <span className="text-xs text-muted-foreground ml-4">
                              {typeInfo.name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tasks for this date</p>
                )}
              </ScrollArea>
            </div>

            {/* Task Types Management */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  Task Types
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTypeForm(!showTypeForm)}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              {showTypeForm && (
                <div className="space-y-2 mb-3 p-2 bg-muted rounded-lg">
                  <Input
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="Type name..."
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center gap-1.5">
                    {defaultColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 transition-transform",
                          selectedColor === color ? "border-foreground scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <Button size="sm" className="ml-auto h-6 text-xs" onClick={handleAddType}>
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <ScrollArea className="h-[80px]">
                <div className="space-y-1">
                  {taskTypes.map(type => (
                    <div key={type.id} className="flex items-center justify-between p-1.5 rounded hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-sm">{type.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onDeleteTaskType(type.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {taskTypes.length === 0 && (
                    <p className="text-xs text-muted-foreground">No custom types yet</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
