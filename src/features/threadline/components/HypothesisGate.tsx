import React, { useState } from "react";
import { 
  Brain, 
  ArrowRight, 
  ChevronLeft,
  Lock, 
  User, 
  Sparkles, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  AlertCircle,
  HelpCircle,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button, Card, Typography, Textarea, Label, DataPoint, Separator } from "@ui/index";
import { cn } from "@lib/utils";

export type GateState = 'gate' | 'typing' | 'revealed';

interface HypothesisGateProps {
  onRevealed: (hypothesis: string, skipped: boolean) => void;
  onBack?: () => void;
  children: React.ReactNode; // The analysis content to show when revealed
  initialState?: GateState;
}

export function HypothesisGate({ onRevealed, onBack, children, initialState = 'gate' }: HypothesisGateProps) {
  const [state, setState] = useState<GateState>(initialState);
  const [hypothesis, setHypothesis] = useState("");
  const [showAnnotations, setShowAnnotations] = useState(false);
  const minLength = 20;

  const handleReveal = (skipped: boolean = false) => {
    setState('revealed');
    onRevealed(skipped ? "" : hypothesis, skipped);
  };

  const DesignAnnotation = ({ children, title, position = "top" }: { children: React.ReactNode, title: string, position?: "top" | "bottom" | "left" | "right" }) => {
    if (!showAnnotations) return <>{children}</>;
    
    return (
      <div className="relative group/annot">
        <div className={cn(
          "absolute z-[100] px-2 py-1 bg-primary text-white text-[10px] font-bold rounded shadow-lg pointer-events-none whitespace-nowrap opacity-0 group-hover/annot:opacity-100 transition-opacity",
          position === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
          position === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
          position === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
          position === "right" && "left-full top-1/2 -translate-y-1/2 ml-2"
        )}>
          {title}
        </div>
        <div className="ring-1 ring-primary/30 ring-offset-2 rounded-sm group-hover/annot:ring-primary transition-all">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Design Rationale Toggle - Hidden as per user request to show Working Hypothesis directly */}
      {false && (
      <div className="flex justify-between items-center mb-4 border-b border-divider pb-4">
         <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={18} />
            <Typography variant="h3">AI Rationale Engine</Typography>
         </div>
         <Button 
            variant="ghost" 
            size="sm" 
            className={cn("text-xs gap-2", showAnnotations ? "text-primary bg-primary/5" : "text-text-disabled")}
            onClick={() => setShowAnnotations(!showAnnotations)}
         >
            {showAnnotations ? <Eye size={14} /> : <EyeOff size={14} />}
            {showAnnotations ? "Hide Design Rationale" : "Show Design Rationale"}
         </Button>
      </div>
      )}

      <AnimatePresence mode="wait">
        {state === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-12 text-center space-y-6"
          >
            <DesignAnnotation title="The Gate: Content is non-existent until passed" position="top">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                <Lock size={32} />
              </div>
            </DesignAnnotation>
            
            <div className="max-w-md space-y-2">
              <Typography variant="h2" className="text-2xl font-bold tracking-tight">
                Unlock Clinical Synthesis
              </Typography>
              <Typography variant="body" className="text-text-secondary leading-relaxed">
                To prevent automation bias and ensure clinical accountability, the synthesis is locked until a working hypothesis is provided.
              </Typography>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button 
                variant="brand" 
                size="lg" 
                className="h-12 px-8 rounded-full font-bold text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                onClick={() => setState('typing')}
              >
                Start Synthesis
                <ArrowRight className="ml-2" size={18} />
              </Button>

              {onBack && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-text-secondary flex items-center gap-2"
                  onClick={onBack}
                >
                  <ChevronLeft size={16} />
                  Back to Workspace
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {state === 'typing' && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <DesignAnnotation title="Minimum char requirement blocks one-word bypasses" position="top">
                <div className="relative space-y-2">
                  <Label htmlFor="hypothesis">Clinician Working Hypothesis</Label>
                  <Textarea
                    id="hypothesis"
                    autoFocus
                    placeholder="Enter your clinical working hypothesis based on the reviewed evidence..."
                    className={cn(
                      "w-full min-h-[160px] p-4 font-sans text-sm",
                      hypothesis.length >= minLength 
                        ? "border-primary/20 bg-white" 
                        : "bg-gray-50/50"
                    )}
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                  />
                  <div className={cn(
                    "absolute bottom-3 right-4 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded bg-white/80 backdrop-blur shadow-sm z-10",
                    hypothesis.length < minLength ? "text-rose-500" : "text-emerald-500"
                  )}>
                    {hypothesis.length} / {minLength} Characters
                  </div>
                </div>
              </DesignAnnotation>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-divider">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-text-secondary flex items-center gap-2"
                  onClick={() => {
                    if (initialState === 'gate') {
                      setState('gate');
                    } else if (onBack) {
                      onBack();
                    }
                  }}
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
                
                <DesignAnnotation title="Skip exists but is visually subordinate" position="top">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-text-disabled hover:text-rose-600 hover:bg-rose-50 group flex items-center gap-2"
                    onClick={() => handleReveal(true)}
                  >
                    <AlertCircle size={14} className="group-hover:animate-pulse" />
                    Skip & Flag for Audit
                  </Button>
                </DesignAnnotation>
              </div>
              
              <Button 
                variant="brand" 
                size="lg" 
                className="h-10 px-6 font-bold disabled:opacity-50 disabled:grayscale transition-all"
                disabled={hypothesis.length < minLength}
                onClick={() => handleReveal(false)}
              >
                Synthesize Working Hypothesis
              </Button>
            </div>
          </motion.div>
        )}

        {state === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
