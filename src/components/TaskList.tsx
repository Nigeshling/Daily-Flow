import { useState } from 'react';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { isSameDay, startOfDay, addDays, subDays, format, isToday, isBefore } from 'date-fns';
import { Task, TaskType } from '@/types/productivity';
import { TaskItem } from './TaskItem';
import { TaskCalendar } from './TaskCalendar';
import { CreateTaskDialog } from './CreateTaskDialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';

export function TaskList() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('productivity-tasks', []);
  const [taskTypes, setTaskTypes] = useLocalStorage<TaskType[]>('productivity-task-types', []);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addTaskType = (name: string, color: string) => {
    const newType: TaskType = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setTaskTypes((prev) => [...prev, newType]);
  };

  const deleteTaskType = (id: string) => {
    setTaskTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const goToPreviousDay = () => setSelectedDate(prev => subDays(prev, 1));
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

  const selectedDay = startOfDay(selectedDate);
  const today = startOfDay(new Date());
  const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dueDate), selectedDay));
  const completedCount = dayTasks.filter((t) => t.completed).length;
  
  // Separate overdue from pending - overdue are past due date and not completed
  const overdueTasks = dayTasks.filter((t) => !t.completed && isBefore(startOfDay(new Date(t.dueDate)), today));
  const pendingTasks = dayTasks.filter((t) => !t.completed && !isBefore(startOfDay(new Date(t.dueDate)), today));
  const completedTasks = dayTasks.filter((t) => t.completed);
  const overdueCount = overdueTasks.length;

  return (
    <div className="glass-card p-6 animate-fade-up stagger-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goToPreviousDay} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center min-w-[140px]">
            <h2 className="text-xl font-semibold text-foreground">
              {isToday(selectedDate) ? "Today's Tasks" : format(selectedDate, 'EEE, MMM d')}
            </h2>
            {!isToday(selectedDate) && (
              <button 
                onClick={goToToday}
                className="text-xs text-primary hover:underline"
              >
                Go to today
              </button>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={goToNextDay} className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>{completedCount}</span>
          </div>
          {overdueCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span>{overdueCount}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Circle className="w-4 h-4" />
            <span>{pendingTasks.length}</span>
          </div>
          <TaskCalendar
            tasks={tasks}
            taskTypes={taskTypes}
            onAddTaskType={addTaskType}
            onDeleteTaskType={deleteTaskType}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {completedCount} of {dayTasks.length} completed
      </p>

      {/* Add Task Button */}
      <div className="mb-6">
        <CreateTaskDialog
          taskTypes={taskTypes}
          onAddTask={addTask}
          onAddTaskType={addTaskType}
          fullWidth
        />
      </div>

      <div className="space-y-3">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div className="pb-3 mb-3 border-b border-destructive/20">
            <p className="text-sm text-destructive font-medium mb-3 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Overdue
            </p>
            {overdueTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slide-in mb-2"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TaskItem task={task} onToggle={toggleTask} onDelete={deleteTask} isOverdue />
              </div>
            ))}
          </div>
        )}

        {/* Pending Tasks */}
        {pendingTasks.map((task, index) => (
          <div
            key={task.id}
            className="animate-slide-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <TaskItem task={task} onToggle={toggleTask} onDelete={deleteTask} />
          </div>
        ))}

        {completedTasks.length > 0 && (
          <div className="pt-4 border-t border-border mt-4">
            <p className="text-sm text-muted-foreground mb-3">Completed</p>
            {completedTasks.map((task) => (
              <div key={task.id} className="mb-2">
                <TaskItem task={task} onToggle={toggleTask} onDelete={deleteTask} />
              </div>
            ))}
          </div>
        )}

        {dayTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Circle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No tasks for {isToday(selectedDate) ? 'today' : format(selectedDate, 'MMM d')}. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
