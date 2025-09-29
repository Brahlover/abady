
import React from 'react';

interface TimeBankProps {
  hours: number;
}

const TimeBank: React.FC<TimeBankProps> = ({ hours }) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm font-medium text-slate-400">REWARD BALANCE</p>
      <p className="text-3xl font-bold text-emerald-400 tracking-tight">
        {hours.toFixed(2)}
        <span className="text-xl font-semibold text-emerald-300 ml-1">hours</span>
      </p>
    </div>
  );
};

export default TimeBank;
