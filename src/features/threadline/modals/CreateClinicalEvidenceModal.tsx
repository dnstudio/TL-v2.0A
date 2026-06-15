/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Modal, Typography, Badge, Button, Textarea, Select, SearchableSelect } from "@ui/index";
import { COMMON_TAGS } from "./constants";
import { cn } from "../../../lib/utils";

interface CreateClinicalEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
  initialText?: string;
  initialReference?: string;
  initialTags?: string[];
  initialChunkId?: string;
  initialPage?: number;
  editingItem?: any | null;
  context?: 'session' | 'document' | 'assessment';
}

export function CreateClinicalEvidenceModal({ 
  isOpen, 
  onClose, 
  onCreate,
  initialText = "",
  initialReference = "",
  initialTags = [],
  initialChunkId = "",
  initialPage = 0,
  editingItem = null,
  context = 'session'
}: CreateClinicalEvidenceModalProps) {
  const [text, setText] = useState(initialText);
  const [type, setType] = useState<string>('verbatim');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [notes, setNotes] = useState("");
  const [source, setSource] = useState(editingItem?.sourceLabel || "");
  
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setText(editingItem.text || "");
        
        let initialType = editingItem.type;
        if (context === 'assessment') initialType = 'observation';
        else if (context === 'document') initialType = 'observation';
        else if (context === 'session') {
          if (initialType !== 'verbatim' && initialType !== 'behavioural') {
            initialType = 'verbatim';
          }
        }
        setType(initialType);
        
        setTags(editingItem.tags || []);
        setNotes(editingItem.notes || "");
        setSource(editingItem.sourceLabel || "");
      } else {
        setText(initialText);
        setTags(initialTags || []);
        
        let defaultType = 'verbatim';
        if (context === 'assessment') defaultType = 'observation';
        else if (context === 'document') defaultType = 'observation';
        setType(defaultType);
        
        setNotes("");
        setSource("");
      }
    }
  }, [isOpen, editingItem, context, initialText, initialTags]);

  const handleCreate = () => {
    const defaultTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onCreate({
      ...editingItem,
      id: editingItem ? editingItem.id : `ev-${Date.now()}`,
      text,
      type,
      tags,
      notes,
      sourceLabel: source,
      timestamp: editingItem?.timestamp || initialReference || defaultTimestamp,
      framework: editingItem?.framework || "DSM-5",
      isUserGenerated: true,
      chunkId: editingItem?.chunkId || initialChunkId,
      page: editingItem?.page || initialPage,
    });
    onClose();
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} className="px-6 py-2.5">
        Cancel
      </Button>
      <Button 
        onClick={handleCreate}
        className="px-6 py-2.5 bg-[#06302c] text-white font-semibold rounded-md hover:opacity-90 transition-all font-sans"
      >
        {editingItem ? 'Save Changes' : 'Create Clinical Evidence'}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        context === 'document' ? "Extract Evidence" : 
        (context === 'assessment' ? "Add Supporting Evidence" : 
        (editingItem ? "Edit Clinical Evidence" : "Create Clinical Evidence"))
      } 
      footer={footer} 
      width={600}
    >
      <div className="space-y-6 font-sans">
        <div className="space-y-4">
          <div className="space-y-2">
            <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">
              Evidence Type
            </Typography>
            <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
              {context === 'session' && (
                <>
                  <button 
                    type="button"
                    onClick={() => setType('verbatim')}
                    className={cn(
                      "px-6 py-1.5 rounded-md text-[10px] font-bold transition-all tracking-wider",
                      type === 'verbatim' ? "bg-white text-[#06302c] shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    VERBATIM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('behavioural')}
                    className={cn(
                      "px-6 py-1.5 rounded-md text-[10px] font-bold transition-all tracking-wider",
                      type === 'behavioural' ? "bg-white text-[#06302c] shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    BEHAVIOURAL
                  </button>
                </>
              )}
              {context === 'assessment' && (
                <button 
                  type="button"
                  className="px-6 py-1.5 rounded-md text-[10px] font-bold transition-all tracking-wider bg-white text-[#06302c] shadow-sm cursor-default"
                >
                  OBSERVATION
                </button>
              )}
              {context === 'document' && (
                <button 
                  type="button"
                  className="px-6 py-1.5 rounded-md text-[10px] font-bold transition-all tracking-wider bg-white text-[#06302c] shadow-sm cursor-default"
                >
                  OBSERVATION
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">
              Observation Summary
            </Typography>
            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              className="min-h-[100px]"
              placeholder={context === 'document' || context === 'assessment' ? "Clinical evidence finding..." : "Describe the observed clinical behavior or quote..."}
            />
          </div>

          {context === 'assessment' && (
            <div className="space-y-2">
              <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Source</Typography>
              <Select 
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="" disabled>Select Source</option>
                <option value="OVERALL SEVERITY LEVEL">OVERALL SEVERITY LEVEL</option>
                <option value="TOTAL SCORE">TOTAL SCORE</option>
                <option value="PERCENTILE">PERCENTILE</option>
                <option value="OVERALL IMPRESSION">OVERALL IMPRESSION</option>
                <option value="CLINICAL THREAD ANALYSIS">CLINICAL THREAD ANALYSIS</option>
                <option value="PHYSICAL AROUSAL">PHYSICAL AROUSAL</option>
                <option value="COGNITIVE FOCUS">COGNITIVE FOCUS</option>
                <option value="NEXT STEPS">NEXT STEPS</option>
                <option value="Diagnostic Interview">Diagnostic Interview</option>
              </Select>
            </div>
          )}

          <div className="space-y-4">
             <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Clinical Tags</Typography>
             
             <div className="flex flex-wrap gap-2 mb-1 min-h-[44px] p-3 bg-slate-50 border border-divider rounded-xl">
               {tags.map(tag => (
                 <Badge key={tag} variant="soft" className="bg-primary/10 text-primary border-none px-2.5 py-1.5 flex items-center gap-1.5 animate-in fade-in zoom-in-75 duration-200">
                   {tag}
                   <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => toggleTag(tag)} />
                 </Badge>
               ))}
               {tags.length === 0 && <span className="text-xs text-slate-400 italic self-center">No tags added...</span>}
             </div>
             
             <SearchableSelect 
               label="Add Tag"
               value=""
               onChange={(val) => {
                 if (val && !tags.includes(val)) {
                   toggleTag(val);
                 }
               }}
               options={COMMON_TAGS.map(t => ({ value: t, label: t }))}
               placeholder="Search and add clinical tags..."
               className="bg-white"
             />
          </div>

          <div className="space-y-2">
            <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Clinical Notes</Typography>
            <Textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Add additional context or notes for this evidence..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
