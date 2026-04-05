'use client';

import { Filter } from 'lucide-react';
import { TaskStatus } from '@/types';

interface FilterDropdownProps {
  value: TaskStatus | '';
  onChange: (value: TaskStatus | '') => void;
}

const options: { label: string; value: TaskStatus | '' }[] = [
  { label: 'All tasks', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

export function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  return (
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TaskStatus | '')}
        className="input-field pl-9 pr-8 appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface-card">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
