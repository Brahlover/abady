
import React, { useState, useMemo, useCallback } from 'react';
import { Task, TaskType } from './types';
import { WORK_TO_FUN_RATIO, TOTAL_HOURS } from './constants';
import ProductivityClock from './components/ProductivityClock';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TimeBank from './components/TimeBank';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [funTimeBank, setFunTimeBank] = useState<number>(0); // in hours

  const isHourOccupied = useMemo(() => {
    const occupiedSlots = new Array(TOTAL_HOURS).fill(false);
    tasks.forEach(task => {
      for (let i = 0; i < task.duration; i++) {
        const hourIndex = (task.startHour + i) % TOTAL_HOURS;
        occupiedSlots[hourIndex] = true;
      }
    });
    return occupiedSlots;
  }, [tasks]);

  const totalHoursScheduled = useMemo(() => {
    return isHourOccupied.filter(Boolean).length;
  }, [isHourOccupied]);

  const findFreeSlot = useCallback((duration: number): number => {
    if (duration > TOTAL_HOURS - totalHoursScheduled) return -1;
    
    for (let i = 0; i < TOTAL_HOURS; i++) {
      let isSlotAvailable = true;
      for (let j = 0; j < duration; j++) {
        if (isHourOccupied[(i + j) % TOTAL_HOURS]) {
          isSlotAvailable = false;
          break;
        }
      }
      if (isSlotAvailable) {
        return i;
      }
    }
    return -1;
  }, [isHourOccupied, totalHoursScheduled]);

  const handleAddTask = (taskName: string, taskType: TaskType, duration: number): string | null => {
    const startHour = findFreeSlot(duration);
    if (startHour === -1) {
      return "Not enough free time on the clock for this task.";
    }

    if (taskType === TaskType.Fun && duration > funTimeBank) {
      return "Not enough fun time earned. Complete more work tasks!";
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskName,
      type: taskType,
      duration,
      startHour,
    };

    setTasks(prevTasks => [...prevTasks, newTask].sort((a,b) => a.startHour - b.startHour));

    if (taskType === TaskType.Work) {
      setFunTimeBank(prev => prev + duration / WORK_TO_FUN_RATIO);
    } else {
      setFunTimeBank(prev => prev - duration);
    }
    
    return null; // Success
  };
  
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    if (taskToDelete.type === TaskType.Work) {
      setFunTimeBank(prev => Math.max(0, prev - taskToDelete.duration / WORK_TO_FUN_RATIO));
    } else {
      setFunTimeBank(prev => prev + taskToDelete.duration);
    }

    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
  };


  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Productivity Cycle</h1>
        <p className="text-slate-400 mt-2">Balance your work and fun. Earn rewards for your focus.</p>
      </header>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Clock and Time Bank */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <ProductivityClock tasks={tasks} />
          <TimeBank hours={funTimeBank} />
        </div>

        {/* Right Column: Task Management */}
        <div className="space-y-6">
          <TaskForm onAddTask={handleAddTask} funTimeBank={funTimeBank} remainingHours={TOTAL_HOURS - totalHoursScheduled} />
          <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
        </div>
      </div>
    </div>
  );
};

export default App;
