/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Plus, 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Layout,
  FileText,
  Activity,
  User,
  Layers,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// UI Components
import { 
  Button, 
  Badge, 
  Card, 
  Typography, 
  Input, 
  TableFooter 
} from "@ui/index";
import { StatusBadge } from "@shared/StatusBadge";
import { EmptyState } from "@shared/EmptyState";
import { SectionHeader } from "@shared/SectionHeader";
import { cn } from "@lib/utils";

// Domain & Context
import { useSearchParams } from "react-router-dom";
import { MOCK_ASSESSMENTS, MOCK_CLIENT_DATA, MOCK_CLIENTS, MOCK_DOCUMENTS } from "../mockData";
import { deriveClientStatus } from "./ClientListScreen";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { useAppStore, useClinicalStore } from "@/services/store";
import { WorkspaceAlertsProvider, useWorkspaceAlerts } from "@/contexts/WorkspaceAlertsContext";

// Components
import { ProgressBanner } from "../components/ProgressBanner";
import { ArrowRight } from "lucide-react";

// Modals & Panels
import { ShareAssessmentModal } from "../modals/ShareAssessmentModal";
import { StartAssessmentModal } from "../modals/StartAssessmentModal";
import { AssessmentCard } from "../components/AssessmentCard";
import { AssessmentCompareSidebar } from "../components/AssessmentCompareSidebar";
import { ClinicalNotesSidebar } from "../components/ClinicalNotesSidebar";
import { WorkspaceHeader } from "@components/layout/WorkspaceHeader";
import { WorkspaceStatusBar } from "../components/WorkspaceStatusBar";

// Workspaces
import { EvidenceWorkspace } from "./EvidenceWorkspace";
import { ReportWorkspace } from "./ReportWorkspace";
import { SessionListWorkspace } from "./SessionListWorkspace";
import { ProfileWorkspace } from "./ProfileWorkspace";
import { AnalysisWorkspace } from "./AnalysisWorkspace";
import { DocumentsWorkspace } from "./DocumentsWorkspace";
import { DocumentDetailsScreen } from "./DocumentDetailsScreen";
import { AssessmentResultScreen } from "./AssessmentResultScreen";

import { UpdatesBanner, UpdateItem } from "../components/UpdatesBanner";

