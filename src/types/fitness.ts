export interface Exercise {
  id: string;
  name: string;
  category: 'running' | 'cycling' | 'swimming' | 'walking' | 'hiking' | 'strength' | 'cardio' | 'sports' | 'other';
  hasDistance: boolean;
  hasElevation: boolean;
  hasTime: boolean;
  icon: string;
  metValue: number; // Metabolic equivalent for calorie calculation
}

export interface FitnessLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: Exercise['category'];
  date: string; // YYYY-MM-DD
  duration?: number; // in minutes
  distance?: number; // in miles
  elevationGain?: number; // in feet
  calories?: number;
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: 'fastest_mile' | 'longest_distance' | 'longest_duration' | 'highest_elevation' | 'fastest_5k' | 'fastest_10k';
  value: number;
  unit: string;
  date: string;
  logId: string;
}

export interface FitnessStreak {
  currentStreak: number; // weeks
  longestStreak: number; // weeks
  lastActiveWeek: string; // YYYY-Www format
  weeklyActivity: { week: string; workouts: number }[];
}

export interface WeeklyFitnessGoal {
  id: string;
  type: 'distance' | 'duration';
  exerciseId?: string; // Optional: specific exercise or category
  exerciseCategory?: Exercise['category']; // Optional: target category
  targetValue: number; // miles or minutes
  createdAt: string;
}
