import { useState } from 'react';
import { Moon, Plus, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SleepLog, HealthGoals } from '@/types/health';
import { format, parseISO, differenceInMinutes } from 'date-fns';

export function SleepTracker() {
  const [sleepLogs, setSleepLogs] = useLocalStorage<SleepLog[]>('sleep-logs', []);
  const [goals, setGoals] = useLocalStorage<HealthGoals>('health-goals', {
    dailyWater: 2500,
    dailyCalories: 2000,
    sleepHours: 8,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [quality, setQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
  const [goalHours, setGoalHours] = useState(goals.sleepHours.toString());

  const today = new Date().toISOString().split('T')[0];
  const todayLog = sleepLogs.find((log) => log.date === today);

  // Calculate sleep duration
  const calculateDuration = (bed: string, wake: string): number => {
    const [bedH, bedM] = bed.split(':').map(Number);
    const [wakeH, wakeM] = wake.split(':').map(Number);

    let bedMinutes = bedH * 60 + bedM;
    let wakeMinutes = wakeH * 60 + wakeM;

    // If wake time is earlier than bedtime, assume next day
    if (wakeMinutes <= bedMinutes) {
      wakeMinutes += 24 * 60;
    }

    return (wakeMinutes - bedMinutes) / 60;
  };

  const addSleepLog = () => {
    const duration = calculateDuration(bedtime, wakeTime);
    const newLog: SleepLog = {
      id: crypto.randomUUID(),
      bedtime,
      wakeTime,
      date: today,
      duration,
      quality,
    };

    // Replace if already exists for today
    const filteredLogs = sleepLogs.filter((log) => log.date !== today);
    setSleepLogs([...filteredLogs, newLog]);
    setIsAddDialogOpen(false);
  };

  const deleteTodayLog = () => {
    setSleepLogs(sleepLogs.filter((log) => log.date !== today));
  };

  const saveGoal = () => {
    const newGoal = parseFloat(goalHours);
    if (newGoal > 0) {
      setGoals({ ...goals, sleepHours: newGoal });
      setIsGoalDialogOpen(false);
    }
  };

  const progress = todayLog
    ? Math.min((todayLog.duration / goals.sleepHours) * 100, 100)
    : 0;

  const qualityColors = {
    poor: 'text-destructive',
    fair: 'text-warning',
    good: 'text-success',
    excellent: 'text-primary',
  };

  const qualityEmoji = {
    poor: '😴',
    fair: '😐',
    good: '😊',
    excellent: '🌟',
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Moon className="w-5 h-5 text-indigo-500" />
            </div>
            Sleep Tracker
          </CardTitle>
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Target className="w-4 h-4" />
                Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Sleep Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Daily Sleep Goal (hours)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={goalHours}
                    onChange={(e) => setGoalHours(e.target.value)}
                    placeholder="8"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 7-9 hours for adults
                  </p>
                </div>
                <Button onClick={saveGoal} className="w-full">
                  Save Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayLog ? (
          <>
            {/* Today's Sleep Display */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-foreground">
                {todayLog.duration.toFixed(1)}
                <span className="text-lg text-muted-foreground font-normal">
                  /{goals.sleepHours}h
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-center gap-2">
                <span className={qualityColors[todayLog.quality || 'good']}>
                  {qualityEmoji[todayLog.quality || 'good']} {todayLog.quality || 'good'}
                </span>
              </div>
            </div>

            {/* Sleep Times */}
            <div className="flex justify-between text-sm bg-muted/50 rounded-lg p-3">
              <div className="text-center">
                <p className="text-muted-foreground">Bedtime</p>
                <p className="font-semibold">{todayLog.bedtime}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Wake up</p>
                <p className="font-semibold">{todayLog.wakeTime}</p>
              </div>
            </div>

            {/* Delete Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={deleteTodayLog}
              className="w-full text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Today's Log
            </Button>
          </>
        ) : (
          <>
            {/* No Log Today */}
            <div className="text-center py-4">
              <Moon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground">No sleep logged today</p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Last Night's Sleep
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Sleep</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bedtime</Label>
                      <Input
                        type="time"
                        value={bedtime}
                        onChange={(e) => setBedtime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Wake Time</Label>
                      <Input
                        type="time"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sleep Quality</Label>
                    <Select value={quality} onValueChange={(v: any) => setQuality(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">😴 Poor</SelectItem>
                        <SelectItem value="fair">😐 Fair</SelectItem>
                        <SelectItem value="good">😊 Good</SelectItem>
                        <SelectItem value="excellent">🌟 Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-2xl font-bold">
                      {calculateDuration(bedtime, wakeTime).toFixed(1)} hours
                    </p>
                  </div>
                  <Button onClick={addSleepLog} className="w-full">
                    Save Sleep Log
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}