function AssessmentListScreenContent({ clientId, onBack }: { clientId: string, onBack: () => void }) {
  const { setActiveAssessmentId, useGroupedTabs, setActiveClientId } = useAppStore();
  const { conflicts, missingDocuments, lowConfidenceMappings } = useWorkspaceAlerts();
  
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab = (() => {
    if (clientId === "125570") return "Report";
    if (clientId === "125566" || clientId === "125571" || clientId === "125572") return "Evidence";
    if (clientId === "125569") return "Documents";
    return "Profile";
  })();

  const activeTab = searchParams.get("tab") || defaultTab;
  const setActiveTab = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    setSearchParams(newParams);
  };

  const selectedAssessmentIdLocal = searchParams.get("assessmentId") || null;
  const setSelectedAssessmentIdLocal = (id: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set("assessmentId", id);
    } else {
      newParams.delete("assessmentId");
    }
    setSearchParams(newParams);
  };

  const clinicalData = useClinicalStore();

  const clientData = React.useMemo(() => {
    const staticData = (MOCK_CLIENT_DATA as any)[clientId] || {};
    const clientRecord = clinicalData.clients.find(c => c.id === clientId);
    
    return {
      ...staticData,
      ...clientRecord,
      sessions: clinicalData.sessions[clientId] || staticData.sessions || [],
      assessments: clinicalData.assessments[clientId] || staticData.assessments || [],
      documents: clinicalData.documents[clientId] || staticData.documents || [],
    };
  }, [clinicalData, clientId]);

  const sessionId = searchParams.get("sessionId");
  const selectedSessionLocal = clientData?.sessions?.find((s: any) => s.id === sessionId) || null;
  const setSelectedSessionLocal = (session: any | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (session) {
      newParams.set("sessionId", session.id || session);
    } else {
      newParams.delete("sessionId");
    }
    setSearchParams(newParams);
  };

  const documentId = searchParams.get("documentId");
  const selectedDocumentLocal = (clientData?.documents || MOCK_DOCUMENTS).find((d: any) => d.id === documentId || d.name === documentId) || null;
  const setSelectedDocumentLocal = (doc: any | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (doc) {
      newParams.set("documentId", doc.id || doc.name || doc);
    } else {
      newParams.delete("documentId");
    }
    setSearchParams(newParams);
  };

  const search = searchParams.get("q") || "";
  const setSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("q", value);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

  const isShareModalOpen = searchParams.get("share") === "true";
  const setIsShareModalOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("share", "true");
    } else {
      newParams.delete("share");
    }
    setSearchParams(newParams);
  };

  const isStartAssessmentModalOpen = searchParams.get("startAssessment") === "true";
  const setIsStartAssessmentModalOpen = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("startAssessment", "true");
    } else {
      newParams.delete("startAssessment");
    }
    setSearchParams(newParams);
  };

  const sharingAssessmentTitle = searchParams.get("shareTitle") || "";
  const setSharingAssessmentTitle = (title: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (title) {
      newParams.set("shareTitle", title);
    } else {
      newParams.delete("shareTitle");
    }
    setSearchParams(newParams);
  };

  const [isAnalysisManuallyUnlocked, setIsAnalysisManuallyUnlocked] = useState(false);
  const [forceStatusReady, setForceStatusReady] = useState(false);

  // Mock updates for returning clinician
  const [updates, setUpdates] = useState<UpdateItem[]>([
    {
      id: "upd-1",
      field: "Primary Hypothesis",
      oldValue: "Major Depressive Disorder",
      newValue: "Bipolar II Disorder, Most Recent Episode Depressed",
      changedBy: "Dr. Sarah Chen",
      changedAt: "Yesterday, 4:15 PM",
      type: "clinician"
    },
    {
      id: "upd-2",
      field: "PHQ-9 Score",
      oldValue: "12 (Moderate)",
      newValue: "18 (Moderately Severe)",
      changedBy: "System Extraction",
      changedAt: "Today, 9:20 AM",
      type: "system"
    },
    {
      id: "upd-3",
      field: "Medication List",
      oldValue: "Fluoxetine 20mg",
      newValue: "Fluoxetine 40mg, Quetiapine 50mg PRN",
      changedBy: "Dr. James Wilson",
      changedAt: "Oct 12, 11:30 AM",
      type: "clinician"
    }
  ]);

  const handleAcknowledgeUpdate = (id: string) => {
    setUpdates(prev => prev.filter(u => u.id !== id));
  };

  const handleAcknowledgeAll = () => {
    setUpdates([]);
  };

  React.useEffect(() => {
    setActiveClientId(clientId);
    
    // Auto unlock analysis if specified in mock data
    if (clientData?.reportUnlocked) {
      setIsAnalysisManuallyUnlocked(true);
    } else {
      setIsAnalysisManuallyUnlocked(false);
    }
    
    // Clear old client query states when switching clients
    const newParams = new URLSearchParams();
    const defaultTabForClient = (() => {
      if (clientId === "125570") return "Report";
      if (clientId === "125566" || clientId === "125571" || clientId === "125572") return "Evidence";
      if (clientId === "125569") return "Documents";
      return "Profile";
    })();
    newParams.set("tab", defaultTabForClient);
    setSearchParams(newParams);
  }, [clientId, setActiveClientId]);
  const clientMeta = clinicalData.clients.find(c => c.id === clientId) || MOCK_CLIENTS.find(c => c.id === clientId);
  const derivedStatus = clientMeta ? deriveClientStatus(
    clientMeta,
    clientData?.assessments || [],
    clientData?.sessions || [],
    clientData?.documents || []
  ) : "idle";
  const status = forceStatusReady ? "ready" : derivedStatus;

  // Clinical Unlock Logic (Requirement: 2 Sessions, 2 Completed Assessments, 2 Uploaded Documents)
  const sessionsCount = clientData?.sessions?.length || 0;
  const sessionsMet = sessionsCount >= 2;
  const assessmentsCount = clientData?.assessments?.filter((a: any) => a.status.toLowerCase() === 'completed').length || 0;
  const assessmentsMet = assessmentsCount >= 2;
  const documentsCount = clientData?.documents?.filter((d: any) => d.status === 'uploaded' || d.status === 'completed').length || 0;
  const documentsMet = documentsCount >= 2;
  
  const currentProgress = Math.min(sessionsCount, 2) + Math.min(assessmentsCount, 2) + Math.min(documentsCount, 2);
  const evidenceCriteriaMet = currentProgress >= 6;
  
  const isEvidenceLocked = status === "ready" ? false : !evidenceCriteriaMet;
  // Analysis and Report are locked until evidence is fully reviewed (allAccepted) 
  // OR if it's manually unlocked (specified in mock data)
  const isAnalysisLocked = status === "ready" ? false : (!evidenceCriteriaMet || (!clientData?.allAccepted && !isAnalysisManuallyUnlocked));

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
  };

  const navGroups = [
    { label: "Core", tabs: ["Profile", "Sessions", "Assessments", "Documents"] },
    { label: "Refinement", tabs: ["Evidence"] },
    { label: "Insights", tabs: ["Analysis", "Report"] }
  ];

  const renderTab = (tab: string) => {
    const isActive = activeTab === tab;
    const badgeCount = tab === "Evidence" ? conflicts.length : tab === "Documents" ? missingDocuments.length : 0;
    
    let isLocked = false;
    if (tab === "Evidence" && isEvidenceLocked) isLocked = true;
    if ((tab === "Analysis" || tab === "Report") && isAnalysisLocked) isLocked = true;

    const isRequirementMet = 
      (tab === "Sessions" && sessionsMet) ||
      (tab === "Assessments" && assessmentsMet) ||
      (tab === "Documents" && documentsMet) ||
      (tab === "Evidence" && clientData?.allAccepted);

    const hasHazard = tab === "Evidence" && FEATURE_FLAGS.FEATURE_UX_CROSS_TAB_SIGNALLING && conflicts.length > 0;

    return (
      <button 
        key={tab}
        onClick={() => !isLocked && handleTabSelect(tab)} 
        disabled={isLocked}
        className={cn(
          "flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative border-b-2",
          isActive ? "text-primary border-primary" : "text-text-secondary border-transparent hover:text-primary hover:bg-gray-50",
          isLocked && "opacity-40 cursor-not-allowed hover:bg-transparent",
          hasHazard && "text-orange-600"
        )}
      >
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {tab}
          {isRequirementMet && (
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          )}
          {hasHazard && (
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <AlertTriangle size={14} className="text-orange-500 fill-orange-50" />
            </motion.div>
          )}
        </div>
        {badgeCount > 0 && !isLocked && (
          <span className={cn(
            "flex items-center justify-center min-w-[18px] h-4.5 px-1.5 rounded-full text-[10px] font-bold",
            isActive ? "bg-primary text-white" : "bg-gray-200 text-text-secondary",
            hasHazard && !isActive && "bg-orange-100 text-orange-700"
          )}>
            {badgeCount}
          </span>
        )}
      </button>
    );
  };

  const assessments = clientData?.assessments || MOCK_ASSESSMENTS;
  const filtered = assessments.filter((a: any) => a.title.toLowerCase().includes(search.toLowerCase()));

  const handleViewResult = (id?: string) => {
    if (id) {
      setActiveAssessmentId(id);
      setSelectedAssessmentIdLocal(id);
    }
  };

  const hideNavigation = !!selectedAssessmentIdLocal || !!selectedSessionLocal || !!selectedDocumentLocal;

  const unlockEvidenceBanner = isAnalysisLocked && status !== "ready" ? (
    <ProgressBanner
      title={evidenceCriteriaMet ? "Evidence Workspace Unlocked" : "Unlock Evidence Workspace"}
      subtitle={evidenceCriteriaMet ? "All clinical requirements met for verification." : "Complete requirements to begin evidence review."}
      current={currentProgress}
      total={6}
      progressLabel="Requirements Met"
      actionLabel="Review evidence"
      actionIcon={ArrowRight}
      onAction={() => {
        handleTabSelect("Evidence");
      }}
      isActionActive={evidenceCriteriaMet}
      className="mb-6"
      breakdown={[
        { label: "Sessions", current: Math.min(sessionsCount, 2), total: 2 },
        { label: "Assessments", current: Math.min(assessmentsCount, 2), total: 2 },
        { label: "Documents", current: Math.min(documentsCount, 2), total: 2 }
      ]}
    />
  ) : null;

  return (
    <div className="bg-workspace-bg min-h-screen">
      <ShareAssessmentModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        assessmentTitle={sharingAssessmentTitle}
      />

      <StartAssessmentModal 
        isOpen={isStartAssessmentModalOpen}
        onClose={() => setIsStartAssessmentModalOpen(false)}
        clientId={clientId}
        onStart={(assessment) => {
          console.log("Starting assessment:", assessment);
          // In a real app we would add this to the client's assessments list
        }}
      />

      <div className={cn("px-6 md:px-[60px]", hideNavigation ? "pt-8 pb-16" : "py-8")}>
        {!hideNavigation && (
          <div className="mb-12 space-y-6">
            {FEATURE_FLAGS.FEATURE_CHANGES_SINCE_LAST_SESSION && (
              <UpdatesBanner 
                updates={updates} 
                onAcknowledge={handleAcknowledgeUpdate} 
                onAcknowledgeAll={handleAcknowledgeAll} 
              />
            )}

            {!FEATURE_FLAGS.FEATURE_COMPACT_HUD && (
              <WorkspaceStatusBar onNavigate={handleTabSelect} />
            )}

            <div className="flex border-b border-divider overflow-x-auto no-scrollbar">
              {useGroupedTabs ? (
                <div className="flex items-center">
                  {navGroups.map((group, idx) => (
                    <React.Fragment key={group.label}>
                      <div className="flex items-center">
                        {group.tabs.map(renderTab)}
                      </div>
                      {idx < navGroups.length - 1 && (
                        <div className="px-2 text-text-disabled">
                          <ChevronRight size={18} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="flex">
                  {[...navGroups[0].tabs, ...navGroups[1].tabs, ...navGroups[2].tabs].map(renderTab)}
                </div>
              )}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={clientId + activeTab + (selectedAssessmentIdLocal || '') + (selectedSessionLocal?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "Profile" && <ProfileWorkspace />}
            {activeTab === "Analysis" && (
              <AnalysisWorkspace 
                onViewProfile={() => setActiveTab("Profile")} 
                onNavigateToAssessments={() => setActiveTab("Assessments")} 
                onNavigateToTab={setActiveTab}
              />
            )}
            {activeTab === "Evidence" && (
              <EvidenceWorkspace 
                clientId={clientId}
                onViewProfile={() => setActiveTab("Profile")} 
                onNavigateToAssessments={(id) => {
                  if (id) {
                    setActiveAssessmentId(id);
                    setSelectedAssessmentIdLocal(id);
                  }
                  setActiveTab("Assessments");
                }} 
                onNavigateToDocuments={(id) => {
                  if (id) {
                    // Try to find the document object by ID or label
                    const doc = (clientData?.documents || MOCK_DOCUMENTS).find((d: any) => d.id === id || d.name === id);
                    if (doc) {
                      setSelectedDocumentLocal(doc);
                    }
                  }
                  setActiveTab("Documents");
                }}
                onNavigateToSession={(session) => {
                  setSelectedSessionLocal(session);
                  setActiveTab("Sessions");
                }}
                onUnlockReport={() => {
                  setForceStatusReady(true);
                  setActiveTab("Report");
                }}
              />
            )}
            {activeTab === "Documents" && (
              selectedDocumentLocal ? (
                <DocumentDetailsScreen 
                  document={{ ...selectedDocumentLocal, clientName: clientMeta?.name }} 
                  onBack={() => setSelectedDocumentLocal(null)} 
                />
              ) : (
                <DocumentsWorkspace 
                  subHeaderContent={unlockEvidenceBanner} 
                  onDocumentSelect={setSelectedDocumentLocal}
                />
              )
            )}
            {activeTab === "Report" && <ReportWorkspace onNavigateToAssessments={() => setActiveTab("Assessments")} status={status} />}
            {activeTab === "Sessions" && (
              <SessionListWorkspace 
                selectedSession={selectedSessionLocal}
                onSessionSelect={setSelectedSessionLocal}
                onBack={() => setSelectedSessionLocal(null)}
                subHeaderContent={unlockEvidenceBanner}
              />
            )}
            {activeTab === "Assessments" && (
              selectedAssessmentIdLocal ? (
                <AssessmentResultScreen 
                  clientId={clientId} 
                  assessmentIndex={selectedAssessmentIdLocal}
                  onBack={() => setSelectedAssessmentIdLocal(null)} 
                />
              ) : (
                <div className="space-y-6">
                  <SectionHeader 
                    title="Assessments"
                    subtitle="Quick insights into client performance through tailored assessments."
                    actions={
                      <Button variant="brand" onClick={() => setIsStartAssessmentModalOpen(true)}>
                        <Plus size={18} /> 
                        Start New Assessment
                      </Button>
                    }
                    small
                  />
                  {unlockEvidenceBanner}
                  <Card className="p-0 border-divider overflow-hidden">
                    <div className="p-6 border-b border-divider bg-gray-50/30 flex justify-end">
                      <div className="relative w-full sm:w-[320px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                        <Input
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Search Assessment"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {filtered.length === 0 ? (
                        <EmptyState 
                          icon={Search}
                          title="No assessments found"
                          description="Try adjusting your search or start a new assessment session."
                          actionLabel="Start New Assessment"
                          onAction={() => setIsStartAssessmentModalOpen(true)}
                        />
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {filtered.map((a, i) => (
                            <AssessmentCard 
                              key={i} 
                              title={a.title} 
                              subtitle={a.subtitle} 
                              status={a.status} 
                              onViewResult={() => handleViewResult(a.id)} 
                              onShare={() => {
                                setSharingAssessmentTitle(a.title);
                                setIsShareModalOpen(true);
                              }}
                              date={(a as any).date} 
                              description={(a as any).description} 
                              notes={(a as any).notes}
                              overallImpression={a.overallImpression}
                              score={a.score}
                              percentile={a.percentile}
                              descriptor={a.descriptor}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
        
        <AssessmentCompareSidebar />
        <ClinicalNotesSidebar />
      </div>
    </div>
  );
}

export function AssessmentListScreen(props: { clientId: string, onBack: () => void }) {
  return (
    <WorkspaceAlertsProvider>
      <AssessmentListScreenContent {...props} />
    </WorkspaceAlertsProvider>
  );
}
