import React, { useState } from "react";
import { AlertCircle, FileText, Check, Clock, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardHeader, CardTitle, Typography, Button, Badge } from "@ui/index";

export interface UpdateItem {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
  type: "system" | "clinician" | "patient";
}

interface UpdatesBannerProps {
  updates: UpdateItem[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
}

export function UpdatesBanner({ updates, onAcknowledge, onAcknowledgeAll }: UpdatesBannerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (updates.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-8"
      >
        <Card className="border-divider bg-surface shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between px-5 py-3.5 border-b border-divider bg-slate-50/80 space-y-0">
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-text-secondary" />
              <CardTitle className="uppercase tracking-widest text-[11px] text-text-secondary">
                Changes Since Last Session
              </CardTitle>
              {updates.length > 0 && (
                <Badge variant="soft" className="h-5 px-1.5 ml-1 text-[10px] font-bold bg-slate-200/70 text-slate-600 border-none py-0">
                  {updates.length}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-slate-200/50"
                onClick={onAcknowledgeAll}
              >
                Acknowledge All
              </Button>
            </div>
          </CardHeader>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="divide-y divide-divider">
                  {updates.map((update) => (
                    <div key={update.id} className="p-4 flex items-start gap-5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex-1 space-y-2.5 pt-0.5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-2 flex-1">
                             <div className="flex items-center gap-2">
                                <Badge variant="soft" className="text-[10px] uppercase tracking-wider font-bold text-slate-600 bg-slate-100 px-2 py-0.5">
                                  {update.field}
                                </Badge>
                                <span className="text-xs text-text-secondary flex items-center gap-1.5">
                                  <span className="font-medium text-slate-700 flex items-center gap-1">
                                    {update.type === "system" ? <AlertCircle size={10} /> : <User size={10} />}
                                    {update.changedBy}
                                  </span>
                                  &bull;
                                  <span>{update.changedAt}</span>
                                </span>
                             </div>
                             <div className="flex items-center gap-3 text-sm">
                                <span className="text-text-secondary tabular-nums line-through decoration-slate-300">
                                  {update.oldValue}
                                </span>
                                <span className="text-slate-400">→</span>
                                <span className="font-semibold text-slate-900 tabular-nums">
                                  {update.newValue}
                                </span>
                             </div>
                          </div>
                      
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 shrink-0"
                            onClick={() => onAcknowledge(update.id)}
                            title="Acknowledge This Update"
                          >
                            <Check size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

