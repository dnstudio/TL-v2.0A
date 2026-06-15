/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MessageSquare, FileText, BookOpen } from "lucide-react";
import { Modal, Typography } from "@ui/index";

interface AddEvidenceTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'session' | 'assessment' | 'document' | 'criteria' | 'nextstep') => void;
}

export function AddEvidenceTypeModal({ 
  isOpen, 
  onClose, 
  onSelect 
}: AddEvidenceTypeModalProps) {
  const options = [
    { id: 'session', label: 'Session', description: 'Raw clinical notes or verbatim transcripts', icon: MessageSquare },
    { id: 'assessment', label: 'Assessment', description: 'Structured clinical tests or specialized assessments', icon: FileText },
    { id: 'document', label: 'Document', description: 'External reports, referrals, or clinical history', icon: BookOpen }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Evidence" width={480}>
      <div className="grid grid-cols-1 gap-3 py-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id as any)}
            className="flex items-start gap-4 p-4 text-left bg-white border border-divider rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group outline-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-600 group-hover:bg-primary/5 group-hover:text-primary transition-colors shrink-0">
              <opt.icon size={20} />
            </div>
            <div>
              <Typography variant="body" className="font-bold text-slate-800">{opt.label}</Typography>
              <Typography variant="body-sm" className="text-slate-500 mt-0.5 leading-snug">{opt.description}</Typography>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
