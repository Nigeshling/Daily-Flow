export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: Date;
}

export interface SleepLog {
  id: string;
  bedtime: string; // HH:mm format
  wakeTime: string; // HH:mm format
  date: string; // YYYY-MM-DD
  duration: number; // in hours
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number; // grams
  sodium?: number; // mg
  isCustom?: boolean;
}

export interface FoodLog {
  id: string;
  food: FoodItem;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
}

export interface HealthGoals {
  dailyWater: number; // ml
  dailyCalories: number;
  sleepHours: number;
  sleepBedtime?: string; // target bedtime HH:mm
  sleepWakeTime?: string; // target wake time HH:mm
}

export interface WeeklySummary {
  avgWater: number;
  avgCalories: number;
  avgSleep: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  totalDaysLogged: number;
  waterGoalMet: number;
  calorieGoalMet: number;
  sleepGoalMet: number;
}
