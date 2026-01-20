import { useMemo, useState } from 'react';
import { 
  BarChart3, Droplets, Moon, Apple, TrendingUp, TrendingDown, Minus, 
  Dumbbell, CheckCircle2, Clock, Trophy, Brain, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { WaterLog, SleepLog, FoodLog, HealthGoals } from '@/types/health';
import { FitnessLog, PersonalRecord } from '@/types/fitness';
import { Task } from '@/types/productivity';
import { startOfWeek, endOfWeek, isWithinInterval, format, subWeeks, addWeeks, isSameWeek } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export function EnhancedSummary() {
  const [waterLogs] = useLocalStorage<WaterLog[]>('water-logs', []);
  const [sleepLogs] = useLocalStorage<SleepLog[]>('sleep-logs', []);
  const [foodLogs] = useLocalStorage<FoodLog[]>('food-logs', []);
  const [fitnessLogs] = useLocalStorage<FitnessLog[]>('fitness-logs', []);
  const [personalRecords] = useLocalStorage<PersonalRecord[]>('personal-records', []);
  const [tasks] = useLocalStorage<Task[]>('productivity-tasks', []);
  const [goals] = useLocalStorage<HealthGoals>('health-goals', {
    dailyWater: 2500,
    dailyCalories: 2000,
    sleepHours: 8,
  });
  const [selectedWeekDate, setSelectedWeekDate] = useState(new Date());

  const goToPreviousWeek = () => setSelectedWeekDate(prev => subWeeks(prev, 1));
  const goToNextWeek = () => setSelectedWeekDate(prev => addWeeks(prev, 1));
  const goToCurrentWeek = () => setSelectedWeekDate(new Date());
  const isCurrentWeek = isSameWeek(selectedWeekDate, new Date(), { weekStartsOn: 1 });

  const weeklyData = useMemo(() => {
    const currentStart = startOfWeek(selectedWeekDate, { weekStartsOn: 1 });
    const currentEnd = endOfWeek(selectedWeekDate, { weekStartsOn: 1 });
    const prevStart = startOfWeek(subWeeks(selectedWeekDate, 1), { weekStartsOn: 1 });
    const prevEnd = endOfWeek(subWeeks(selectedWeekDate, 1), { weekStartsOn: 1 });
    const interval = { start: currentStart, end: currentEnd };
    const prevInterval = { start: prevStart, end: prevEnd };

    // Water stats
    const weekWaterLogs = waterLogs.filter((log) =>
      isWithinInterval(new Date(log.timestamp), interval)
    );
    const waterByDay = new Map<string, number>();
    weekWaterLogs.forEach((log) => {
      const day = format(new Date(log.timestamp), 'EEE');
      waterByDay.set(day, (waterByDay.get(day) || 0) + log.amount);
    });
    const totalWater = Array.from(waterByDay.values()).reduce((a, b) => a + b, 0);
    const avgWater = waterByDay.size > 0 ? totalWater / waterByDay.size : 0;
    const waterGoalMet = Array.from(waterByDay.values()).filter(v => v >= goals.dailyWater).length;

    // Sleep stats
    const weekSleepLogs = sleepLogs.filter((log) => {
      const logDate = new Date(log.date);
      return isWithinInterval(logDate, interval);
    });
    const avgSleep = weekSleepLogs.length > 0
      ? weekSleepLogs.reduce((sum, log) => sum + log.duration, 0) / weekSleepLogs.length
      : 0;
    const sleepGoalMet = weekSleepLogs.filter(log => log.duration >= goals.sleepHours).length;

    // Food stats
    const weekFoodLogs = foodLogs.filter((log) =>
      isWithinInterval(new Date(log.timestamp), interval)
    );
    const foodByDay = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
    weekFoodLogs.forEach((log) => {
      const day = format(new Date(log.timestamp), 'EEE');
      const existing = foodByDay.get(day) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
      foodByDay.set(day, {
        calories: existing.calories + log.food.calories * log.servings,
        protein: existing.protein + log.food.protein * log.servings,
        carbs: existing.carbs + log.food.carbs * log.servings,
        fat: existing.fat + log.food.fat * log.servings,
      });
    });
    const totals = Array.from(foodByDay.values()).reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    const avgCalories = foodByDay.size > 0 ? totals.calories / foodByDay.size : 0;
    const avgProtein = foodByDay.size > 0 ? totals.protein / foodByDay.size : 0;
    const avgCarbs = foodByDay.size > 0 ? totals.carbs / foodByDay.size : 0;
    const avgFat = foodByDay.size > 0 ? totals.fat / foodByDay.size : 0;
    const calorieGoalMet = Array.from(foodByDay.values()).filter(
      d => d.calories >= goals.dailyCalories * 0.8 && d.calories <= goals.dailyCalories * 1.2
    ).length;

    // Fitness stats
    const weekFitnessLogs = fitnessLogs.filter((log) =>
      isWithinInterval(new Date(log.date), interval)
    );
    const totalWorkouts = weekFitnessLogs.length;
    const totalExerciseTime = weekFitnessLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const totalDistance = weekFitnessLogs.reduce((sum, log) => sum + (log.distance || 0), 0);
    const totalCaloriesBurned = weekFitnessLogs.reduce((sum, log) => sum + (log.calories || 0), 0);

    // Task stats
    const weekTasks = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return isWithinInterval(taskDate, interval);
    });
    const completedTasks = weekTasks.filter(t => t.completed).length;
    const totalTasks = weekTasks.length;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Daily chart data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyData = days.map(day => ({
      day,
      water: Math.round((waterByDay.get(day) || 0) / 100) / 10, // Convert to L
      sleep: weekSleepLogs.find(l => format(new Date(l.date), 'EEE') === day)?.duration || 0,
      calories: Math.round((foodByDay.get(day)?.calories || 0) / 100) / 10, // Convert to hundreds
      workouts: weekFitnessLogs.filter(l => format(new Date(l.date), 'EEE') === day).length,
    }));

    // Macro pie chart data
    const macroData = [
      { name: 'Protein', value: Math.round(avgProtein), color: 'hsl(var(--primary))' },
      { name: 'Carbs', value: Math.round(avgCarbs), color: 'hsl(var(--warning))' },
      { name: 'Fat', value: Math.round(avgFat), color: 'hsl(var(--destructive))' },
    ];

    // Previous week comparison
    const prevWaterLogs = waterLogs.filter((log) =>
      isWithinInterval(new Date(log.timestamp), prevInterval)
    );
    const prevTotalWater = prevWaterLogs.reduce((sum, log) => sum + log.amount, 0);
    const prevAvgWater = prevWaterLogs.length > 0 ? prevTotalWater / 7 : 0;

    const prevSleepLogs = sleepLogs.filter((log) =>
      isWithinInterval(new Date(log.date), prevInterval)
    );
    const prevAvgSleep = prevSleepLogs.length > 0
      ? prevSleepLogs.reduce((sum, log) => sum + log.duration, 0) / prevSleepLogs.length
      : 0;

    return {
      water: { avg: avgWater, goalMet: waterGoalMet, prevAvg: prevAvgWater },
      sleep: { avg: avgSleep, goalMet: sleepGoalMet, prevAvg: prevAvgSleep },
      food: { avgCalories, avgProtein, avgCarbs, avgFat, goalMet: calorieGoalMet },
      fitness: { totalWorkouts, totalTime: totalExerciseTime, totalDistance, caloriesBurned: totalCaloriesBurned },
      tasks: { completed: completedTasks, total: totalTasks, completionRate: taskCompletionRate },
      dailyData,
      macroData,
    };
  }, [waterLogs, sleepLogs, foodLogs, fitnessLogs, tasks, goals, selectedWeekDate]);

  // Generate AI Summary
  const aiSummary = useMemo(() => {
    const insights: string[] = [];
    
    // Water insight
    if (weeklyData.water.avg >= goals.dailyWater) {
      insights.push("💧 Excellent hydration this week! You've been consistently meeting your water goals.");
    } else if (weeklyData.water.avg >= goals.dailyWater * 0.8) {
      insights.push("💧 Good hydration efforts, but try to drink a bit more to hit your daily goal consistently.");
    } else if (weeklyData.water.avg > 0) {
      insights.push("💧 Your water intake needs attention. Consider setting reminders to drink throughout the day.");
    }
    
    // Sleep insight
    if (weeklyData.sleep.avg >= goals.sleepHours) {
      insights.push("😴 Great sleep habits! You're getting the recommended amount of rest.");
    } else if (weeklyData.sleep.avg >= goals.sleepHours * 0.85) {
      insights.push("😴 You're close to your sleep goal. Try going to bed 30 minutes earlier.");
    } else if (weeklyData.sleep.avg > 0) {
      insights.push("😴 Sleep debt is accumulating. Prioritize rest for better energy and focus.");
    }
    
    // Nutrition insight
    if (weeklyData.food.goalMet >= 5) {
      insights.push("🍎 Nutrition is on point! Your calorie intake is well-balanced.");
    } else if (weeklyData.food.avgCalories > 0) {
      const calorieDiff = weeklyData.food.avgCalories - goals.dailyCalories;
      if (calorieDiff > 200) {
        insights.push("🍎 You're eating above your calorie goal. Consider lighter meals or more active days.");
      } else if (calorieDiff < -200) {
        insights.push("🍎 You might be under-eating. Make sure you're fueling your body enough.");
      }
    }
    
    // Fitness insight
    if (weeklyData.fitness.totalWorkouts >= 5) {
      insights.push(`🏃 Outstanding! ${weeklyData.fitness.totalWorkouts} workouts this week. You're crushing your fitness goals!`);
    } else if (weeklyData.fitness.totalWorkouts >= 3) {
      insights.push(`🏃 Good activity level with ${weeklyData.fitness.totalWorkouts} workouts. Keep up the momentum!`);
    } else if (weeklyData.fitness.totalWorkouts > 0) {
      insights.push(`🏃 You got ${weeklyData.fitness.totalWorkouts} workout(s) in. Try to add one more session next week.`);
    } else {
      insights.push("🏃 No workouts logged yet. Even a short walk can make a difference!");
    }
    
    // Task insight
    if (weeklyData.tasks.completionRate >= 80) {
      insights.push(`✅ Productivity champion! ${Math.round(weeklyData.tasks.completionRate)}% task completion rate.`);
    } else if (weeklyData.tasks.completionRate >= 50) {
      insights.push(`✅ Solid progress on tasks. ${weeklyData.tasks.completed}/${weeklyData.tasks.total} completed.`);
    } else if (weeklyData.tasks.total > 0) {
      insights.push("✅ Consider breaking tasks into smaller, manageable chunks for better completion.");
    }
    
    // Overall summary
    const overallScore = (
      (weeklyData.water.avg >= goals.dailyWater * 0.8 ? 20 : 10) +
      (weeklyData.sleep.avg >= goals.sleepHours * 0.85 ? 20 : 10) +
      (weeklyData.food.goalMet >= 3 ? 20 : 10) +
      (weeklyData.fitness.totalWorkouts >= 3 ? 20 : 10) +
      (weeklyData.tasks.completionRate >= 50 ? 20 : 10)
    );
    
    let overallMessage = "";
    if (overallScore >= 90) {
      overallMessage = "🌟 Exceptional week! You're performing at your best across all areas.";
    } else if (overallScore >= 70) {
      overallMessage = "👍 Great week overall! A few small improvements can make it even better.";
    } else if (overallScore >= 50) {
      overallMessage = "📈 Decent week with room for growth. Focus on one area to improve next week.";
    } else {
      overallMessage = "💪 Every step counts! Start with small, consistent habits to build momentum.";
    }
    
    return { insights, overall: overallMessage, score: overallScore };
  }, [weeklyData, goals]);

  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return { icon: Minus, color: 'text-muted-foreground', text: 'No data' };
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < 5) return { icon: Minus, color: 'text-muted-foreground', text: 'Stable' };
    if (change > 0) return { icon: TrendingUp, color: 'text-success', text: `+${change.toFixed(0)}%` };
    return { icon: TrendingDown, color: 'text-destructive', text: `${change.toFixed(0)}%` };
  };

  const formatPace = (minutesPerMile: number): string => {
    const mins = Math.floor(minutesPerMile);
    const secs = Math.round((minutesPerMile - mins) * 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={goToPreviousWeek} className="h-8 w-8">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center min-w-[180px]">
          <p className="text-sm font-medium">
            {format(startOfWeek(selectedWeekDate, { weekStartsOn: 1 }), 'MMM d')} -{' '}
            {format(endOfWeek(selectedWeekDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </p>
          {!isCurrentWeek && (
            <button 
              onClick={goToCurrentWeek}
              className="text-xs text-primary hover:underline"
            >
              Go to current week
            </button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={goToNextWeek} className="h-8 w-8">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Summary Card */}
      <Card className="glass-card bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            {isCurrentWeek ? 'AI Weekly Insights' : 'Weekly Insights'}
            <Badge variant="secondary" className="ml-auto">
              Score: {aiSummary.score}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm font-medium">{aiSummary.overall}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {aiSummary.insights.map((insight, idx) => (
              <p key={idx} className="text-sm text-muted-foreground">{insight}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Water */}
        <Card className="glass-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Avg Water</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(weeklyData.water.avg)}ml</p>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-muted-foreground">{weeklyData.water.goalMet}/7 days goal</span>
              <div className={`flex items-center gap-1 ${getTrend(weeklyData.water.avg, weeklyData.water.prevAvg).color}`}>
                {(() => {
                  const trend = getTrend(weeklyData.water.avg, weeklyData.water.prevAvg);
                  const Icon = trend.icon;
                  return <><Icon className="w-3 h-3" /><span>{trend.text}</span></>;
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card className="glass-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Moon className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="text-sm font-medium">Avg Sleep</span>
            </div>
            <p className="text-2xl font-bold">{weeklyData.sleep.avg.toFixed(1)}h</p>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-muted-foreground">{weeklyData.sleep.goalMet}/7 days goal</span>
              <div className={`flex items-center gap-1 ${getTrend(weeklyData.sleep.avg, weeklyData.sleep.prevAvg).color}`}>
                {(() => {
                  const trend = getTrend(weeklyData.sleep.avg, weeklyData.sleep.prevAvg);
                  const Icon = trend.icon;
                  return <><Icon className="w-3 h-3" /><span>{trend.text}</span></>;
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card className="glass-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Apple className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-sm font-medium">Avg Calories</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(weeklyData.food.avgCalories)}</p>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-muted-foreground">{weeklyData.food.goalMet}/7 on target</span>
            </div>
          </CardContent>
        </Card>

        {/* Workouts */}
        <Card className="glass-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Dumbbell className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-sm font-medium">Workouts</span>
            </div>
            <p className="text-2xl font-bold">{weeklyData.fitness.totalWorkouts}</p>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-muted-foreground">{weeklyData.fitness.totalTime} min total</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="water" name="Water (L)" fill="hsl(200, 80%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sleep" name="Sleep (h)" fill="hsl(240, 60%, 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="workouts" name="Workouts" fill="hsl(25, 90%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Macro Distribution */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={weeklyData.macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}g`}
                    labelLine={false}
                  >
                    {weeklyData.macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {weeklyData.macroData.map((macro) => (
                <div key={macro.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                  <span className="text-sm">{macro.name}: {macro.value}g</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fitness Summary */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Fitness Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-primary">{weeklyData.fitness.totalWorkouts}</p>
              <p className="text-sm text-muted-foreground">Workouts</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-primary">{weeklyData.fitness.totalTime}</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-primary">{weeklyData.fitness.totalDistance.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Miles</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-primary">{weeklyData.fitness.caloriesBurned}</p>
              <p className="text-sm text-muted-foreground">Calories Burned</p>
            </div>
          </div>

          {/* Personal Records */}
          {personalRecords.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-amber-500" />
                Personal Records
              </p>
              <div className="flex flex-wrap gap-2">
                {personalRecords.map((pr) => (
                  <Badge key={`${pr.exerciseId}-${pr.type}`} variant="secondary">
                    {pr.exerciseName}: {pr.type.replace(/_/g, ' ')} - 
                    {pr.type === 'fastest_mile' 
                      ? ` ${formatPace(pr.value)}/mi`
                      : ` ${pr.value} ${pr.unit}`
                    }
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Summary */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Productivity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-success">{weeklyData.tasks.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-muted-foreground">{weeklyData.tasks.total - weeklyData.tasks.completed}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-3xl font-bold text-primary">{Math.round(weeklyData.tasks.completionRate)}%</p>
              <p className="text-sm text-muted-foreground">Completion</p>
            </div>
          </div>
          <Progress 
            value={weeklyData.tasks.completionRate} 
            className="mt-4 h-2" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
