/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Modal, Typography, Button } from "@ui/index";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item", 
  message = "Are you sure you want to delete this item? This action cannot be undone." 
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width={400}>
      <div className="space-y-6">
        <Typography variant="body-sm" className="text-slate-600 leading-relaxed">
          {message}
        </Typography>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="flex-1 py-2.5 text-slate-500 font-semibold border border-divider hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-all border-none"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
