/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Badge } from "@ui/index";
import { EntityCard } from "./EntityCard";
import { StatusBadge } from "@shared/StatusBadge";
import { Edit2, Trash2 } from "lucide-react";

import { getEvidenceBadgeProps } from "../utils/evidenceUtils";

interface EvidenceCardProps {
  key?: React.Key;
  evidence: any;
  onEdit?: (evidence: any) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  context?: string;
}

export const EvidenceCard = React.memo(function EvidenceCard({ evidence, onEdit, onDelete, onClick, context }: EvidenceCardProps) {
  const isVerbatim = evidence.type === 'verbatim' || !!evidence.verbatim;
  const isBehavioural = evidence.type === 'behavioural';
  
  const title = isVerbatim 
    ? `"${evidence.verbatim || evidence.text || evidence.label}"` 
    : (evidence.label || evidence.text);

  const badgeProps = getEvidenceBadgeProps(evidence.type, undefined, context || (evidence.sourceDocumentId ? "document" : "assessment"));

  const metadata = [
    { label: "Reference", value: evidence.timestamp || evidence.timestampValue || "05:12" },
  ];

  if (evidence.findings || evidence.tags) {
    metadata.push({
      label: "Clinical Tags",
      value: (
        <div className="flex flex-wrap gap-1">
          {(evidence.findings || []).map((f: any, fIdx: number) => (
            <Badge key={f.id || fIdx} variant="soft" className="px-2 py-0.5 text-xs text-slate-600 font-mono">
              {f.tags?.[0] || f.text}
            </Badge>
          ))}
          {(evidence.tags || []).map((tag: string, tIdx: number) => (
            <Badge key={`${tag}-${tIdx}`} variant="soft" className="px-2 py-0.5 text-xs text-slate-600 font-mono">
              {tag}
            </Badge>
          ))}
        </div>
      )
    });
  }

  const statusBadge = (
    <div className="flex items-center gap-2">
      <StatusBadge 
        status={badgeProps.status as any} 
        showIcon={false}
        label={badgeProps.label}
        className={badgeProps.className}
      />
      <StatusBadge 
        status={evidence.isUserGenerated ? 'user' : 'ai'} 
        showIcon={false}
      />
    </div>
  );

  const rightAction = (onEdit || onDelete) && (
    <div className="flex gap-2 items-center">
      {onEdit && (
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(evidence); }} 
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
        >
          <Edit2 size={14} />
        </button>
      )}
      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(evidence.id); }} 
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );

  return (
    <EntityCard 
      title={title}
      titleClassName={isVerbatim || isBehavioural ? "text-base font-bold leading-relaxed text-slate-800" : "font-bold"}
      metadata={metadata}
      statusBadge={statusBadge}
      rightAction={rightAction}
      onClick={onClick}
      hoverable={!!onClick}
    />
  );
});

EvidenceCard.displayName = "EvidenceCard";
