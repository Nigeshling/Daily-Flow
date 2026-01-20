import { useState } from 'react';
import { Droplets, Plus, Minus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { WaterLog, HealthGoals } from '@/types/health';
import { cn } from '@/lib/utils';

const QUICK_ADD_OPTIONS = [250, 500, 750];

export function WaterTracker() {
  const [waterLogs, setWaterLogs] = useLocalStorage<WaterLog[]>('water-logs', []);
  const [goals, setGoals] = useLocalStorage<HealthGoals>('health-goals', {
    dailyWater: 2500,
    dailyCalories: 2000,
    sleepHours: 8,
  });
  const [customAmount, setCustomAmount] = useState('');
  const [goalInput, setGoalInput] = useState(goals.dailyWater.toString());
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

  const today = new Date().toDateString();
  const todayLogs = waterLogs.filter(
    (log) => new Date(log.timestamp).toDateString() === today
  );
  const todayTotal = todayLogs.reduce((sum, log) => sum + log.amount, 0);
  const progress = Math.min((todayTotal / goals.dailyWater) * 100, 100);

  const addWater = (amount: number) => {
    const newLog: WaterLog = {
      id: crypto.randomUUID(),
      amount,
      timestamp: new Date(),
    };
    setWaterLogs([...waterLogs, newLog]);
  };

  const removeLastLog = () => {
    const todayLogIds = todayLogs.map((l) => l.id);
    if (todayLogIds.length === 0) return;
    const lastId = todayLogIds[todayLogIds.length - 1];
    setWaterLogs(waterLogs.filter((log) => log.id !== lastId));
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      addWater(amount);
      setCustomAmount('');
    }
  };

  const saveGoal = () => {
    const newGoal = parseInt(goalInput);
    if (newGoal > 0) {
      setGoals({ ...goals, dailyWater: newGoal });
      setIsGoalDialogOpen(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            Water Intake
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
                <DialogTitle>Set Daily Water Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Daily Goal (ml)</Label>
                  <Input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="2500"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 2000-3000ml per day
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
        {/* Progress Display */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-foreground">
            {todayTotal}
            <span className="text-lg text-muted-foreground font-normal">
              /{goals.dailyWater}ml
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {progress >= 100
              ? '🎉 Goal reached!'
              : `${goals.dailyWater - todayTotal}ml to go`}
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {QUICK_ADD_OPTIONS.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => addWater(amount)}
              className="h-12 flex-col gap-0.5"
            >
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-xs">{amount}ml</span>
            </Button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Custom ml"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleCustomAdd()}
          />
          <Button onClick={handleCustomAdd} size="icon" disabled={!customAmount}>
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            onClick={removeLastLog}
            size="icon"
            variant="outline"
            disabled={todayLogs.length === 0}
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        {/* Today's Log Count */}
        <p className="text-xs text-center text-muted-foreground">
          {todayLogs.length} entries today
        </p>
      </CardContent>
    </Card>
  );
}
