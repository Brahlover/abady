
export enum TaskType {
  Work = 'Work',
  Fun = 'Fun',
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  duration: number; // in hours
  startHour: number; // 0-11
}
