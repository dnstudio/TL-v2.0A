import React from 'react';
import { Sparkles } from 'lucide-react';

export const SysBadge: React.FC<{ className?: string, children?: React.ReactNode }> = ({ className = "", children }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-slate-200 rounded-md bg-slate-50 text-[11px] font-medium text-slate-700 whitespace-nowrap transition-all duration-200 ${className}`}>
    <Sparkles size={11} /> {children || 'AI Insights'}
  </span>
);
