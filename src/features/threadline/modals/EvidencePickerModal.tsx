/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Modal, Typography, Checkbox, Button } from "@ui/index";

import { getEvidenceBadgeProps } from "../utils/evidenceUtils";
import { cn } from "@lib/utils";

interface EvidencePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMultiple: (items: any[]) => void;
  pool: any[];
  alreadyAddedIds?: string[];
}

export function EvidencePickerModal({ 
  isOpen, 
  onClose, 
  onSelectMultiple,
  pool,
  alreadyAddedIds = []
}: EvidencePickerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selection when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
      setSearch("");
      setSelectedTag("all");
      setSelectedSource("all");
    }
  }, [isOpen]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    pool.forEach(f => {
      const fTags = Array.isArray(f.tags) ? f.tags : (f.tag || '').split(',').map((t: string) => t.trim()).filter(Boolean);
      fTags.forEach((t: string) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [pool]);

  const allSources = useMemo(() => {
    const sources = new Set<string>();
    pool.forEach(f => {
      if (f.sourceSession) sources.add(f.sourceSession);
    });
    return Array.from(sources).sort();
  }, [pool]);

  const filtered = useMemo(() => {
    return pool.filter(f => {
      if (alreadyAddedIds.includes(f.id)) return false;
      
      const searchMatch = search === "" || 
        f.text.toLowerCase().includes(search.toLowerCase()) || 
        (f.sourceSession || "").toLowerCase().includes(search.toLowerCase());
      
      const fTags = Array.isArray(f.tags) ? f.tags : (f.tag || '').split(',').map((t: string) => t.trim()).filter(Boolean);
      const tagMatch = selectedTag === "all" || fTags.includes(selectedTag);
      
      const sourceMatch = selectedSource === "all" || f.sourceSession === selectedSource;

      return searchMatch && tagMatch && sourceMatch;
    });
  }, [pool, alreadyAddedIds, search, selectedTag, selectedSource]);

  const handleToggle = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleConfirm = () => {
    const items = pool.filter(f => selectedIds.has(f.id));
    onSelectMultiple(items);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Select Clinical Evidence" 
      width={700}
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            className="bg-[#06302c]"
          >
            Add Selected ({selectedIds.size})
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-divider rounded-xl text-sm outline-none focus:border-primary/40 focus:bg-white transition-all h-10"
              placeholder="Search evidence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="relative flex-shrink-0" ref={filterRef}>
            <Button 
              variant={(selectedTag !== 'all' || selectedSource !== 'all') ? "primary" : "outline"}
              className="h-10 w-10 flex items-center justify-center p-0 rounded-xl"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={16} />
            </Button>
            
            {isFilterOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-divider rounded-xl shadow-lg p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="body-sm" className="font-semibold text-slate-800">Filters</Typography>
                  {(selectedTag !== 'all' || selectedSource !== 'all') && (
                    <button 
                      onClick={() => { setSelectedTag('all'); setSelectedSource('all'); }}
                      className="text-[10px] text-primary hover:underline font-semibold uppercase tracking-wider"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Typography variant="label-micro" className="text-slate-500 uppercase font-bold tracking-wider">By Tag</Typography>
                    <select 
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="w-full h-9 px-3 py-1 bg-slate-50 border border-divider rounded-lg text-sm outline-none focus:border-primary/40"
                    >
                      <option value="all">All Tags</option>
                      {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Typography variant="label-micro" className="text-slate-500 uppercase font-bold tracking-wider">By Source</Typography>
                    <select 
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      className="w-full h-9 px-3 py-1 bg-slate-50 border border-divider rounded-lg text-sm outline-none focus:border-primary/40"
                    >
                      <option value="all">All Sources</option>
                      {allSources.map(source => <option key={source} value={source}>{source}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map((item, idx) => (
            <button
              key={item.id || idx}
              onClick={() => handleToggle(item.id)}
              className="w-full text-left p-4 bg-white border border-divider rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group flex items-start gap-4"
            >
              <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={selectedIds.has(item.id)} 
                  onCheckedChange={() => handleToggle(item.id)} 
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Typography variant="body-sm" className="text-slate-800 leading-relaxed font-medium line-clamp-2">
                  {item.type === 'verbatim' ? `"${item.text}"` : item.text}
                </Typography>
                <div className="flex items-center gap-3 flex-wrap">
                  {(() => {
                    const badgeProps = getEvidenceBadgeProps(
                      item.type,
                      item.status,
                      item.context || (item.sourceDocumentId ? "document" : (item.sourceAssessmentId ? "assessment" : "session"))
                    );
                    return (
                      <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight", badgeProps.className)}>
                        {badgeProps.label}
                      </div>
                    );
                  })()}
                  <Typography variant="label-micro" className="text-slate-400">
                    {item.sourceSession} • {item.timestamp}
                  </Typography>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center border border-dashed border-divider rounded-xl bg-slate-50/50">
              <Typography variant="body-sm" className="text-slate-400 italic">No available evidence matching your filters.</Typography>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
