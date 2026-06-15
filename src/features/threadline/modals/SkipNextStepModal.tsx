/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Modal, Typography } from "@ui/index";

interface SkipNextStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onConfirm: () => void;
}

export function SkipNextStepModal({ isOpen, onClose, item, onConfirm }: SkipNextStepModalProps) {
  if (!item) return null;
  const footer = (
    <>
      <button 
        onClick={onClose} 
        className="px-6 py-2.5 text-[#06302c] font-semibold hover:bg-gray-100 rounded-md transition-colors"
      >
        Cancel
      </button>
      <button 
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className="px-6 py-2.5 bg-[#06302c] text-white font-semibold rounded-md hover:opacity-90 transition-all font-sans"
      >
        Skip Step
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Skip Next Step" footer={footer} width={520}>
      <div className="flex flex-col gap-8">
        <div className="relative w-full">
          <div className="border border-gray-300 rounded p-4 bg-gray-100 text-base text-gray-500">
            {item?.label}
          </div>
          <div className="absolute -top-2 left-3 bg-white px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Next step name:</p>
          </div>
        </div>

        <div>
          <div className="text-lg font-medium text-[#06302c] mb-4 font-sans">Target level :</div>
          <div className="relative w-full">
            <div className="border border-gray-300 rounded px-4 py-3 flex justify-between items-center min-h-[56px]">
              <div className="flex flex-wrap gap-2">
                <div className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-sky-100 font-sans">
                  {item?.impact}
                  <button className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px]">✕</button>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 left-3 bg-white px-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Impact setting</p>
            </div>
          </div>
        </div>

        <div className="relative w-full font-sans">
          <div className="border border-gray-300 rounded p-3">
            <textarea 
              placeholder="Type here..."
              className="w-full border-none outline-none text-base text-gray-900 resize-none min-h-[120px] bg-transparent"
            />
          </div>
          <div className="absolute -top-2 left-3 bg-white px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Why are you skipping this next step?</p>
          </div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Reason (optional)</div>
        </div>
      </div>
    </Modal>
  );
}
