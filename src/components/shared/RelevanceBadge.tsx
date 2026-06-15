/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, XCircle, ArrowRight, X, History, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { cn } from "../../lib/utils";

export type RelevanceLevel = 'high' | 'medium' | 'low';
export type RelevanceCause = 'stale_data' | 'off_target' | 'ambiguous_link';

interface RelevanceBadgeProps {
  relevance: RelevanceLevel;
  className?: string;
  showIcon?: boolean;
  cause?: RelevanceCause;
  onAction?: (cause: RelevanceCause) => void;
}

const CAUSE_DETAILS = {
  stale_data: {
    title: "Stale Data",
    description: "This evidence is over 12 months old and may not reflect the client's current clinical presentation.",
    actionLabel: "Request Update",
    icon: History,
    color: "amber"
  },
  off_target: {
    title: "Secondary Focus",
    description: "While clinically valid, this observation relates to a secondary diagnosis not under primary review.",
    actionLabel: "Adjust Focus",
    icon: Target,
    color: "blue"
  },
  ambiguous_link: {
    title: "Weak Linkage",
    description: "The connection between this observation and the selected clinical criteria is indirect.",
    actionLabel: "Review Mapping",
    icon: AlertCircle,
    color: "red"
  }
};

export function RelevanceBadge({ 
  relevance, 
  className, 
  showIcon = true,
  cause,
  onAction
}: RelevanceBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPopoverPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const configs = {
    high: {
      variant: "balance" as const,
      icon: CheckCircle2,
      label: "High relevance"
    },
    medium: {
      variant: "mood" as const,
      icon: AlertCircle,
      label: "Mid relevance"
    },
    low: {
      variant: "reflection" as const,
      icon: XCircle,
      label: "Low relevance"
    }
  };

  const { variant, icon: Icon, label } = configs[relevance];
  const isClickable = relevance !== 'high' && !!cause;
  const causeDetail = cause ? CAUSE_DETAILS[cause] : null;

  const popover = (
    <AnimatePresence>
      {isOpen && causeDetail && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          style={{ 
            position: 'absolute',
            top: popoverPos.top,
            left: popoverPos.left,
            zIndex: 9999,
          }}
          className="mt-2 w-[280px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-divider p-4 overflow-hidden pointer-events-auto"
        >
          <div className="flex justify-between items-start mb-3">
            <div className={cn(
              "p-2 rounded-lg",
              causeDetail.color === 'amber' && "bg-amber-50 text-amber-600",
              causeDetail.color === 'red' && "bg-rose-50 text-rose-600",
              causeDetail.color === 'blue' && "bg-blue-50 text-blue-600"
            )}>
              <causeDetail.icon size={18} />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="p-1 text-text-disabled hover:text-text-primary transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <Typography variant="body-sm" className="font-bold mb-1">
            Relevance Insight
          </Typography>
          <Typography variant="body-sm" className="text-text-secondary text-[13px] leading-normal mb-4">
            {causeDetail.description}
          </Typography>

          <Button 
            variant="brand" 
            size="sm" 
            className="w-full h-8 text-xs font-bold gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(cause!);
              setIsOpen(false);
            }}
          >
            {causeDetail.actionLabel}
            <ArrowRight size={14} />
          </Button>
          
          <div className="mt-3 pt-3 border-t border-divider">
            <Typography variant="label-micro" className="text-[9px] uppercase tracking-wider text-text-disabled font-bold flex items-center gap-1.5 focus:outline-none">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
              Clinical Priority Protocol
            </Typography>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative inline-block" ref={containerRef}>
      <Badge 
        variant={variant} 
        className={cn(
          "gap-1.5 px-3 h-6 text-xs", 
          isClickable && "cursor-pointer hover:ring-1 hover:ring-offset-1 select-none transition-all active:scale-95",
          isClickable && relevance === 'medium' && "hover:ring-amber-400 font-bold",
          isClickable && relevance === 'low' && "hover:ring-rose-400 font-bold",
          className
        )}
        onClick={() => isClickable && setIsOpen(!isOpen)}
      >
        {showIcon && <Icon size={14} className="shrink-0" />}
        <span className="font-semibold tracking-tight">{label}</span>
      </Badge>

      {createPortal(popover, document.body)}
    </div>
  );
}

export function mapScoreToRelevance(score: number): RelevanceLevel {
  if (score >= 0.75) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}
