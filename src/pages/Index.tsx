import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { StatsCards } from '@/components/StatsCards';
import { TaskList } from '@/components/TaskList';
import { FocusTimer } from '@/components/FocusTimer';
import { QuickNotes } from '@/components/QuickNotes';
import { WaterTracker } from '@/components/WaterTracker';
import { SleepTracker } from '@/components/SleepTracker';
import { FoodTracker } from '@/components/FoodTracker';
import { FitnessTracker } from '@/components/FitnessTracker';
import { EnhancedSummary } from '@/components/EnhancedSummary';
import { getDailyQuote } from '@/data/quotes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task } from '@/types/productivity';
import { ListTodo, Heart, BarChart3, Quote, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [quote] = useState(() => getDailyQuote());
  const [tasks] = useLocalStorage<Task[]>('productivity-tasks', []);
  
  // Calculate overdue tasks (tasks with due date before today that aren't completed)
  const overdueTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return !t.completed && dueDate < today;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at top right, hsl(12 76% 61% / 0.08), transparent 50%), radial-gradient(ellipse at bottom left, hsl(200 60% 50% / 0.06), transparent 50%)',
        }}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <DashboardHeader />

        {/* Quote of the Day */}
        <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border/50 animate-fade-up">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm italic text-foreground">"{quote.text}"</p>
              <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
            </div>
          </div>
        </div>

        {/* Overdue Alert */}
        {overdueTasks > 0 && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 animate-fade-up">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive font-medium">
              You have {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''} that need attention!
            </p>
          </div>
        )}

        <Tabs defaultValue="tasks" className="animate-fade-up">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="mt-0">
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TaskList />
              <div className="space-y-6">
                <FocusTimer />
                <QuickNotes />
              </div>
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WaterTracker />
              <SleepTracker />
              <FoodTracker />
              <FitnessTracker />
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-0">
            <EnhancedSummary />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Stay focused. Stay healthy. Stay productive. ✨
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
