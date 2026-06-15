import React from "react";
import { ClipboardList } from "lucide-react";
import { useAppStore } from "@/services/store";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { EmptyState } from "@shared/EmptyState";

interface AssessmentGateProps {
  children: React.ReactNode;
  onNavigateToAssessments: () => void;
}

export function AssessmentGate({ children, onNavigateToAssessments }: AssessmentGateProps) {
  const { activeAssessmentId } = useAppStore();

  if (!FEATURE_FLAGS.FEATURE_ASSESSMENT_GATE || activeAssessmentId) {
    return <>{children}</>;
  }

  return (
    <div className="py-20 flex justify-center min-h-[400px] text-center">
        <EmptyState 
          icon={ClipboardList}
          title="No active assessment"
          description="Start a new assessment in the Assessments tab to begin."
          actionLabel="Go to Assessments"
          onAction={onNavigateToAssessments}
        />
    </div>
  );
}
