/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { 
  AlertTriangle, 
  FileX, 
  Clock, 
  CheckCircle, 
  Plus as AddIcon, 
  HelpCircle,
  User,
  Target,
  Scale,
  Moon,
  Link2,
  Sun,
  BookOpen
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

const STATUS_META = {
  'not-started': { label: 'Not Started', variant: 'soft' as const, icon: Clock },
  'required': { label: 'Required', variant: 'focus' as const, icon: Clock },
  'missing': { label: 'Missing', variant: 'reflection' as const, icon: FileX },
  'in-progress': { label: 'In Progress', variant: 'focus' as const, icon: Clock },
  'processing': { label: 'Processing', variant: 'focus' as const, icon: Clock },
  'completed': { label: 'Completed', variant: 'balance' as const, icon: CheckCircle },
  'uploaded': { label: 'Uploaded', variant: 'balance' as const, icon: CheckCircle },
  'ready': { label: 'Ready', variant: 'balance' as const, icon: CheckCircle },
  'conflict': { label: 'Conflict', variant: 'reflection' as const, icon: AlertTriangle },
  'conflicts-unresolved': { label: 'Conflicts', variant: 'reflection' as const, icon: AlertTriangle },
  'missing-documents': { label: 'Missing Docs', variant: 'focus' as const, icon: FileX },
  'new': { label: 'New', variant: 'default' as const, icon: AddIcon },
  'optional': { label: 'Optional', variant: 'sleep' as const, icon: HelpCircle },
  'clinician': { label: 'Clinician', variant: 'focus' as const, icon: User },
  'ai': { label: 'AI', variant: 'outline-sleep' as const, icon: HelpCircle },
  'user': { label: 'User', variant: 'outline-focus' as const, icon: User },
  'approved': { label: 'Approved', variant: 'balance' as const, icon: CheckCircle },
  'draft': { label: 'Draft', variant: 'default' as const, icon: Clock },
  'deprecated': { label: 'Deprecated', variant: 'reflection' as const, icon: AlertTriangle },
  'evidence': { label: 'Evidence', variant: 'connection' as const, icon: Clock },
  'focus': { label: 'Focus', variant: 'focus' as const, icon: Target },
  'balance': { label: 'Balance', variant: 'balance' as const, icon: Scale },
  'sleep': { label: 'Sleep', variant: 'sleep' as const, icon: Moon },
  'connection': { label: 'Connection', variant: 'connection' as const, icon: Link2 },
  'mood': { label: 'Mood', variant: 'mood' as const, icon: Sun },
  'reflection': { label: 'Reflection', variant: 'reflection' as const, icon: BookOpen },
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  showIcon?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  key?: any;
}

export function StatusBadge({ status, label, className, showIcon = true, onClick, style }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  const config = (STATUS_META as any)[normalizedStatus] || STATUS_META['not-started'];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        "gap-1 uppercase text-[10px] tracking-wider font-bold h-5 px-2 rounded cursor-default", 
        onClick && "cursor-pointer", 
        className
      )}
      onClick={onClick}
      style={style}
    >
      {showIcon && <Icon size={12} strokeWidth={2.5} className="shrink-0" />}
      {label || config.label}
    </Badge>
  );
}
