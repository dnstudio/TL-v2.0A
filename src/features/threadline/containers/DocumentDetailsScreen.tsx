/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  Download,
  Share2,
  FileText,
  History,
  Info,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  Button,
  Card,
  Typography,
  Badge,
  Separator,
  Avatar,
  DataPoint,
  Input,
  Modal,
} from "@ui/index";
import { EntityCard, DetailViewLayout } from "../components";
import { EvidenceCard } from "../components/EvidenceCard";
import { StatusBadge } from "@shared/StatusBadge";
import { CreateClinicalEvidenceModal } from "../modals";
import { cn } from "@lib/utils";
import { MOCK_EVIDENCE_ITEMS } from "../mockData";
import { Plus as AddIcon } from "lucide-react";

import { useClinicalStore } from "@/services/store";
import { useAppStore } from "@/services/store";

interface DocumentDetailsScreenProps {
  document: any;
  onBack: () => void;
}

export function DocumentDetailsScreen({
  document,
  onBack,
}: DocumentDetailsScreenProps) {
  if (!document) return null;
  const { activeClientId } = useAppStore();
  const setDocuments = useClinicalStore(state => state.setDocuments);
  const clinicalDocuments = useClinicalStore(state => state.documents[activeClientId || ""]) || [];
  const currentDocFromStore = clinicalDocuments.find(d => d.id === document.id);

  const [activeTabEvidence, setActiveTabEvidence] =
    React.useState("Evidence");
  const [isEditingNarrative, setIsEditingNarrative] = React.useState(false);
  const [narrativeSummary, setNarrativeSummary] = React.useState(currentDocFromStore?.description || document.description ||
    "The clinical analysis confirms consistent observations of neurodivergent traits. The report highlights significant overlaps in tactile hypersensitivity and social communication challenges, particularly in structured educational settings.");
  
  const [localEvidence, setLocalEvidence] = React.useState<any[]>(currentDocFromStore?.findings || document.findings || []);

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = React.useState(false);
  const [evidenceInitialText, setEvidenceInitialText] = React.useState("");
  const [editingEvidenceItem, setEditingEvidenceItem] =
    React.useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(
    null,
  );
  const [highlightedChunkId, setHighlightedChunkId] = React.useState<
    string | null
  >(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let initialFindings: any[] = currentDocFromStore?.findings || document.findings || [];
    if (initialFindings.length === 0) {
      const evidenceItem = MOCK_EVIDENCE_ITEMS.find(ei => {
        if (!ei.label || !document.name) return false;
        const labelLower = ei.label.toLowerCase();
        const nameLower = document.name.toLowerCase();
        return (
          ei.id === document.id || 
          labelLower === nameLower ||
          (nameLower.includes("school") && labelLower.includes("school")) ||
          (nameLower.includes("letter") && labelLower.includes("letter")) ||
          (nameLower.includes("medical") && labelLower.includes("medical"))
        );
      });
      if (evidenceItem && evidenceItem.findings) {
        initialFindings = evidenceItem.findings;
      }
    }
    setLocalEvidence(initialFindings);
  }, [document, currentDocFromStore]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [evidenceInitialPageRef, setEvidenceInitialPageRef] =
    React.useState("");
  const [evidenceInitialChunkId, setEvidenceInitialChunkId] =
    React.useState("");
  const [evidenceInitialPage, setEvidenceInitialPage] = React.useState(1);

  const allDocumentChunks = [
    {
      id: "chunk-1",
      text: "**1. CLINICAL BACKGROUND & REFERRAL**\n\nThe patient, 14-year-old male, was referred for a comprehensive neurodevelopmental evaluation following concerns raised by his academic tutors and primary care physician. Initial screening indicated potential overlap between:\n\n• Sensory processing issues\n• Social-emotional regulation difficulties\n• Executive function deficits",
      page: 1,
      ref: "p. 1",
    },
    {
      id: "chunk-2",
      text: "**2. DEVELOPMENTAL HISTORY**\n\n- Early developmental milestones were within expected ranges for gross motor skills.\n- Language development showed a notable plateau between ages 24 and 36 months.\n- Subsequent resolution was noted following early intervention services (speech therapy).",
      page: 1,
      ref: "p. 1",
    },
    {
      id: "chunk-3",
      text: "**3. EDUCATIONAL OBSERVATIONS & CLASSROOM DYNAMICS**\n\n### 3.1 ATTENTION & TRANSITIONS\nDuring the classroom observation, the student demonstrated significant difficulty in maintaining attention during transitions between high-interest activities (e.g., computer science) and group-based projects. \n\n### 3.2 PEER INTERACTION\nThe preschool records indicate that social communication challenge was a primary barrier to peer engagement. Teachers noted that he often preferred solitary play or parallel play over collaborative games.",
      page: 2,
      ref: "p. 2",
    },
    {
      id: "chunk-4",
      text: "**4. SENSORY DOMAIN ASSESSMENT**\n\nThe sensory domain assessment revealed a complex pattern of seeking and avoidant behaviors. Specifically, tactile hypersensitivity to textures was rated as 'Severe' on the standardized adult/adolescent sensory profile.\n\n> *\"The medical exam noted several instances of autonomic arousal when subjected to unanticipated loud noises in the clinical environment.\"*",
      page: 3,
      ref: "p. 3",
    },
    {
      id: "chunk-5",
      text: "**5. EMOTIONAL REGULATION & BEHAVIORAL PROFILE**\n\nFindings from the BASC-3 parent rating scales suggest clinically significant levels of anxiety and a tendency towards social withdrawal when stressed in social environments.\n\nObservations suggest a pattern of sensory seeking behavior that is particularly evident during structured tasks.\n\n- Avoidance of crowded spaces\n- Self-soothing through repetitive tasks",
      page: 4,
      ref: "p. 4",
    },
    {
      id: "chunk-6",
      text: "**6. FUNCTIONAL ASSESSMENT & DIAGNOSTIC SUMMARY**\n\nFunctional assessment shows that while the patient has strong academic performance in specialized subjects, his overall social competence is hindered by:\n\n1. Difficulties in perspective-taking\n2. Understanding non-verbal cues\n3. Rapid escalation during sensory overload",
      page: 5,
      ref: "p. 5",
    },
    {
      id: "chunk-7",
      text: "### CLINICAL INTERVIEW DATA\nClinical interview with the parents highlights significant tactile hypersensitivity. The child frequently removes clothing due to discomfort with seams and textures, which has been consistent over several years.",
      page: 5,
      ref: "p. 5",
    },
    {
      id: "chunk-8",
      text: "**7. FAMILY & GENETIC HISTORY**\n\nDetailed family history collection reveals a positive history for neurodevelopmental conditions, with an immediate family member previously diagnosed with Autism Spectrum Disorder (ASD).",
      page: 9,
      ref: "p. 9",
    },
    {
      id: "chunk-9",
      text: "**8. ADOS-2 OBSERVATIONS**\n\nObservation during the ADOS-2 assessment shows limited use of eye contact and reduced range of facial expressions. The patient frequently uses repetitive vocalizations when focused on high-interest objects.",
      page: 12,
      ref: "p. 12",
    },
  ];

  const totalPages = Math.max(...allDocumentChunks.map((c) => c.page));

  const filteredChunks = searchQuery
    ? allDocumentChunks.filter((c) =>
        c.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allDocumentChunks.filter((c) => c.page === currentPage);

  const formatText = (text: string) => {
    // Simple markdown-like formatter
    return text.split("\n").map((line, i) => {
      // Bold items
      let formattedLine = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-bold text-slate-900">$1</strong>',
      );

      // Inline highlights (clinical terms)
      formattedLine = formattedLine.replace(
        /'(.*?)'/g,
        '<span class="bg-primary/5 px-1 rounded text-primary border border-primary/10">$1</span>',
      );

      // Headings
      if (line.startsWith("### ")) {
        return (
          <Typography
            key={i}
            variant="label-micro"
            className="block text-primary/70 font-bold mb-1 mt-3"
            dangerouslySetInnerHTML={{
              __html: formattedLine.replace("### ", ""),
            }}
          />
        );
      }

      // Bullets
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-2 pl-2 mb-1">
            <span className="text-primary/40">•</span>
            <Typography
              variant="body"
              className="text-text-primary text-[14px]"
              dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }}
            />
          </div>
        );
      }

      // Blockquote
      if (line.startsWith("> ")) {
        return (
          <div key={i} className="pl-4 border-l-2 border-slate-200 italic my-2">
            <Typography
              variant="body"
              className="text-slate-600 text-[14px]"
              dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }}
            />
          </div>
        );
      }

      // Numbered lists
      if (/^\d+\./.test(line)) {
        return (
          <div key={i} className="flex gap-2 pl-2 mb-1">
            <span className="text-primary/40 font-mono text-xs">
              {line.split(".")[0]}.
            </span>
            <Typography
              variant="body"
              className="text-text-primary text-[14px]"
              dangerouslySetInnerHTML={{
                __html: formattedLine.substring(formattedLine.indexOf(".") + 1),
              }}
            />
          </div>
        );
      }

      return (
        <Typography
          key={i}
          variant="body"
          className="text-text-primary leading-relaxed text-[15px] mb-2"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  const handleOpenEvidenceModal = (chunk: any) => {
    setEvidenceInitialText(chunk.text);
    setEvidenceInitialPageRef(chunk.ref);
    setEvidenceInitialChunkId(chunk.id);
    setEvidenceInitialPage(chunk.page);
    setEditingEvidenceItem(null);
    setIsEvidenceModalOpen(true);
  };

  const handleEditEvidenceModal = (item: any) => {
    setEditingEvidenceItem(item);
    setIsEvidenceModalOpen(true);
  };

  const handleDeleteEvidence = (id: string) => {
    const updated = localEvidence.filter((e: any) => e.id !== id);
    setLocalEvidence(updated);

    if (activeClientId && currentDocFromStore) {
      const updatedDocs = clinicalDocuments.map(d => 
        d.id === document.id ? { ...d, findings: updated } : d
      );
      setDocuments(activeClientId, updatedDocs);
    }
  };

  const handleCreateEvidence = (newEvidence: any) => {
    let updated;
    if (editingEvidenceItem) {
      updated = localEvidence.map((e: any) =>
        e.id === newEvidence.id ? newEvidence : e,
      );
    } else {
      updated = [newEvidence, ...localEvidence];
    }
    setLocalEvidence(updated);

    if (activeClientId && currentDocFromStore) {
      const updatedDocs = clinicalDocuments.map(d => 
        d.id === document.id ? { ...d, findings: updated } : d
      );
      setDocuments(activeClientId, updatedDocs);
    }
    setIsEvidenceModalOpen(false);
  };

  React.useEffect(() => {
    if (highlightedChunkId) {
      const scrollWithRetry = (retries = 0) => {
        const element = window.document.getElementById(highlightedChunkId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (retries < 20) {
          setTimeout(() => scrollWithRetry(retries + 1), 50);
        }
      };
      scrollWithRetry();
    }
  }, [highlightedChunkId]);

  return (
    <DetailViewLayout
      onBack={onBack}
      backLabel="Back to Documents"
      title={document.name}
      subtitle={
        <Typography variant="mono-label" className="text-[13px] text-text-secondary">
          {document.id ||
            `DOC-${Math.random().toString(36).substring(7).toUpperCase()}`}{" "}
          • Uploaded on {document.uploadDate || "Jan 12, 2026"}
        </Typography>
      }
      headerBadges={
        <>
          <StatusBadge status={document.status.toLowerCase() as any} />
          <Badge
            variant="soft"
            className="bg-blue-100 text-blue-800 border-none font-bold text-[10px] uppercase tracking-wider"
          >
            {document.type}
          </Badge>
        </>
      }
      headerActions={
        <>
          <Button variant="outline" size="sm" icon={<Share2 size={16} />}>
            Share
          </Button>
          <Button
            variant="brand"
            className="shrink-0"
            icon={<Download size={18} />}
          >
            Download Document
          </Button>
        </>
      }
      metaBanner={[
        {
          label: "Patient Name",
          value: document.clientName || "Unknown Patient",
        },
        { label: "Document Type", value: document.type || "Clinical Report" },
        { label: "Source System", value: "EMR Core - Clinical Port" },
        { label: "Compliance", value: "HIPAA Compliant" },
      ]}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Document Content */}
        <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
          <Card className="p-0 border-divider overflow-hidden flex flex-col flex-1 min-h-0 bg-white">
            <div className="p-4 border-b border-divider bg-slate-50/50 flex flex-col gap-4 shrink-0">
              <div className="flex justify-between items-center">
                <Typography
                  variant="label-micro"
                  className="text-text-secondary uppercase font-bold tracking-wider"
                >
                  Document Transcript / Text
                </Typography>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 border border-divider rounded-lg bg-white p-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || !!searchQuery}
                      className="p-1 hover:bg-slate-50 disabled:opacity-30 transition-colors rounded"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-bold px-2 min-w-[60px] text-center">
                      {searchQuery
                        ? "SEARCH"
                        : `PAGE ${currentPage} / ${totalPages}`}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages || !!searchQuery}
                      className="p-1 hover:bg-slate-50 disabled:opacity-30 transition-colors rounded"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={14}
                />
                <Input
                  placeholder="Search within clinical document..."
                  className="pl-9 h-9 bg-white text-xs border-divider focus:border-primary/30"
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div
              ref={containerRef}
              className="p-8 overflow-y-auto flex-1 space-y-4 bg-white selection:bg-primary/10 scroll-smooth"
            >
              {filteredChunks.length > 0 ? (
                filteredChunks.map((chunk, idx) => (
                  <motion.div
                    key={idx}
                    id={chunk.id}
                    initial={false}
                    animate={highlightedChunkId === chunk.id ? {
                      backgroundColor: ["rgba(6, 48, 44, 0)", "rgba(6, 48, 44, 0.15)", "rgba(6, 48, 44, 0.03)"],
                      scale: [1, 1.02, 1],
                      transition: { duration: 0.8, times: [0, 0.2, 1] }
                    } : { backgroundColor: "rgba(6, 48, 44, 0)", scale: 1 }}
                    className={cn(
                      "relative group/chunk pl-6 border-l-2 transition-all p-4 rounded-xl border-2 border-transparent",
                      highlightedChunkId === chunk.id
                        ? "border-primary/40 bg-primary/[0.03] ring-1 ring-primary/10 ring-inset shadow-md z-10"
                        : "border-transparent hover:border-primary/10",
                    )}
                  >
                    <div className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-transparent group-hover/chunk:bg-primary/20 transition-all" />
                    <div className="space-y-2 pr-10 relative">
                      <div className="flex items-center">
                        <Typography
                          variant="label-micro"
                          className="text-slate-400 font-mono italic"
                        >
                          {chunk.ref}
                        </Typography>
                      </div>
                      <div className="space-y-1">
                        {searchQuery ? (
                          <Typography
                            variant="body"
                            className="text-text-primary leading-relaxed text-[15px]"
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: chunk.text.replace(
                                  new RegExp(`(${searchQuery})`, "gi"),
                                  '<mark class="bg-amber-200 text-amber-900 px-0.5 rounded">$1</mark>',
                                ),
                              }}
                            />
                          </Typography>
                        ) : (
                          formatText(chunk.text)
                        )}
                      </div>

                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-center">
                        <button
                          onClick={() => handleOpenEvidenceModal(chunk)}
                          className="p-1.5 rounded-md text-slate-300 hover:text-primary hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20"
                          title="Create Evidence Finding"
                        >
                          <AddIcon size={18} />
                        </button>
                        {localEvidence.find(
                          (e: any) => e.chunkId === chunk.id,
                        ) && (
                          <button
                            onClick={() =>
                              handleEditEvidenceModal(
                                localEvidence.find(
                                  (e: any) => e.chunkId === chunk.id,
                                ),
                              )
                            }
                            className="p-1.5 rounded-md text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-emerald-100 hover:border-emerald-200"
                            title="Edit Existing Evidence"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-24 text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-slate-50 rounded-full mb-4">
                    <Search size={32} className="text-slate-300" />
                  </div>
                  <Typography variant="h3" className="text-slate-400">
                    No matches found
                  </Typography>
                  <Typography variant="body-sm" className="text-slate-500">
                    Try searching for a different clinical term or concept.
                  </Typography>
                </div>
              )}

              {!searchQuery && (
                <div className="pt-12 pb-24 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-divider text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {currentPage === totalPages
                      ? "End of Document Content"
                      : `Continue to Page ${currentPage + 1}`}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Narrative Summary & History */}
        <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
          <Card className="p-0 border-divider overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-divider bg-slate-50/50 flex justify-between items-center whitespace-nowrap overflow-x-auto no-scrollbar">
              <div className="flex gap-4">
                {["Summary", "Evidence"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabEvidence(tab)}
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider transition-colors",
                      activeTabEvidence === tab
                        ? "text-primary border-b-2 border-primary pb-1"
                        : "text-text-disabled hover:text-text-secondary",
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {activeTabEvidence === "Summary" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 px-2 hover:bg-primary/5", isEditingNarrative ? "text-primary bg-primary/10" : "text-text-secondary hover:text-primary")}
                    onClick={() => setIsEditingNarrative(!isEditingNarrative)}
                  >
                    <Edit2 size={14} />
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {activeTabEvidence === "Summary" && (
                <div className="space-y-4">
                  {isEditingNarrative ? (
                    <textarea 
                      className="w-full text-sm text-text-primary leading-relaxed bg-white p-4 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px] resize-y" 
                      value={narrativeSummary}
                      onChange={(e) => setNarrativeSummary(e.target.value)}
                    />
                  ) : (
                    <Typography
                      variant="body"
                      className="text-text-primary leading-relaxed whitespace-pre-wrap"
                    >
                      {narrativeSummary}
                    </Typography>
                  )}

                  {isEditingNarrative && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-divider mt-4">
                       <Button variant="outline" size="sm" onClick={() => setIsEditingNarrative(false)}>Reset</Button>
                       <Button variant="brand" size="sm" onClick={() => {
                         if (document && activeClientId) {
                           document.description = narrativeSummary;
                           useClinicalStore.getState().updateDocument(activeClientId, document.id, {
                             description: narrativeSummary
                           });
                         }
                         setIsEditingNarrative(false);
                       }}>Save Summary</Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-divider">
                    <div className="space-y-1">
                      <Typography
                        variant="label-micro"
                        className="text-text-secondary uppercase"
                      >
                        Clinical Mappings
                      </Typography>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge
                          variant="soft"
                          className="bg-slate-100 text-slate-800 border-none"
                        >
                          Social-Emotional
                        </Badge>
                        <Badge
                          variant="soft"
                          className="bg-slate-100 text-slate-800 border-none"
                        >
                          Sensory Processing
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTabEvidence === "Evidence" && (
                <div className="space-y-4">
                  {localEvidence.map((finding: any) => (
                    <EvidenceCard
                      key={finding.id}
                      evidence={finding}
                      onEdit={handleEditEvidenceModal}
                      onDelete={(id) => setDeleteConfirmId(id)}
                      context="document"
                      onClick={() => {
                        if (finding.chunkId) {
                          if (finding.page) {
                            setCurrentPage(finding.page);
                          }
                          setHighlightedChunkId(finding.chunkId);
                          // Clear highlight after a few seconds
                          setTimeout(() => setHighlightedChunkId(null), 3000);
                        }
                      }}
                    />
                  ))}
                  {localEvidence.length === 0 && (
                    <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-divider">
                      <Typography
                        variant="label-micro"
                        className="text-text-disabled uppercase font-bold"
                      >
                        No evidence findings created
                      </Typography>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>


        </div>
      </div>

      <CreateClinicalEvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onCreate={handleCreateEvidence}
        initialText={evidenceInitialText}
        initialReference={evidenceInitialPageRef}
        initialChunkId={evidenceInitialChunkId}
        initialPage={evidenceInitialPage}
        editingItem={editingEvidenceItem}
        context="document"
      />

      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Evidence"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                if (deleteConfirmId) handleDeleteEvidence(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
            >
              Delete
            </Button>
          </>
        }
        width={400}
      >
        <div className="py-4">
          <Typography variant="body" className="text-slate-600">
            Are you sure you want to delete this clinical evidence? This action
            cannot be undone.
          </Typography>
        </div>
      </Modal>
    </DetailViewLayout>
  );
}
