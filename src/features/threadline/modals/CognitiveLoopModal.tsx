/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Modal, Typography, Button } from "@ui/index";

interface CognitiveLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CognitiveLoopModal({ isOpen, onClose }: CognitiveLoopModalProps) {
  const footer = (
    <Button 
      onClick={onClose}
      className="px-8 py-2.5 bg-[#06302c] text-white font-semibold rounded-md hover:opacity-90 transition-all border-none font-sans"
    >
      Close
    </Button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Cognitive Loop" footer={footer} width={640}>
      <div className="flex flex-col gap-6 font-sans">
        <Typography variant="body" className="text-[15px] text-gray-600 leading-relaxed">
          The Cognitive Loop is a structured sequential process designed to guide clinical reasoning and ensure thorough evaluation of diagnostic evidence.
        </Typography>

        <div className="flex flex-col gap-5">
          {[
            { step: 1, label: "Initial Evidence Collection", desc: "Gathering and documenting raw clinical observations and data points." },
            { step: 2, label: "Feature Extraction", desc: "Identifying key clinical features and patterns from the collected evidence." },
            { step: 3, label: "Findings Mapping", desc: "Mapping clinical features to formal diagnostic findings from established guidelines." },
            { step: 4, label: "Uncertainty Analysis", desc: "Reviewing mapping confidence and identifying gaps or contradictions in evidence." },
            { step: 5, label: "Refinement & Next Steps", desc: "Defining specific actions to resolve clinical uncertainty or gather missing data." },
            { step: 6, label: "Clinical Formulation", desc: "Finalising the working impression based on the validated evidence chain." }
          ].map(s => (
            <div key={s.step} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[#06302c] text-white flex items-center justify-center text-sm font-bold shrink-0">
                {s.step}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-gray-900 mb-1">{s.label}</div>
                <div className="text-sm text-gray-600 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
