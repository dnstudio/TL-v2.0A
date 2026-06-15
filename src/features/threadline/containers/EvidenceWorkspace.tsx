/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PERSISTENCE: EvidenceWorkspace management.
 * - acceptedItems, rejectedItems, deferredItems: Loaded from localStore on mount.
 * - Actions (Accept/Reject/Defer/Modify): Write to localStore and append audit events.
 * - hasSkippedConflicts: Persisted to allow Gate 2/3 bypass to survive refresh.
 */

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Edit3,
  ExternalLink,
  Activity,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Info,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  X,
  HelpCircle,
  Clock,
  FileText,
  BookOpen,
  Tag,
  Maximize2,
  Minimize2,
  ArrowRight,
  ChevronDown,
  Plus,
  Brain,
  History,
  Database,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Dot,
} from "recharts";

// UI Components
import {
  Button,
  Badge,
  Card,
  Typography,
  Input,
  Modal,
  Toast,
  DataPoint,
  CollapsibleSection,
} from "@ui/index";
import { SysBadge } from "@shared/SysBadge";
import { StatusBadge } from "@shared/StatusBadge";
import { ConfidenceBadge, mapScoreToConfidence } from "@shared/ConfidenceBadge";
import { ImpactBadge, mapScoreToImpact } from "@shared/ImpactBadge";
import { RelevanceBadge, mapScoreToRelevance } from "@shared/RelevanceBadge";
import { WorkspaceContainer } from "@components/layout/WorkspaceContainer";
import { WorkspaceLayout } from "@components/layout/WorkspaceLayout";
import { cn } from "@lib/utils";
import { ProgressBanner } from "../components/ProgressBanner";

// Context & Domain
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { useAppStore, useClinicalStore, EvidenceDecisionStore } from "@/services/store";
import { useWorkspaceAlerts } from "@/contexts/WorkspaceAlertsContext";
import {
  MOCK_EVIDENCE_ITEMS,
  MOCK_CLIENT_DATA,
  MOCK_ASSESSMENTS,
  MOCK_DOCUMENTS,
} from "../mockData";
import { useGroupedEvidence } from "../hooks/useGroupedEvidence";

// Sub-components
import { AssessmentGate } from "../components/AssessmentGate";
import { HypothesisGate } from "../components/HypothesisGate";
import { ReviewItem } from "../components/ReviewItem";
import { AssessmentCompareSidebar } from "../components/AssessmentCompareSidebar";
import { ClinicalNotesSidebar } from "../components/ClinicalNotesSidebar";
import {
  ModifyModal,
  SkipNextStepModal,
  AddEvidenceTypeModal,
  CreateClinicalEvidenceModal,
} from "../modals";
import { ModalHeader } from "../modals/shared/ModalHeader";
import { ConflictResolutionModal } from "../modals/ConflictResolutionModal";
import { CreateSessionModal } from "../modals/CreateSessionModal";
import { StartAssessmentModal } from "../modals/StartAssessmentModal";
import { UploadDocumentModal } from "../modals/UploadDocumentModal";
import { EntityCard } from "../components";
import { EvidenceWorkspaceCTAs } from "../components/EvidenceWorkspaceCTAs";

import { getEvidenceBadgeProps } from "../utils/evidenceUtils";
import { EvidenceInsightsCard, LowScoreWarningBanner } from "../components/EvidenceInsights";
import { Step, ReviewCategory } from "../components/EvidenceWorkspaceComponents";

// --- EvidenceInsightsCard Helper Components Removed (Moved to EvidenceInsights.tsx) ---

