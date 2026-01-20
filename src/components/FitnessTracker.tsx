import { useState, useMemo } from 'react';
import { 
  Dumbbell, Plus, Search, Target, Trash2, Trophy, TrendingUp,
  Clock, Mountain, Route, ChevronDown, Flame, Settings, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FitnessLog, PersonalRecord, WeeklyFitnessGoal, Exercise } from '@/types/fitness';
import { exercises, exerciseCategories, getExerciseById } from '@/data/exerciseDatabase';
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval, getISOWeek, getYear } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

// Assumed average weight in kg for calorie calculation (can be made configurable)
const ASSUMED_WEIGHT_KG = 70;

export function FitnessTracker() {
  const [fitnessLogs, setFitnessLogs] = useLocalStorage<FitnessLog[]>('fitness-logs', []);
  const [personalRecords, setPersonalRecords] = useLocalStorage<PersonalRecord[]>('personal-records', []);
  const [weeklyGoals, setWeeklyGoals] = useLocalStorage<WeeklyFitnessGoal[]>('weekly-fitness-goals', []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('running');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPRCelebration, setShowPRCelebration] = useState<PersonalRecord | null>(null);
  
  // Form state
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [elevation, setElevation] = useState('');
  const [notes, setNotes] = useState('');
  
  // Goal form state
  const [goalType, setGoalType] = useState<'distance' | 'duration'>('duration');
  const [goalExerciseCategory, setGoalExerciseCategory] = useState<string>('');
  const [goalTargetValue, setGoalTargetValue] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = fitnessLogs.filter((log) => log.date === today);
  
  // Weekly streak calculation
  const weeklyStreak = useMemo(() => {
    const weeks: { week: string; workouts: number }[] = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekDate = subWeeks(now, i);
      const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });
      const weekKey = `${getYear(weekStart)}-W${String(getISOWeek(weekStart)).padStart(2, '0')}`;
      
      const weekWorkouts = fitnessLogs.filter((log) => {
        const logDate = new Date(log.date);
        return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
      }).length;
      
      weeks.push({ week: weekKey, workouts: weekWorkouts });
    }
    
    // Calculate current streak
    let streak = 0;
    for (let i = weeks.length - 1; i >= 0; i--) {
      if (weeks[i].workouts > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return { weeks, currentStreak: streak };
  }, [fitnessLogs]);
  
  // Calculate weekly goal progress
  const weeklyGoalProgress = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const thisWeekLogs = fitnessLogs.filter((log) => {
      const logDate = new Date(log.date);
      return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
    });
    
    return weeklyGoals.map((goal) => {
      const relevantLogs = goal.exerciseCategory 
        ? thisWeekLogs.filter((log) => log.category === goal.exerciseCategory)
        : thisWeekLogs;
      
      let current = 0;
      if (goal.type === 'distance') {
        current = relevantLogs.reduce((sum, log) => sum + (log.distance || 0), 0);
      } else {
        current = relevantLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
      }
      
      const progress = Math.min((current / goal.targetValue) * 100, 100);
      
      return {
        ...goal,
        current,
        progress,
        isComplete: current >= goal.targetValue,
      };
    });
  }, [fitnessLogs, weeklyGoals]);
  
  const filteredExercises = exercises.filter((ex) => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const selectedExerciseData = getExerciseById(selectedExercise);
  
  // AI-based calorie estimation using MET values
  const estimateCalories = (exercise: Exercise, durationMinutes: number, distanceMiles?: number, elevationFt?: number): number => {
    // Base calculation: Calories = MET × Weight (kg) × Time (hours)
    let met = exercise.metValue;
    
    // Adjust MET based on intensity indicators
    if (distanceMiles && durationMinutes > 0) {
      const paceMinPerMile = durationMinutes / distanceMiles;
      // Faster pace = higher intensity
      if (paceMinPerMile < 7) met *= 1.3; // Very fast
      else if (paceMinPerMile < 9) met *= 1.15; // Fast
      else if (paceMinPerMile > 12) met *= 0.85; // Slow
    }
    
    // Elevation bonus (approximately 10% more calories per 1000ft gained)
    if (elevationFt && elevationFt > 0) {
      const elevationBonus = 1 + (elevationFt / 1000) * 0.1;
      met *= Math.min(elevationBonus, 1.5); // Cap at 50% bonus
    }
    
    const timeInHours = durationMinutes / 60;
    const calories = met * ASSUMED_WEIGHT_KG * timeInHours;
    
    return Math.round(calories);
  };
  
  const checkForPR = (log: FitnessLog): PersonalRecord | null => {
    const relevantRecords = personalRecords.filter(pr => pr.exerciseId === log.exerciseId);
    
    // Check fastest mile (for distance-based exercises)
    if (log.distance && log.duration) {
      const pacePerMile = log.duration / log.distance;
      const currentFastestMile = relevantRecords.find(pr => pr.type === 'fastest_mile');
      
      if (!currentFastestMile || pacePerMile < currentFastestMile.value) {
        return {
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          type: 'fastest_mile',
          value: pacePerMile,
          unit: 'min/mile',
          date: log.date,
          logId: log.id,
        };
      }
    }
    
    // Check longest distance
    if (log.distance) {
      const currentLongest = relevantRecords.find(pr => pr.type === 'longest_distance');
      
      if (!currentLongest || log.distance > currentLongest.value) {
        return {
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          type: 'longest_distance',
          value: log.distance,
          unit: 'miles',
          date: log.date,
          logId: log.id,
        };
      }
    }
    
    // Check highest elevation
    if (log.elevationGain) {
      const currentHighest = relevantRecords.find(pr => pr.type === 'highest_elevation');
      
      if (!currentHighest || log.elevationGain > currentHighest.value) {
        return {
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          type: 'highest_elevation',
          value: log.elevationGain,
          unit: 'ft',
          date: log.date,
          logId: log.id,
        };
      }
    }
    
    return null;
  };
  
  const addWorkout = () => {
    if (!selectedExercise) return;
    
    const exercise = getExerciseById(selectedExercise);
    if (!exercise) return;
    
    const durationNum = duration ? parseFloat(duration) : undefined;
    const distanceNum = distance ? parseFloat(distance) : undefined;
    const elevationNum = elevation ? parseFloat(elevation) : undefined;
    
    // AI-based calorie estimation
    const calories = durationNum ? estimateCalories(exercise, durationNum, distanceNum, elevationNum) : undefined;
    
    const newLog: FitnessLog = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      date: today,
      duration: durationNum,
      distance: distanceNum,
      elevationGain: elevationNum,
      calories,
      notes: notes || undefined,
    };
    
    // Check for PR
    const newPR = checkForPR(newLog);
    if (newPR) {
      // Update or add PR
      const updatedPRs = personalRecords.filter(
        pr => !(pr.exerciseId === newPR.exerciseId && pr.type === newPR.type)
      );
      setPersonalRecords([...updatedPRs, newPR]);
      setShowPRCelebration(newPR);
      setTimeout(() => setShowPRCelebration(null), 3000);
    }
    
    setFitnessLogs([...fitnessLogs, newLog]);
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const addGoal = () => {
    if (!goalTargetValue || parseFloat(goalTargetValue) <= 0) return;
    
    const newGoal: WeeklyFitnessGoal = {
      id: crypto.randomUUID(),
      type: goalType,
      exerciseCategory: goalExerciseCategory as Exercise['category'] || undefined,
      targetValue: parseFloat(goalTargetValue),
      createdAt: new Date().toISOString(),
    };
    
    setWeeklyGoals([...weeklyGoals, newGoal]);
    setIsGoalDialogOpen(false);
    resetGoalForm();
  };
  
  const deleteGoal = (id: string) => {
    setWeeklyGoals(weeklyGoals.filter(g => g.id !== id));
  };
  
  const resetForm = () => {
    setSelectedExercise('');
    setDuration('');
    setDistance('');
    setElevation('');
    setNotes('');
    setSearchQuery('');
  };
  
  const resetGoalForm = () => {
    setGoalType('duration');
    setGoalExerciseCategory('');
    setGoalTargetValue('');
  };
  
  const deleteLog = (id: string) => {
    setFitnessLogs(fitnessLogs.filter((log) => log.id !== id));
  };
  
  const formatPace = (minutesPerMile: number): string => {
    const mins = Math.floor(minutesPerMile);
    const secs = Math.round((minutesPerMile - mins) * 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getCategoryName = (categoryId: string): string => {
    const cat = exerciseCategories.find(c => c.id === categoryId);
    return cat?.name || 'All Activities';
  };

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Dumbbell className="w-5 h-5 text-orange-500" />
            </div>
            Fitness Log
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Flame className="w-3 h-3" />
            {weeklyStreak.currentStreak} week streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-hidden flex flex-col">
        {/* PR Celebration */}
        {showPRCelebration && (
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-3 animate-pulse">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-semibold text-amber-600">🎉 New Personal Record!</p>
                <p className="text-sm text-muted-foreground">
                  {showPRCelebration.exerciseName}: {showPRCelebration.type.replace(/_/g, ' ')} - 
                  {showPRCelebration.type === 'fastest_mile' 
                    ? ` ${formatPace(showPRCelebration.value)}/mile`
                    : ` ${showPRCelebration.value} ${showPRCelebration.unit}`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Weekly Goals Progress */}
        {weeklyGoalProgress.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Weekly Goals
              </p>
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Settings className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
            {weeklyGoalProgress.map((goal) => (
              <div key={goal.id} className="bg-muted/30 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">
                    {goal.exerciseCategory ? getCategoryName(goal.exerciseCategory) : 'All Activities'}: 
                    {' '}{goal.type === 'distance' ? `${goal.current.toFixed(1)}/${goal.targetValue} mi` : `${Math.round(goal.current)}/${goal.targetValue} min`}
                  </span>
                  <div className="flex items-center gap-1">
                    {goal.isComplete && <span className="text-xs">✓</span>}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={goal.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        )}
        
        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="font-semibold">{todayLogs.length} workouts</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="font-semibold">
              {todayLogs.reduce((sum, log) => sum + (log.distance || 0), 0).toFixed(1)} mi
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Calories</p>
            <p className="font-semibold">
              {todayLogs.reduce((sum, log) => sum + (log.calories || 0), 0)} cal
            </p>
          </div>
        </div>
        
        {/* Weekly Streak Chart */}
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Weekly Activity (12 weeks)
          </p>
          <div className="flex gap-1 justify-between">
            {weeklyStreak.weeks.map((week, idx) => (
              <div key={week.week} className="flex flex-col items-center gap-1">
                <div 
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                    week.workouts > 0 
                      ? week.workouts >= 3 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-orange-500/50 text-orange-100'
                      : 'bg-muted'
                  }`}
                  title={`Week ${idx + 1}: ${week.workouts} workouts`}
                >
                  {week.workouts > 0 ? week.workouts : ''}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>12 weeks ago</span>
            <span>This week</span>
          </div>
        </div>
        
        {/* Today's Logs */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-2">
            {todayLogs.map((log) => {
              const exercise = getExerciseById(log.exerciseId);
              return (
                <Collapsible key={log.id}>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{exercise?.icon || '🏅'}</span>
                          <div className="text-left">
                            <p className="font-medium text-sm">{log.exerciseName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {log.duration && <span>{log.duration} min</span>}
                              {log.distance && <span>• {log.distance} mi</span>}
                              {log.calories && <span>• ~{log.calories} cal</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLog(log.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="pt-3 space-y-3">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-2 text-center text-sm">
                        {log.duration && (
                          <div className="bg-background/50 rounded p-2">
                            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="font-medium">{log.duration}</p>
                            <p className="text-xs text-muted-foreground">min</p>
                          </div>
                        )}
                        {log.distance && (
                          <div className="bg-background/50 rounded p-2">
                            <Route className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="font-medium">{log.distance}</p>
                            <p className="text-xs text-muted-foreground">miles</p>
                          </div>
                        )}
                        {log.elevationGain && (
                          <div className="bg-background/50 rounded p-2">
                            <Mountain className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="font-medium">{log.elevationGain}</p>
                            <p className="text-xs text-muted-foreground">ft</p>
                          </div>
                        )}
                        {log.calories && (
                          <div className="bg-background/50 rounded p-2">
                            <Flame className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="font-medium">~{log.calories}</p>
                            <p className="text-xs text-muted-foreground">cal</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Elevation Chart */}
                      {log.elevationGain && log.distance && (
                        <div className="bg-background/50 rounded-lg p-3">
                          <p className="text-xs font-medium mb-2">Elevation Profile</p>
                          <div className="h-20">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={
                                Array.from({ length: 10 }, (_, i) => ({
                                  dist: ((i + 1) / 10) * (log.distance || 1),
                                  elev: Math.sin((i / 10) * Math.PI) * (log.elevationGain || 0) * 0.8 + 
                                        Math.random() * (log.elevationGain || 0) * 0.2
                                }))
                              }>
                                <defs>
                                  <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="dist" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                                <Area 
                                  type="monotone" 
                                  dataKey="elev" 
                                  stroke="hsl(var(--primary))" 
                                  fill="url(#elevGradient)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                      
                      {/* AI Calorie Estimation Explanation */}
                      {log.calories && (
                        <div className="bg-orange-500/10 rounded-lg p-2 text-xs text-muted-foreground">
                          <span className="font-medium">🤖 AI Estimate:</span> ~{log.calories} calories burned based on 
                          {' '}{log.exerciseName.toLowerCase()}'s metabolic rate
                          {log.distance && log.duration && `, pace of ${formatPace(log.duration / log.distance)}/mi`}
                          {log.elevationGain && `, and ${log.elevationGain}ft elevation gain`}.
                        </div>
                      )}
                      
                      {log.notes && (
                        <p className="text-sm text-muted-foreground italic">"{log.notes}"</p>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
            
            {todayLogs.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Dumbbell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No workouts logged today</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {/* Add Workout Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Log Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Log Workout</DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto space-y-4 pt-4">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {exerciseCategories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedExercise('');
                        }}
                        className="gap-1"
                      >
                        <span>{cat.icon}</span>
                        <span className="hidden sm:inline">{cat.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Exercise Search */}
                <div className="space-y-2">
                  <Label>Exercise</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search exercises..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <ScrollArea className="h-40 border rounded-lg">
                    <div className="p-2 space-y-1">
                      {filteredExercises.map((ex) => (
                        <button
                          key={ex.id}
                          onClick={() => setSelectedExercise(ex.id)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            selectedExercise === ex.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          <span className="mr-2">{ex.icon}</span>
                          {ex.name}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Dynamic Fields based on Exercise */}
                {selectedExerciseData && (
                  <div className="space-y-4 pt-2 border-t">
                    <p className="text-sm font-medium">
                      {selectedExerciseData.icon} {selectedExerciseData.name}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {selectedExerciseData.hasTime && (
                        <div className="space-y-1">
                          <Label className="text-xs">Duration (min)</Label>
                          <Input
                            type="number"
                            placeholder="30"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                          />
                        </div>
                      )}
                      
                      {selectedExerciseData.hasDistance && (
                        <div className="space-y-1">
                          <Label className="text-xs">Distance (miles)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="3.0"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                          />
                        </div>
                      )}
                      
                      {selectedExerciseData.hasElevation && (
                        <div className="space-y-1">
                          <Label className="text-xs">Elevation Gain (ft)</Label>
                          <Input
                            type="number"
                            placeholder="500"
                            value={elevation}
                            onChange={(e) => setElevation(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Live Calorie Estimation */}
                    {duration && parseFloat(duration) > 0 && (
                      <div className="bg-orange-500/10 rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">Estimated Calories</p>
                        <p className="text-2xl font-bold text-orange-500">
                          ~{estimateCalories(
                            selectedExerciseData, 
                            parseFloat(duration), 
                            distance ? parseFloat(distance) : undefined,
                            elevation ? parseFloat(elevation) : undefined
                          )} cal
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on MET value of {selectedExerciseData.metValue}
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Notes (optional)</Label>
                      <Input
                        placeholder="How did it feel?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={addWorkout} 
                className="w-full mt-4"
                disabled={!selectedExercise}
              >
                Save Workout
              </Button>
            </DialogContent>
          </Dialog>
          
          {/* Add Goal Dialog */}
          <Dialog open={isGoalDialogOpen} onOpenChange={(open) => {
            setIsGoalDialogOpen(open);
            if (!open) resetGoalForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Set Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Set Weekly Goal</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Goal Type</Label>
                  <Select value={goalType} onValueChange={(v) => setGoalType(v as 'distance' | 'duration')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duration">Workout Time (minutes)</SelectItem>
                      <SelectItem value="distance">Distance (miles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Activity (optional)</Label>
                  <Select value={goalExerciseCategory || "all"} onValueChange={(v) => setGoalExerciseCategory(v === "all" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All activities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      {exerciseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Target {goalType === 'distance' ? '(miles)' : '(minutes)'}</Label>
                  <Input
                    type="number"
                    placeholder={goalType === 'distance' ? '10' : '150'}
                    value={goalTargetValue}
                    onChange={(e) => setGoalTargetValue(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={addGoal} 
                className="w-full mt-4"
                disabled={!goalTargetValue || parseFloat(goalTargetValue) <= 0}
              >
                Create Goal
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Personal Records */}
        {personalRecords.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-3 flex-shrink-0">
            <p className="text-sm font-medium flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Personal Records
            </p>
            <div className="flex flex-wrap gap-2">
              {personalRecords.slice(0, 3).map((pr) => (
                <Badge key={`${pr.exerciseId}-${pr.type}`} variant="secondary" className="text-xs">
                  {pr.type === 'fastest_mile' 
                    ? `${formatPace(pr.value)}/mi` 
                    : `${pr.value} ${pr.unit}`
                  } ({pr.exerciseName.split(' ')[0]})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
