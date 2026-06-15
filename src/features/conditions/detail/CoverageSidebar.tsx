import { motion } from "motion/react";
import { CheckCircle2, Plus, AlertTriangle, X } from "lucide-react";
import { DecisionUnit } from "../../../types";
import { cn } from "../../../lib/utils";

interface CoverageSidebarProps {
  onClose: () => void;
  onDimensionClick?: (ruleType: string) => void;
  units: DecisionUnit[];
}

export function CoverageSidebar({ onClose, onDimensionClick, units }: CoverageSidebarProps) {
  const checkOk = (label: string) => {
    return units.some(u => u.type.toLowerCase().startsWith(label.toLowerCase()));
  };

  const dimensions = [
    { l: "Duration / persistence", d: "Minimum symptom duration required" },
    { l: "Symptom threshold", d: "Minimum number of symptoms required" },
    { l: "Domain requirement", d: "Requirements across symptom categories" },
    { l: "Functional impairment", d: "Functional impairment criteria" },
    { l: "Onset requirement", d: "Age or timing of onset rules" },
    { l: "Context / setting", d: "Cross-situational requirements" },
    { l: "Exclusion rule", d: "Differential diagnosis rules" },
    { l: "Severity classification", d: "Subtyping or severity levels" },
  ].map(d => ({ ...d, ok: checkOk(d.l) }));

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-[100] backdrop-blur-[2px]"
      />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-[400px] bg-white z-[101] shadow-xl flex flex-col overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between min-h-[72px]">
          <h2 className="m-0 font-sans text-2xl text-text-primary">
            Coverage & Validation
          </h2>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer p-1">
            <X size={20} className="text-text-primary" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-8">
            
            <div>
              <p className="font-sans text-base text-text-primary mb-4 font-medium">
                Required Rule Dimensions
              </p>
              <div className="flex flex-col gap-3">
                {dimensions.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => onDimensionClick && onDimensionClick(item.l)}
                    className={cn(
                      "flex gap-3 px-4 py-3 rounded border cursor-pointer transition-colors",
                      item.ok ? "bg-success-light border-transparent" : "bg-slate-50 border-divider hover:border-slate-300"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.ok ? (
                        <CheckCircle2 size={22} className="text-[#8BC34A]" />
                      ) : (
                        <div className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center">
                          <Plus size={14} className="text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "m-0 font-sans text-base font-medium",
                        item.ok ? "text-[#1e4620]" : "text-text-primary"
                      )}>{item.l}</p>
                      <p className={cn(
                        "m-0 font-sans text-sm",
                        item.ok ? "text-[#1e4620]" : "text-text-secondary"
                      )}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-sans text-base text-[#f57c00] mb-4 font-medium">Active Warnings (2)</p>
              <div className="flex flex-col gap-3">
                {[
                   { l: "Numeric threshold recommended", d: "Symptom threshold rule is currently based on clinical judgment only." },
                   { l: "Impairment settings", d: "Functional impairment should specify at least two environments." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3 rounded bg-orange-50 border border-orange-100/50">
                    <div className="mt-0.5 shrink-0">
                       <AlertTriangle size={22} className="text-[#F57C00]" />
                    </div>
                    <div>
                      <p className="m-0 font-sans text-base font-medium text-[#663c00]">{item.l}</p>
                      <p className="m-0 font-sans text-sm text-[#663c00]">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
}
