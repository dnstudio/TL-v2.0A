/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Modal, Typography, SearchableSelect, Button, Input, Select, Textarea } from "@ui/index";
import { cn } from "@lib/utils";
import { COMMON_FRAMEWORKS, COMMON_TAGS, CLINICAL_STATUSES, CLINICAL_FOCUS_OPTIONS, IMPACT_OPTIONS, GLOBAL_FINDINGS_POOL } from "./constants";
import { getEvidenceBadgeProps } from "../utils/evidenceUtils";
import { EvidencePickerModal } from "./EvidencePickerModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

export interface ModifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSave?: (data: any) => void;
  onDelete?: (data: any) => void;
  allFindingsPool?: any[];
  isAddMode?: boolean;
  addType?: 'criteria' | 'nextstep' | 'session' | 'assessment' | 'document';
  groupBy?: 'source' | 'tag' | 'item';
}

export function ModifyModal({ 
  isOpen, 
  onClose, 
  item, 
  onSave, 
  onDelete,
  allFindingsPool, 
  isAddMode = false,
  addType = 'criteria',
  groupBy = 'source'
}: ModifyModalProps) {
  const pool = allFindingsPool || GLOBAL_FINDINGS_POOL;
  
  const effectiveItem = item || {
    type: addType,
    label: '',
    score: '',
    status: 'Met',
    findings: []
  };

  const isCriteria = effectiveItem.type === 'criteria';
  const isNextStep = effectiveItem.type === 'nextstep';
  const isEvidence = !isCriteria && !isNextStep;

  const [name, setName] = useState(effectiveItem.label);
  const [score, setScore] = useState(effectiveItem.score);
  const [status, setStatus] = useState(effectiveItem.status);
  const [clinicalFocus, setClinicalFocus] = useState(effectiveItem.suggestedClinicalFocus || "");
  const [impact, setImpact] = useState(effectiveItem.impact || "");
  const [rationale, setRationale] = useState(effectiveItem.rationale || "");
  const [reason, setReason] = useState("");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [findings, setFindings] = useState<any[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isTagPickerDialogOpen, setIsTagPickerDialogOpen] = useState(false);
  const [isSourcePickerDialogOpen, setIsSourcePickerDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [selectedTagToAdd, setSelectedTagToAdd] = useState("");
  const [selectedSourceToAdd, setSelectedSourceToAdd] = useState("");

  useEffect(() => {
    if (effectiveItem) {
      setName(effectiveItem.label || "");
      setScore(effectiveItem.score || (isAddMode ? "" : "0.95"));
      
      const existingTags = effectiveItem.tags || [];
      const derivedTags = (effectiveItem.findings || []).flatMap((f: any) => {
        if (Array.isArray(f.tags)) return f.tags;
        if (typeof f.tag === 'string') return f.tag.split(',').map((t: string) => t.trim()).filter(Boolean);
        return [];
      });
      
      let uniqueTags = Array.from(new Set([...existingTags, ...derivedTags]));
      if (groupBy === 'tag' && effectiveItem.type === 'tag') {
        uniqueTags = uniqueTags.filter(t => t.toLowerCase() === (effectiveItem.label || "").toLowerCase());
      }
      setSelectedTags(uniqueTags);
      setStatus(effectiveItem.status || (isCriteria ? "Met" : ""));
      setClinicalFocus(effectiveItem.suggestedClinicalFocus || "");
      setImpact(effectiveItem.impact || "");
      setRationale(effectiveItem.rationale || "");
      setReason("");
      
      setFindings(isAddMode ? [] : (effectiveItem.findings || []));
    }
  }, [effectiveItem?.label, allFindingsPool, isOpen, isAddMode, effectiveItem.type, groupBy]);

  if (!item && !isAddMode) return null;

  const handleAddFindingsByTag = (tag: string) => {
    const findingsToAdd = pool.filter(f => {
      const tags = (Array.isArray(f.tags) ? f.tags : (f.tag || '').split(',').map((t: any) => t.trim()).filter(Boolean));
      return tags.includes(tag);
    });
    
    const existingIds = new Set(findings.map(f => f.id));
    const newFindings = findingsToAdd.filter(f => !existingIds.has(f.id));
    
    if (newFindings.length > 0) {
      setFindings([...findings, ...newFindings]);
    }
    setIsTagPickerDialogOpen(false);
    setSelectedTagToAdd("");
  };

  const handleAddFindingsBySource = (source: string) => {
    const findingsToAdd = pool.filter(f => f.sourceSession === source);
    
    const existingIds = new Set(findings.map(f => f.id));
    const newFindings = findingsToAdd.filter(f => !existingIds.has(f.id));
    
    if (newFindings.length > 0) {
      setFindings([...findings, ...newFindings]);
    }
    setIsSourcePickerDialogOpen(false);
    setSelectedSourceToAdd("");
  };

  const handleSave = () => {
    const updatedData = {
      ...effectiveItem,
      label: name,
      score,
      status,
      suggestedClinicalFocus: clinicalFocus,
      impact,
      rationale,
      reason,
      tags: selectedTags,
      findings
    };
    if (onSave) {
      onSave(updatedData);
    } else {
      onClose();
    }
  };

  const title = isAddMode 
    ? (addType === 'session' ? 'Add Clinical Session' : 
       addType === 'assessment' ? 'Add Assessment' : 
       addType === 'document' ? 'Add Document' : 
       addType === 'nextstep' ? "Add Clinical Plan Item" : "Add Finding") 
    : (isNextStep ? "Modify Clinical Plan Item" : isCriteria ? "Modify Finding" : "Modify Evidence");

  const footer = (
    <div className="flex items-center justify-between w-full font-sans">
      <div>
        {!isAddMode && onDelete && (
          <Button 
            variant="ghost" 
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4 font-semibold"
          >
            Delete
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="px-6 py-2.5 text-[#06302c] font-semibold"
        >
          {isAddMode ? "Cancel" : (isEvidence ? "Discard" : "Cancel")}
        </Button>
        <Button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#06302c] text-white font-semibold rounded-md hover:opacity-90 transition-all border-none"
        >
          {isAddMode ? (
            addType === 'session' ? 'Add session' : 
            addType === 'assessment' ? 'Add assessment' : 
            addType === 'document' ? 'Add document' : 
            addType === 'nextstep' ? 'Add clinical plan item' : 'Add Finding'
          ) : (isEvidence ? "Save Correction" : "Save Changes")}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} width={600}>
        <div className="flex flex-col gap-8 font-sans">
          <div className="grid grid-cols-2 gap-4">
              <Input
                label={isCriteria ? "Finding Name" : 
                       isNextStep ? "Clinical Plan Item" : 
                       addType === 'session' ? "Clinical Focus" :
                       addType === 'assessment' ? "Assessment Name" :
                       addType === 'document' ? "Document Name" :
                       "Finding Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              
              <Input
                label={isCriteria ? "Certainty score" : isNextStep ? "Impact score" : "Relevance Score"}
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />

              {isCriteria && (
                <div className="space-y-2">
                  <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Suggested Status</Typography>
                  <Select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {CLINICAL_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </div>
              )}

              {(isNextStep || isCriteria) && (
                  <div className="col-span-2 space-y-2">
                    <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Rationale</Typography>
                    <Textarea
                      value={rationale}
                      onChange={(e) => setRationale(e.target.value)}
                      className="min-h-[100px]"
                      placeholder={`Enter the rationale for this ${isCriteria ? 'finding' : 'next step'}...`}
                    />
                  </div>
              )}

              {isNextStep && (
                <>
                  <div className="space-y-2">
                    <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Suggested Clinical Focus</Typography>
                    <Select 
                      value={clinicalFocus}
                      onChange={(e) => setClinicalFocus(e.target.value)}
                    >
                      <option value="" disabled>Select focus</option>
                      {CLINICAL_FOCUS_OPTIONS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Expected Impact</Typography>
                    <Select 
                      value={impact}
                      onChange={(e) => setImpact(e.target.value)}
                    >
                      <option value="" disabled>Select impact</option>
                      {IMPACT_OPTIONS.map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </Select>
                  </div>
                </>
              )}
          </div>

          {!isNextStep && (
            <div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Typography variant="label-micro" className="text-slate-400 uppercase font-bold tracking-wider">
                    Supporting Evidence
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-[10px] text-primary bg-primary/5 hover:bg-primary/10"
                      onClick={() => setIsPickerOpen(true)}
                    >
                      <Plus size={10} className="mr-1" /> Add Evidence
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    {findings.map((f, idx) => (
                      <div key={f.id || idx} className="bg-white p-4 rounded-xl border border-divider hover:border-primary/20 transition-all group relative">
                        <button 
                          onClick={() => setFindings(findings.filter((_, fIdx) => fIdx !== idx))}
                          className="absolute top-3 right-3 p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors z-10"
                        >
                          <X size={14} />
                        </button>
                        <Typography variant="body-sm" className="text-slate-700 leading-relaxed font-medium pr-8">
                          {f.type === 'verbatim' ? `"${f.text}"` : f.text}
                        </Typography>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                             {(() => {
                               const badgeProps = getEvidenceBadgeProps(f.type, f.status, f.context || (f.sourceDocumentId ? 'document' : (f.sourceAssessmentId ? 'assessment' : (f.sessionId ? 'session' : undefined))));
                               return (
                                 <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight", badgeProps.className)}>
                                   {badgeProps.label}
                                 </div>
                               );
                             })()}
                             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100/50 rounded text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                              {f.sourceSession || "Clinical Data"}
                            </div>
                            {f.timestamp && <span className="text-[9px] text-slate-300">•</span>}
                            {f.timestamp && <span className="text-[9px] text-slate-400 font-medium">{f.timestamp}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {findings.length === 0 && (
                      <div className="p-8 text-center border border-dashed border-divider rounded-xl bg-slate-50/30">
                        <Typography variant="body-sm" className="text-slate-400 italic">No evidence snippets linked yet.</Typography>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">{isAddMode ? "Reason to add" : "Reason to modify"}</Typography>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              placeholder={isAddMode ? (isNextStep ? "Explain why you are adding this next step..." : "Explain why you are adding this criterion...") : "Explain why you are making these modifications..."}
            />
          </div>
          
          <EvidencePickerModal 
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            onSelectMultiple={(evidences: any[]) => {
              const newFindings = evidences.map(evidence => {
                const newEvidence = { ...evidence, included: true };
                if (groupBy === 'tag') {
                  const currentTags = (Array.isArray(newEvidence.tags) ? newEvidence.tags : (newEvidence.tag || '').split(',').map((t: any) => t.trim()).filter(Boolean));
                  const tagsToAdd = selectedTags.filter(t => !currentTags.includes(t));
                  newEvidence.tags = [...currentTags, ...tagsToAdd];
                }
                return newEvidence;
              });
              setFindings([...findings, ...newFindings]);
            }}
            pool={pool}
            alreadyAddedIds={findings.map(f => f.id)}
          />

          <Modal 
            isOpen={isTagPickerDialogOpen} 
            onClose={() => setIsTagPickerDialogOpen(false)} 
            title="Import Evidence by Tag"
            width={400}
            footer={
              <div className="flex justify-end gap-2 w-full">
                <Button variant="ghost" onClick={() => setIsTagPickerDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={() => handleAddFindingsByTag(selectedTagToAdd)}
                  disabled={!selectedTagToAdd}
                  className="bg-[#06302c]"
                >
                  Confirm
                </Button>
              </div>
            }
          >
            <div className="p-2 space-y-4">
              <Typography variant="body-sm" className="text-slate-600">Select a tag to add all associated evidence snippets.</Typography>
              <SearchableSelect 
                label="Select Clinical Tag"
                value={selectedTagToAdd}
                onChange={setSelectedTagToAdd}
                options={Array.from(new Set(pool.flatMap(f => {
                  const tags = (Array.isArray(f.tags) ? f.tags : (f.tag || '').split(',').map((t: any) => t.trim()).filter(Boolean));
                  return tags;
                }))).sort().map(t => ({ label: t, value: t }))}
                placeholder="Search tags..."
              />
            </div>
          </Modal>

          <Modal 
            isOpen={isSourcePickerDialogOpen} 
            onClose={() => setIsSourcePickerDialogOpen(false)} 
            title="Import Evidence by Source"
            width={400}
            footer={
              <div className="flex justify-end gap-2 w-full">
                <Button variant="ghost" onClick={() => setIsSourcePickerDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={() => handleAddFindingsBySource(selectedSourceToAdd)}
                  disabled={!selectedSourceToAdd}
                  className="bg-[#06302c]"
                >
                  Confirm
                </Button>
              </div>
            }
          >
            <div className="p-2 space-y-4">
              <Typography variant="body-sm" className="text-slate-600">Select a clinical source to add all associated snippets.</Typography>
              <SearchableSelect 
                label="Select Clinical Source"
                value={selectedSourceToAdd}
                onChange={setSelectedSourceToAdd}
                options={Array.from(new Set(pool.map(f => f.sourceSession).filter(Boolean))).map(s => ({ label: s, value: s }))}
                placeholder="Search sources..."
              />
            </div>
          </Modal>
        </div>
      </Modal>

      <DeleteConfirmationModal 
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          setIsConfirmDeleteOpen(false);
          if (onDelete) onDelete(effectiveItem);
        }}
        title={isCriteria ? "Delete Finding" : "Delete Item"}
        message={`Are you sure you want to delete this ${isCriteria ? 'finding' : 'item'}? This action cannot be undone.`}
      />
    </>
  );
}
