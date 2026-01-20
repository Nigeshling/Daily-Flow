import { Exercise } from '@/types/fitness';

export const exercises: Exercise[] = [
  // Running (MET values: 8-12 depending on intensity)
  { id: 'run-outdoor', name: 'Outdoor Run', category: 'running', hasDistance: true, hasElevation: true, hasTime: true, icon: '🏃', metValue: 9.8 },
  { id: 'run-treadmill', name: 'Treadmill Run', category: 'running', hasDistance: true, hasElevation: false, hasTime: true, icon: '🏃', metValue: 9.0 },
  { id: 'run-trail', name: 'Trail Run', category: 'running', hasDistance: true, hasElevation: true, hasTime: true, icon: '🏔️', metValue: 10.5 },
  { id: 'run-interval', name: 'Interval Training', category: 'running', hasDistance: true, hasElevation: false, hasTime: true, icon: '⚡', metValue: 11.0 },
  { id: 'run-sprint', name: 'Sprints', category: 'running', hasDistance: true, hasElevation: false, hasTime: true, icon: '💨', metValue: 12.0 },
  
  // Cycling (MET values: 6-10)
  { id: 'cycle-outdoor', name: 'Outdoor Cycling', category: 'cycling', hasDistance: true, hasElevation: true, hasTime: true, icon: '🚴', metValue: 8.0 },
  { id: 'cycle-indoor', name: 'Indoor Cycling', category: 'cycling', hasDistance: true, hasElevation: false, hasTime: true, icon: '🚴', metValue: 7.0 },
  { id: 'cycle-mountain', name: 'Mountain Biking', category: 'cycling', hasDistance: true, hasElevation: true, hasTime: true, icon: '🚵', metValue: 9.0 },
  { id: 'cycle-spin', name: 'Spin Class', category: 'cycling', hasDistance: false, hasElevation: false, hasTime: true, icon: '🚴', metValue: 8.5 },
  
  // Swimming (MET values: 6-10)
  { id: 'swim-pool', name: 'Pool Swimming', category: 'swimming', hasDistance: true, hasElevation: false, hasTime: true, icon: '🏊', metValue: 8.0 },
  { id: 'swim-open', name: 'Open Water Swimming', category: 'swimming', hasDistance: true, hasElevation: false, hasTime: true, icon: '🌊', metValue: 9.5 },
  
  // Walking (MET values: 3-5)
  { id: 'walk-outdoor', name: 'Walk', category: 'walking', hasDistance: true, hasElevation: true, hasTime: true, icon: '🚶', metValue: 3.5 },
  { id: 'walk-power', name: 'Power Walk', category: 'walking', hasDistance: true, hasElevation: true, hasTime: true, icon: '🚶', metValue: 5.0 },
  { id: 'walk-nordic', name: 'Nordic Walking', category: 'walking', hasDistance: true, hasElevation: true, hasTime: true, icon: '🥾', metValue: 6.0 },
  
  // Hiking (MET values: 5-8)
  { id: 'hike-easy', name: 'Easy Hike', category: 'hiking', hasDistance: true, hasElevation: true, hasTime: true, icon: '🥾', metValue: 5.0 },
  { id: 'hike-moderate', name: 'Moderate Hike', category: 'hiking', hasDistance: true, hasElevation: true, hasTime: true, icon: '⛰️', metValue: 6.5 },
  { id: 'hike-strenuous', name: 'Strenuous Hike', category: 'hiking', hasDistance: true, hasElevation: true, hasTime: true, icon: '🏔️', metValue: 8.0 },
  { id: 'hike-backpacking', name: 'Backpacking', category: 'hiking', hasDistance: true, hasElevation: true, hasTime: true, icon: '🎒', metValue: 7.5 },
  
  // Strength (MET values: 3-6)
  { id: 'strength-weight', name: 'Weight Training', category: 'strength', hasDistance: false, hasElevation: false, hasTime: true, icon: '🏋️', metValue: 5.0 },
  { id: 'strength-bodyweight', name: 'Bodyweight Training', category: 'strength', hasDistance: false, hasElevation: false, hasTime: true, icon: '💪', metValue: 4.0 },
  { id: 'strength-crossfit', name: 'CrossFit', category: 'strength', hasDistance: false, hasElevation: false, hasTime: true, icon: '🏋️', metValue: 8.0 },
  { id: 'strength-powerlifting', name: 'Powerlifting', category: 'strength', hasDistance: false, hasElevation: false, hasTime: true, icon: '🏋️', metValue: 6.0 },
  { id: 'strength-kettlebell', name: 'Kettlebell', category: 'strength', hasDistance: false, hasElevation: false, hasTime: true, icon: '🔔', metValue: 6.0 },
  
  // Cardio (MET values: 6-12)
  { id: 'cardio-hiit', name: 'HIIT', category: 'cardio', hasDistance: false, hasElevation: false, hasTime: true, icon: '🔥', metValue: 10.0 },
  { id: 'cardio-elliptical', name: 'Elliptical', category: 'cardio', hasDistance: true, hasElevation: false, hasTime: true, icon: '🏃', metValue: 7.0 },
  { id: 'cardio-rowing', name: 'Rowing', category: 'cardio', hasDistance: true, hasElevation: false, hasTime: true, icon: '🚣', metValue: 8.5 },
  { id: 'cardio-jump-rope', name: 'Jump Rope', category: 'cardio', hasDistance: false, hasElevation: false, hasTime: true, icon: '🪢', metValue: 11.0 },
  { id: 'cardio-stair', name: 'Stair Climber', category: 'cardio', hasDistance: false, hasElevation: true, hasTime: true, icon: '🪜', metValue: 9.0 },
  { id: 'cardio-dance', name: 'Dance Workout', category: 'cardio', hasDistance: false, hasElevation: false, hasTime: true, icon: '💃', metValue: 6.5 },
  { id: 'cardio-aerobics', name: 'Aerobics', category: 'cardio', hasDistance: false, hasElevation: false, hasTime: true, icon: '🤸', metValue: 7.0 },
  
  // Sports (MET values vary widely)
  { id: 'sport-basketball', name: 'Basketball', category: 'sports', hasDistance: false, hasElevation: false, hasTime: true, icon: '🏀', metValue: 8.0 },
  { id: 'sport-soccer', name: 'Soccer', category: 'sports', hasDistance: true, hasElevation: false, hasTime: true, icon: '⚽', metValue: 9.0 },
  { id: 'sport-tennis', name: 'Tennis', category: 'sports', hasDistance: false, hasElevation: false, hasTime: true, icon: '🎾', metValue: 7.5 },
  { id: 'sport-golf', name: 'Golf', category: 'sports', hasDistance: true, hasElevation: false, hasTime: true, icon: '⛳', metValue: 4.5 },
  { id: 'sport-boxing', name: 'Boxing', category: 'sports', hasDistance: false, hasElevation: false, hasTime: true, icon: '🥊', metValue: 9.0 },
  { id: 'sport-martial-arts', name: 'Martial Arts', category: 'sports', hasDistance: false, hasElevation: false, hasTime: true, icon: '🥋', metValue: 8.0 },
  { id: 'sport-volleyball', name: 'Volleyball', category: 'sports', hasDistance: false, hasElevation: false, hasTime: true, icon: '🏐', metValue: 6.0 },
  { id: 'sport-badminton', name: 'Badminton', category: 'sports', hasDistance: false, hasElevation: false, hasTime: true, icon: '🏸', metValue: 5.5 },
  { id: 'sport-table-tennis', name: 'Table Tennis', category: 'sports', hasDistance: false, hasElevation: false, hasTime: true, icon: '🏓', metValue: 4.0 },
  { id: 'sport-climbing', name: 'Rock Climbing', category: 'sports', hasDistance: false, hasElevation: true, hasTime: true, icon: '🧗', metValue: 8.0 },
  { id: 'sport-skiing', name: 'Skiing', category: 'sports', hasDistance: true, hasElevation: true, hasTime: true, icon: '⛷️', metValue: 7.0 },
  { id: 'sport-snowboarding', name: 'Snowboarding', category: 'sports', hasDistance: true, hasElevation: true, hasTime: true, icon: '🏂', metValue: 6.0 },
  { id: 'sport-skateboarding', name: 'Skateboarding', category: 'sports', hasDistance: true, hasElevation: false, hasTime: true, icon: '🛹', metValue: 5.0 },
  { id: 'sport-surfing', name: 'Surfing', category: 'sports', hasDistance: false, hasElevation: false, hasTime: true, icon: '🏄', metValue: 6.0 },
  
  // Other (MET values: 2-5)
  { id: 'yoga', name: 'Yoga', category: 'other', hasDistance: false, hasElevation: false, hasTime: true, icon: '🧘', metValue: 3.0 },
  { id: 'pilates', name: 'Pilates', category: 'other', hasDistance: false, hasElevation: false, hasTime: true, icon: '🤸', metValue: 3.5 },
  { id: 'stretching', name: 'Stretching', category: 'other', hasDistance: false, hasElevation: false, hasTime: true, icon: '🙆', metValue: 2.5 },
  { id: 'meditation', name: 'Meditation', category: 'other', hasDistance: false, hasElevation: false, hasTime: true, icon: '🧘', metValue: 1.5 },
  { id: 'other-custom', name: 'Other Exercise', category: 'other', hasDistance: true, hasElevation: true, hasTime: true, icon: '🏅', metValue: 5.0 },
];

export const exerciseCategories = [
  { id: 'running', name: 'Running', icon: '🏃' },
  { id: 'cycling', name: 'Cycling', icon: '🚴' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'walking', name: 'Walking', icon: '🚶' },
  { id: 'hiking', name: 'Hiking', icon: '🥾' },
  { id: 'strength', name: 'Strength', icon: '🏋️' },
  { id: 'cardio', name: 'Cardio', icon: '🔥' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'other', name: 'Other', icon: '🏅' },
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(e => e.id === id);
};

export const getExercisesByCategory = (category: Exercise['category']): Exercise[] => {
  return exercises.filter(e => e.category === category);
};
