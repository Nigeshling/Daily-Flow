export interface TaskType {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate: Date;
  taskType?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'focus' | 'break';
  sessionsCompleted: number;
}
