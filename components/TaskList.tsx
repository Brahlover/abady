
import React from 'react';
import { Task, TaskType } from '../types';
import TrashIcon from './icons/TrashIcon';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
        <div className="p-6 text-center bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-2">Your Clock is Empty</h2>
            <p className="text-slate-400">Add a task to start your productivity cycle!</p>
        </div>
    );
  }

  return (
    <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-4">Scheduled Tasks</h2>
      <ul className="space-y-3">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg animate-fade-in">
            <div className="flex items-center space-x-3">
                <div className={`w-2 h-8 rounded-full ${task.type === TaskType.Work ? 'bg-sky-500' : 'bg-emerald-500'}`}></div>
                <div>
                    <p className="font-medium text-white">{task.name}</p>
                    <p className="text-xs text-slate-400">{task.duration} {task.duration > 1 ? 'hours' : 'hour'} - {task.type}</p>
                </div>
            </div>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white transition-colors"
              aria-label={`Delete task ${task.name}`}
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
