import { Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function DashboardHeader() {
  const now = new Date();
  const hour = now.getHours();
  
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="mb-8 animate-fade-up">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {greeting}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg pl-14">
            {formattedDate}
          </p>
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
