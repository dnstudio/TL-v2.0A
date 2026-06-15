import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@lib/utils";
import { TYPE_SCALE, BRAND, TEXT_PRIMARY, TEXT_SECONDARY } from "../constants";

interface ProgressBannerProps {
  title: string;
  subtitle: string;
  current: number;
  total: number;
  progressLabel: string;
  actionLabel: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  isActionActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  breakdown?: { label: string; current: number; total: number }[];
}

export function ProgressBanner({
  title,
  subtitle,
  current,
  total,
  progressLabel,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  isActionActive = false,
  className,
  style,
  breakdown
}: ProgressBannerProps) {
  const isComplete = current >= total;
  const active = isActionActive || isComplete;
  
  return (
    <div className={cn("bg-white flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 rounded-none sm:rounded-xl sm:border border-t border-b border-divider", className)}>
      <div className="w-full md:w-auto text-center md:text-left flex-1">
        <div className="text-[16px] font-semibold text-slate-900 mb-1">{title}</div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900/70">{subtitle}</div>
        {breakdown && breakdown.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-start">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className={cn("inline-block w-1.5 h-1.5 rounded-full", item.current >= item.total ? "bg-slate-900" : "bg-gray-300")} />
                <span className="text-[10px] text-slate-900/70 whitespace-nowrap">
                  {item.label}: <span className="font-medium text-slate-900">{item.current}/{item.total}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full md:w-auto self-center">
        <div className="flex items-center gap-4 w-full justify-center sm:justify-start sm:w-auto">
          <span className="text-[13px] text-slate-900/70 whitespace-nowrap">
            <span className="font-medium text-slate-900">{current}</span> of {total} {progressLabel}
          </span>
          <div className="w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
            <motion.div 
              animate={{ width: `${Math.min((current / total) * 100, 100)}%` }}
              className="h-full bg-slate-900"
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <button 
          onClick={active ? onAction : undefined}
          disabled={!active}
          className={cn(
            "flex items-center justify-center gap-2 whitespace-nowrap transition-all w-full sm:w-auto",
            "px-6 py-2.5 rounded-full font-bold text-sm",
            !active ? "bg-slate-400 text-white cursor-not-allowed opacity-70" : "bg-primary text-white cursor-pointer"
          )}
        >
          {ActionIcon && <ActionIcon size={18} />}
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
