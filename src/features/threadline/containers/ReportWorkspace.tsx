/**
 * PERSISTENCE: ReportWorkspace management.
 * - reviewedSections: Persisted to AssessmentRecord to survive refresh.
 * - reportApproved: Dispatched to shared state and audit log.
 */

import React, { useState, useEffect } from "react";
import { Download as DownloadIcon, ChevronUp, Edit3 as EditIcon, CheckCircle2, Circle, AlertTriangle, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, BRAND_LIGHT, ACCEPTED_BG, cardStyle, cardHeaderStyle, h1Style, subStyle, primaryBtn, outlineBtn, TYPE_SCALE } from "../constants";
import { cn } from "@lib/utils";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { useAppStore, useClinicalStore } from "@/services/store";
import { useWorkspaceAlerts } from "@/contexts/WorkspaceAlertsContext";

import { AssessmentGate } from "../components/AssessmentGate";
import { ReportSection } from "../components";
import { ProgressBanner } from "../components/ProgressBanner";
import { WorkspaceLayout } from "@components/layout/WorkspaceLayout";
import { Modal, Button, Typography, DataPoint } from "@ui/index";

const REPORT_TYPES = [
  { id: 'diagnostic', label: 'Diagnostic Summary Report', subtitle: 'Threadline Diagnostic Summary Report' },
  { id: 'intake', label: 'Intake Assessment', subtitle: 'Initial Intake and Triage Summary' },
  { id: 'progress', label: 'Progress Note', subtitle: 'Session-based Progress Update' },
  { id: 'discharge', label: 'Discharge Summary', subtitle: 'Treatment Completion and Discharge Report' }
];

