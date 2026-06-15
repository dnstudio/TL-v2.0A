import React, { useState } from "react";
import { Settings, X as CloseIcon, FlaskConical, RefreshCw, RotateCcw, AlertTriangle, Database } from "lucide-react";
import { Button } from "../ui/Button";
import { useClinicalStore, useAppStore } from "../../services/store";
import { Modal } from "../ui/Modal";
import { Typography } from "../ui/Typography";

interface DebugMenuProps {
  isDebugMinimized: boolean;
  setIsDebugMinimized: (val: boolean) => void;
  isPlayground: boolean;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  setShowMockData: (val: boolean) => void;
  onNavigate: (path: string) => void;
}

export function DebugMenu({
  isDebugMinimized,
  setIsDebugMinimized,
  isPlayground,
  isAdminView,
  setIsAdminView,
  setShowMockData,
  onNavigate
}: DebugMenuProps) {
  const resetClinical = useClinicalStore(state => state.resetStore);
  const resetApp = useAppStore(state => state.resetToDefaults);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const handleReset = () => {
    resetClinical();
    resetApp();
    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 500);
  };

  const handleWipe = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = window.location.origin;
  };

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-2 z-[1000] p-1.5 bg-white rounded-full shadow-lg border border-slate-200 transition-all duration-300 ${isDebugMinimized ? 'max-w-[88px]' : 'max-w-[1200px] overflow-hidden'}`}>
      <div className="flex items-center gap-1.5">
        <Button 
          variant={isDebugMinimized ? 'brand' : 'ghost'}
          size="sm"
          onClick={() => setIsDebugMinimized(!isDebugMinimized)}
          className="w-8 h-8 p-0 rounded-full shrink-0"
          title={isDebugMinimized ? "Show Debug Menu" : "Minimize Debug Menu"}
        >
          {isDebugMinimized ? <Settings size={14} /> : <CloseIcon size={14} />}
        </Button>
        {isDebugMinimized && (
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('/playground')}
            className="w-8 h-8 p-0 rounded-full shrink-0 text-text-secondary hover:text-primary transition-colors"
            title="Go to Playground"
          >
            <FlaskConical size={14} />
          </Button>
        )}
      </div>
      
      {!isDebugMinimized && (
        <div className="flex items-center gap-2 pr-2">
          <Button 
            variant={isPlayground ? 'brand' : 'ghost'}
            size="sm"
            onClick={() => onNavigate(isPlayground ? '/conditions' : '/playground')}
            className="rounded-full px-4 h-8 text-xs flex gap-2 items-center"
          >
            <FlaskConical size={14} />
            {isPlayground ? "Back to App" : "Playground"}
          </Button>
          {!isPlayground && (
            <Button 
              variant={isAdminView ? 'brand' : 'ghost'}
              size="sm"
              onClick={() => setIsAdminView(!isAdminView)}
              className="rounded-full px-4 h-8 text-xs"
            >
              Admin: {isAdminView ? "ON" : "OFF"}
            </Button>
          )}
          {/* Mock and Explorer links hidden as requested */}
          <div className="flex items-center border-l border-slate-200 ml-2 pl-2 gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="rounded-full px-4 h-8 text-xs flex gap-2 items-center text-slate-700 hover:bg-slate-100 border-slate-200"
              title="Reset App State (Preserves Rejected)"
            >
              <RotateCcw size={14} />
              Reset
            </Button>

            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setShowWipeConfirm(true)}
              className="rounded-full px-4 h-8 text-xs flex gap-2 items-center text-red-600 hover:bg-red-50"
              title="Hard Reset (Wipe Everything)"
            >
              <CloseIcon size={14} />
              Wipe
            </Button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset App State"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button variant="brand" onClick={handleReset}>
              Confirm Reset
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Typography variant="body1">
            This will clear clinical notes, session history, and application preferences.
          </Typography>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-blue-700 text-sm">
            <Settings size={18} className="shrink-0" />
            <p><strong>Note:</strong> Evidence that you have specifically rejected will be preserved as requested.</p>
          </div>
        </div>
      </Modal>

      {/* Wipe Confirmation Modal */}
      <Modal
        isOpen={showWipeConfirm}
        onClose={() => setShowWipeConfirm(false)}
        title="Hard Reset (Wipe Everything)"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowWipeConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleWipe}>
              Wipe Everything
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700">
            <AlertTriangle size={24} className="shrink-0" />
            <div>
              <Typography variant="h4" className="text-red-900 mb-1">Warning: Irreversible Action</Typography>
              <Typography variant="body2">
                This will permanently delete ALL local data stored in your browser. This includes:
              </Typography>
              <ul className="list-disc ml-5 mt-2 text-xs space-y-1">
                <li>All clinical notes and decisions</li>
                <li>All rejected evidence items</li>
                <li>All feature toggle settings</li>
                <li>All UI state and preferences</li>
              </ul>
            </div>
          </div>
          <Typography variant="body2" className="text-text-secondary text-center italic">
            Are you sure you want to perform a completely fresh start?
          </Typography>
        </div>
      </Modal>
    </div>
  );
}
