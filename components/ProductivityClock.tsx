
import React from 'react';
import { Task, TaskType } from '../types';
import { TOTAL_HOURS } from '../constants';

interface ProductivityClockProps {
  tasks: Task[];
}

const ProductivityClock: React.FC<ProductivityClockProps> = ({ tasks }) => {
  const size = 400;
  const center = size / 2;
  const radius = size / 2 - 30;
  const strokeWidth = 25;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
    return d;
  };
  
  const hourSegments = Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const hour = i;
    const task = tasks.find(t => {
      for (let j = 0; j < t.duration; j++) {
        if ((t.startHour + j) % TOTAL_HOURS === hour) return true;
      }
      return false;
    });

    const anglePerSegment = 360 / TOTAL_HOURS;
    const startAngle = hour * anglePerSegment;
    const endAngle = startAngle + anglePerSegment;

    const color = task ? (task.type === TaskType.Work ? 'stroke-sky-500' : 'stroke-emerald-500') : 'stroke-slate-700';
    const pathData = describeArc(center, center, radius, startAngle + 2, endAngle - 2); // Add padding between segments

    return (
      <g key={hour}>
        <path d={pathData} fill="none" className={`${color} transition-all duration-300`} strokeWidth={strokeWidth} strokeLinecap="round">
          {task && <title>{task.name} ({task.type})</title>}
        </path>
      </g>
    );
  });
  
  const hourLabels = [12, 3, 6, 9].map((hour) => {
      const angle = (hour % 12) * 30;
      const pos = polarToCartesian(center, center, radius + 20, angle);
      return (
        <text key={hour} x={pos.x} y={pos.y} dy=".3em" textAnchor="middle" className="text-xs fill-slate-400 font-semibold">
          {hour}
        </text>
      )
  });

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#334155" strokeWidth="1" />
         <g>{hourSegments}</g>
         {hourLabels}
      </svg>
    </div>
  );
};

export default ProductivityClock;
