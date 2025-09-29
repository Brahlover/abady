
import React, { useState } from 'react';
import { TaskType } from '../types';

interface TaskFormProps {
  onAddTask: (name: string, type: TaskType, duration: number) => string | null;
  funTimeBank: number;
  remainingHours: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, funTimeBank, remainingHours }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TaskType>(TaskType.Work);
  const [duration, setDuration] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Task name cannot be empty.");
      return;
    }
    if(duration > remainingHours) {
        setError(`Not enough time. Only ${remainingHours} hours left on the clock.`);
        return;
    }

    const result = onAddTask(name, type, duration);
    if (result) {
      setError(result);
    } else {
      setName('');
      setDuration(1);
      setType(TaskType.Work);
      setError(null);
    }
  };

  return (
    <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-4">Add a New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-name" className="block text-sm font-medium text-slate-300 mb-1">Task Name</label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Design new feature"
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-type" className="block text-sm font-medium text-slate-300 mb-1">Type</label>
            <select
              id="task-type"
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
            >
              <option value={TaskType.Work}>Work</option>
              <option value={TaskType.Fun} disabled={funTimeBank <= 0}>Fun</option>
            </select>
          </div>
          <div>
            <label htmlFor="task-duration" className="block text-sm font-medium text-slate-300 mb-1">Duration (hrs)</label>
            <input
              id="task-duration"
              type="number"
              min="1"
              max={remainingHours}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
            />
          </div>
        </div>
        
        {error && <p className="text-sm text-red-400">{error}</p>}
        
        <button type="submit" className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors duration-200">
          Add to Clock
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
