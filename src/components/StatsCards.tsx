import { CheckCircle2, Clock, AlertTriangle, Target } from 'lucide-react';
import { Task } from '@/types/productivity';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  colorClass: string;
}

function StatCard({ icon, label, value, trend, colorClass }: StatCardProps) {
  return (
    <div className="glass-card p-5 hover-lift">
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl', colorClass)}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs text-success font-medium">{trend}</span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

export function StatsCards() {
  const [tasks] = useLocalStorage<Task[]>('productivity-tasks', []);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const completedToday = tasks.filter((t) => {
    const taskDate = new Date(t.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return t.completed && taskDate.getTime() === today.getTime();
  }).length;

  // Overdue = not completed AND due date is before today
  const overdueTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return !t.completed && dueDate < today;
  }).length;

  // Pending = not completed AND due date is today or future (not overdue)
  const pendingTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return !t.completed && dueDate >= today;
  }).length;

  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up">
      <StatCard
        icon={<CheckCircle2 className="w-5 h-5 text-success" />}
        label="Completed Today"
        value={completedToday}
        colorClass="bg-success/10"
      />
      <StatCard
        icon={<Target className="w-5 h-5 text-primary" />}
        label="Pending Tasks"
        value={pendingTasks}
        colorClass="bg-primary/10"
      />
      <StatCard
        icon={<Clock className="w-5 h-5 text-warning" />}
        label="High Priority"
        value={highPriorityTasks}
        colorClass="bg-warning/10"
      />
      <StatCard
        icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
        label="Overdue Tasks"
        value={overdueTasks}
        trend={overdueTasks > 0 ? '⚠️' : undefined}
        colorClass="bg-destructive/10"
      />
    </div>
  );
}