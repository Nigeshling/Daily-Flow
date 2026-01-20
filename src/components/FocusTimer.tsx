import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, Music, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TimerSettings {
  focusTime: number;
  breakTime: number;
}

interface FocusTimerProps {
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export function FocusTimer({ isExpanded = false, onExpandChange }: FocusTimerProps) {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('timer-settings', {
    focusTime: 25,
    breakTime: 5,
  });
  const [sessionsCompleted, setSessionsCompleted] = useLocalStorage<number>('focus-sessions', 0);
  
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Temp settings for dialog
  const [tempFocusTime, setTempFocusTime] = useState(settings.focusTime.toString());
  const [tempBreakTime, setTempBreakTime] = useState(settings.breakTime.toString());

  const currentDuration = mode === 'focus' ? settings.focusTime * 60 : settings.breakTime * 60;

  const reset = useCallback(() => {
    setTimeLeft(mode === 'focus' ? settings.focusTime * 60 : settings.breakTime * 60);
    setIsRunning(false);
  }, [mode, settings]);

  const toggleMode = useCallback(() => {
    const newMode = mode === 'focus' ? 'break' : 'focus';
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? settings.focusTime * 60 : settings.breakTime * 60);
    setIsRunning(false);
  }, [mode, settings]);

  // Auto-expand when timer starts
  const handleStart = () => {
    setIsRunning(true);
    if (onExpandChange && !isExpanded) {
      onExpandChange(true);
    }
  };

  const handleToggleRunning = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      handleStart();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'focus') {
        setSessionsCompleted((prev) => prev + 1);
      }
      toggleMode();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, toggleMode, setSessionsCompleted]);

  const saveSettings = () => {
    const focusNum = parseInt(tempFocusTime) || 25;
    const breakNum = parseInt(tempBreakTime) || 5;
    
    const newSettings = {
      focusTime: Math.max(1, Math.min(120, focusNum)),
      breakTime: Math.max(1, Math.min(60, breakNum)),
    };
    
    setSettings(newSettings);
    setTimeLeft(mode === 'focus' ? newSettings.focusTime * 60 : newSettings.breakTime * 60);
    setIsRunning(false);
    setIsSettingsOpen(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  const timerSize = isExpanded ? 'w-40 h-40' : 'w-20 h-20';
  const timerTextSize = isExpanded ? 'text-4xl' : 'text-lg';

  const TimerContent = () => (
    <>
      {/* Timer Display */}
      <div className={`flex items-center justify-center ${isExpanded ? 'my-8' : 'my-3'}`}>
        <div className={`relative ${timerSize}`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={mode === 'focus' ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${timerTextSize} font-bold text-foreground tabular-nums`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`flex items-center justify-center gap-2 ${isExpanded ? 'gap-4' : ''}`}>
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="rounded-full"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          size={isExpanded ? 'lg' : 'default'}
          onClick={handleToggleRunning}
          className={`rounded-full ${isExpanded ? 'px-10' : 'px-6'} ${
            mode === 'focus' 
              ? 'bg-primary hover:bg-primary/90' 
              : 'bg-accent hover:bg-accent/90'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 mr-1.5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Start
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleMode}
          className="rounded-full"
          aria-label={`Switch to ${mode === 'focus' ? 'break' : 'focus'} mode`}
        >
          {mode === 'focus' ? (
            <Coffee className="w-4 h-4" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Music Option - Beta (only in expanded view) */}
      {isExpanded && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Focus Music</span>
              <Badge variant="secondary" className="text-xs">Beta</Badge>
            </div>
            <Button
              variant={isMusicPlaying ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsMusicPlaying(!isMusicPlaying)}
              className="gap-2"
            >
              {isMusicPlaying ? (
                <>
                  <Pause className="w-3 h-3" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Play
                </>
              )}
            </Button>
          </div>
          {isMusicPlaying && (
            <p className="text-xs text-muted-foreground mt-2">
              🎵 Lo-fi beats playing... (Coming soon - audio implementation pending)
            </p>
          )}
        </div>
      )}
    </>
  );

  if (isExpanded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${mode === 'focus' ? 'bg-primary/10' : 'bg-accent/10'}`}>
              {mode === 'focus' ? (
                <Brain className={`w-5 h-5 ${mode === 'focus' ? 'text-primary' : ''}`} />
              ) : (
                <Coffee className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground capitalize">
                {mode} Time
              </h2>
              <p className="text-sm text-muted-foreground">
                {sessionsCompleted} sessions completed today
              </p>
            </div>
          </div>
          
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Focus Duration (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={tempFocusTime}
                    onChange={(e) => setTempFocusTime(e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Break Duration (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={tempBreakTime}
                    onChange={(e) => setTempBreakTime(e.target.value)}
                    placeholder="5"
                  />
                </div>
                <Button onClick={saveSettings} className="w-full">
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TimerContent />
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-fade-up stagger-2 relative">
      {onExpandChange && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onExpandChange(true)}
          className="absolute top-3 right-12 h-7 w-7 z-10"
          aria-label="Expand"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${mode === 'focus' ? 'bg-primary/10' : 'bg-accent/10'}`}>
            {mode === 'focus' ? (
              <Brain className={`w-4 h-4 ${mode === 'focus' ? 'text-primary' : ''}`} />
            ) : (
              <Coffee className="w-4 h-4 text-accent" />
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground capitalize">
              {mode} Time
            </h2>
            <p className="text-xs text-muted-foreground">
              {sessionsCompleted} sessions today
            </p>
          </div>
        </div>
        
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Focus Duration (minutes)</Label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={tempFocusTime}
                  onChange={(e) => setTempFocusTime(e.target.value)}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label>Break Duration (minutes)</Label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={tempBreakTime}
                  onChange={(e) => setTempBreakTime(e.target.value)}
                  placeholder="5"
                />
              </div>
              <Button onClick={saveSettings} className="w-full">
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <TimerContent />
    </div>
  );
}