export function EvidenceWorkspace({
  onViewProfile,
  onNavigateToAssessments,
  onNavigateToDocuments,
  onNavigateToSession,
  onUnlockReport,
  clientId = "125566",
}: {
  onViewProfile?: () => void;
  onNavigateToAssessments?: (id?: string) => void;
  onNavigateToDocuments?: (id?: string) => void;
  onNavigateToSession?: (session: any) => void;
  onUnlockReport?: () => void;
  clientId?: string;
}) {
  const { activeAssessmentId, activeClientId } = useAppStore();
  const effectiveClientId = clientId || activeClientId || "";

  const { setAcceptedMappings, conflicts } = useWorkspaceAlerts();

  const clinicalData = useClinicalStore();
  const clientData = React.useMemo(() => {
    const staticData = (MOCK_CLIENT_DATA as any)[effectiveClientId] || {};
    const clientRecord = clinicalData.clients.find(c => c.id === effectiveClientId);
    
    return {
      ...staticData,
      ...clientRecord,
      sessions: clinicalData.sessions[effectiveClientId] || staticData.sessions || [],
      assessments: clinicalData.assessments[effectiveClientId] || staticData.assessments || [],
      documents: clinicalData.documents[effectiveClientId] || staticData.documents || [],
    };
  }, [clinicalData, effectiveClientId]);

  const sessionsFromStore = clinicalData.sessions[effectiveClientId] || [];

  const initialSessions = React.useMemo(() => {
    return clientData?.sessions?.map((s: any, idx: number) => ({
      ...s,
      id: s.id || `S-${idx + 1}`,
      date: s.date,
      focus: s.focus || s.description || "Clinical Snapshot",
      evidence: s.evidence || []
    })) || [];
  }, [clientData]);

  // Seed sessions from mock if store is empty
  React.useEffect(() => {
    if (effectiveClientId && sessionsFromStore.length === 0 && initialSessions.length > 0) {
      clinicalData.setSessions(effectiveClientId, initialSessions);
    }
  }, [effectiveClientId, sessionsFromStore.length, initialSessions.length]);

  // Seed assessments and documents if empty
  const assessmentsFromStore = clinicalData.assessments[effectiveClientId] || [];
  const documentsFromStore = clinicalData.documents[effectiveClientId] || [];
  
  React.useEffect(() => {
    if (effectiveClientId && assessmentsFromStore.length === 0) {
      const initialAssessments = clientData?.assessments || MOCK_ASSESSMENTS;
      clinicalData.setAssessments(effectiveClientId, initialAssessments);
    }
    if (effectiveClientId && documentsFromStore.length === 0) {
      const initialDocs = clientData?.documents || MOCK_DOCUMENTS;
      clinicalData.setDocuments(effectiveClientId, initialDocs);
    }
  }, [effectiveClientId, assessmentsFromStore.length, documentsFromStore.length, clientData]);

  const [localEvidenceItems, setLocalEvidenceItems] =
    useState(MOCK_EVIDENCE_ITEMS);
  const [localSessions, setLocalSessions] = useState<any[]>(sessionsFromStore);

  // Sync localSessions when clinicalData.sessions changes or clientId changes
  React.useEffect(() => {
    const fromStore = clinicalData.sessions[effectiveClientId] || [];
    // Migrate missing evidence from mock data for existing persisted sessions
    const merged = fromStore.map((storeSession) => {
      let ev = storeSession.evidence || [];
      if (ev.length === 0) {
        const mockMatch = initialSessions.find((s) => s.id === storeSession.id || s.focus === storeSession.focus);
        if (mockMatch && mockMatch.evidence && mockMatch.evidence.length > 0) {
          ev = mockMatch.evidence;
        }
      }
      return { ...storeSession, evidence: ev };
    });
    setLocalSessions(merged);
  }, [effectiveClientId, clinicalData.sessions, initialSessions]);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Set initial activeSessionId when localSessions populates
  React.useEffect(() => {
    if (!activeSessionId && localSessions.length > 0) {
       setActiveSessionId(localSessions[0].id);
    }
  }, [localSessions]);
  const [activeItemLabel, setActiveItemLabel] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<
    | "session"
    | "criteria"
    | "nextstep"
    | "assessment"
    | "document"
    | "tag"
    | "evidence_item"
  >("evidence_item");
  const [groupByUI, setGroupByUI] = useState<"source" | "tag" | "item">("item");
  const groupBy = FEATURE_FLAGS.FEATURE_HIDE_EVIDENCE_BY_TAG ? "source" : groupByUI;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(true);
  const [isFindingsExpanded, setIsFindingsExpanded] = useState(true);
  const [isNextStepsExpanded, setIsNextStepsExpanded] = useState(true);

  const handleToggleEvidence = (open: boolean) => {
    setIsEvidenceExpanded(open);
    if (open) {
      setIsFindingsExpanded(false);
      setIsNextStepsExpanded(false);
    }
  };

  const handleToggleFindings = (open: boolean) => {
    setIsFindingsExpanded(open);
    // When unlock Clinical Findings and expand the accordion, collapse the evidence accordion
    const isUnlocked = !FEATURE_FLAGS.FEATURE_SEQUENTIAL_EVIDENCE_REVIEW || isEvidenceReviewed;
    if (open && isUnlocked) {
      setIsEvidenceExpanded(false);
      setIsNextStepsExpanded(false);
    }
  };

  const handleToggleNextSteps = (open: boolean) => {
    setIsNextStepsExpanded(open);
    // When unlocked Follow-up & Next Steps and expand, collapse clinical finding accordion
    // and also collapse evidence accordion
    const isUnlocked = !FEATURE_FLAGS.FEATURE_SEQUENTIAL_EVIDENCE_REVIEW || (isEvidenceReviewed && isClinicalFindingsReviewed);
    if (open && isUnlocked) {
      setIsFindingsExpanded(false);
      setIsEvidenceExpanded(false);
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();

  const isOlderAssessmentsOpen = searchParams.get("modalOlderAssessments") === "true";
  const setIsOlderAssessmentsOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("modalOlderAssessments", "true");
    } else {
      newParams.delete("modalOlderAssessments");
    }
    setSearchParams(newParams);
  };

  const isModifyOpen = searchParams.get("modalModify") === "true";
  const setIsModifyOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("modalModify", "true");
    } else {
      newParams.delete("modalModify");
    }
    setSearchParams(newParams);
  };

  const [isModifyItemOpen, setIsModifyItemOpen] = useState(false);

  const isAddEvidenceTypeOpen = searchParams.get("modalAddType") === "true";
  const setIsAddEvidenceTypeOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("modalAddType", "true");
    } else {
      newParams.delete("modalAddType");
    }
    setSearchParams(newParams);
  };

  const [addEvidenceType, setAddEvidenceType] = useState<
    "session" | "assessment" | "document" | "criteria" | "nextstep"
  >("criteria");
  const [isAddMode, setIsAddMode] = useState(false);

  const isSkipOpen = searchParams.get("modalSkip") === "true";
  const setIsSkipOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("modalSkip", "true");
    } else {
      newParams.delete("modalSkip");
    }
    setSearchParams(newParams);
  };

  const isConflictModalOpen = searchParams.get("modalConflict") === "true";
  const setIsConflictModalOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("modalConflict", "true");
    } else {
      newParams.delete("modalConflict");
    }
    setSearchParams(newParams);
  };

  const isUploadModalOpen = searchParams.get("modalUpload") === "true";
  const setIsUploadModalOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("modalUpload", "true");
    } else {
      newParams.delete("modalUpload");
    }
    setSearchParams(newParams);
  };

  const isCreateSessionModalOpen = searchParams.get("modalCreateSession") === "true";
  const setIsCreateSessionModalOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("modalCreateSession", "true");
    } else {
      newParams.delete("modalCreateSession");
    }
    setSearchParams(newParams);
  };

  // Zustand State Selection
  const decisions = clinicalData.getEvidenceDecisions(effectiveClientId, activeAssessmentId || "");
  const cognitiveLoop = clinicalData.getCognitiveLoop(effectiveClientId, activeAssessmentId || "");

  const acceptedItems = useMemo(() => decisions.acceptedItems.map(i => i.id), [decisions]);
  const deferredItems = useMemo(() => decisions.deferredItems.map(i => i.id), [decisions]);
  const rejectedItems = useMemo(() => {
    const rejected: Record<string, string> = {};
    Object.entries(decisions.rejectedItems).forEach(([id, data]) => {
      rejected[id] = data.rationale;
    });
    return rejected;
  }, [decisions]);
  const hasSkippedConflicts = decisions.hasSkippedConflicts;

  const [clinicianHypothesis, setClinicianHypothesis] = useState(cognitiveLoop.hypothesisText || "");
  const [hypothesisSkipped, setHypothesisSkipped] = useState(false);

  // Sync hypothesis when cognitiveLoop changes
  useEffect(() => {
    setClinicianHypothesis(cognitiveLoop.hypothesisText || "");
  }, [cognitiveLoop.hypothesisText]);

  // Utility to update decisions in store
  const updateDecisions = (patch: Partial<EvidenceDecisionStore>) => {
    if (!effectiveClientId || !activeAssessmentId) return;
    clinicalData.setEvidenceDecisions(effectiveClientId, activeAssessmentId, {
      ...decisions,
      ...patch
    });
  };

  const [showToast, setShowToast] = useState(false);
  const [isFrictionOpen, setIsFrictionOpen] = useState(false);
  const [isRejectFrictionOpen, setIsRejectFrictionOpen] = useState(false);
  const [isTraceabilityHovered, setIsTraceabilityHovered] = useState<
    string | null
  >(null);

  const [activeAction, setActiveAction] = useState<
    "accept" | "reject" | "modify" | "defer" | null
  >(null);
  const [rationale, setRationale] = useState("");
  const rationaleRef = useRef<HTMLTextAreaElement>(null);

  const handleItemSelect = (
    id: string,
    type:
      | "session"
      | "criteria"
      | "nextstep"
      | "assessment"
      | "document"
      | "tag"
      | "evidence_item",
  ) => {
    if (type === "session") {
      setActiveType("session");
      setActiveSessionId(id);
      setActiveItemLabel(null);
    } else {
      setActiveType(type);
      setActiveItemLabel(id);
      setActiveSessionId(null);
    }
  };

  const handleTagClick = (tag: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const slug = tag.toLowerCase().trim();
    setActiveType("tag");
    setActiveItemLabel(`tag-${slug}`);
    setActiveSessionId(null);
  };

  const handleSourceClick = (srcId?: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!srcId) return;

    // Check what kind of source it is using derived items for accuracy
    const isSession = localSessions.some((s) => s.id === srcId);
    const isAssessment = assessmentItems.some((a: any) => a.id === srcId || a.label === srcId);
    const isDocument = documentItems.some((d: any) => d.id === srcId || d.label === srcId);
    const isStandalone = standaloneEvidence.some((i: any) => i.id === srcId || i.label === srcId);

    if (isSession) {
      setActiveType("session");
      setActiveSessionId(srcId);
    } else if (isAssessment) {
      setActiveType("assessment");
      const aItem = assessmentItems.find((a: any) => a.id === srcId || a.label === srcId);
      setActiveItemLabel(aItem?.id || aItem?.label || srcId);
      setActiveSessionId(null);
    } else if (isDocument) {
      setActiveType("document");
      const dItem = documentItems.find((d: any) => d.id === srcId || d.label === srcId);
      setActiveItemLabel(dItem?.id || dItem?.label || srcId);
      setActiveSessionId(null);
    } else if (isStandalone) {
      const sItem = standaloneEvidence.find((i: any) => i.id === srcId || i.label === srcId);
      setActiveType(sItem?.type as any || "evidence_item");
      setActiveItemLabel(sItem?.id || sItem?.label || srcId);
      setActiveSessionId(null);
    }
  };

  const handleJumpToSpot = (finding: any) => {
    if (!finding) return;

    if (finding.type === 'session' && finding.id) {
      const session = localSessions.find((s) => s.id === finding.id);
      if (session && onNavigateToSession) {
        onNavigateToSession(session);
      }
      return;
    }
    if (finding.type === 'assessment' && finding.id) {
      if (onNavigateToAssessments) onNavigateToAssessments(finding.id);
      return;
    }
    if (finding.type === 'document' && finding.id) {
      if (onNavigateToDocuments) onNavigateToDocuments(finding.id);
      return;
    }

    if (finding.sessionId) {
      const session = localSessions.find((s) => s.id === finding.sessionId);
      if (session && onNavigateToSession) {
        onNavigateToSession(session);
        return;
      }
    }

    if (finding.sourceAssessmentId && onNavigateToAssessments) {
      onNavigateToAssessments(finding.sourceAssessmentId);
    } else if (finding.sourceDocumentId && onNavigateToDocuments) {
      onNavigateToDocuments(finding.sourceDocumentId);
    }
  };

  const handleConfidenceAction = (cause: string) => {
    if (cause === "missing_document") {
      setIsUploadModalOpen(true);
    } else if (cause === "source_conflict") {
      setIsConflictModalOpen(true);
    } else if (cause === "insufficient_data" || cause === "stale_data") {
      setIsCreateSessionModalOpen(true);
    } else {
      console.log("Action for cause:", cause);
      // For other clinical insights, we can just log or show a toast if available
    }
  };

  // Derived data
  const criteriaItems = useMemo(() => {
    return localEvidenceItems
      .filter((i) => i.type === "criteria")
      .map((i: any) => ({ 
        ...i, 
        hasConflict: i.hasConflict,
        cause: i.cause,
        findings: (i.findings || []).map((f: any) => ({
          ...f,
          sourceAssessmentId: f.sourceAssessmentId,
          sourceDocumentId: f.sourceDocumentId,
          sessionId: f.sessionId
        }))
      }));
  }, [localEvidenceItems]);

  const nextStepItems = useMemo(() => {
    return localEvidenceItems
      .filter((i) => i.type === "nextstep")
      .map((i: any) => ({ 
        ...i, 
        hasConflict: i.hasConflict,
        cause: i.impactCause || i.cause,
        findings: (i.findings || []).map((f: any) => ({
          ...f,
          sourceAssessmentId: f.sourceAssessmentId,
          sourceDocumentId: f.sourceDocumentId,
          sessionId: f.sessionId
        }))
      }));
  }, [localEvidenceItems]);

  const assessmentItemsFromStore = useMemo(() => clinicalData.getAssessments(effectiveClientId), [clinicalData, effectiveClientId]);
  const documentItemsFromStore = useMemo(() => clinicalData.documents[effectiveClientId] || [], [clinicalData.documents, effectiveClientId]);

  const allAssessmentItems = useMemo(() => {
    return assessmentItemsFromStore
      .filter((a: any) => a.status !== 'not-started')
      .map((a: any) => {
        const evidenceItem = MOCK_EVIDENCE_ITEMS.find(ei => {
          if (!ei.label || !a.title) return false;
          const labelLower = ei.label.toLowerCase();
          const titleLower = a.title.toLowerCase();
          return (
            ei.id === a.id || 
            labelLower === titleLower ||
            (titleLower.includes("phq-9") && labelLower.includes("phq-9")) ||
            (titleLower.includes("gad-7") && labelLower.includes("gad-7")) ||
            (titleLower.includes("asrs") && labelLower.includes("asrs")) ||
            (titleLower.includes("wai") && labelLower.includes("wai"))
          );
        });
        return {
          ...a,
          label: a.title,
          type: "assessment",
          hasConflict: a.hasConflict || evidenceItem?.hasConflict,
          conflictTargetId: a.conflictTargetId || evidenceItem?.conflictTargetId,
          conflictTargetLabel: a.conflictTargetLabel || evidenceItem?.conflictTargetLabel,
          conflictTargetType: a.conflictTargetType || evidenceItem?.conflictTargetType,
          conflictDescription: a.conflictDescription || evidenceItem?.conflictDescription,
          cause: a.relevanceCause || a.cause,
          findings: ((a.findings && a.findings.length > 0) ? a.findings : (evidenceItem?.findings || [])).map((f: any) => ({
            ...f,
            hasConflict: f.hasConflict,
            sourceAssessmentId: f.sourceAssessmentId || a.id || a.title
          }))
        };
      });
  }, [assessmentItemsFromStore]);

  const assessmentItems = useMemo(() => {
    const seen = new Set();
    return [...allAssessmentItems].reverse().filter(a => {
      if (seen.has(a.label)) return false;
      seen.add(a.label);
      return true;
    }).reverse();
  }, [allAssessmentItems]);
    
  const allDocumentItems = useMemo(() => {
    return documentItemsFromStore
      .map((d: any) => {
        const evidenceItem = MOCK_EVIDENCE_ITEMS.find(ei => ei.label === d.name || ei.id === d.id);
        return {
          ...d,
          label: d.name,
          type: "document",
          hasConflict: d.hasConflict || evidenceItem?.hasConflict,
          conflictTargetId: d.conflictTargetId || evidenceItem?.conflictTargetId,
          conflictTargetLabel: d.conflictTargetLabel || evidenceItem?.conflictTargetLabel,
          conflictTargetType: d.conflictTargetType || evidenceItem?.conflictTargetType,
          conflictDescription: d.conflictDescription || evidenceItem?.conflictDescription,
          cause: d.relevanceCause || d.cause,
          findings: ((d.findings && d.findings.length > 0) ? d.findings : (evidenceItem?.findings || [])).map((f: any) => ({
            ...f,
            hasConflict: f.hasConflict,
            sourceDocumentId: f.sourceDocumentId || d.id || d.name
          }))
        };
      });
  }, [documentItemsFromStore]);

  const documentItems = useMemo(() => {
    const seen = new Set();
    return [...allDocumentItems].reverse().filter(d => {
      if (seen.has(d.label)) return false;
      seen.add(d.label);
      return true;
    }).reverse();
  }, [allDocumentItems]);
    
  const standaloneEvidence = useMemo(() => {
    return localEvidenceItems.filter((i) => {
      if (i.type !== "evidence" && i.type !== "document" && i.type !== "assessment") return false;
      
      // Check if it already exists in assessmentItems or documentItems
      const exists = 
        assessmentItems.some(ai => ai.id === i.id || ai.label === i.label) ||
        documentItems.some(di => di.id === i.id || di.label === i.label);
        
      return !exists;
    });
  }, [localEvidenceItems, assessmentItems, documentItems]);
  // Keep original mock documents and assessments in standaloneEvidence to not break MOCK_EVIDENCE_ITEMS that aren't in the store yet.

  const { tagGroups, allEvidenceSnippets } = useGroupedEvidence(
    localSessions,
    assessmentItems,
    documentItems,
    standaloneEvidence
  );
  const currentSession = localSessions.find(
    (s: any) => s.id === activeSessionId,
  );

  const derivedAcceptedItems = React.useMemo(() => {
    let result = [...acceptedItems];
    if (FEATURE_FLAGS.FEATURE_IMPLICIT_GROUP_ACCEPTANCE) {
      localSessions.forEach((s: any) => {
        const sessionSnippets = allEvidenceSnippets.filter(
          (snip) => snip.sessionId === s.id,
        );
        if (
          sessionSnippets.length > 0 &&
          sessionSnippets.every((snip) => acceptedItems.includes(snip.id))
        ) {
          result.push(s.id);
        }
      });
      assessmentItems.forEach((a) => {
        const id = a.id || a.label;
        const sessionSnippets = allEvidenceSnippets.filter(
          (snip) => snip.sessionId === id,
        );
        if (
          sessionSnippets.length > 0 &&
          sessionSnippets.every((snip) => acceptedItems.includes(snip.id))
        ) {
          result.push(id);
        }
      });
      documentItems.forEach((d) => {
        const id = d.id || d.label;
        const sessionSnippets = allEvidenceSnippets.filter(
          (snip) => snip.sessionId === id,
        );
        if (
          sessionSnippets.length > 0 &&
          sessionSnippets.every((snip) => acceptedItems.includes(snip.id))
        ) {
          result.push(id);
        }
      });
      tagGroups.forEach((tg) => {
        if (
          tg.findings.length > 0 &&
          tg.findings.every((f: any) => acceptedItems.includes(f.id))
        ) {
          result.push(tg.id);
        }
      });
    }
    return result;
  }, [
    acceptedItems,
    FEATURE_FLAGS.FEATURE_IMPLICIT_GROUP_ACCEPTANCE,
    localSessions,
    allEvidenceSnippets,
    tagGroups,
    assessmentItems,
    documentItems,
  ]);

  const derivedPartiallyAcceptedItems = React.useMemo(() => {
    let result: string[] = [];
    if (!FEATURE_FLAGS.FEATURE_IMPLICIT_GROUP_ACCEPTANCE) return result;

    localSessions.forEach((s: any) => {
      const sessionSnippets = allEvidenceSnippets.filter(
        (snip) => snip.sessionId === s.id,
      );
      const someAcceptedOrRejected = sessionSnippets.some(
        (snip) => acceptedItems.includes(snip.id) || !!rejectedItems[snip.id],
      );
      const allAccepted =
        sessionSnippets.length > 0 &&
        sessionSnippets.every((snip) => acceptedItems.includes(snip.id));
      const allRejected =
        sessionSnippets.length > 0 &&
        sessionSnippets.every((snip) => !!rejectedItems[snip.id]);
      if (someAcceptedOrRejected && !allAccepted && !allRejected) {
        result.push(s.id);
      }
    });
    assessmentItems.forEach((a) => {
      const id = a.id || a.label;
      const sessionSnippets = allEvidenceSnippets.filter(
        (snip) => snip.sessionId === id,
      );
      const someAcceptedOrRejected = sessionSnippets.some(
        (snip) => acceptedItems.includes(snip.id) || !!rejectedItems[snip.id],
      );
      const allAccepted =
        sessionSnippets.length > 0 &&
        sessionSnippets.every((snip) => acceptedItems.includes(snip.id));
      const allRejected =
        sessionSnippets.length > 0 &&
        sessionSnippets.every((snip) => !!rejectedItems[snip.id]);
      if (someAcceptedOrRejected && !allAccepted && !allRejected) {
        result.push(id);
      }
    });
    documentItems.forEach((d) => {
      const id = d.id || d.label;
      const sessionSnippets = allEvidenceSnippets.filter(
        (snip) => snip.sessionId === id,
      );
      const someAcceptedOrRejected = sessionSnippets.some(
        (snip) => acceptedItems.includes(snip.id) || !!rejectedItems[snip.id],
      );
      const allAccepted =
        sessionSnippets.length > 0 &&
        sessionSnippets.every((snip) => acceptedItems.includes(snip.id));
      const allRejected =
        sessionSnippets.length > 0 &&
        sessionSnippets.every((snip) => !!rejectedItems[snip.id]);
      if (someAcceptedOrRejected && !allAccepted && !allRejected) {
        result.push(id);
      }
    });
    tagGroups.forEach((tg) => {
      const someAcceptedOrRejected = tg.findings.some(
        (f: any) => acceptedItems.includes(f.id) || !!rejectedItems[f.id],
      );
      const allAccepted =
        tg.findings.length > 0 &&
        tg.findings.every((f: any) => acceptedItems.includes(f.id));
      const allRejected =
        tg.findings.length > 0 &&
        tg.findings.every((f: any) => !!rejectedItems[f.id]);
      if (someAcceptedOrRejected && !allAccepted && !allRejected) {
        result.push(tg.id);
      }
    });
    return result;
  }, [
    acceptedItems,
    rejectedItems,
    FEATURE_FLAGS.FEATURE_IMPLICIT_GROUP_ACCEPTANCE,
    localSessions,
    allEvidenceSnippets,
    tagGroups,
    assessmentItems,
    documentItems,
  ]);

  // Sync state when client changes
  React.useEffect(() => {
    if (groupBy === "item" && allEvidenceSnippets.length > 0) {
      setActiveItemLabel(allEvidenceSnippets[0].id);
      setActiveType("evidence_item");
      setActiveSessionId(null);
    } else if (groupBy === "tag" && tagGroups.length > 0) {
      setActiveItemLabel(tagGroups[0].id);
      setActiveType("tag");
      setActiveSessionId(null);
    } else if (localSessions.length > 0) {
      setActiveSessionId(localSessions[0].id);
      setActiveType("session");
      setActiveItemLabel(null);
    } else if (criteriaItems.length > 0) {
      setActiveType("criteria");
      setActiveItemLabel(criteriaItems[0].label);
      setActiveSessionId(null);
    }
  }, [
    clientId,
    localSessions.length,
    criteriaItems.length,
    allEvidenceSnippets.length,
    tagGroups.length,
    groupBy,
  ]);

  React.useEffect(() => {
    if (clientData?.allAccepted) {
      const allRequired = [
        ...localSessions.map((s: any) => s.id),
        ...criteriaItems.map((i) => i.label),
        ...assessmentItems.map((i) => i.label),
        ...documentItems.map((i) => i.label),
        ...tagGroups.map((t) => t.id),
        ...allEvidenceSnippets.map((i) => i.id),
      ];
      const accepted = allRequired.map(id => ({ id, rationale: "", timestamp: new Date().toISOString() }));
      updateDecisions({ acceptedItems: accepted });

      // Also sync mappings for analysis
      const mappings = [
        ...criteriaItems.map((i) => ({
          id: i.label,
          label: i.label,
          confidence: parseFloat(i.score) || 0,
        })),
        ...assessmentItems.map((i) => ({
          id: i.label,
          label: i.label,
          confidence: parseFloat(i.score) || 0,
        })),
        ...documentItems.map((i) => ({
          id: i.label,
          label: i.label,
          confidence: parseFloat(i.score) || 0,
        })),
      ];
      setAcceptedMappings(mappings);
    } else {
      updateDecisions({ acceptedItems: [] });
      setAcceptedMappings([]);
    }
    // Only run when client ID changes to avoid clearing manual progress
  }, [clientId, localSessions.length, tagGroups.length]);

  const currentList =
    activeType === "session"
      ? []
      : activeType === "tag"
        ? tagGroups
        : activeType === "evidence_item"
          ? allEvidenceSnippets
          : activeType === "criteria"
            ? criteriaItems
            : activeType === "assessment"
              ? assessmentItems
              : activeType === "document"
                ? documentItems
                : nextStepItems;

  const currentItem =
    activeType === "session"
      ? currentSession
        ? {
            ...currentSession,
            type: "session",
            label: currentSession.focus,
            findings: currentSession.evidence,
          }
        : null
      : (activeType === "evidence_item"
          ? allEvidenceSnippets.find((i) => i.id === activeItemLabel)
          : currentList.find((i) => (i.id || i.label) === activeItemLabel)) ||
        null;

  const currentItemTags = Array.from(
    new Set([
      ...((currentItem as any)?.tags || []),
      ...((currentItem as any)?.findings || []).flatMap((f: any) =>
        Array.isArray(f.tags)
          ? f.tags
          : (f.tag || "")
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean),
      ),
    ]),
  );

  const removeSnippet = (snippetId: string) => {
    // Avoid removing if ID is missing (shouldn't happen with valid data)
    if (!snippetId) return;

    // 1. Update localSessions
    const updatedSessions = localSessions.map((s) => ({
      ...s,
      evidence: s.evidence?.filter(
        (f: any) => (f.id || f.text) !== snippetId,
      ),
    }));
    setLocalSessions(updatedSessions);
    clinicalData.setSessions(effectiveClientId, updatedSessions);

    // 2. Update assessments and documents
    const updatedAssessments = assessmentItemsFromStore.map((a: any) => ({
      ...a,
      findings: a.findings?.filter((f: any) => (f.id || f.text) !== snippetId),
    }));
    clinicalData.setAssessments(effectiveClientId, updatedAssessments);

    const updatedDocs = documentItemsFromStore.map((d: any) => ({
      ...d,
      findings: d.findings?.filter((f: any) => (f.id || f.text) !== snippetId),
    }));
    clinicalData.setDocuments(effectiveClientId, updatedDocs);

    // 3. Update localEvidenceItems (for standalone criteria & next steps)
    setLocalEvidenceItems((prev) =>
      prev.map((item) => ({
        ...item,
        findings: item.findings?.filter(
          (f: any) => (f.id || f.text) !== snippetId,
        ),
      })),
    );

    // 4. Clear active item if it was the one being removed
    if (activeItemLabel === snippetId) {
      setActiveItemLabel(null);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const isAnalysisModalOpen = searchParams.get("modalAnalysis") === "true";
  const setIsAnalysisModalOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("modalAnalysis", "true");
    } else {
      newParams.delete("modalAnalysis");
    }
    setSearchParams(newParams);
  };

  const requiredItems = [
    ...(groupBy === "source"
      ? [
          ...localSessions.map((s: any) => s.id),
          ...assessmentItems.map((i) => i.label),
          ...documentItems.map((i) => i.label),
        ]
      : groupBy === "tag"
        ? tagGroups.map((t) => t.id)
        : allEvidenceSnippets.map((i) => i.id)),
    ...criteriaItems.map((i) => i.label),
  ];
  const totalRequiredItems = requiredItems.length;

  const currentRequiredProgress = requiredItems.filter(
    (id) => derivedAcceptedItems.includes(id) || !!rejectedItems[id],
  ).length;

  const isAllRequiredReviewed =
    clientData?.allAccepted || currentRequiredProgress === totalRequiredItems;

  const isEvidenceReviewed = useMemo(() => {
    if (clientData?.allAccepted) return true;
    const evidenceIds = groupBy === "source"
      ? [
          ...localSessions.map((s: any) => s.id),
          ...assessmentItems.map((i) => i.label),
          ...documentItems.map((i) => i.label),
        ]
      : groupBy === "tag"
        ? tagGroups.map((t) => t.id)
        : allEvidenceSnippets.map((i) => i.id);
    
    if (evidenceIds.length === 0) return true;
    
    return evidenceIds.every(id => 
      derivedAcceptedItems.includes(id) || !!rejectedItems[id]
    );
  }, [clientData?.allAccepted, groupBy, localSessions, assessmentItems, documentItems, tagGroups, allEvidenceSnippets, derivedAcceptedItems, rejectedItems]);

  const isClinicalFindingsReviewed = useMemo(() => {
    if (clientData?.allAccepted) return true;
    const criteriaIds = criteriaItems.map((i) => i.label);
    if (criteriaIds.length === 0) return true;
    return criteriaIds.every(id => 
      derivedAcceptedItems.includes(id) || !!rejectedItems[id]
    );
  }, [clientData?.allAccepted, criteriaItems, derivedAcceptedItems, rejectedItems]);

  // Use refs to ensure the auto-expand/collapse only triggers once when the threshold is crossed
  const hasAutoUnlockedFindings = useRef(false);
  const hasAutoUnlockedNextSteps = useRef(false);

  // Sequential Auto-Collapse Logic:
  // When a section is fully reviewed, the next section automatically unlocks, expands, and collapses the previous one
  useEffect(() => {
    if (FEATURE_FLAGS.FEATURE_SEQUENTIAL_EVIDENCE_REVIEW) {
      if (isEvidenceReviewed && !hasAutoUnlockedFindings.current) {
        hasAutoUnlockedFindings.current = true;
        setIsFindingsExpanded(true);
        setIsEvidenceExpanded(false);
      }
    }
  }, [isEvidenceReviewed]);

  useEffect(() => {
    if (FEATURE_FLAGS.FEATURE_SEQUENTIAL_EVIDENCE_REVIEW) {
      if (isEvidenceReviewed && isClinicalFindingsReviewed && !hasAutoUnlockedNextSteps.current) {
        hasAutoUnlockedNextSteps.current = true;
        setIsNextStepsExpanded(true);
        setIsFindingsExpanded(false);
        setIsEvidenceExpanded(false);
      }
    }
  }, [isEvidenceReviewed, isClinicalFindingsReviewed]);

  const isCriteria = activeType === "criteria";
  const isNextStep = activeType === "nextstep";
  const isAssessment = activeType === "assessment";
  const isDocument = activeType === "document";
  const isTag = activeType === "tag";
  const isEvidenceItem = activeType === "evidence_item";
  const itemConfidence = currentItem 
    ? parseFloat(currentItem.score || (
        activeType === "session" ? "0.98" : 
        activeType === "evidence_item" ? "0.95" : "0"
      )) 
    : 0;
  const activeId = activeType === "session" ? activeSessionId : activeItemLabel;

  const handleActionClick = (
    action: "accept" | "reject" | "modify" | "defer",
  ) => {
    if (action === "reject") {
      setIsRejectFrictionOpen(true);
      return;
    }
    
    if (action === "accept") handleAccept();
    if (action === "modify") {
      if (activeType === "evidence_item") {
        setIsModifyItemOpen(true);
      } else {
        setIsModifyOpen(true);
      }
    }
    if (action === "defer") handleDefer();
  };

  const commitAction = () => {
    if (activeAction === "accept") handleAccept();
    else if (activeAction === "reject") {
      const id = activeType === "session" ? activeSessionId : activeItemLabel;
      if (id) {
        const rejected = { ...decisions.rejectedItems };
        rejected[id] = { rationale, timestamp: new Date().toISOString() };
        
        updateDecisions({
          rejectedItems: rejected,
          deferredItems: decisions.deferredItems.filter(di => di.id !== id)
        });
        autoAdvance();
      }
    } else if (activeAction === "defer") handleDefer();

    setActiveAction(null);
    setRationale("");
  };

  const autoAdvance = () => {
    const id = activeType === "session" ? activeSessionId : activeItemLabel;
    if (!id) return;

    setTimeout(() => {
      if (activeType === "session") {
        const currentIndex = localSessions.findIndex(
          (s: any) => s.id === activeSessionId,
        );
        const nextSession =
          localSessions
            .slice(currentIndex + 1)
            .find(
              (s: any) =>
                !derivedAcceptedItems.includes(s.id) &&
                !rejectedItems[s.id] &&
                !deferredItems.includes(s.id),
            ) ||
          localSessions[currentIndex + 1] ||
          null;

        if (nextSession) {
          setActiveSessionId(nextSession.id);
        } else {
          // Move to criteria if no more sessions
          if (criteriaItems.length > 0) {
            setActiveType("criteria");
            setActiveItemLabel(criteriaItems[0].label);
            setActiveSessionId(null);
          }
        }
      } else {
        const currentIndex = currentList.findIndex(
          (i) => (i.id || i.label) === activeItemLabel,
        );

        const nextItem =
          currentList
            .slice(currentIndex + 1)
            .find(
              (i) =>
                !derivedAcceptedItems.includes(i.id || i.label) &&
                !rejectedItems[i.id || i.label] &&
                !deferredItems.includes(i.id || i.label),
            ) ||
          currentList[currentIndex + 1] ||
          null;

        if (nextItem) {
          setActiveItemLabel(nextItem.id || nextItem.label);
        } else if (activeType === "evidence_item" && criteriaItems.length > 0) {
          setActiveType("criteria");
          setActiveItemLabel(criteriaItems[0].label);
        } else if (activeType === "tag" && criteriaItems.length > 0) {
          setActiveType("criteria");
          setActiveItemLabel(criteriaItems[0].label);
        } else if (activeType === "criteria" && assessmentItems.length > 0) {
          setActiveType("assessment");
          setActiveItemLabel(assessmentItems[0].label);
        } else if (activeType === "assessment" && documentItems.length > 0) {
          setActiveType("document");
          setActiveItemLabel(documentItems[0].label);
        } else if (activeType === "document" && nextStepItems.length > 0) {
          setActiveType("nextstep");
          setActiveItemLabel(nextStepItems[0].label);
        }
      }
    }, 1500);
  };

  const handleDefer = () => {
    const id = activeType === "session" ? activeSessionId : activeItemLabel;
    if (!id) return;

    let newDeferredIds = [id];

    // Include child items for groups
    if (
      activeType === "session" ||
      activeType === "assessment" ||
      activeType === "document"
    ) {
      const snippetsForSource = allEvidenceSnippets
        .filter((s) => s.sessionId === id)
        .map((s) => s.id);
      newDeferredIds = [...newDeferredIds, ...snippetsForSource];
    } else if (activeType === "tag") {
      const tagGroup = tagGroups.find((t) => t.id === id);
      if (tagGroup) {
        const snippetsForTag = tagGroup.findings.map((f: any) => f.id);
        newDeferredIds = [...newDeferredIds, ...snippetsForTag];
      }
    }

    if (
      !decisions.deferredItems.some((di) => di.id === id)
    ) {
      const newDeferredItems = [...decisions.deferredItems];
      newDeferredIds.forEach(newId => {
        if (!newDeferredItems.some(i => i.id === newId)) {
          newDeferredItems.push({ id: newId, reason: "insufficient_data", timestamp: new Date().toISOString() });
        }
      });

      updateDecisions({
        deferredItems: newDeferredItems
      });
      autoAdvance();
    }
  };

  const handleRestore = (label: string) => {
    let idsToRemove = [label];
    
    // Check if it's a group and remove its children too
    const isSession = localSessions.some(s => s.id === label);
    const isAssessmentOrDoc = assessmentItems.some(i => i.label === label) || documentItems.some(i => i.label === label);
    const tagGroup = tagGroups.find(tg => tg.id === label);

    if (isSession || isAssessmentOrDoc) {
      const snippetsForSource = allEvidenceSnippets
        .filter((s) => s.sessionId === label)
        .map((s) => s.id);
      idsToRemove = [...idsToRemove, ...snippetsForSource];
    } else if (tagGroup) {
      const snippetsForTag = tagGroup.findings.map((f: any) => f.id);
      idsToRemove = [...idsToRemove, ...snippetsForTag];
    }

    updateDecisions({
      deferredItems: decisions.deferredItems.filter((l) => !idsToRemove.includes(l.id))
    });
    if (activeType === "session") setActiveSessionId(label);
    else setActiveItemLabel(label);
  };

  const handleUndoAccept = () => {
    const id = activeType === "session" ? activeSessionId : activeItemLabel;
    if (!id) return;
    updateDecisions({
      acceptedItems: decisions.acceptedItems.filter((l) => l.id !== id)
    });
    if (activeType !== "session") {
      setAcceptedMappings((prev: any[]) => prev.filter((m) => m.id !== id));
    }
  };

  const handleUndoReject = () => {
    const id = activeType === "session" ? activeSessionId : activeItemLabel;
    if (!id) return;
    const rejected = { ...decisions.rejectedItems };
    delete rejected[id];
    updateDecisions({
      rejectedItems: rejected
    });
  };

  const handleAccept = () => {
    const id = activeType === "session" ? activeSessionId : activeItemLabel;
    if (!id) return;

    const isHighRelevanceNoConflict = itemConfidence >= 0.75 && !currentItem?.hasConflict;

    if (
      FEATURE_FLAGS.FEATURE_UX_COGNITIVE_FRICTION_ON_ACCEPT &&
      !derivedAcceptedItems.includes(id) &&
      !isHighRelevanceNoConflict
    ) {
      setIsFrictionOpen(true);
      return;
    }

    confirmAccept(id);
  };

  const confirmAccept = (id: string) => {
    let newAcceptedIds = [id];

    // Auto-accept child items if we are accepting a group
    if (
      activeType === "session" ||
      activeType === "assessment" ||
      activeType === "document"
    ) {
      const snippetsForSource = allEvidenceSnippets
        .filter((s) => s.sessionId === id)
        .map((s) => s.id);
      newAcceptedIds = [...newAcceptedIds, ...snippetsForSource];
    } else if (activeType === "tag") {
      const tagGroup = tagGroups.find((t) => t.id === id);
      if (tagGroup) {
        const snippetsForTag = tagGroup.findings.map((f: any) => f.id);
        newAcceptedIds = [...newAcceptedIds, ...snippetsForTag];
      }
    }

    const newAcceptedItems = [...decisions.acceptedItems];
    newAcceptedIds.forEach(newId => {
      if (!newAcceptedItems.some(i => i.id === newId)) {
        newAcceptedItems.push({ id: newId, rationale: "", timestamp: new Date().toISOString() });
      }
    });

    updateDecisions({
      acceptedItems: newAcceptedItems,
      deferredItems: decisions.deferredItems.filter((di) => !newAcceptedIds.includes(di.id))
    });

    if (activeType !== "session" && activeItemLabel) {
      setAcceptedMappings((prev: any[]) => {
        if (prev.find((m) => m.id === activeItemLabel)) return prev;
        return [
          ...prev,
          {
            id: activeItemLabel,
            label: activeItemLabel,
            confidence: itemConfidence || 0,
          },
        ];
      });
    }

    autoAdvance();
    setIsFrictionOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div
        className={cn(
          "px-5 py-6 border-b border-divider",
          isSidebarCollapsed ? "flex items-center justify-center" : "",
        )}
      >
        {!isSidebarCollapsed ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <Typography
                variant="h4"
                className="font-sans text-[20px] font-medium text-slate-800"
              >
                Review Queue
              </Typography>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="h-8 w-8 text-text-secondary shrink-0"
                title="Collapse Sidebar"
              >
                <ChevronLeft size={18} />
              </Button>
            </div>
            {!FEATURE_FLAGS.FEATURE_HIDE_EVIDENCE_BY_TAG && (
              <div className="flex p-1 bg-gray-200/50 rounded-lg w-full mt-2">
                <button
                  className={cn(
                    "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all text-center",
                    groupBy === "item"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                  onClick={() => {
                    setGroupByUI("item");
                    if (
                      activeType === "session" ||
                      activeType === "assessment" ||
                      activeType === "document" ||
                      activeType === "tag"
                    ) {
                      if (allEvidenceSnippets.length > 0) {
                        setActiveType("evidence_item");
                        setActiveItemLabel(allEvidenceSnippets[0].id);
                        setActiveSessionId(null);
                      }
                    }
                  }}
                >
                  By Item
                </button>
                <button
                  className={cn(
                    "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all text-center",
                    groupBy === "source"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-700",
                  )}
                  onClick={() => {
                    setGroupByUI("source");
                    if (activeType === "tag") {
                      if (localSessions.length > 0) {
                        setActiveType("session");
                        setActiveSessionId(localSessions[0].id);
                        setActiveItemLabel(null);
                      }
                    }
                  }}
                >
                  By Source
                </button>
                <button
                  className={cn(
                    "flex-1 text-xs font-semibold py-1.5 rounded-md transition-all text-center",
                    groupBy === "tag"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                  onClick={() => {
                    setGroupByUI("tag");
                    if (
                      activeType === "session" ||
                      activeType === "assessment" ||
                      activeType === "document" ||
                      activeType === "evidence_item"
                    ) {
                      if (tagGroups.length > 0) {
                        setActiveType("tag");
                        setActiveItemLabel(tagGroups[0].id);
                        setActiveSessionId(null);
                      }
                    }
                  }}
                >
                  By Tag
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="h-8 w-8 text-text-secondary mx-auto"
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </Button>
        )}
      </div>

      {!isSidebarCollapsed && (
        <div className="flex-1 overflow-y-auto p-3">
          {/* Evidence Category */}
          {groupBy === "source" ? (
            <ReviewCategory
              title={
                FEATURE_FLAGS.FEATURE_HIDE_EVIDENCE_BY_TAG
                  ? `Evidence (${localSessions.length + assessmentItems.length + documentItems.length + standaloneEvidence.length})`
                  : `Evidence by Source (${localSessions.length + assessmentItems.length + documentItems.length + standaloneEvidence.length})`
              }
              items={[
                ...localSessions.map((s: any) => ({
                  label: s.focus || s.description || "Clinical Snapshot",
                  score: s.score || "0.98",
                  type: "session",
                  id: s.id,
                  hasConflict: s.hasConflict,
                  cause: s.relevanceCause || s.cause,
                })),
                ...assessmentItems.map(a => ({ ...a, score: a.score || "0.9" })),
                ...documentItems.map(d => ({ ...d, score: d.score || "0.9" })),
                ...standaloneEvidence.map(i => ({
                  ...i,
                  label: i.label || i.id,
                  type: i.type,
                  id: i.id || i.label,
                  score: i.score || (i.type === "evidence" ? "0.95" : "0.9"),
                  hasConflict: i.hasConflict,
                  cause: i.relevanceCause || i.cause
                }))
              ].filter(i => !deferredItems.includes(i.id || (i as any).label))}
              activeType={activeType}
              onConfidenceAction={handleConfidenceAction}
              activeItemLabel={
                activeType === "session" ? activeSessionId : activeItemLabel
              }
              deferredItems={deferredItems}
              acceptedItems={derivedAcceptedItems}
              partiallyAcceptedItems={derivedPartiallyAcceptedItems}
              rejectedItems={rejectedItems}
              isOpen={isEvidenceExpanded}
              onToggle={handleToggleEvidence}
              onSelect={(id, type) => {
                if (type === "session") {
                  setActiveSessionId(id);
                } else {
                  setActiveItemLabel(id);
                  setActiveSessionId(null);
                }
                setActiveType(type as any);
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 flex items-center justify-center gap-2 rounded-lg"
                onClick={() => setIsAddEvidenceTypeOpen(true)}
              >
                <Plus size={14} /> Add Evidence
              </Button>
            </ReviewCategory>
          ) : groupBy === "tag" ? (
            <ReviewCategory
              title={`Evidence by Tag (${tagGroups.length})`}
              items={tagGroups.filter(tg => !deferredItems.includes(tg.id))}
              activeType={activeType}
              onConfidenceAction={handleConfidenceAction}
              activeItemLabel={activeItemLabel}
              deferredItems={deferredItems}
              acceptedItems={derivedAcceptedItems}
              partiallyAcceptedItems={derivedPartiallyAcceptedItems}
              rejectedItems={rejectedItems}
              isOpen={isEvidenceExpanded}
              onToggle={handleToggleEvidence}
              onSelect={(id, type) => {
                setActiveItemLabel(id);
                setActiveSessionId(null);
                setActiveType(type as any);
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 flex items-center justify-center gap-2 rounded-lg"
                onClick={() => setIsAddEvidenceTypeOpen(true)}
              >
                <Plus size={14} /> Add Evidence
              </Button>
            </ReviewCategory>
          ) : (
            <ReviewCategory
              title={`Evidence by Item (${allEvidenceSnippets.length})`}
              items={allEvidenceSnippets
                .filter(f => !deferredItems.includes(f.id))
                .map((f) => ({
                  id: f.id || f.label || f.text,
                  label: f.text || f.label || f.verbatim || f.description,
                  type: "evidence_item" as const,
                  score: f.score || "0.95",
                  sessionSource: f.sourceSession,
                  timestamp: f.timestamp,
                  hasConflict: !!f.hasConflict,
                  isUserGenerated: f.isUserGenerated,
                  cause: (f as any).relevanceCause || (f as any).cause,
                }))}
              activeType={activeType}
              onConfidenceAction={handleConfidenceAction}
              activeItemLabel={activeItemLabel}
              deferredItems={deferredItems}
              acceptedItems={acceptedItems}
              partiallyAcceptedItems={derivedPartiallyAcceptedItems}
              rejectedItems={rejectedItems}
              isOpen={isEvidenceExpanded}
              onToggle={handleToggleEvidence}
              onSelect={(id, type) => {
                setActiveItemLabel(id);
                setActiveSessionId(null);
                setActiveType(type as any);
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 flex items-center justify-center gap-2 rounded-lg"
                onClick={() => setIsAddEvidenceTypeOpen(true)}
              >
                <Plus size={14} /> Add Evidence
              </Button>
            </ReviewCategory>
          )}

          {/* Findings Category */}
          <ReviewCategory
            title={`Clinical Findings (${criteriaItems.length})`}
            items={criteriaItems
              .filter(i => !deferredItems.includes(i.id || i.label))
              .map(i => ({ ...i, score: i.score || "0.85" }))
            }
            activeType={activeType}
            onConfidenceAction={handleConfidenceAction}
            activeItemLabel={activeItemLabel}
            deferredItems={deferredItems}
            acceptedItems={derivedAcceptedItems}
            partiallyAcceptedItems={derivedPartiallyAcceptedItems}
            rejectedItems={rejectedItems}
            disabled={FEATURE_FLAGS.FEATURE_SEQUENTIAL_EVIDENCE_REVIEW && !isEvidenceReviewed}
            isOpen={isFindingsExpanded}
            onToggle={handleToggleFindings}
            onSelect={(id, type) => {
              setActiveItemLabel(id);
              setActiveType("criteria");
              setActiveSessionId(null);
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 flex items-center justify-center gap-2 rounded-lg"
              onClick={() => {
                setAddEvidenceType("criteria");
                setIsAddMode(true);
                setIsModifyOpen(true);
              }}
            >
              <Plus size={14} /> Add Finding
            </Button>
          </ReviewCategory>

          {/* Removed Deferred from here as it was moved above follow up */}

          {/* Deferred Items Category (Moved above follow up) */}
          {deferredItems.length > 0 && (
            <CollapsibleSection
              title={`Deferred Review (${deferredItems.length})`}
              bg="bg-orange-50"
              indicatorColor="#f97316"
            >
              {deferredItems.map((id) => {
                // Try to find the item in snippets, tag groups, sessions, criteria, assessments, documents or next steps
                const session = localSessions.find((s: any) => s.id === id);
                const criteria = criteriaItems.find((i) => i.label === id);
                const assessment = assessmentItems.find((i) => i.label === id);
                const document = documentItems.find((i) => i.label === id);
                const nextStep = nextStepItems.find((i) => i.label === id);
                const tagGroup = tagGroups.find((tg: any) => tg.id === id);
                const snippet = allEvidenceSnippets.find((s: any) => s.id === id);

                if (session) {
                  return (
                    <ReviewItem
                      key={id}
                      label={session.focus || session.description || "Clinical Snapshot"}
                      score={session.score || "0.98"}
                      type="session"
                      hasConflict={session.hasConflict}
                      active={
                        activeType === "session" && activeSessionId === id
                      }
                      deferred={true}
                      noStrike={true}
                      accepted={derivedAcceptedItems.includes(id)}
                      rejected={!!rejectedItems[id]}
                      isUserGenerated={false}
                      cause={session.relevanceCause || session.cause}
                      onConfidenceAction={handleConfidenceAction}
                      onClick={() => {
                        setActiveSessionId(id);
                        setActiveType("session");
                        setActiveItemLabel(null);
                      }}
                    />
                  );
                }

                if (tagGroup) {
                  return (
                    <ReviewItem
                      key={id}
                      label={tagGroup.label}
                      score={tagGroup.score || "0.95"}
                      type="tag"
                      hasConflict={(tagGroup as any).hasConflict}
                      active={activeType === "tag" && activeItemLabel === id}
                      deferred={true}
                      noStrike={true}
                      accepted={derivedAcceptedItems.includes(id)}
                      rejected={!!rejectedItems[id]}
                      isUserGenerated={false}
                      cause={(tagGroup as any).cause}
                      onConfidenceAction={handleConfidenceAction}
                      onClick={() => {
                        setActiveItemLabel(id);
                        setActiveType("tag");
                        setActiveSessionId(null);
                      }}
                    />
                  );
                }

                if (snippet) {
                  return (
                    <ReviewItem
                      key={id}
                      label={snippet.text}
                      score={snippet.score || "0.95"}
                      type="evidence_item"
                      hasConflict={snippet.hasConflict}
                      active={activeType === "evidence_item" && activeItemLabel === id}
                      deferred={true}
                      noStrike={true}
                      accepted={acceptedItems.includes(id)}
                      rejected={!!rejectedItems[id]}
                      isUserGenerated={snippet.isUserGenerated}
                      cause={(snippet as any).relevanceCause || (snippet as any).cause}
                      onConfidenceAction={handleConfidenceAction}
                      onClick={() => {
                        setActiveItemLabel(id);
                        setActiveType("evidence_item");
                        setActiveSessionId(null);
                      }}
                    />
                  );
                }

                const item = criteria || assessment || document || nextStep;
                if (item) {
                  const defaultScore = 
                    item.type === 'nextstep' ? "0.85" :
                    item.type === 'criteria' ? "0.85" :
                    item.type === 'assessment' ? "0.9" : "0.9";
                  return (
                    <ReviewItem
                      key={id}
                      label={item.label}
                      score={item.score || defaultScore}
                      type={item.type}
                      hasConflict={item.hasConflict}
                      active={
                        (activeType === "criteria" ||
                          activeType === "assessment" ||
                          activeType === "document" ||
                          activeType === "nextstep") &&
                        activeItemLabel === id
                      }
                      deferred={true}
                      noStrike={true}
                      accepted={derivedAcceptedItems.includes(id)}
                      rejected={!!rejectedItems[id]}
                      isUserGenerated={item.isUserGenerated}
                      cause={item.impactCause || item.relevanceCause || item.cause}
                      onConfidenceAction={handleConfidenceAction}
                      onClick={() => {
                        setActiveItemLabel(item.label);
                        setActiveType(item.type as any);
                        setActiveSessionId(null);
                      }}
                    />
                  );
                }
                return null;
              })}
            </CollapsibleSection>
          )}

          {/* Next Steps Category */}
          <ReviewCategory
            title={`Follow-up & Next Steps (${nextStepItems.length})`}
            items={nextStepItems.map(i => ({ ...i, score: i.score || "0.85" }))}
            activeType={activeType}
            onConfidenceAction={handleConfidenceAction}
            activeItemLabel={activeItemLabel}
            deferredItems={deferredItems}
            acceptedItems={derivedAcceptedItems}
            partiallyAcceptedItems={derivedPartiallyAcceptedItems}
            rejectedItems={rejectedItems}
            disabled={FEATURE_FLAGS.FEATURE_SEQUENTIAL_EVIDENCE_REVIEW && (!isEvidenceReviewed || !isClinicalFindingsReviewed)}
            isOpen={isNextStepsExpanded}
            onToggle={handleToggleNextSteps}
            onSelect={(id, type) => {
              setActiveItemLabel(id);
              setActiveType("nextstep");
              setActiveSessionId(null);
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 flex items-center justify-center gap-2 rounded-lg"
              onClick={() => {
                setAddEvidenceType("nextstep");
                setIsAddMode(true);
                setIsModifyOpen(true);
              }}
            >
              <Plus size={14} /> Add Next Step
            </Button>
          </ReviewCategory>
        </div>
      )}
    </div>
  );

  const allEvidenceFindingsPool = [
    ...localSessions.flatMap((s) =>
      (s.evidence || []).map((ev: any) => ({ ...ev, sourceSession: s.focus, sessionId: s.id, context: 'session' })),
    ),
    ...criteriaItems.flatMap((i) =>
      (i.findings || []).map((f: any) => ({ ...f, sourceSession: i.label, context: 'criteria' })),
    ),
    ...assessmentItems.flatMap((i) =>
      (i.findings || []).map((f: any) => ({ ...f, sourceSession: i.label, sourceAssessmentId: i.id, context: 'assessment' })),
    ),
    ...documentItems.flatMap((i) =>
      (i.findings || []).map((f: any) => ({ ...f, sourceSession: i.label, sourceDocumentId: i.id, context: 'document' })),
    ),
    ...standaloneEvidence.flatMap((i) => {
      const sourceId = i.id || i.label;
      if (i.findings && i.findings.length > 0) {
        return i.findings.map((f: any) => ({ 
          ...f, 
          sourceSession: i.label || i.sessionSource || 'Evidence', 
          sessionId: f.sessionId || (i.type === 'evidence' ? sourceId : undefined),
          sourceDocumentId: f.sourceDocumentId || (i.type === 'document' ? sourceId : undefined),
          sourceAssessmentId: f.sourceAssessmentId || (i.type === 'assessment' ? sourceId : undefined),
          context: i.type === 'document' ? 'document' : (i.type === 'assessment' ? 'assessment' : (i.type === 'evidence' ? 'session' : 'criteria'))
        }));
      }
      return [{ 
        ...i, 
        sourceSession: i.label || i.sessionSource || 'Evidence',
        sessionId: i.type === 'evidence' ? sourceId : undefined,
        sourceDocumentId: i.type === 'document' ? sourceId : undefined,
        sourceAssessmentId: i.type === 'assessment' ? sourceId : undefined,
        context: i.type === 'document' ? 'document' : (i.type === 'assessment' ? 'assessment' : (i.type === 'evidence' ? 'session' : 'criteria'))
      }];
    }),
  ];

  const mainContent = (
    <div className="flex flex-col h-full bg-workspace-bg overflow-hidden relative">
      <AddEvidenceTypeModal
        isOpen={isAddEvidenceTypeOpen}
        onClose={() => setIsAddEvidenceTypeOpen(false)}
        onSelect={(type) => {
          setAddEvidenceType(type);
          setIsAddEvidenceTypeOpen(false);
          setIsAddMode(true);
          // Only open ModifyModal for criteria/nextstep
          if (type === "criteria" || type === "nextstep") {
            setIsModifyOpen(true);
          }
        }}
      />

      <CreateSessionModal
        isOpen={isAddMode && addEvidenceType === "session"}
        onClose={() => setIsAddMode(false)}
        onSessionCreate={(info) => {
          const newId = `new-session-${Date.now()}`;
          const newSession = {
            id: newId,
            date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
            focus: "New Clinical Session",
            notes: "",
            evidence: [],
          };
          setLocalSessions((prev) => {
            clinicalData.addSession(effectiveClientId, newSession);
            return [...prev, newSession];
          });
          setActiveSessionId(newId);
          setActiveType("session");
          setActiveItemLabel(null);
          setIsAddMode(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
      />

      <StartAssessmentModal
        isOpen={isAddMode && addEvidenceType === "assessment"}
        onClose={() => setIsAddMode(false)}
        onStart={(assessment) => {
          const newId = `new-assessment-${Date.now()}`;
          const newItem = {
            ...assessment,
            type: "assessment",
            id: newId,
            label: assessment.name,
            findings: [],
          };
          setLocalEvidenceItems((prev) => [...prev, newItem]);
          setActiveType("assessment");
          setActiveItemLabel(newId);
          setActiveSessionId(null);
          setIsAddMode(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
      />

      <UploadDocumentModal
        isOpen={isAddMode && addEvidenceType === "document"}
        onClose={() => setIsAddMode(false)}
        onUpload={(doc) => {
          const newId = `new-document-${Date.now()}`;
          const newItem = {
            id: newId,
            label: doc.name,
            type: "document",
            findings: [],
          };
          setLocalEvidenceItems((prev) => [...prev, newItem]);
          setActiveType("document");
          setActiveItemLabel(newId);
          setActiveSessionId(null);
          setIsAddMode(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
      />

      <ModifyModal
        isOpen={isModifyOpen}
        onClose={() => {
          setIsModifyOpen(false);
          setIsAddMode(false);
        }}
        item={isAddMode ? null : currentItem}
        isAddMode={isAddMode}
        addType={isAddMode ? addEvidenceType : "criteria"}
        allFindingsPool={allEvidenceFindingsPool}
        groupBy={groupBy}
        onSave={(data) => {
          console.log("EvidenceWorkspace: Saving item", data);

          if (isAddMode) {
            const newId = `new-${addEvidenceType}-${Date.now()}`;
            const newItem = {
              ...data,
              type: addEvidenceType,
              id: newId,
            };
            setLocalEvidenceItems((prev) => [...prev, newItem]);
            setActiveType(addEvidenceType as any);
            setActiveItemLabel(newId);
            setActiveSessionId(null);

            // Sync to global mock data
            MOCK_EVIDENCE_ITEMS.push(newItem as any);
          } else if (activeType === "session" && activeSessionId) {
            setLocalSessions((prev) =>
              prev.map((s) =>
                s.id === activeSessionId
                  ? {
                      ...s,
                      focus: data.label,
                      tags: data.tags,
                      evidence: data.findings,
                    }
                  : s,
              ),
            );

            // Sync to global mock data
            if (clientData && clientData.sessions) {
              const globalSession = clientData.sessions.find(
                (s: any) => s.id === activeSessionId,
              );
              if (globalSession) {
                globalSession.focus = data.label;
                globalSession.evidence = data.findings;
                // Note: mapping might be needed if field names differ
              }
            }
          } else if (activeItemLabel) {
            setLocalEvidenceItems((prev) =>
              prev.map((i) => {
                const matches = (i.id || i.label) === activeItemLabel;
                if (matches) {
                  const updated = {
                    ...i,
                    label: data.label,
                    score: data.score,
                    status: data.status,
                    tags: data.tags,
                    findings: data.findings,
                    suggestedClinicalFocus: data.suggestedClinicalFocus,
                    impact: data.impact,
                    rationale: data.rationale,
                    reason: data.reason,
                  };

                  // Sync to global mock data
                  const globalIdx = (MOCK_EVIDENCE_ITEMS as any[]).findIndex(
                    (item) => (item.id || item.label) === activeItemLabel,
                  );
                  if (globalIdx !== -1) {
                    (MOCK_EVIDENCE_ITEMS as any[])[globalIdx] = updated as any;
                  }

                  return updated;
                }
                return i;
              }),
            );

            // If the activeItemLabel matched the id, keep the id.
            // If it matched the label, update it to the new label in all related state collections.
            const itemToUpdate = localEvidenceItems.find(
              (i) => (i.id || i.label) === activeItemLabel,
            );
            if (
              itemToUpdate &&
              !itemToUpdate.id &&
              data.label &&
              data.label !== activeItemLabel
            ) {
              const oldLabel = activeItemLabel;
              const newLabel = data.label;

              setActiveItemLabel(newLabel);

              // Update other state collections that might use label as ID
              updateDecisions({
                deferredItems: decisions.deferredItems.map((di) => (di.id === oldLabel ? { ...di, id: newLabel } : di)),
                acceptedItems: decisions.acceptedItems.map((ai) => (ai.id === oldLabel ? { ...ai, id: newLabel } : ai)),
              });
              
              if (rejectedItems[oldLabel]) {
                const newRejected = { ...decisions.rejectedItems };
                newRejected[newLabel] = newRejected[oldLabel];
                delete newRejected[oldLabel];
                updateDecisions({ rejectedItems: newRejected });
              }
            }
          }

          setIsModifyOpen(false);
          setIsAddMode(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
        onDelete={(data) => {
          console.log("EvidenceWorkspace: Deleting item", data);
          setIsModifyOpen(false);
          setIsAddMode(false);

          if (activeType === "session" && activeSessionId) {
            setLocalSessions((prev) => {
              const updated = prev.filter((s) => s.id !== activeSessionId);
              clinicalData.setSessions(effectiveClientId, updated);
              return updated;
            });
            setActiveSessionId(null);
          } else if (activeItemLabel) {
            const idToRemove = activeItemLabel;
            setLocalEvidenceItems((prev) =>
              prev.filter((i) => (i.id || i.label) !== idToRemove),
            );

            // Sync to global mock data
            const globalIdx = (MOCK_EVIDENCE_ITEMS as any[]).findIndex(
              (item) => (item.id || item.label) === idToRemove,
            );
            if (globalIdx !== -1) {
              (MOCK_EVIDENCE_ITEMS as any[]).splice(globalIdx, 1);
            }

            // Clean up other state collections
            updateDecisions({
              deferredItems: decisions.deferredItems.filter((di) => di.id !== idToRemove),
              acceptedItems: decisions.acceptedItems.filter((ai) => ai.id !== idToRemove)
            });
            const nextRejected = { ...decisions.rejectedItems };
            delete nextRejected[idToRemove];
            updateDecisions({ rejectedItems: nextRejected });

            setActiveItemLabel(null);
          }

          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
      />

      <CreateClinicalEvidenceModal
        isOpen={isModifyItemOpen}
        onClose={() => setIsModifyItemOpen(false)}
        context={"session"}
        editingItem={currentItem}
        initialText={(currentItem as any)?.text || currentItem?.label || ""}
        initialTags={(currentItem as any)?.tags || []}
        onCreate={(data) => {
          setIsModifyItemOpen(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);

          if (activeItemLabel) {
            // Update the evidence item in local state
            // It could be in criteria findings, assessment findings, document findings, or localSessions findings

            const updateFindings = (findings: any[]) => {
              if (!findings) return findings;
              return findings.map((f) =>
                f.id === activeItemLabel ? { ...f, ...data } : f,
              );
            };

            const updatedSessions = localSessions.map((s) => {
                const hasFinding = s.evidence?.some(
                  (f: any) => f.id === activeItemLabel,
                );
                return {
                  ...s,
                  notes: hasFinding
                    ? data.notes !== undefined
                      ? data.notes
                      : s.notes
                    : s.notes,
                  evidence: updateFindings(s.evidence),
                };
            });
            setLocalSessions(updatedSessions);
            clinicalData.setSessions(effectiveClientId, updatedSessions);

            const updatedAssessments = assessmentItemsFromStore.map((a: any) => {
                const hasFinding = a.findings?.some((f: any) => f.id === activeItemLabel);
                if (hasFinding && data.notes !== undefined) {
                    return { ...a, description: data.notes || a.description, findings: updateFindings(a.findings) };
                }
                return { ...a, findings: updateFindings(a.findings) };
            });
            clinicalData.setAssessments(effectiveClientId, updatedAssessments);

            const updatedDocs = documentItemsFromStore.map((d: any) => {
                const hasFinding = d.findings?.some((f: any) => f.id === activeItemLabel);
                if (hasFinding && data.notes !== undefined) {
                    return { ...d, description: data.notes || d.description, findings: updateFindings(d.findings) };
                }
                return { ...d, findings: updateFindings(d.findings) };
            });
            clinicalData.setDocuments(effectiveClientId, updatedDocs);

            // Also update localEvidenceItems
            setLocalEvidenceItems((prev) =>
              prev.map((item) => {
                const hasFinding = item.findings?.some(
                  (f: any) => f.id === activeItemLabel,
                );
                if (hasFinding && data.notes !== undefined) {
                  return {
                    ...item,
                    notes: data.notes,
                    findings: updateFindings(item.findings),
                  };
                }
                return { ...item, findings: updateFindings(item.findings) };
              }),
            );
          }
        }}
      />

      <SkipNextStepModal
        isOpen={isSkipOpen}
        onClose={() => setIsSkipOpen(false)}
        item={currentItem}
        onConfirm={handleAccept}
      />
      <Toast message="Correction saved successfully!" visible={showToast} />

      <Modal
        isOpen={isFrictionOpen}
        onClose={() => setIsFrictionOpen(false)}
        title="Intentional Confirmation"
        width={400}
      >
        <div className="space-y-6">
          <Typography variant="body" className="text-slate-600">
            You are about to accept an AI-generated finding. Why do you believe
            this is accurate?
          </Typography>
          <div className="space-y-2">
            {[
              "Evidence is clear",
              "Matches my observations",
              "Corrects an earlier oversight",
            ].map((reason) => (
              <Button
                key={reason}
                variant="outline"
                className="w-full justify-start h-12 text-slate-700"
                onClick={() => activeId && confirmAccept(activeId)}
              >
                {reason}
              </Button>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsFrictionOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isRejectFrictionOpen}
        onClose={() => setIsRejectFrictionOpen(false)}
        title="Intentional Confirmation"
        width={400}
      >
        <div className="space-y-6">
          <Typography variant="body" className="text-slate-600">
            You are about to reject an AI-generated finding. Please provide a reason:
          </Typography>
          <div className="space-y-2">
            {(activeType === "session"
              ? [
                  "Insufficient data",
                  "Unreliable transcript",
                  "Duplicate session",
                ]
              : ["Wrong criterion", "Not diagnostic evidence", "Too weak"]
            ).map((reason) => (
              <Button
                key={reason}
                variant="outline"
                className="w-full justify-start h-12 text-error-dark hover:bg-error-light/10 hover:border-error border-error/30"
                onClick={() => {
                  const id = activeType === "session" ? activeSessionId : activeItemLabel;
                  if (id) {
                    const newRejected = { ...decisions.rejectedItems };
                    newRejected[id] = { rationale: reason, timestamp: new Date().toISOString() };
                    updateDecisions({
                      rejectedItems: newRejected
                    });
                    autoAdvance();
                    setIsRejectFrictionOpen(false);
                  }
                }}
              >
                {reason}
              </Button>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsRejectFrictionOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Head */}
      <div className="px-8 py-5 border-b border-divider bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-8">
          <Step
            label="Evidence"
            num={1}
            active={
              activeType === "session" ||
              activeType === "evidence_item" ||
              activeType === "tag"
            }
          />
          <div className="w-10 h-px bg-divider" />
          <Step
            label="Findings Review"
            num={2}
            active={
              activeType === "criteria" ||
              activeType === "assessment" ||
              activeType === "document"
            }
          />
          <div className="w-10 h-px bg-divider" />
          <Step
            label="Clinical Plan"
            num={3}
            active={activeType === "nextstep"}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSessionId || activeItemLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {!currentItem ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-divider rounded-2xl">
                <Typography
                  variant="body"
                  className="text-text-disabled italic"
                >
                  Select an item to view details
                </Typography>
              </div>
            ) : activeType === "session" ? (
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-divider pb-6">
                  <div className="space-y-1">
                    <Typography
                      variant="label-micro"
                      className="text-text-disabled uppercase tracking-[0.2em] font-bold"
                    >
                      Clinical Session
                    </Typography>
                    <Typography
                      variant="h3"
                      className="font-serif font-semibold"
                    >
                      {currentSession?.focus || "Anxiety Management"}
                    </Typography>
                    <div className="flex items-center gap-3 mt-1">
                      <Typography
                        variant="body-sm"
                        className="text-text-secondary font-medium"
                      >
                        <span className="lowercase">{currentSession?.id}</span>{" "}
                        • {currentSession?.date}
                      </Typography>
                    </div>
                  </div>
                  <RelevanceBadge
                    relevance={mapScoreToRelevance(
                      parseFloat((currentItem as any)?.score || "0.98"),
                    )}
                    cause={(currentItem as any)?.relevanceCause}
                    onAction={handleConfidenceAction}
                  />
                </div>

                <LowScoreWarningBanner
                  score={(currentItem as any)?.score}
                  type="session"
                  badgeType="relevance"
                />

                {FEATURE_FLAGS.FEATURE_UX_LONGITUDINAL_EVIDENCE_SYNTHESIS &&
                  currentSession?.id === "CS-003" && (
                    <div className="bg-white p-6 rounded-2xl border border-divider space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Typography
                            variant="label-micro"
                            className="text-text-disabled uppercase tracking-[0.2em] font-bold block mb-1"
                          >
                            Longitudinal Symptom Baseline
                          </Typography>
                          <Typography
                            variant="h4"
                            className="font-sans font-bold flex items-center gap-2"
                          >
                            Symptom: Social Withdrawal
                          </Typography>
                        </div>
                      </div>
                      <div className="h-40 w-full pt-4 border-b border-divider mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              {
                                name: "Jan 25",
                                value: 40,
                                label: "Jan 2025: Low Concern",
                              },
                              {
                                name: "Jun 25",
                                value: 80,
                                label: "Jun 2025: High Concern",
                              },
                              {
                                name: "May 26",
                                value: 60,
                                label: "May 2026: Mid-Range",
                              },
                            ]}
                            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                          >
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fontSize: 10,
                                fontWeight: "bold",
                                fill: "#94a3b8",
                              }}
                              dy={10}
                              padding={{ left: 10, right: 10 }}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                                      {payload[0].payload.label}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{
                                r: 4,
                                strokeWidth: 2,
                                fill: "#fff",
                                stroke: "#3b82f6",
                              }}
                              activeDot={{
                                r: 6,
                                strokeWidth: 0,
                                fill: "#3b82f6",
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 px-2">
                        Social withdrawal spikes coincided with mid-year exams
                        in 2025
                      </div>
                    </div>
                  )}

                {FEATURE_FLAGS.FEATURE_UX_WORKFLOW_TRIGGERED_INTERVENTIONS &&
                  currentSession?.hasConflict && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-orange-50 border-2 border-orange-200 p-6 rounded-2xl flex gap-4 items-start ring-4 ring-orange-500/10"
                    >
                      <div className="p-3 bg-orange-500 text-white rounded-full shrink-0 animate-pulse">
                        <ShieldAlert size={24} />
                      </div>
                      <div className="space-y-2">
                        <Typography
                          variant="body"
                          className="font-bold text-orange-900"
                        >
                          Triggered Evidence Scrutiny
                        </Typography>
                        <Typography
                          variant="body-sm"
                          className="text-orange-800"
                        >
                          This session contains evidence that **directly
                          contradicts** the teacher's report from June 2025.
                          <br />
                          <span className="font-bold">
                            Recommendation:
                          </span>{" "}
                          Re-verify the "Social Avoidance" criterion before
                          proceeding.
                        </Typography>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="xs"
                            variant="brand"
                            className="bg-orange-600 border-none hover:bg-orange-700"
                          >
                            Acknowledge Discrepancy
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            className="border-orange-300 text-orange-700 bg-white"
                          >
                            View Conflicting Doc
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                <div className="grid grid-cols-1 gap-4">
                  {(currentSession?.evidence || []).filter(
                    (snippet: any) => snippet.included !== false,
                  ).length ? (
                    <>
                      <Typography
                        variant="label-micro"
                        className="text-text-disabled uppercase font-bold tracking-wider"
                      >
                        Supporting Evidence
                      </Typography>
                      {(currentSession.evidence || [])
                        .filter((snippet: any) => snippet.included !== false)
                        .map((snippet: any) => (
                          <EntityCard
                            key={snippet.id}
                            title={
                              snippet.type === "verbatim"
                                ? `"${snippet.text}"`
                                : snippet.text
                            }
                            titleClassName={
                              ["verbatim", "behavioural"].includes(snippet.type)
                                ? "text-base font-bold leading-relaxed text-slate-800"
                                : "font-bold"
                            }
                            onClick={() => {
                              setActiveType("evidence_item");
                              setActiveItemLabel(snippet.id);
                              setActiveSessionId(null);
                            }}
                            onMouseEnter={() =>
                              FEATURE_FLAGS.FEATURE_UX_EVIDENCE_TRACEABILITY_ENHANCEMENT &&
                              setIsTraceabilityHovered(snippet.id)
                            }
                            onMouseLeave={() => setIsTraceabilityHovered(null)}
                            statusBadge={
                              <div className="flex items-center gap-2">
                                <StatusBadge
                                  {...getEvidenceBadgeProps(
                                    snippet.type,
                                    snippet.status,
                                    snippet.context,
                                  )}
                                  showIcon={false}
                                />
                                <StatusBadge
                                  status={
                                    snippet.isUserGenerated ? "user" : "ai"
                                  }
                                  showIcon={false}
                                />
                              </div>
                            }
                            metadata={[
                              {
                                label: "SOURCE",
                                value: (
                                  <button
                                    onClick={(e) =>
                                      handleSourceClick(currentSession?.id, e)
                                    }
                                    className="hover:underline cursor-pointer text-left focus:outline-none"
                                  >
                                    {currentSession?.focus} •{" "}
                                    {snippet.timestamp}
                                  </button>
                                ),
                              },
                              ...(Array.isArray(snippet.tags)
                                ? snippet.tags.length
                                  ? [
                                      {
                                        label: "TAGS",
                                        value: (
                                          <div className="flex flex-wrap gap-1">
                                            {snippet.tags.map((tag: string) => (
                                              <Badge
                                                key={tag}
                                                variant="soft"
                                                className="px-2 py-0.5 text-xs text-slate-500 font-mono cursor-pointer hover:bg-slate-200"
                                                onClick={(
                                                  e: React.MouseEvent,
                                                ) => handleTagClick(tag, e)}
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        ),
                                      },
                                    ]
                                  : []
                                : snippet.tag
                                  ? [
                                      {
                                        label: "TAGS",
                                        value: (
                                          <div className="flex flex-wrap gap-1">
                                            {snippet.tag
                                              .split(",")
                                              .map((t: string) => t.trim())
                                              .filter(Boolean)
                                              .map((tag: string) => (
                                                <Badge
                                                  key={tag}
                                                  variant="soft"
                                                  className="px-2 py-0.5 text-xs text-slate-500 font-mono cursor-pointer hover:bg-slate-200"
                                                  onClick={(
                                                    e: React.MouseEvent,
                                                  ) => handleTagClick(tag, e)}
                                                >
                                                  {tag}
                                                </Badge>
                                              ))}
                                          </div>
                                        ),
                                      },
                                    ]
                                  : []),
                              {
                                label: "FRAMEWORK",
                                value: snippet.framework,
                              },
                            ]}
                            rightAction={
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                                onClick={() => handleJumpToSpot(snippet)}
                              >
                                <ExternalLink size={12} className="mr-1.5" />{" "}
                                Jump to Spot
                              </Button>
                            }
                            summary={null}
                          >
                            {isTraceabilityHovered === snippet.id &&
                              FEATURE_FLAGS.FEATURE_UX_EVIDENCE_TRACEABILITY_ENHANCEMENT && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-4 p-4 bg-slate-900 text-white rounded-lg text-sm border-l-4 border-primary"
                                >
                                  <div className="flex items-center gap-2 mb-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <BookOpen size={10} /> Raw Source Extract
                                  </div>
                                  <div className="italic leading-relaxed">
                                    "...the context surrounding this observation
                                    indicates {snippet.text.toLowerCase()}. This
                                    was recorded during {currentSession?.focus}{" "}
                                    at {snippet.timestamp}..."
                                  </div>
                                </motion.div>
                              )}
                          </EntityCard>
                        ))}
                    </>
                  ) : (
                    <div className="py-20 text-center bg-white border border-dashed border-divider rounded-2xl">
                      <Typography
                        variant="body"
                        className="text-text-disabled italic"
                      >
                        No snippets found for this session
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            ) : isTag ? (
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-divider pb-6">
                  <div className="space-y-1">
                    <Typography
                      variant="label-micro"
                      className="text-text-disabled uppercase tracking-[0.2em] font-bold"
                    >
                      TAG NAME
                    </Typography>
                    <Typography
                      variant="h3"
                      className="font-serif font-semibold"
                    >
                      {currentItem?.label}
                    </Typography>
                    <div className="flex items-center gap-3 mt-1">
                      <Typography
                        variant="body-sm"
                        className="text-text-secondary font-medium"
                      >
                        {(currentItem as any)?.findings?.length} findings
                      </Typography>
                    </div>
                  </div>
                  <RelevanceBadge
                    relevance={mapScoreToRelevance(
                      parseFloat((currentItem as any)?.score || "0.95"),
                    )}
                    cause={(currentItem as any)?.relevanceCause}
                    onAction={handleConfidenceAction}
                  />
                </div>

                <LowScoreWarningBanner
                  score={(currentItem as any)?.score}
                  type="tag"
                  badgeType="relevance"
                />

                <div className="grid grid-cols-1 gap-4">
                  <Typography
                    variant="label-micro"
                    className="text-text-disabled uppercase font-bold tracking-wider"
                  >
                    Supporting Evidence
                  </Typography>
                  {(currentItem as any)?.findings?.map(
                    (snippet: any, idx: number) => (
                      <EntityCard
                        key={snippet.id || idx}
                        title={
                          snippet.type === "verbatim"
                            ? `"${snippet.text}"`
                            : snippet.text
                        }
                        titleClassName={
                          ["verbatim", "behavioural"].includes(snippet.type)
                            ? "text-base font-bold leading-relaxed text-slate-800"
                            : "font-bold"
                        }
                        onClick={() => {
                          setActiveType("evidence_item");
                          setActiveItemLabel(snippet.id);
                          setActiveSessionId(null);
                        }}
                        statusBadge={
                          <div className="flex items-center gap-2">
                            <StatusBadge
                              {...getEvidenceBadgeProps(
                                snippet.type,
                                snippet.status,
                                snippet.context,
                              )}
                              showIcon={false}
                            />
                            <StatusBadge
                              status={snippet.isUserGenerated ? "user" : "ai"}
                              showIcon={false}
                            />
                          </div>
                        }
                        metadata={[
                          {
                            label: "SOURCE",
                            value: (
                              <button
                                onClick={(e) =>
                                  handleSourceClick(snippet.sessionId || snippet.sourceAssessmentId || snippet.sourceDocumentId, e)
                                }
                                className="hover:underline cursor-pointer text-left focus:outline-none"
                              >
                                {snippet.sourceSession} •{" "}
                                {snippet.sourceTimestamp ||
                                  snippet.timestamp ||
                                  ""}
                              </button>
                            ),
                          },
                          {
                            label: "FRAMEWORK",
                            value: snippet.framework || "DSM-5",
                          },
                        ]}
                          rightAction={
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                              onClick={() => handleJumpToSpot(snippet)}
                            >
                              <ExternalLink size={12} className="mr-1.5" /> Jump
                              to Spot
                            </Button>
                          }
                        summary={null}
                      />
                    ),
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Common detail header for all types */}
                <div className="flex justify-between items-end border-b border-divider pb-6">
                  <div className="space-y-1">
                    <Typography
                      variant="label-micro"
                      className="text-text-disabled uppercase font-bold tracking-wider"
                    >
                      {isCriteria
                        ? "Finding Name"
                        : isAssessment
                          ? "Assessment Type"
                          : isDocument
                            ? "Document Type"
                            : isNextStep
                              ? "Clinical Plan Item"
                              : isEvidenceItem
                                ? groupBy === "item"
                                  ? `${((currentItem as any).type || "Extract").charAt(0).toUpperCase() + ((currentItem as any).type || "Extract").slice(1)} - Generated by ${(currentItem as any).isUserGenerated ? "User" : "AI"}`
                                  : "Extract Type"
                                : `${currentItem?.type} type`}
                    </Typography>
                    <Typography
                      variant="h3"
                      className="font-serif font-semibold"
                    >
                      {isEvidenceItem
                        ? (currentItem as any).type === "verbatim"
                          ? `"${(currentItem as any).text}"`
                          : (currentItem as any).text
                        : currentItem?.label || activeItemLabel}
                    </Typography>
                    <div className="flex items-center gap-3 mt-1">
                      <Typography
                        variant="body-sm"
                        className="text-text-secondary font-medium"
                      >
                        <span className="lowercase">
                          idx-{currentItem?.id || "N/A"}
                        </span>{" "}
                        •{" "}
                        {isEvidenceItem
                          ? (currentItem as any).timestamp
                          : "Apr 21, 2024"}
                      </Typography>
                    </div>
                  </div>
                  {isCriteria && currentItem && (() => {
                    const confidence = mapScoreToConfidence(parseFloat(currentItem.score || "0.85"));
                    return (
                      <ConfidenceBadge
                        confidence={confidence}
                        cause={(currentItem as any).cause || (confidence === 'low' ? 'insufficient_data' : undefined)}
                        onAction={handleConfidenceAction}
                      />
                    );
                  })()}
                  {isNextStep && currentItem && (
                    <ImpactBadge
                      impact={mapScoreToImpact(
                        parseFloat(currentItem.score || "0.85"),
                      )}
                      cause={(currentItem as any).impactCause}
                      onAction={handleConfidenceAction}
                    />
                  )}
                  {(isEvidenceItem || isAssessment || isDocument) &&
                    currentItem && (
                      <RelevanceBadge
                        relevance={mapScoreToRelevance(
                          parseFloat((currentItem as any).score || (isEvidenceItem ? "0.95" : "0.9")),
                        )}
                        cause={(currentItem as any).relevanceCause}
                        onAction={handleConfidenceAction}
                      />
                    )}
                </div>

                <LowScoreWarningBanner
                  score={currentItem?.score}
                  type={activeType}
                  badgeType={
                    isCriteria
                      ? "confidence"
                      : isNextStep
                        ? "impact"
                        : "relevance"
                  }
                />

                {currentItem?.hasConflict && (
                  <div className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-lg flex items-start gap-4 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-sm mt-0.5">
                      !
                    </div>
                    <div className="space-y-2 w-full">
                      <Typography
                        variant="body"
                        className="font-bold text-[#991b1b]"
                      >
                        Unresolved Conflict Identified
                      </Typography>
                      <Typography
                        variant="body-sm"
                        className="text-[#991b1b]/90 leading-relaxed"
                      >
                        {(() => {
                          const item = currentItem as any;
                          // Only render if conflict actually exists and shouldn't be hidden by state
                          if (!item.hasConflict) return null;

                          const desc =
                            item.conflictDescription ||
                            "This finding conflicts with other recorded evidence. Please review carefully before accepting.";
                          const targetLabel = item.conflictTargetLabel;

                          if (targetLabel && desc.includes(targetLabel)) {
                            const parts = desc.split(targetLabel);
                            return (
                              <>
                                {parts[0]}
                                <button
                                  onClick={() => {
                                    if (
                                      item.conflictTargetId &&
                                      item.conflictTargetType
                                    ) {
                                      handleItemSelect(
                                        item.conflictTargetId,
                                        item.conflictTargetType,
                                      );
                                    }
                                  }}
                                  className="font-bold underline hover:text-red-700 transition-colors cursor-pointer"
                                >
                                  {targetLabel}
                                </button>
                                {parts[1]}
                              </>
                            );
                          }
                          return desc;
                        })()}
                      </Typography>

                      {(() => {
                        const item = currentItem as any;
                        if (item.findings) {
                          const conflictingFindings = item.findings.filter(
                            (f: any) => f.hasConflict,
                          );
                          if (conflictingFindings.length > 0) {
                            return (
                              <div className="mt-3 space-y-2">
                                <Typography
                                  variant="label-micro"
                                  className="font-bold uppercase text-[#991b1b]"
                                >
                                  Conflicting Evidence Items:
                                </Typography>
                                <ul className="list-disc pl-4 space-y-1">
                                  {conflictingFindings.map(
                                    (finding: any, idx: number) => (
                                      <li key={idx}>
                                        <Typography
                                          variant="body-sm"
                                          className="text-[#991b1b] truncate max-w-[280px] md:max-w-[400px]"
                                          title={finding.text}
                                        >
                                          "{finding.text}"
                                        </Typography>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            );
                          }
                        }
                        return null;
                      })()}

                      <div className="pt-2">
                        <button className="text-xs font-bold text-[#991b1b] px-3 py-1.5 bg-white border border-[#fca5a5] rounded-md hover:bg-[#fef2f2] transition-colors">
                          Flag for Clinical Oversight
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isEvidenceItem ? (
                  <div className="space-y-6">
                    <EntityCard
                      title=""
                      titleClassName="hidden"
                      onMouseEnter={() =>
                        FEATURE_FLAGS.FEATURE_UX_EVIDENCE_TRACEABILITY_ENHANCEMENT &&
                        setIsTraceabilityHovered((currentItem as any).id)
                      }
                      onMouseLeave={() => setIsTraceabilityHovered(null)}
                      statusBadge={
                        /* Status badge hidden at item level per Turn 4 */
                        null
                      }
                      metadata={[
                        {
                          label: "SOURCE",
                          value: (
                            <button
                              onClick={(e) =>
                                handleSourceClick(
                                  (currentItem as any).sessionId || (currentItem as any).sourceAssessmentId || (currentItem as any).sourceDocumentId,
                                  e,
                                )
                              }
                              className="hover:underline cursor-pointer text-left focus:outline-none"
                            >
                              {(currentItem as any).sourceSession} •{" "}
                              {(currentItem as any).timestamp}
                            </button>
                          ),
                        },
                        {
                          label: "FRAMEWORK",
                          value: (currentItem as any).framework || "DSM-5",
                        },
                        {
                          label: "TAGS",
                          value: (
                            <div className="flex flex-wrap gap-1">
                              {(Array.isArray((currentItem as any).tags)
                                ? (currentItem as any).tags
                                : ((currentItem as any).tag || "")
                                    .split(",")
                                    .map((t: string) => t.trim())
                                    .filter(Boolean)
                              ).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="soft"
                                  className="px-2 py-0.5 text-xs text-slate-500 font-mono cursor-pointer hover:bg-slate-200"
                                  onClick={(e: React.MouseEvent) =>
                                    handleTagClick(tag, e)
                                  }
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          ),
                        },
                      ]}
                      rightAction={
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                          onClick={() => handleJumpToSpot(currentItem)}
                        >
                          <ExternalLink size={12} className="mr-1.5" /> Jump to
                          Spot
                        </Button>
                      }
                      summary={null}
                    >
                      {(currentItem as any).notes && (
                        <div className="mt-0 pt-0 space-y-2">
                          <Typography
                            variant="label-micro"
                            className="text-text-secondary uppercase font-bold tracking-wider"
                          >
                            Clinical Notes
                          </Typography>
                          <Typography
                            variant="body"
                            className="text-slate-800 leading-relaxed max-w-[800px]"
                          >
                            {(currentItem as any).notes}
                          </Typography>
                        </div>
                      )}
                      {isTraceabilityHovered === (currentItem as any).id &&
                        FEATURE_FLAGS.FEATURE_UX_EVIDENCE_TRACEABILITY_ENHANCEMENT && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 p-4 bg-slate-900 text-white rounded-lg text-sm border-l-4 border-primary"
                          >
                            <div className="flex items-center gap-2 mb-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                              <BookOpen size={10} /> Raw Source Extract
                            </div>
                            <div className="italic leading-relaxed">
                              "...the context surrounding this observation
                              indicates{" "}
                              {(currentItem as any).text.toLowerCase()}. This
                              was recorded during{" "}
                              {(currentItem as any).sourceSession} at{" "}
                              {(currentItem as any).timestamp}..."
                            </div>
                          </motion.div>
                        )}
                    </EntityCard>
                    {FEATURE_FLAGS.FEATURE_INTELLIGENCE_INSIGHTS && (
                      <EvidenceInsightsCard
                        item={currentItem}
                        allSnippets={allEvidenceSnippets}
                        sessions={localSessions}
                        type="evidence_item"
                        onNavigateToSource={(src) => handleSourceClick(src)}
                      />
                    )}
                  </div>
                ) : isAssessment ? (
                  (() => {
                    const assessmentDetail =
                      (clientData?.assessments || MOCK_ASSESSMENTS).find(
                        (a: any) =>
                          a.id === currentItem?.id ||
                          a.title === currentItem?.label ||
                          (activeItemLabel &&
                            a.title
                              .toLowerCase()
                              .includes(
                                activeItemLabel.toLowerCase().split(" ")[0],
                              )),
                      ) ||
                      (clientData?.assessments?.[0]) ||
                      MOCK_ASSESSMENTS[0];

                    const olderVersions = allAssessmentItems.filter(a => a.label === assessmentDetail.title && a.id !== assessmentDetail.id);

                    return (
                      <div className="space-y-6">
                        <EntityCard
                          title={assessmentDetail.title}
                          summary={assessmentDetail.description}
                          hoverable={false}
                          rightAction={
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                              onClick={() => {
                                if (onNavigateToAssessments) {
                                  onNavigateToAssessments(assessmentDetail.id);
                                }
                              }}
                            >
                              View Workspace
                            </Button>
                          }
                          metadata={[
                            ...(assessmentDetail.overallImpression
                              ? [
                                  {
                                    label: "OVERALL IMPRESSION",
                                    value: assessmentDetail.overallImpression,
                                  },
                                ]
                              : []),
                            ...(assessmentDetail.score
                              ? [
                                  {
                                    label: "RELEVANCE SCORE",
                                    value: `${assessmentDetail.score}${assessmentDetail.descriptor ? ` - ${assessmentDetail.descriptor}` : ""}`,
                                  },
                                ]
                              : []),
                            ...(assessmentDetail.percentile
                              ? [
                                  {
                                    label: "PERCENTILE",
                                    value: assessmentDetail.percentile,
                                  },
                                ]
                              : []),
                            ...(assessmentDetail.descriptor
                              ? [
                                  {
                                    label: "DESCRIPTOR",
                                    value: assessmentDetail.descriptor,
                                  },
                                ]
                              : []),
                          ]}
                        />
                        {olderVersions.length > 0 && (
                          <div className="flex justify-start">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:bg-primary/5 h-8 gap-2 bg-primary/5"
                              onClick={() => setIsOlderAssessmentsOpen(true)}
                            >
                              <History size={14} />
                              View {olderVersions.length} Older Assessment{olderVersions.length > 1 ? 's' : ''}
                            </Button>
                          </div>
                        )}
                        {FEATURE_FLAGS.FEATURE_INTELLIGENCE_INSIGHTS && (
                          <EvidenceInsightsCard
                            item={{
                              ...assessmentDetail,
                              label: assessmentDetail.title,
                              tags: (currentItem as any)?.tags || [],
                            }}
                            allSnippets={allEvidenceFindingsPool}
                            sessions={localSessions}
                            type="assessment"
                            assessments={
                              clientData?.assessments || MOCK_ASSESSMENTS
                            }
                            onNavigateToSource={(src) => handleSourceClick(src)}
                          />
                        )}
                        <div className="space-y-4">
                          <Typography
                            variant="label-micro"
                            className="text-text-disabled uppercase font-bold tracking-wider"
                          >
                            Supporting Evidence
                          </Typography>
                          <div className="space-y-4">
                            {(currentItem as any)?.findings
                              ?.filter((f: any) => f.included !== false)
                              .map((finding: any) => (
                                <EntityCard
                                  key={finding.id}
                                  title={finding.text}
                                  titleClassName="text-base font-semibold text-slate-800 leading-snug"
                                  onClick={() => {
                                    setActiveType("evidence_item");
                                    setActiveItemLabel(finding.id);
                                    setActiveSessionId(null);
                                  }}
                                  statusBadge={
                                    <div className="flex items-center gap-2">
                                      <StatusBadge
                                        {...getEvidenceBadgeProps(
                                          finding.type,
                                          finding.status,
                                          finding.context || (finding.sourceDocumentId ? "document" : "assessment"),
                                        )}
                                        showIcon={false}
                                      />
                                      <StatusBadge
                                        status={
                                          finding.isUserGenerated
                                            ? "user"
                                            : "ai"
                                        }
                                        showIcon={false}
                                      />
                                    </div>
                                  }
                                  metadata={[
                                    {
                                      label: "SOURCE",
                                      value: (
                                        <button
                                          onClick={(e) =>
                                            handleSourceClick(
                                              finding.sessionId,
                                              e,
                                            )
                                          }
                                          className="hover:underline cursor-pointer text-left focus:outline-none"
                                        >
                                          {finding.sourceSession ||
                                            currentItem?.label}{" "}
                                          • {finding.timestamp}
                                        </button>
                                      ),
                                    },
                                    ...(finding.tags?.length || finding.tag
                                      ? [
                                          {
                                            label: "TAGS",
                                            value: (
                                              <div className="flex flex-wrap gap-1">
                                                {(Array.isArray(finding.tags)
                                                  ? finding.tags
                                                  : (finding.tag || "")
                                                      .split(",")
                                                      .map((t: string) =>
                                                        t.trim(),
                                                      )
                                                      .filter(Boolean)
                                                ).map((tag: string) => (
                                                  <Badge
                                                    key={tag}
                                                    variant="soft"
                                                    className="px-2 py-0.5 text-xs text-slate-500 font-mono cursor-pointer hover:bg-slate-200"
                                                    onClick={(
                                                      e: React.MouseEvent,
                                                    ) => handleTagClick(tag, e)}
                                                  >
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            ),
                                          },
                                        ]
                                      : []),
                                    ...(finding.framework
                                      ? [
                                          {
                                            label: "FRAMEWORK",
                                            value: finding.framework,
                                          },
                                        ]
                                      : []),
                                  ]}
                                  rightAction={
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                                      onClick={() => handleJumpToSpot(finding)}
                                    >
                                      <ExternalLink
                                        size={12}
                                        className="mr-1.5"
                                      />{" "}
                                      Jump to Spot
                                    </Button>
                                  }
                                  hoverable={true}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : isDocument ? (
                  <div className="space-y-6">
                    {FEATURE_FLAGS.FEATURE_INTELLIGENCE_INSIGHTS && (
                      <EvidenceInsightsCard
                        item={currentItem}
                        allSnippets={allEvidenceFindingsPool}
                        sessions={localSessions}
                        type="document"
                        onNavigateToSource={(src) => handleSourceClick(src)}
                      />
                    )}
                    <Typography
                      variant="label-micro"
                      className="text-text-disabled uppercase font-bold tracking-wider"
                    >
                      Supporting Evidence
                    </Typography>
                    <div className="space-y-4">
                      {(currentItem as any)?.findings
                        ?.filter((f: any) => f.included !== false)
                        .map((finding: any) => (
                          <EntityCard
                            key={finding.id}
                            title={finding.text}
                            titleClassName="text-base font-semibold text-slate-800 leading-snug"
                            onClick={() => {
                              setActiveType("evidence_item");
                              setActiveItemLabel(finding.id);
                              setActiveSessionId(null);
                            }}
                            statusBadge={
                              <div className="flex items-center gap-2">
                                <StatusBadge
                                  {...getEvidenceBadgeProps(
                                    finding.type,
                                    finding.status,
                                    "document",
                                  )}
                                  showIcon={false}
                                />
                                <StatusBadge
                                  status={
                                    finding.isUserGenerated ? "user" : "ai"
                                  }
                                  showIcon={false}
                                />
                              </div>
                            }
                            metadata={[
                              {
                                label: "SOURCE",
                                value: (
                                  <button
                                    onClick={(e) =>
                                      handleSourceClick(finding.sessionId, e)
                                    }
                                    className="hover:underline cursor-pointer text-left focus:outline-none"
                                  >
                                    {finding.sourceSession ||
                                      currentItem?.label}{" "}
                                    • {finding.timestamp}
                                  </button>
                                ),
                              },
                              ...(finding.tags?.length || finding.tag
                                ? [
                                    {
                                      label: "TAGS",
                                      value: (
                                        <div className="flex flex-wrap gap-1">
                                          {(Array.isArray(finding.tags)
                                            ? finding.tags
                                            : (finding.tag || "")
                                                .split(",")
                                                .map((t: string) => t.trim())
                                                .filter(Boolean)
                                          ).map((tag: string) => (
                                            <Badge
                                              key={tag}
                                              variant="soft"
                                              className="px-2 py-0.5 text-xs text-slate-500 font-mono cursor-pointer hover:bg-slate-200"
                                              onClick={(e: React.MouseEvent) =>
                                                handleTagClick(tag, e)
                                              }
                                            >
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      ),
                                    },
                                  ]
                                : []),
                              ...(finding.framework
                                ? [
                                    {
                                      label: "FRAMEWORK",
                                      value: finding.framework,
                                    },
                                  ]
                                : []),
                            ]}
                            rightAction={
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                                onClick={() => handleJumpToSpot(finding)}
                              >
                                <ExternalLink size={12} className="mr-1.5" />{" "}
                                Jump to Spot
                              </Button>
                            }
                            hoverable={true}
                          />
                        ))}
                    </div>
                  </div>
                ) : (
                  <Card className="p-8 space-y-8 bg-white">
                    {isNextStep ? (
                      <div className="space-y-6">
                        <DataPoint
                          label="SUGGESTED CLINICAL FOCUS"
                          value={
                            (currentItem as any)?.suggestedClinicalFocus ||
                            "Standard Evaluation"
                          }
                        />
                        <DataPoint
                          label="EXPECTED IMPACT"
                          value={
                            (currentItem as any)?.impact ||
                            "High information gain"
                          }
                        />
                        <DataPoint
                          label="RATIONALE"
                          value={
                            (currentItem as any)?.rationale ||
                            "Resolves ambiguity for this specific topic."
                          }
                        />
                      </div>
                    ) : isCriteria ? (
                      <div className="space-y-10">
                        <div className="space-y-4">
                          {(currentItem as any)?.rationale && (
                            <DataPoint
                              label="RATIONALE"
                              value={(currentItem as any)?.rationale}
                            />
                          )}
                          <DataPoint
                            label="SUGGESTED STATUS"
                            value={currentItem?.status || "Supported"}
                          />
                        </div>

                        <div className="space-y-4">
                          <Typography
                            variant="label-micro"
                            className="text-text-disabled uppercase font-bold tracking-wider"
                          >
                            Supporting Evidence
                          </Typography>
                          <div className="space-y-4">
                            {(currentItem as any)?.findings
                              ?.filter((f: any) => f.included !== false)
                              .map((finding: any) => (
                                <EntityCard
                                  key={finding.id}
                                  title={finding.text}
                                  titleClassName="text-base font-semibold text-slate-800 leading-snug"
                                  onClick={() => {
                                    setActiveType("evidence_item");
                                    setActiveItemLabel(finding.id);
                                    setActiveSessionId(null);
                                  }}
                                  statusBadge={
                                    <div className="flex items-center gap-2">
                                      <StatusBadge
                                        {...getEvidenceBadgeProps(
                                          finding.type,
                                          finding.status,
                                          finding.context || (finding.sourceDocumentId ? "document" : (finding.sourceAssessmentId ? "assessment" : (finding.sessionId ? "session" : undefined))),
                                        )}
                                        showIcon={false}
                                      />
                                      <StatusBadge
                                        status={
                                          finding.isUserGenerated
                                            ? "user"
                                            : "ai"
                                        }
                                        showIcon={false}
                                      />
                                    </div>
                                  }
                                  metadata={[
                                    {
                                      label: "SOURCE",
                                      value: (
                                        <button
                                          onClick={(e) =>
                                            handleSourceClick(
                                              finding.sessionId,
                                              e,
                                            )
                                          }
                                          className="hover:underline cursor-pointer text-left focus:outline-none"
                                        >
                                          {finding.sourceSession ||
                                            currentItem?.label}{" "}
                                          • {finding.timestamp}
                                        </button>
                                      ),
                                    },
                                    ...(finding.tags?.length || finding.tag
                                      ? [
                                          {
                                            label: "TAGS",
                                            value: (
                                              <div className="flex flex-wrap gap-1">
                                                {(Array.isArray(finding.tags)
                                                  ? finding.tags
                                                  : (finding.tag || "")
                                                      .split(",")
                                                      .map((t: string) =>
                                                        t.trim(),
                                                      )
                                                      .filter(Boolean)
                                                ).map((tag: string) => (
                                                  <Badge
                                                    key={tag}
                                                    variant="soft"
                                                    className="px-2 py-0.5 text-xs text-slate-500 font-mono cursor-pointer hover:bg-slate-200"
                                                    onClick={(
                                                      e: React.MouseEvent,
                                                    ) => handleTagClick(tag, e)}
                                                  >
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            ),
                                          },
                                        ]
                                      : []),
                                    ...(finding.framework
                                      ? [
                                          {
                                            label: "FRAMEWORK",
                                            value: finding.framework,
                                          },
                                        ]
                                      : []),
                                  ]}
                                  rightAction={
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                                      onClick={() => handleJumpToSpot(finding)}
                                    >
                                      <ExternalLink
                                        size={12}
                                        className="mr-1.5"
                                      />{" "}
                                      Jump to Spot
                                    </Button>
                                  }
                                  hoverable={true}
                                />
                              ))}
                          </div>
                        </div>
                        {FEATURE_FLAGS.FEATURE_INTELLIGENCE_INSIGHTS && (
                          <EvidenceInsightsCard
                            item={currentItem}
                            allSnippets={allEvidenceFindingsPool}
                            sessions={localSessions}
                            type="criteria"
                            onNavigateToSource={(src) => handleSourceClick(src)}
                          />
                        )}
                      </div>
                    ) : null}
                  </Card>
                )}
              </>
            )}

            {/* Inline Rationale Flow */}
            <AnimatePresence>
              {activeAction && activeAction !== "reject" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary/5 border-2 border-primary/20 p-8 rounded-2xl space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        activeAction === "accept"
                          ? "bg-success/20 text-success"
                          : "bg-error/20 text-error",
                      )}
                    >
                      {activeAction === "accept" ? (
                        <ThumbsUp size={20} />
                      ) : (
                        <ThumbsDown size={20} />
                      )}
                    </div>
                    <Typography variant="h3">
                      Reason for{" "}
                      {activeAction.charAt(0).toUpperCase() +
                        activeAction.slice(1)}
                    </Typography>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      ref={rationaleRef}
                      value={rationale}
                      onChange={(e) => setRationale(e.target.value)}
                      placeholder="Provide justification for this mapping decision..."
                      className="w-full bg-white border border-divider rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => setActiveAction(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="brand"
                        onClick={commitAction}
                        disabled={!rationale.trim()}
                      >
                        Commit {activeAction}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-8 border-t border-divider bg-gray-50/50 flex flex-col gap-6 shrink-0">
        <div className="w-full flex flex-wrap gap-4">
          {!activeItemLabel && !activeSessionId ? (
            <div className="w-full p-4 text-center bg-gray-100/50 rounded-xl border border-divider">
              <Typography
                variant="body-sm"
                className="text-text-disabled font-bold italic"
              >
                Select an item from the review queue to begin assessment
              </Typography>
            </div>
          ) : activeId && derivedAcceptedItems.includes(activeId) ? (
            <div className="w-full bg-success-light/30 border border-success/10 p-4 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-success" size={20} />
                <Typography
                  variant="body-sm"
                  className="text-success-dark font-bold"
                >
                  {activeType === "session"
                    ? "Session accepted successfully."
                    : "Mapping accepted successfully."}
                </Typography>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleUndoAccept}
                className="text-success-dark hover:bg-success/10 border border-success/20"
              >
                Undo Accept
              </Button>
            </div>
          ) : activeId && rejectedItems[activeId] ? (
            <div className="w-full bg-error-light/30 border border-error/10 p-4 rounded-xl flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <XCircle className="text-error" size={20} />
                  <Typography
                    variant="body-sm"
                    className="text-error-dark font-bold"
                  >
                    {activeType === "session"
                      ? "Session rejected"
                      : "Evidence rejected"}
                  </Typography>
                </div>
                <Typography
                  variant="body-sm"
                  className="text-error-dark/80 pl-8"
                >
                  Reason: {rejectedItems[activeId]}
                </Typography>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleUndoReject}
                className="text-error-dark hover:bg-error/10 border border-error/20"
              >
                Undo Reject
              </Button>
            </div>
          ) : activeId && deferredItems.includes(activeId) ? (
            <div className="w-full space-y-6">
              <div className="w-full bg-orange-50 border border-orange-500/10 p-4 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Clock className="text-orange-600" size={20} />
                  <Typography
                    variant="body-sm"
                    className="text-orange-700 font-bold"
                  >
                    {activeType === "session"
                      ? "Session deferred"
                      : "Evidence deferred"}
                  </Typography>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleRestore(activeId)}
                  className="text-orange-700 hover:bg-orange-100 border border-orange-200"
                >
                  Undo Defer
                </Button>
              </div>

              <EvidenceWorkspaceCTAs
                type={activeType}
                disabled={activeAction !== null}
                onAccept={() => handleActionClick("accept")}
                onReject={() => handleActionClick("reject")}
                onModify={() => handleActionClick("modify")}
                onDefer={() => handleActionClick("defer")}
                onSkip={() => setIsSkipOpen(true)}
              />
            </div>
          ) : (
            <EvidenceWorkspaceCTAs
              type={activeType}
              disabled={false}
              onAccept={() => handleActionClick("accept")}
              onReject={() => handleActionClick("reject")}
              onModify={() => handleActionClick("modify")}
              onDefer={() => handleActionClick("defer")}
              onSkip={() => setIsSkipOpen(true)}
            />
          )}
        </div>
      </div>
    </div>
  );

  const workspaceContainer = (
    <WorkspaceContainer
      sidebarWidth={isSidebarCollapsed ? 64 : 320}
      sidebarContent={sidebarContent}
      mainContent={mainContent}
      height={isFullScreen ? "100%" : "800px"}
    />
  );

  const progressBanner = (
    <ProgressBanner
      title="Evidence Review"
      subtitle="Review all extracted evidence to unlock the report analysis"
      current={currentRequiredProgress}
      total={totalRequiredItems}
      progressLabel="Items Reviewed"
      actionLabel="See analysis"
      actionIcon={ArrowRight}
      onAction={() => {
        if (
          FEATURE_FLAGS.FEATURE_CONFLICT_RESOLUTION_GATE &&
          conflicts.length > 0 &&
          !hasSkippedConflicts
        ) {
          setIsConflictModalOpen(true);
        } else {
          setIsAnalysisModalOpen(true);
        }
      }}
      isActionActive={isAllRequiredReviewed}
      className="mb-6 mx-0"
    />
  );

  const analysisModal = (
    <Modal
      isOpen={isAnalysisModalOpen}
      onClose={() => setIsAnalysisModalOpen(false)}
      width={720}
    >
      <ModalHeader 
        title="Working Hypothesis" 
        subtitle="Finalize your working hypothesis to synthesize the comprehensive clinical analysis and unlock the assessment report."
      />
      <HypothesisGate
        initialState="typing"
        onBack={() => setIsAnalysisModalOpen(false)}
        onRevealed={(hyp, skipped) => {
          setClinicianHypothesis(hyp);
          setHypothesisSkipped(skipped);
        }}
      >
        <div className="max-h-[70vh] overflow-y-auto p-1 pr-3 space-y-6 -mr-3">
          <Card className="p-6 bg-white border-divider shadow-none space-y-6">
            <DataPoint 
              label="CLINICIAN WORKING HYPOTHESIS"
              value={
                <div className="space-y-2 mt-1">
                  <Typography variant="body" className="text-text-primary leading-relaxed">
                    "{clinicianHypothesis || "Bypassed hypothesis phase."}"
                  </Typography>
                  {clinicianHypothesis.length === 0 && (
                    <div className="flex items-center gap-2 text-rose-600 bg-rose-50/50 p-2 rounded-lg text-[10px] font-bold uppercase w-fit ring-1 ring-rose-100">
                      <AlertCircle size={12} />
                      AUDIT FLAG: NO HYPOTHESIS PROVIDED
                    </div>
                  )}
                </div>
              }
            />

            <DataPoint 
              label="SYSTEM RATIONALE"
              value={
                <Typography variant="body" className="text-text-secondary leading-relaxed mt-1">
                  Synthesis based on {clinicianHypothesis.length > 0 ? "corroboration of provided hypothesis" : "available system signals"} with 92% evidence coverage across 14 extracted markers.
                </Typography>
              }
            />
          </Card>

          <div className="space-y-6">
            <Typography variant="body" className="text-text-secondary">
              Review the generated analysis before unlocking the final report.
            </Typography>

            <Card className="divide-y divide-divider p-0 overflow-hidden border-none shadow-none">
              {[
                {
                  id: "step-summary",
                  stepNum: 1,
                  title: "Initial Evidence Summary",
                  sub: "Core observations from sessions and collateral",
                  items: [
                    "Assessment Data",
                    "Session Insights",
                    "Document Collateral",
                  ],
                },
                {
                  id: "step-patterns",
                  stepNum: 2,
                  title: "Symptom Patterns",
                  sub: "Whole Mind Snapshot & Observed Themes",
                  items: ["Symptom Clusters", "Functional Impact"],
                },
                {
                  id: "step-impression",
                  stepNum: 3,
                  title: "Working Impression",
                  sub: "Provisional status based on combined signals",
                  items: [
                    "Working Impression (Likely Social Anxiety)",
                    "Differential Considerations",
                  ],
                },
                {
                  id: "step-roadmap",
                  stepNum: 4,
                  title: "Clarity Roadmap",
                  sub: "Next steps to resolve uncertainty",
                  items: ["Suggested Diagnostic Actions", "Information Gaps"],
                },
              ].map((step) => (
                <div
                  key={step.id}
                  className="p-4 sm:p-6 flex gap-4 sm:gap-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-divider flex items-center justify-center font-bold text-text-disabled shrink-0 bg-white">
                    {step.stepNum}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <Typography variant="h3">{step.title}</Typography>
                      <Typography
                        variant="body-sm"
                        className="text-text-secondary"
                      >
                        {step.sub}
                      </Typography>
                    </div>
                    <div className="flex flex-col gap-2">
                      {step.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between p-3 bg-white border border-divider rounded-lg group cursor-pointer hover:border-primary/30 transition-all"
                        >
                          <Typography
                            variant="body"
                            className="font-medium text-sm text-text-primary leading-tight"
                          >
                            {item}
                          </Typography>
                          <ChevronDown
                            size={14}
                            className="text-text-disabled group-hover:text-primary transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-divider">
            <Button
              variant="secondary"
              onClick={() => setIsAnalysisModalOpen(false)}
            >
              Back to Evidence
            </Button>
            <Button
              variant="brand"
              onClick={() => {
                setIsAnalysisModalOpen(false);
                if (onUnlockReport) onUnlockReport();
              }}
            >
              Accept & Unlock Report
            </Button>
          </div>
        </div>
      </HypothesisGate>
    </Modal>
  );

  const olderAssessmentsModal = (
    <Modal
      isOpen={isOlderAssessmentsOpen}
      onClose={() => setIsOlderAssessmentsOpen(false)}
      title={`Historical Versions: ${currentItem?.label}`}
      width={600}
    >
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
         {allAssessmentItems
           .filter(a => a.label === currentItem?.label && a.id !== (currentItem as any).id)
           .reverse()
           .map(a => (
             <EntityCard
               key={a.id}
               title={a.subtitle}
               summary={a.overallImpression || a.notes || "No impression recorded."}
               hoverable={false}
               metadata={[
                  { label: "Date", value: a.date || "N/A" },
                  { label: "Score", value: a.score || "N/A" },
                  { label: "Status", value: a.status }
               ]}
             />
           ))
         }
         {allAssessmentItems.filter(a => a.label === currentItem?.label && a.id !== (currentItem as any).id).length === 0 && (
           <div className="py-12 text-center text-slate-400 italic">
             No older versions available for this tool.
           </div>
         )}
      </div>
    </Modal>
  );

  if (isFullScreen) {
    return (
      <AssessmentGate
        onNavigateToAssessments={onNavigateToAssessments || (() => {})}
      >
        <div className="fixed inset-0 z-50 bg-workspace-bg flex flex-col items-center">
          <div className="w-full bg-white border-b border-divider shrink-0 flex justify-center">
            <div className="w-full max-w-[1400px] flex justify-between items-center p-4">
              <Typography variant="h2" className="font-sans">
                Evidence Workspace
              </Typography>
              <Button variant="ghost" onClick={() => setIsFullScreen(false)}>
                <Minimize2 size={18} className="mr-2" /> Exit Focus Mode
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full flex flex-col max-w-[1400px] px-4 md:px-8 py-6 overflow-hidden">
            {progressBanner}
            {workspaceContainer}
          </div>
        </div>
        {analysisModal}
        <UploadDocumentModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={(data) => {
            console.log("Uploaded:", data);
            setIsUploadModalOpen(false);
          }}
        />
        <CreateSessionModal
          isOpen={isCreateSessionModalOpen}
          onClose={() => setIsCreateSessionModalOpen(false)}
          onSessionCreate={(sessionInfo) => {
            console.log("Session Created:", sessionInfo);
            setIsCreateSessionModalOpen(false);
          }}
        />
        <AssessmentCompareSidebar />
        <ClinicalNotesSidebar />
        {olderAssessmentsModal}
      </AssessmentGate>
    );
  }

  return (
    <AssessmentGate
      onNavigateToAssessments={onNavigateToAssessments || (() => {})}
    >
      <WorkspaceLayout
        title="Evidence Workspace"
        subtitle="Review extracted evidence, assess diagnostic criteria, and identify next steps"
        headerActions={
          <Button variant="secondary" onClick={() => setIsFullScreen(true)}>
            <Maximize2 size={18} className="mr-2" /> Focus Mode
          </Button>
        }
        subHeaderContent={progressBanner}
        sidebarWidth={isSidebarCollapsed ? 64 : 320}
        sidebarContent={sidebarContent}
        mainContent={mainContent}
        height="800px"
      />
      {analysisModal}
      {olderAssessmentsModal}
      <ConflictResolutionModal
        isOpen={isConflictModalOpen}
        conflicts={conflicts}
        onResolve={() => setIsConflictModalOpen(false)}
        onSkip={() => {
          updateDecisions({ hasSkippedConflicts: true });
          setIsConflictModalOpen(false);
          setIsAnalysisModalOpen(true);
        }}
      />
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={(data) => {
          console.log("Uploaded:", data);
          setIsUploadModalOpen(false);
        }}
      />
      <CreateSessionModal
        isOpen={isCreateSessionModalOpen}
        onClose={() => setIsCreateSessionModalOpen(false)}
        onSessionCreate={(sessionInfo) => {
          console.log("Session Created:", sessionInfo);
          setIsCreateSessionModalOpen(false);
        }}
      />
      <AssessmentCompareSidebar />
      <ClinicalNotesSidebar />
    </AssessmentGate>
  );
}
