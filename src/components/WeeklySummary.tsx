import { useMemo } from 'react';
import { BarChart3, Droplets, Moon, Apple, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { WaterLog, SleepLog, FoodLog, HealthGoals, WeeklySummary as WeeklySummaryType } from '@/types/health';
import { startOfWeek, endOfWeek, isWithinInterval, format, subWeeks } from 'date-fns';

export function WeeklySummary() {
  const [waterLogs] = useLocalStorage<WaterLog[]>('water-logs', []);
  const [sleepLogs] = useLocalStorage<SleepLog[]>('sleep-logs', []);
  const [foodLogs] = useLocalStorage<FoodLog[]>('food-logs', []);
  const [goals] = useLocalStorage<HealthGoals>('health-goals', {
    dailyWater: 2500,
    dailyCalories: 2000,
    sleepHours: 8,
  });

  const { currentWeek, previousWeek } = useMemo(() => {
    const now = new Date();
    const currentStart = startOfWeek(now, { weekStartsOn: 1 });
    const currentEnd = endOfWeek(now, { weekStartsOn: 1 });
    const prevStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const prevEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    const calculateSummary = (start: Date, end: Date): WeeklySummaryType => {
      const interval = { start, end };

      // Water
      const weekWaterLogs = waterLogs.filter((log) =>
        isWithinInterval(new Date(log.timestamp), interval)
      );
      const waterByDay = new Map<string, number>();
      weekWaterLogs.forEach((log) => {
        const day = new Date(log.timestamp).toDateString();
        waterByDay.set(day, (waterByDay.get(day) || 0) + log.amount);
      });
      const waterDays = waterByDay.size || 1;
      const totalWater = Array.from(waterByDay.values()).reduce((a, b) => a + b, 0);
      const avgWater = totalWater / waterDays;
      const waterGoalMet = Array.from(waterByDay.values()).filter(
        (v) => v >= goals.dailyWater
      ).length;

      // Sleep
      const weekSleepLogs = sleepLogs.filter((log) => {
        const logDate = new Date(log.date);
        return isWithinInterval(logDate, interval);
      });
      const avgSleep =
        weekSleepLogs.length > 0
          ? weekSleepLogs.reduce((sum, log) => sum + log.duration, 0) / weekSleepLogs.length
          : 0;
      const sleepGoalMet = weekSleepLogs.filter(
        (log) => log.duration >= goals.sleepHours
      ).length;

      // Food
      const weekFoodLogs = foodLogs.filter((log) =>
        isWithinInterval(new Date(log.timestamp), interval)
      );
      const foodByDay = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
      weekFoodLogs.forEach((log) => {
        const day = new Date(log.timestamp).toDateString();
        const existing = foodByDay.get(day) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
        foodByDay.set(day, {
          calories: existing.calories + log.food.calories * log.servings,
          protein: existing.protein + log.food.protein * log.servings,
          carbs: existing.carbs + log.food.carbs * log.servings,
          fat: existing.fat + log.food.fat * log.servings,
        });
      });
      const foodDays = foodByDay.size || 1;
      const totals = Array.from(foodByDay.values()).reduce(
        (acc, day) => ({
          calories: acc.calories + day.calories,
          protein: acc.protein + day.protein,
          carbs: acc.carbs + day.carbs,
          fat: acc.fat + day.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      const avgCalories = totals.calories / foodDays;
      const avgProtein = totals.protein / foodDays;
      const avgCarbs = totals.carbs / foodDays;
      const avgFat = totals.fat / foodDays;
      const calorieGoalMet = Array.from(foodByDay.values()).filter(
        (d) => d.calories <= goals.dailyCalories * 1.1 && d.calories >= goals.dailyCalories * 0.8
      ).length;

      return {
        avgWater,
        avgCalories,
        avgSleep,
        avgProtein,
        avgCarbs,
        avgFat,
        totalDaysLogged: Math.max(waterDays, weekSleepLogs.length, foodDays),
        waterGoalMet,
        calorieGoalMet,
        sleepGoalMet,
      };
    };

    return {
      currentWeek: calculateSummary(currentStart, currentEnd),
      previousWeek: calculateSummary(prevStart, prevEnd),
    };
  }, [waterLogs, sleepLogs, foodLogs, goals]);

  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return { icon: Minus, color: 'text-muted-foreground', text: 'No data' };
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < 5) return { icon: Minus, color: 'text-muted-foreground', text: 'Stable' };
    if (change > 0) return { icon: TrendingUp, color: 'text-success', text: `+${change.toFixed(0)}%` };
    return { icon: TrendingDown, color: 'text-destructive', text: `${change.toFixed(0)}%` };
  };

  const waterTrend = getTrend(currentWeek.avgWater, previousWeek.avgWater);
  const sleepTrend = getTrend(currentWeek.avgSleep, previousWeek.avgSleep);
  const calorieTrend = getTrend(currentWeek.avgCalories, previousWeek.avgCalories);

  const stats = [
    {
      icon: Droplets,
      label: 'Avg Water',
      value: `${Math.round(currentWeek.avgWater)}ml`,
      goal: `${goals.dailyWater}ml goal`,
      progress: (currentWeek.avgWater / goals.dailyWater) * 100,
      trend: waterTrend,
      goalsMet: `${currentWeek.waterGoalMet}/7 days`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Moon,
      label: 'Avg Sleep',
      value: `${currentWeek.avgSleep.toFixed(1)}h`,
      goal: `${goals.sleepHours}h goal`,
      progress: (currentWeek.avgSleep / goals.sleepHours) * 100,
      trend: sleepTrend,
      goalsMet: `${currentWeek.sleepGoalMet}/7 days`,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      icon: Apple,
      label: 'Avg Calories',
      value: `${Math.round(currentWeek.avgCalories)}`,
      goal: `${goals.dailyCalories} goal`,
      progress: Math.min((currentWeek.avgCalories / goals.dailyCalories) * 100, 100),
      trend: calorieTrend,
      goalsMet: `${currentWeek.calorieGoalMet}/7 on target`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          Weekly Summary
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d')} -{' '}
          {format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="font-medium text-sm">{stat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{stat.value}</span>
                <div className={`flex items-center gap-0.5 text-xs ${stat.trend.color}`}>
                  <stat.trend.icon className="w-3 h-3" />
                  <span>{stat.trend.text}</span>
                </div>
              </div>
            </div>
            <Progress value={stat.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stat.goal}</span>
              <span>{stat.goalsMet}</span>
            </div>
          </div>
        ))}

        {/* Macro Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-medium mb-3">Avg Daily Macros</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-semibold text-sm">{Math.round(currentWeek.avgProtein)}g</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="font-semibold text-sm">{Math.round(currentWeek.avgCarbs)}g</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Fat</p>
              <p className="font-semibold text-sm">{Math.round(currentWeek.avgFat)}g</p>
            </div>
          </div>
        </div>

        {currentWeek.totalDaysLogged === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Start logging to see your weekly summary! 📊
          </p>
        )}
      </CardContent>
    </Card>
  );
}
