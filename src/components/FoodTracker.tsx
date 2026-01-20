import { useState, useMemo } from 'react';
import { Apple, Plus, Search, Target, Trash2, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { FoodItem, FoodLog, HealthGoals } from '@/types/health';
import { allFoods } from '@/data/foodDatabase';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export function FoodTracker() {
  const [foodLogs, setFoodLogs] = useLocalStorage<FoodLog[]>('food-logs', []);
  const [customFoods, setCustomFoods] = useLocalStorage<FoodItem[]>('custom-foods', []);
  const [goals, setGoals] = useLocalStorage<HealthGoals>('health-goals', {
    dailyWater: 2500,
    dailyCalories: 2000,
    sleepHours: 8,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<typeof MEAL_TYPES[number]>('breakfast');
  const [servings, setServings] = useState('1');
  const [goalInput, setGoalInput] = useState(goals.dailyCalories.toString());

  // Manual food entry state
  const [manualFood, setManualFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const today = new Date().toDateString();
  const todayLogs = foodLogs.filter(
    (log) => new Date(log.timestamp).toDateString() === today
  );

  const todayTotals = useMemo(() => {
    return todayLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.food.calories * log.servings,
        protein: acc.protein + log.food.protein * log.servings,
        carbs: acc.carbs + log.food.carbs * log.servings,
        fat: acc.fat + log.food.fat * log.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [todayLogs]);

  const calorieProgress = Math.min((todayTotals.calories / goals.dailyCalories) * 100, 100);

  const allAvailableFoods = [...allFoods, ...customFoods];
  const filteredFoods = allAvailableFoods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFoodLog = (food: FoodItem) => {
    const newLog: FoodLog = {
      id: crypto.randomUUID(),
      food,
      servings: parseFloat(servings) || 1,
      mealType: selectedMeal,
      timestamp: new Date(),
    };
    setFoodLogs([...foodLogs, newLog]);
    setIsAddDialogOpen(false);
    setSearchQuery('');
    setServings('1');
  };

  const addManualFood = () => {
    const newFood: FoodItem = {
      id: `custom-${crypto.randomUUID()}`,
      name: manualFood.name,
      calories: parseInt(manualFood.calories) || 0,
      protein: parseInt(manualFood.protein) || 0,
      carbs: parseInt(manualFood.carbs) || 0,
      fat: parseInt(manualFood.fat) || 0,
      isCustom: true,
    };
    setCustomFoods([...customFoods, newFood]);
    addFoodLog(newFood);
    setIsManualDialogOpen(false);
    setManualFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const deleteFoodLog = (id: string) => {
    setFoodLogs(foodLogs.filter((log) => log.id !== id));
  };

  const saveGoal = () => {
    const newGoal = parseInt(goalInput);
    if (newGoal > 0) {
      setGoals({ ...goals, dailyCalories: newGoal });
      setIsGoalDialogOpen(false);
    }
  };

  const mealTypeColors = {
    breakfast: 'bg-amber-500/10 text-amber-600',
    lunch: 'bg-green-500/10 text-green-600',
    dinner: 'bg-blue-500/10 text-blue-600',
    snack: 'bg-purple-500/10 text-purple-600',
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Apple className="w-5 h-5 text-green-500" />
            </div>
            Food Tracker
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
                <DialogTitle>Set Calorie Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Daily Calorie Goal</Label>
                  <Input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="2000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1500-2500 calories depending on activity level
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
        {/* Calorie Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">
              {Math.round(todayTotals.calories)}
            </span>
            <span className="text-muted-foreground">
              / {goals.dailyCalories} cal
            </span>
          </div>
          <Progress value={calorieProgress} className="h-2" />
        </div>

        {/* Macro Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="font-semibold">{Math.round(todayTotals.protein)}g</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="font-semibold">{Math.round(todayTotals.carbs)}g</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="font-semibold">{Math.round(todayTotals.fat)}g</p>
          </div>
        </div>

        {/* Today's Logs */}
        {todayLogs.length > 0 && (
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {todayLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between bg-muted/30 rounded-lg p-2 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{log.food.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={mealTypeColors[log.mealType]}
                      >
                        {log.mealType}
                      </Badge>
                      <span className="text-muted-foreground">
                        {log.servings}x • {Math.round(log.food.calories * log.servings)} cal
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteFoodLog(log.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Add Food Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Food</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="search" className="pt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Search Foods</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search foods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Meal</Label>
                    <Select value={selectedMeal} onValueChange={(v: any) => setSelectedMeal(v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEAL_TYPES.map((meal) => (
                          <SelectItem key={meal} value={meal}>
                            {meal.charAt(0).toUpperCase() + meal.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Servings</Label>
                    <Input
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-1">
                    {filteredFoods.slice(0, 20).map((food) => (
                      <button
                        key={food.id}
                        onClick={() => addFoodLog(food)}
                        className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <p className="font-medium text-sm">{food.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                        </p>
                      </button>
                    ))}
                    {filteredFoods.length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <UtensilsCrossed className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">No foods found</p>
                        <Button
                          variant="link"
                          onClick={() => {
                            setIsAddDialogOpen(false);
                            setIsManualDialogOpen(true);
                            setManualFood({ ...manualFood, name: searchQuery });
                          }}
                        >
                          Add it manually
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Food Name</Label>
                    <Input
                      placeholder="e.g., Homemade Pasta"
                      value={manualFood.name}
                      onChange={(e) =>
                        setManualFood({ ...manualFood, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Calories</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={manualFood.calories}
                        onChange={(e) =>
                          setManualFood({ ...manualFood, calories: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Protein (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={manualFood.protein}
                        onChange={(e) =>
                          setManualFood({ ...manualFood, protein: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Carbs (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={manualFood.carbs}
                        onChange={(e) =>
                          setManualFood({ ...manualFood, carbs: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Fat (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={manualFood.fat}
                        onChange={(e) =>
                          setManualFood({ ...manualFood, fat: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Meal</Label>
                      <Select value={selectedMeal} onValueChange={(v: any) => setSelectedMeal(v)}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MEAL_TYPES.map((meal) => (
                            <SelectItem key={meal} value={meal}>
                              {meal.charAt(0).toUpperCase() + meal.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Servings</Label>
                      <Input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={addManualFood}
                  className="w-full"
                  disabled={!manualFood.name || !manualFood.calories}
                >
                  Add Food
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