const REPORT_DATA: Record<string, any> = {
  diagnostic: {
    sections: [
      { id: 'sources', title: 'Sources of Information Reviewed', type: 'list' },
      { id: 'concerns', title: 'Clinical Concerns', type: 'text' },
      { id: 'snapshot', title: 'Whole-Mind Snapshot', type: 'snapshot' },
      { id: 'insights', title: 'Assessment Insights', type: 'insights' },
      { id: 'impression', title: 'Working Impression', type: 'text' },
      { id: 'next_steps', title: 'Recommended Next Steps', type: 'recommendations' },
      { id: 'safety', title: 'Safety Summary', type: 'list' }
    ],
    content: {
      sources: [
        "Structured mental-health telehealth session transcript",
        "Self-reported assessments: GAD-7, PHQ-9, SDS",
        "Teacher comments and school report",
        "Previous psychological evaluation",
        "No parent/caregiver collateral available"
      ],
      concerns: "Alexa reports difficulty concentrating during school hours, feelings of overwhelm in the evenings, and sleep irregularity with late bedtimes. She describes increased irritability over the past term. No acute safety concerns were expressed during sessions.",
      snapshot: "Alexa appears to be experiencing a mild but noticeable emotional and cognitive load, influenced by worry, sleep disturbance, and situational demands. Her functioning remains generally intact, with preserved insight.",
      insights: [
        { label: "Worry (GAD-7)", value: "Elevated cognitive worry with physical tension" },
        { label: "Sleep (SDS)", value: "Significant disruption in sleep architecture" },
        { label: "Mood (PHQ-9)", value: "Sub-clinical mood dips related to exhaustion" }
      ],
      impression: "The combined information suggests a pattern of mild distress with early risk indicators across worry, sleep, mood, and attention domains. Impacts on functioning are present but currently limited.",
      recommendations: {
        steps: ["Early generalised anxiety pattern", "Low mood pattern associated with situational influences", "Attention-related challenges"],
        info: ["Elevated worry across assessment items", "Low mood indicators affecting motivation"],
        reason: "Recommendations are based on current symptom clusters and reported functional impact."
      },
      safety: [
        "No acute risk indicators identified.",
        "No reports of suicidal ideation or self-harm.",
        "Client engaged and future-oriented."
      ]
    }
  },
  intake: {
    sections: [
      { id: 'presenting', title: 'Presenting Problem', type: 'text' },
      { id: 'history', title: 'Relevant History', type: 'text' },
      { id: 'goals', title: 'Initial Treatment Goals', type: 'list' },
      { id: 'triage', title: 'Triage Status', type: 'details' }
    ],
    content: {
      presenting: "Client presents for initial assessment citing significant 'life stress' and an inability to 'turn off' at night. Symptoms have persisted for 3 months following a change in workplace responsibilities.",
      history: "History of intermittent anxiety during university. No previous hospitalizations. Family history includes maternal depression. Recent physical exam was clear of medical causes for sleep issues.",
      goals: [
        "Stabilization of sleep patterns (7+ hours)",
        "Development of 3-5 portable coping strategies",
        "Return to previous workplace productivity levels",
        "Identification of primary stressors"
      ],
      triage: [
        { label: "Urgency", value: "Standard / Non-urgent" },
        { label: "Risk Flag", value: "None" },
        { label: "Motivation", value: "High" },
        { label: "Service Level", value: "Weekly Individual Therapy" }
      ]
    }
  },
  progress: {
    sections: [
      { id: 'summary', title: 'Session Summary', type: 'text' },
      { id: 'tracking', title: 'Goal Progress Tracking', type: 'insights' },
      { id: 'homework', title: 'Homework and Engagement', type: 'text' },
      { id: 'plan', title: 'Plan for Next Phase', type: 'list' }
    ],
    content: {
      summary: "Client has shown steady progress over the last four sessions. Engagement remains high, although some resistance was noted when discussing school-related stressors. Sleep hygiene strategies have been introduced.",
      tracking: [
        { label: "Goal 1: Sleep", value: "Improved from 4h to 6h average" },
        { label: "Goal 2: Anxiety", value: "Reduction in daily panic spikes" },
        { label: "Goal 3: Coping", value: "Actively using breathing techniques" }
      ],
      homework: "Completed 80% of thought logs. Demonstrated good application of 'STOP' technique during one workplace conflict. Encouraged to continue logs.",
      plan: [
        "Focus on social anxiety triggers next week",
        "Introduce graded exposure hierarchy",
        "Review sleep log again in 2 weeks",
        "Consider involving school counselor if stress persists"
      ]
    }
  },
  discharge: {
    sections: [
      { id: 'outcome', title: 'Treatment Outcomes', type: 'text' },
      { id: 'remission', title: 'Symptom Remission Status', type: 'insights' },
      { id: 'relapse', title: 'Relapse Prevention Plan', type: 'list' },
      { id: 'final', title: 'Final Clinician Statement', type: 'text' }
    ],
    content: {
      outcome: "Treatment goals have been successfully met. Client reports significantly improved mood stability and consistent sleep patterns. She demonstrates strong mastery of coping mechanisms.",
      remission: [
        { label: "Anxiety", value: "Full remission (GAD-7 score: 3)" },
        { label: "Sleep", value: "Normalized (SDS score: 22)" },
        { label: "Mood", value: "Stable (PHQ-9 score: 4)" }
      ],
      relapse: [
        "Continue morning sunlight exposure",
        "Bi-weekly check-in with GP for 3 months",
        "Use 'Step Back' technique if school stress returns",
        "Self-referral if symptoms persist > 2 weeks"
      ],
      final: "Client is discharged with high confidence in her ability to manage future stressors independently. Termination was collaborative and positive."
    }
  }
};

import { MOCK_REPORT_MAPPING_IDS as REPORT_MAPPING_IDS } from "../mockData";

function CompletenessWarningModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  missingItems 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  missingItems: { id: string, label: string }[] 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Evidence not reflected in report"
      width={500}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Download anyway
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Typography variant="body" className="text-text-secondary">
          The following evidence items were accepted in the Evidence Workspace but are not currently reflected in this version of the report:
        </Typography>
        <div className="bg-slate-50 rounded-lg border border-divider max-h-[200px] overflow-y-auto p-3">
          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            {missingItems.map(item => (
              <li key={item.id} className="text-[14px] leading-relaxed flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-text-secondary shrink-0" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <Typography variant="body" className="text-[13px] text-text-secondary italic">
          This gap will be logged in the audit trail if you proceed.
        </Typography>
      </div>
    </Modal>
  );
}

export function ReportWorkspace({ onNavigateToAssessments, status }: { onNavigateToAssessments?: () => void, status?: string }) {
  const activeAssessmentId = useAppStore(state => state.activeAssessmentId);
  const activeClientId = useAppStore(state => state.activeClientId);
  
  const assessments = useClinicalStore(state => state.assessments[activeClientId || ""]) || [];
  const assessment = assessments.find((a: any) => a.id === activeAssessmentId);
  const updateAssessment = useClinicalStore(state => state.updateAssessment);
  const updateCognitiveLoop = useClinicalStore(state => state.updateCognitiveLoop);

  const { acceptedMappings } = useWorkspaceAlerts();
  const [reviewedSectionsMap, setReviewedSectionsMap] = useState<Record<string, string[]>>({});
  const [showCompletenessModal, setShowCompletenessModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseCountdown, setPauseCountdown] = useState(3);
  const [missingEvidence, setMissingEvidence] = useState<{ id: string, label: string }[]>([]);
  const [selectedReportType, setSelectedReportType] = useState('diagnostic');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentReportType = REPORT_TYPES.find(t => t.id === selectedReportType) || REPORT_TYPES[0];

  // PERSISTENCE: Initial load
  useEffect(() => {
    if (assessment?.reviewedSectionsMap) {
      setReviewedSectionsMap(assessment.reviewedSectionsMap);
    } else if (assessment?.reviewedSections) {
      // Migration for old single-array format
      setReviewedSectionsMap({ diagnostic: assessment.reviewedSections });
    }
  }, [assessment?.reviewedSectionsMap, assessment?.reviewedSections]);

  // PERSISTENCE: Auto-save on change
  useEffect(() => {
    if (!activeAssessmentId || !activeClientId) return;
    updateAssessment(activeClientId, activeAssessmentId, {
      reviewedSectionsMap,
    });
  }, [reviewedSectionsMap, activeAssessmentId, activeClientId, updateAssessment]);

  // REGULATORY NOTE: This is the primary control for RISK-006. The sequential review requirement must not be simplified to a single confirm without updating the risk control documentation.
  
  useEffect(() => {
    let timer: any;
    if (showPauseModal && pauseCountdown > 0) {
      timer = setInterval(() => {
        setPauseCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showPauseModal, pauseCountdown]);

  const toggleReview = (sectionId: string) => {
    setReviewedSectionsMap(prev => {
      const current = prev[selectedReportType] || [];
      const next = current.includes(sectionId)
        ? current.filter(id => id !== sectionId)
        : [...current, sectionId];
      
      return {
        ...prev,
        [selectedReportType]: next
      };
    });
  };

  const currentReviewedReportSections = reviewedSectionsMap[selectedReportType] || [];
  const currentReport = REPORT_DATA[selectedReportType] || REPORT_DATA.diagnostic;
  const isAllReviewed = currentReviewedReportSections.length === currentReport.sections.length;

  const { setReportApproved, conflicts } = useWorkspaceAlerts();

  const proceedWithDownload = (acknowledgedGap = false) => {
    if (FEATURE_FLAGS.FEATURE_UX_COGNITIVE_PAUSE_ON_DIAGNOSIS && !showPauseModal) {
      setShowPauseModal(true);
      setPauseCountdown(3);
      return;
    }

    console.info("AUDIT LOG: Report Approved", {
      timestamp: new Date().toISOString(),
      reportType: selectedReportType,
      assessmentId: activeAssessmentId,
      reviewedSections: currentReviewedReportSections,
      clinicianId: "CLINICIAN_001", // Mock ID
      completenessCheckAcknowledged: acknowledgedGap,
      missingItems: acknowledgedGap ? missingEvidence.map(i => i.id) : []
    });

    // PERSISTENCE: Loop update
    if (activeClientId && activeAssessmentId) {
      updateCognitiveLoop(activeClientId, activeAssessmentId, {
        reportApproved: true,
        reportApprovedAt: new Date().toISOString()
      });
    }

    setReportApproved(true);
    // Trigger download logic here
    alert("Report download triggered successfully.");
    setShowCompletenessModal(false);
    setShowPauseModal(false);
  };

  const handleApprove = () => {
    if (!isAllReviewed && FEATURE_FLAGS.FEATURE_SEQUENTIAL_REPORT_REVIEW) return;

    if (FEATURE_FLAGS.FEATURE_REPORT_COMPLETENESS_CHECK) {
      const missing = acceptedMappings.filter(mapping => !REPORT_MAPPING_IDS.includes(mapping.id));
      if (missing.length > 0) {
        setMissingEvidence(missing.map(m => ({ id: m.id, label: m.label })));
        setShowCompletenessModal(true);
        return;
      }
    }
    
    proceedWithDownload();
  };

  const [activeNav, setActiveNav] = useState("");

  const scrollToSection = (sectionId: string) => {
    setActiveNav(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const container = element.closest('.overflow-y-auto');
      if (container) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const ReviewBadge = ({ sectionId }: { sectionId: string }) => {
    if (!FEATURE_FLAGS.FEATURE_SEQUENTIAL_REPORT_REVIEW) return null;
    const isReviewed = currentReviewedReportSections.includes(sectionId);
    
    return (
      <button 
        onClick={() => toggleReview(sectionId)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer border transition-all duration-200",
          isReviewed ? "bg-secondary-balance text-secondary-balance-text border-secondary-balance-text" : "bg-white text-text-secondary border-divider"
        )}
      >
        <AnimatePresence mode="wait">
                 {isReviewed ? (
                   <motion.div
                     key="checked"
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.5, opacity: 0 }}
                   >
                     <CheckCircle2 size={16} className="text-secondary-balance-text" />
                   </motion.div>
           ) : (
             <motion.div key="unchecked">
               <Circle size={16} />
             </motion.div>
           )}
         </AnimatePresence>
         {isReviewed ? "Reviewed" : "Mark as reviewed"}
       </button>
     );
   };
  
  const sidebarContent = (
    <>
      <div className="px-5 py-6 border-b border-divider">
        <h2 className="m-0 text-[18px] font-medium text-text-primary">Navigation</h2>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        {currentReport.sections.map((section: any, idx: number) => (
          <div 
            key={idx}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "px-6 py-4 cursor-pointer transition-colors duration-200 border-l-4",
              activeNav === section.id ? "bg-primary-light border-primary" : "bg-transparent border-transparent"
            )}
          >
            <div className={cn(
              "text-[14px] leading-relaxed whitespace-pre-line",
              activeNav === section.id ? "text-primary font-medium" : "text-text-primary font-normal"
            )}>
              {section.title}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const mainContent = (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Banner */}
      <div className="p-8 bg-white border-b border-divider">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 bg-slate-50 rounded-xl border border-divider">
          <DataPoint label="Client Name" value="Liam Alexander O'Sullivan" />
          <DataPoint label="Date of Report" value="17 December 2025" />
          <DataPoint label="Report Type" value={currentReportType.label} />
          <DataPoint label="Clinician" value="Dr. O. P." />
          <DataPoint label="Status" value="Compliant" />
        </div>
      </div>

      <div className="flex flex-col px-10 py-6 bg-workspace-bg space-y-6">
        {currentReport.sections.map((section: any) => {
          const content = currentReport.content[section.id];
          if (!content) return null;
          
          return (
            <ReportSection 
              key={section.id} 
              id={section.id}
              title={section.title} 
              noCollapse
              reviewBadge={<ReviewBadge sectionId={section.id} />}
            >
              {section.type === 'text' && (
                <p className="m-0 text-[14px] text-text-secondary leading-relaxed">{content}</p>
              )}

              {section.type === 'list' && (
                <ul className="m-0 pl-5 text-[14px] leading-relaxed text-text-secondary list-disc">
                  {content.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}

              {section.type === 'insights' && (
                <div className="flex flex-col gap-4">
                  {content.map((item: any, i: number) => (
                    <DataPoint key={i} label={item.label} value={item.value} />
                  ))}
                </div>
              )}

              {section.type === 'snapshot' && (
                <>
                  <p className="m-0 mb-2 text-[13px] text-slate-600 italic">A summary of the current clinical snapshot of functioning.</p>
                  <p className="m-0 text-[14px] text-text-secondary leading-relaxed">{content}</p>
                </>
              )}

              {section.type === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.map((item: any, i: number) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="text-sm text-slate-700 font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'recommendations' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Targeted Findings</div>
                      <ul className="margin-0 pl-5 text-slate-600 text-sm leading-relaxed space-y-2 list-disc">
                        {content.steps.map((step: string, i: number) => <li key={i}>{step}</li>)}
                      </ul>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Information to Monitor</div>
                      <ul className="margin-0 pl-5 text-slate-600 text-sm leading-relaxed space-y-2 list-disc">
                        {content.info.map((info: string, i: number) => <li key={i}>{info}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Clinical Rationale</div>
                    <div className="text-sm text-slate-700 leading-relaxed italic">{content.reason}</div>
                  </div>
                </div>
              )}
            </ReportSection>
          );
        })}
      </div>
    </div>
  );

  return (
    <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
      <div className="pb-16">
      
      <WorkspaceLayout 
        title={
          <div className="relative inline-block">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded transition-colors group text-left"
            >
              <span>Report</span>
              <ChevronDown 
                size={20} 
                className={cn(
                  "text-text-secondary transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )} 
              />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 top-full mt-2 w-72 bg-white border border-divider rounded-xl shadow-xl z-50 overflow-hidden py-1"
                  >
                    {REPORT_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedReportType(type.id);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-[14px] transition-colors flex items-center justify-between",
                          selectedReportType === type.id ? "bg-primary-light text-primary font-medium" : "hover:bg-slate-50 text-text-primary"
                        )}
                      >
                        {type.label}
                        {selectedReportType === type.id && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        }
        subtitle={currentReportType.subtitle}
        headerActions={
          !FEATURE_FLAGS.FEATURE_SEQUENTIAL_REPORT_REVIEW && (
            <button 
              onClick={handleApprove}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[14px] font-medium rounded-lg hover:opacity-90 w-auto"
            >
              <DownloadIcon size={18} /> Download Report
            </button>
          )
        }
        subHeaderContent={FEATURE_FLAGS.FEATURE_SEQUENTIAL_REPORT_REVIEW && (
          <ProgressBanner
            title="Report Quality Review"
            subtitle={`Review all ${currentReport.sections.length} sections to enable approval and download`}
            current={currentReviewedReportSections.length}
            total={currentReport.sections.length}
            progressLabel="Sections Reviewed"
            actionLabel="Approve and Download"
            actionIcon={DownloadIcon}
            onAction={handleApprove}
            isActionActive={isAllReviewed}
            className="mb-6"
          />
        )}
        sidebarWidth={280}
        sidebarContent={sidebarContent}
        mainContent={mainContent}
      />
      <CompletenessWarningModal 
        isOpen={showCompletenessModal}
        onClose={() => setShowCompletenessModal(false)}
        onConfirm={() => proceedWithDownload(true)}
        missingItems={missingEvidence}
      />
      
      <Modal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        title="Analytical Review Pause"
        width={550}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowPauseModal(false)}>
              Back to Report
            </Button>
            <Button variant="brand" onClick={() => proceedWithDownload(true)} disabled={pauseCountdown > 0}>
              {pauseCountdown > 0 ? `Wait ${pauseCountdown}s...` : "Confirm & Finalize"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-900 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <AlertTriangle size={24} className="text-slate-900" />
                <Typography variant="body" className="font-semibold text-slate-900">Reviewing Contradictory Evidence</Typography>
            </div>
            
            <Typography variant="body" className="text-slate-600 leading-relaxed">
                Before finalizing this report, the system requires an analytical pause to ensure you have considered these potentially contradictory data points:
            </Typography>

            <div className="space-y-3">
                {conflicts.length > 0 ? conflicts.map(conflict => (
                    <div key={conflict.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <Typography variant="body-sm" className="text-slate-700">{conflict.description}</Typography>
                    </div>
                )) : (
                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3 italic text-slate-500">
                        No critical conflicts identified, but systemic verification is required.
                    </div>
                )}
            </div>

            <Typography variant="body-sm" className="text-slate-400 italic">
                Regulatory Compliance: HF-001 (Analytical Forcing Function)
            </Typography>
        </div>
      </Modal>
    </div>
  </AssessmentGate>
  );
}
