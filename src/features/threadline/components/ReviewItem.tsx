import React from "react";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { ConfidenceBadge, mapScoreToConfidence } from "@shared/ConfidenceBadge";
import { RelevanceBadge, mapScoreToRelevance } from "@shared/RelevanceBadge";
import { ImpactBadge, mapScoreToImpact } from "@shared/ImpactBadge";
import { AlertCircle, Check, X, Circle, AlertTriangle } from "lucide-react";
import { cn } from "@lib/utils";

export interface ReviewItemProps {
  label: string;
  score: string;
  active?: boolean;
  deferred?: boolean;
  accepted?: boolean;
  rejected?: boolean;
  partiallyAccepted?: boolean;
  hasConflict?: boolean;
  onClick: () => void;
  type?: string;
  sessionSource?: string;
  noStrike?: boolean;
  isUserGenerated?: boolean;
  subType?: string;
  cause?: any;
  onConfidenceAction?: (cause: any) => void;
}

export const ReviewItem: React.FC<ReviewItemProps> = React.memo(({ 
  label, 
  score, 
  active = false, 
  deferred = false, 
  accepted = false, 
  rejected = false, 
  partiallyAccepted = false,
  hasConflict = false, 
  onClick, 
  type, 
  sessionSource, 
  noStrike = false,
  isUserGenerated,
  subType,
  cause,
  onConfidenceAction
}) => {
  const isDeferredActive = active && deferred;
  const isAcceptedActive = active && accepted;
  const isRejectedActive = active && rejected;
  const isNextStep = type === 'nextstep';
  const scoreNum = parseFloat(score);
  const isLowScore = !isNaN(scoreNum) && scoreNum < 0.4;
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 py-4 px-6 relative transition-colors duration-200 border-l-4",
        "cursor-pointer",
        isAcceptedActive && "bg-[#ebf5eb]", // Light green background for accepted
        isRejectedActive && "bg-[#ffebee]", // Light red background for rejected
        (active && partiallyAccepted) && "bg-slate-50", // Light grey for partially accepted
        isDeferredActive && "bg-orange-50", // Light orange for deferred/conflicting
        active && !isAcceptedActive && !isRejectedActive && !partiallyAccepted && !isDeferredActive && "bg-slate-100", // Active but untouched
        !active && "bg-transparent", // Default background
        // Border colors based on state and active status
        active ? (
          accepted ? "border-green-700" :
          partiallyAccepted ? "border-slate-400" :
          rejected ? "border-red-500" :
          deferred ? (noStrike ? "border-orange-500" : "border-red-500") :
          isLowScore ? "border-rose-400" :
          "border-primary"
        ) : "border-transparent"
      )}
    >
      {!isNextStep ? (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-1 items-center">
            {hasConflict && (
              <div 
                title="Conflict detected - This item has contradictory information" 
                className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-sm"
              >
                !
              </div>
            )}
            {/* Removed low score alert triangle per user request */}
          </div>
          {accepted ? (
            <div className="w-5 h-5 rounded-full border-2 border-green-700 flex items-center justify-center text-green-700 shrink-0">
              <Check size={12} strokeWidth={4} />
            </div>
          ) : partiallyAccepted ? (
            <div 
              title="Partially Reviewed - Some items within this group have been accepted or rejected."
              className="w-5 h-5 rounded-full border-2 border-slate-400 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-slate-400 opacity-20"></div>
              <div className="w-2 h-0.5 bg-slate-400 rounded-full"></div>
            </div>
          ) : rejected ? (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
              !
            </div>
          ) : deferred ? (
            <div className={cn("shrink-0", (noStrike || hasConflict) ? "text-orange-500" : "text-gray-500")}>
              {(noStrike && hasConflict) ? (
                <AlertTriangle size={20} strokeWidth={2} />
              ) : (
                <Circle size={20} strokeWidth={2} />
              )}
            </div>
          ) : null}
        </>
      ) : null}
      
      <div className={cn(
        "flex-1",
        (isNextStep || (!accepted && !partiallyAccepted && !rejected && !deferred)) ? "pl-9" : ""
      )}>
        <div className={cn(
          "text-[15px] mb-1 line-clamp-2",
          (deferred && !noStrike) || rejected ? "text-red-500" : "text-slate-900",
          active ? "font-medium" : "font-normal",
          (deferred && !noStrike) ? "line-through" : "no-underline"
        )}>
          {label}
        </div>
        <div className="text-[13px] text-slate-600 flex flex-wrap items-center gap-1.5">
          {isUserGenerated !== undefined && (
            <div className={cn(
              "text-[9px] font-bold px-1.5 py-[1px] rounded uppercase",
              isUserGenerated ? "bg-red-50 text-red-600 border border-red-100" : "bg-primary/5 text-primary border border-primary/10"
            )}>
              {isUserGenerated ? "USER" : "AI"}
            </div>
          )}
          {sessionSource && (
            <div className="text-[10px] text-primary font-bold bg-slate-100 px-1.5 py-[1px] rounded uppercase">
              {sessionSource.split(',')[0]}
            </div>
          )}
          {FEATURE_FLAGS.FEATURE_CONFIDENCE_BADGE ? (
            <div className="mt-1">
              {isNextStep ? (
                <ImpactBadge
                  impact={
                    score && !isNaN(parseFloat(score))
                      ? mapScoreToImpact(parseFloat(score))
                      : (score?.toLowerCase() === "high" ? "high" : score?.toLowerCase() === "medium" ? "medium" : "low")
                  }
                  cause={cause}
                  onAction={onConfidenceAction}
                />
              ) : type === "criteria" ? (() => {
                const confLevel = score && !isNaN(parseFloat(score)) 
                  ? mapScoreToConfidence(parseFloat(score)) 
                  : (score?.toLowerCase() === "high" ? "high" : score?.toLowerCase() === "medium" ? "medium" : "low" as const);
                return (
                 <ConfidenceBadge
                   confidence={confLevel}
                   cause={cause || (confLevel === 'low' ? 'insufficient_data' : undefined)}
                   onAction={onConfidenceAction}
                 />
                )
              })() : (
                <RelevanceBadge
                  relevance={
                    score && !isNaN(parseFloat(score))
                      ? mapScoreToRelevance(parseFloat(score))
                      : (score?.toLowerCase() === "high" ? "high" : score?.toLowerCase() === "medium" ? "medium" : "low")
                  }
                  cause={cause}
                  onAction={onConfidenceAction}
                />
              )}
            </div>
          ) : (
            <>
              {isNextStep ? "Impact :" : (type === 'criteria' ? "Certainty score :" : "Relevance score :")} <span className="font-normal">{score}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
