/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X } from "lucide-react";
import { Typography, CollapsibleSection } from "@ui/index";

interface AccordionTagsProps {
  tags: string[];
  findings: any[];
  onRemove?: (tag: string) => void;
  onRemoveSnippet?: (finding: any) => void;
  onNavigateToSource?: (srcId: string) => void;
  defaultOpen?: boolean;
}

export function AccordionTags({ 
  tags, 
  findings, 
  onRemove, 
  onRemoveSnippet,
  onNavigateToSource,
  defaultOpen = false 
}: AccordionTagsProps) {
  const getFindingsForTag = (tag: string) => {
    const searchTag = tag.toLowerCase().trim();
    return (findings || []).filter(f => {
      const fTags = (Array.isArray(f.tags) ? f.tags : (f.tag || '').split(',').map((t: string) => t.trim()).filter(Boolean)).map(t => t.toLowerCase());
      return fTags.includes(searchTag);
    });
  };

  if (!tags || tags.length === 0) {
    return (
      <div className="p-4 text-center border border-dashed border-divider rounded-xl bg-slate-50/30">
        <Typography variant="body-sm" className="text-slate-400 italic">No tags identified</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tags.map((tag, idx) => {
        const relatedFindings = getFindingsForTag(tag);
        return (
          <CollapsibleSection
            key={`${tag}-${idx}`}
            title={tag}
            defaultOpen={defaultOpen || (idx === 0)}
            className="border-divider bg-white"
            indicatorColor="#0ea5e9"
            headerAction={onRemove && (
              <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(tag);
                }}
                className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                type="button"
              >
                <X size={14} />
              </button>
            )}
          >
            <div className="space-y-3 pt-1 pb-1">
              {relatedFindings.map((f, fIdx) => (
                <div key={f.id || fIdx} className="bg-white p-4 rounded-xl border border-divider hover:border-primary/20 transition-all group relative">
                   {onRemoveSnippet && (
                     <button 
                       onClick={() => onRemoveSnippet(f)}
                       className="absolute top-3 right-3 p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors z-10"
                     >
                       <X size={14} />
                     </button>
                   )}
                   <Typography variant="body-sm" className="text-slate-700 leading-relaxed font-medium pr-8">
                    {f.type === 'verbatim' ? `"${f.text}"` : f.text}
                  </Typography>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                       <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                        {f.type || 'finding'}
                      </div>
                      <button 
                         onClick={() => onNavigateToSource?.(f.sessionId || f.sourceSessionId)}
                         className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100/50 rounded text-[9px] font-bold text-slate-400 uppercase tracking-tight hover:bg-slate-200 cursor-pointer transition-colors"
                      >
                         {f.sourceSession || "Clinical Data"}
                      </button>
                      {f.timestamp && <span className="text-[9px] text-slate-300">•</span>}
                      {f.timestamp && <span className="text-[9px] text-slate-400 font-medium">{f.timestamp}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {relatedFindings.length === 0 && (
                <div className="p-4 text-center bg-white/50 rounded-xl border border-dashed border-divider">
                    <Typography variant="body-sm" className="text-slate-400 italic">No direct evidence snippets for this tag</Typography>
                </div>
              )}
            </div>
          </CollapsibleSection>
        );
      })}
    </div>
  );
}
