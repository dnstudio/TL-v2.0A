/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Check, 
  AlertTriangle, 
  Info, 
  X,
  FileText,
  Activity,
  User,
  MoreVertical,
  ArrowRight,
  Bell,
  Mail,
  Filter,
  Download,
  Calendar,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Keyboard,
  MousePointer2,
  Accessibility,
  AlertCircle,
  Code,
  Layout,
  Type,
  Database,
  Grid,
  Layers,
  Compass,
  CheckCircle2,
  Network,
  Route,
  BarChart3
} from "lucide-react";

import { WorkspaceAlertsProvider } from "../../contexts/WorkspaceAlertsContext";

// Raw Source Imports
import ButtonRaw from "../ui/Button.tsx?raw";
import BadgeRaw from "../ui/Badge.tsx?raw";
import AvatarRaw from "../ui/Avatar.tsx?raw";
import TypographyRaw from "../ui/Typography.tsx?raw";
import InputRaw from "../ui/Input.tsx?raw";
import TextareaRaw from "../ui/Textarea.tsx?raw";
import SelectRaw from "../ui/Select.tsx?raw";
import SearchableSelectRaw from "../ui/SearchableSelect.tsx?raw";
import CheckboxRaw from "../ui/Checkbox.tsx?raw";
import SwitchRaw from "../ui/Switch.tsx?raw";
import LabelRaw from "../ui/Label.tsx?raw";
import SeparatorRaw from "../ui/Separator.tsx?raw";
import CardRaw from "../ui/Card.tsx?raw";
import ModalRaw from "../ui/Modal.tsx?raw";
import ToastRaw from "../ui/Toast.tsx?raw";
import ProgressRaw from "../ui/Progress.tsx?raw";
import SkeletonRaw from "../ui/Skeleton.tsx?raw";
import TabsRaw from "../ui/Tabs.tsx?raw";
import TableFooterRaw from "../ui/TableFooter.tsx?raw";
import DataPointRaw from "../ui/DataPoint.tsx?raw";
import CollapsibleSectionRaw from "../ui/CollapsibleSection.tsx?raw";

import StatusBadgeRaw from "../shared/StatusBadge.tsx?raw";
import ConfidenceBadgeRaw from "../shared/ConfidenceBadge.tsx?raw";
import RelevanceBadgeRaw from "../shared/RelevanceBadge.tsx?raw";
import ImpactBadgeRaw from "../shared/ImpactBadge.tsx?raw";
import SysBadgeRaw from "../shared/SysBadge.tsx?raw";
import EmptyStateRaw from "../shared/EmptyState.tsx?raw";
import FileTypeBadgeRaw from "../shared/FileTypeBadge.tsx?raw";
import SectionHeaderRaw from "../shared/SectionHeader.tsx?raw";

import AssessmentCardRaw from "../../features/threadline/components/AssessmentCard.tsx?raw";
import EvidenceCardRaw from "../../features/threadline/components/EvidenceCard.tsx?raw";
import EntityCardRaw from "../../features/threadline/components/EntityCard.tsx?raw";
import ReviewItemRaw from "../../features/threadline/components/ReviewItem.tsx?raw";
import ReviewCategoryRaw from "../../features/threadline/components/EvidenceWorkspaceComponents.tsx?raw";
import BreadcrumbsRaw from "../../features/threadline/components/Breadcrumbs.tsx?raw";
import ProgressBannerRaw from "../../features/threadline/components/ProgressBanner.tsx?raw";
import DetailViewLayoutRaw from "../../features/threadline/components/DetailViewLayout.tsx?raw";
import InterpRowRaw from "../../features/threadline/components/InterpRow.tsx?raw";
import ReportSectionRaw from "../../features/threadline/components/ReportSection.tsx?raw";
import EvidenceWorkspaceCTAsRaw from "../../features/threadline/components/EvidenceWorkspaceCTAs.tsx?raw";
import WorkspaceStatusBarRaw from "../../features/threadline/components/WorkspaceStatusBar.tsx?raw";
import TabBarRaw from "../../features/threadline/components/TabBar.tsx?raw";
import ThreadlineNavbarRaw from "../../features/threadline/components/ThreadlineNavbar.tsx?raw";
import AssessmentGateRaw from "../../features/threadline/components/AssessmentGate.tsx?raw";
import AccordionTagsRaw from "../../features/threadline/components/AccordionTags.tsx?raw";
import ClinicalNotesSidebarRaw from "../../features/threadline/components/ClinicalNotesSidebar.tsx?raw";
import AssessmentCompareSidebarRaw from "../../features/threadline/components/AssessmentCompareSidebar.tsx?raw";
import BaseCardRaw from "../ui/BaseCard.tsx?raw";
import LogoRaw from "../shared/Logo.tsx?raw";
import ConflictResolutionModalRaw from "../../features/threadline/modals/ConflictResolutionModal.tsx?raw";
import FilterBarRaw from "../../features/conditions/FilterBar.tsx?raw";
import ConditionTableRaw from "../../features/conditions/ConditionTable.tsx?raw";
import AlertRaw from "../ui/Alert.tsx?raw";

import ListViewTemplateRaw from "./templates/ListViewTemplate.tsx?raw";
import DetailViewTemplateRaw from "./templates/DetailViewTemplate.tsx?raw";
import WorkspaceTemplateRaw from "./templates/WorkspaceTemplate.tsx?raw";
import FormTemplateRaw from "./templates/FormTemplate.tsx?raw";

// UI Components
import { 
  Button, 
  Badge, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Typography, 
  Input, 
  Select, 
  Modal,
  Tabs,
  Separator,
  Avatar,
  Progress,
  Skeleton,
  Switch,
  Checkbox,
  DataPoint,
  Label,
  Textarea,
  SearchableSelect,
  TableFooter
} from "../ui";

import { CollapsibleSection } from "../ui/CollapsibleSection";
import { Toast } from "../ui/Toast";

// Shared Components
import { StatusBadge } from "../shared/StatusBadge";
import { ConfidenceBadge } from "../shared/ConfidenceBadge";
import { RelevanceBadge } from "../shared/RelevanceBadge";
import { ImpactBadge } from "../shared/ImpactBadge";
import { SysBadge } from "../shared/SysBadge";
import { EmptyState } from "../shared/EmptyState";
import { FileTypeBadge } from "../shared/FileTypeBadge";
import { SectionHeader } from "../shared/SectionHeader";

// Feature Components
import { AssessmentCard, EntityCard, ReviewItem, Breadcrumbs, DetailViewLayout, InterpRow, ReportSection, EvidenceWorkspaceCTAs, WorkspaceStatusBar, TabBar, AssessmentGate, ClinicalNotesSidebar, AssessmentCompareSidebar } from "../../features/threadline/components";
import { EvidenceCard } from "../../features/threadline/components/EvidenceCard";
import { ReviewCategory } from "../../features/threadline/components/EvidenceWorkspaceComponents";
import { ThreadlineNavbar } from "../../features/threadline/components/ThreadlineNavbar";
import { AccordionTags } from "../../features/threadline/components/AccordionTags";
import { BaseCard } from "../ui/BaseCard";
import { Logo } from "../shared/Logo";
import { ProgressBanner } from "../../features/threadline/components/ProgressBanner";
import { ConflictResolutionModal } from "../../features/threadline/modals/ConflictResolutionModal";
import { FilterBar } from "../../features/conditions/FilterBar";
import { ConditionTable } from "../../features/conditions/ConditionTable";
import { Alert } from "../ui/Alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Templates
import { ListViewTemplate } from "./templates/ListViewTemplate";
import { DetailViewTemplate } from "./templates/DetailViewTemplate";
import { WorkspaceTemplate } from "./templates/WorkspaceTemplate";
import { FormTemplate } from "./templates/FormTemplate";

import { cn } from "../../lib/utils";

interface PropEntry {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface ComponentShowcaseProps {
  name: string;
  description: string;
  preview: React.ReactNode;
  props: PropEntry[];
  usability: string[];
  accessibility: string[];
  keyboard: string[];
  antipatterns: string[];
  sourceCode: string;
}

interface TemplateShowcaseProps {
  name: string;
  description: string;
  preview: React.ReactNode;
  sourceCode: string;
}

const UserJourneyDocumentation = () => {
  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <Typography variant="h2" className="text-primary italic tracking-tight">Clinical Decision Loop</Typography>
        <Typography variant="sub" className="text-slate-600 max-w-3xl">
          The Threadline platform facilitates a strict state-based lifecycle for clinical evidence, ensuring rigorous validation through the transition from raw data to finalized diagnostic reports.
        </Typography>
      </div>

      {/* Cognitive Loop Progress */}
      <div className="space-y-6">
        <Typography variant="label" className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">The 6-Step Cognitive Loop</Typography>
        <div className="flex flex-wrap gap-2">
          {[
            "1. Evidence Review",
            "2. Reliability Evaluation",
            "3. Conflict Resolution",
            "4. Hypothesis Formation",
            "5. Uncertainty Assessment",
            "6. Decision & Output"
          ].map((text, i) => (
            <div key={i} className="px-4 py-2 bg-white border border-divider rounded-full text-[11px] font-bold text-slate-600 shadow-sm flex items-center gap-2">
              <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-400">{i + 1}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Visual Journey */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        <div className="hidden md:block absolute top-[60px] left-0 w-full h-px bg-slate-100 z-0" />
        
        {[
          { icon: <Database size={20} />, title: "Discovery", desc: "Sessions, Assessments & Documents categorized as Neutral Discovery.", color: "bg-slate-50 text-slate-400" },
          { icon: <CheckCircle2 size={20} />, title: "Mapping", desc: "Items are validated via Accepted, Declined, or Deferred states.", color: "bg-primary-light text-primary" },
          { icon: <Activity size={20} />, title: "Analysis", desc: "Hypothesis framing and clinical synthesis in the Analysis hub.", color: "bg-primary text-white shadow-brand" },
          { icon: <FileText size={20} />, title: "Report", desc: "Final clinical output audited for completeness and authorized.", color: "bg-workspace-bg border border-divider text-slate-600" }
        ].map((step, i) => (
          <div key={i} className="relative z-10 p-6 bg-white border border-divider rounded-2xl shadow-sm space-y-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color}`}>
              {step.icon}
            </div>
            <div className="space-y-1">
              <Typography variant="h4" className="text-slate-900">{step.title}</Typography>
              <Typography variant="caption" className="text-slate-500 leading-relaxed font-medium">{step.desc}</Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Typography variant="h3" className="flex items-center gap-2">
            <Route className="text-primary" size={20} />
            Transition Logic & Gating
          </Typography>
          
          <div className="space-y-6">
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-divider shadow-sm">
              <div className="w-1 bg-primary/20 rounded-full shrink-0" />
              <div className="space-y-2">
                <Typography variant="label" className="text-primary uppercase tracking-widest italic">Evidence Hub → Analysis</Typography>
                <Typography variant="body" className="text-slate-600 leading-relaxed text-sm">
                  <span className="font-bold text-slate-900">The Completion Gate:</span> Transition is blocked if any primary session is <span className="text-amber-600 font-bold">Deferred</span>. All active artifacts must be either Accepted or Rejected with rationale to achieve "Review Completeness."
                </Typography>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-divider shadow-sm">
              <div className="w-1 bg-primary/20 rounded-full shrink-0" />
              <div className="space-y-2">
                <Typography variant="label" className="text-primary uppercase tracking-widest italic">Analysis → Report Construction</Typography>
                <Typography variant="body" className="text-slate-600 leading-relaxed text-sm">
                   <span className="font-bold text-slate-900">Cognitive Gating:</span> Clinicians must submit their own hypothesis <span className="italic">before</span> system-generated insights are revealed to mitigate automation bias. Setting <span className="bg-slate-100 px-1.5 rounded font-mono text-[10px]">impressionFormulated=true</span> unlocks the builder.
                </Typography>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-divider shadow-sm">
              <div className="w-1 bg-primary/20 rounded-full shrink-0" />
              <div className="space-y-2">
                <Typography variant="label" className="text-primary uppercase tracking-widest italic">Final Download Gate</Typography>
                <Typography variant="body" className="text-slate-600 leading-relaxed text-sm">
                   A 5-point Sequential Review Gate (Formulation, Evidence, Caveats, Next Steps, Missing Info) must be 100% complete before the PDF synthesis engine is authorized to run.
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-2xl p-8 space-y-6 text-white shadow-xl">
            <Typography variant="h3" className="flex items-center gap-2 text-white italic">
              <Network className="text-primary" size={20} />
              Decision States
            </Typography>
            
            <div className="space-y-4">
              {[
                { label: "Accepted", desc: "Clinician validates artifact for inclusion in synthesis.", status: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                { label: "Declined", desc: "Artifact is discounted. Requires mandatory clinical rationale.", status: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
                { label: "Deferred", desc: "Temporary state signaling a need for further context/sessions.", status: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                { label: "Neutral", desc: "The default state for newly discovered or uploaded data.", status: "bg-slate-500/10 text-slate-400 border-slate-500/20" }
              ].map((state, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="space-y-1">
                    <Typography variant="label" className="text-white">{state.label}</Typography>
                    <Typography variant="caption" className="text-slate-400 font-medium">{state.desc}</Typography>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${state.status}`}>
                    {state.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-4">
            <Typography variant="h4" className="text-primary italic">Clinical Integrity Audit</Typography>
            <Typography variant="caption" className="text-slate-600 leading-relaxed">
              Threadline compares <span className="font-bold">acceptedMappings</span> against the report configuration. If evidence is accepted but not technical mapped to a report section, a <span className="text-primary underline">Completeness Warning</span> is triggered to ensure no diagnostic evidence is orphaned.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserStoriesDocumentation = () => {
  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <Typography variant="h2" className="text-primary italic tracking-tight">User Stories & Acceptance Criteria</Typography>
        <Typography variant="sub" className="text-slate-500 max-w-3xl font-medium">
          Detailed behavioral specifications for the core clinical workflows, defined to ensure safety and regulatory compliance.
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {[
          {
            id: "us-01",
            title: "Evidence Validation Hub",
            story: "As a Clinician, I want to evaluate raw artifacts so that I can map validated evidence to the diagnostic framework.",
            ac: [
              "System must require a mandatory text rationale when an artifact is transitioned to the 'Declined' state.",
              "Deferred items must successfully block the 'Proceed to Analysis' gate until resolution.",
              "The Review Queue must track 'Completion Percentage' based on unique session IDs handled."
            ]
          },
          {
            id: "us-02",
            title: "Hypothesis Synthesis",
            story: "As a Clinician, I want to record my own clinical hypothesis before viewing system-generated insights to mitigate automation bias.",
            ac: [
              "Insights panel must remain in a 'Locked' or 'Blurred' state until a hypothesis string length > 0 is detected.",
              "The system must offer a list of 'Accepted Mappings' as context for the clinician's manual framing.",
              "Formulated impressions must set the internal state 'impressionReady' to enable report construction."
            ]
          },
          {
            id: "us-03",
            title: "Report Authorization",
            story: "As a Senior Clinician, I want to audit the synthesized report across five critical safety sections before finalizing for download.",
            ac: [
              "The 'Download PDF' button must remain disabled until all 5 gates (Formulation, Evidence, Caveats, Next Steps, Missing Info) are checked.",
              "System must trigger a 'Completeness Warning' if any 'Accepted' evidence is not technically referenced in the output.",
              "Export operations must log the timestamp, user ID, and report version to the immutable Audit Trail."
            ]
          }
        ].map((story, i) => (
          <div key={i} className="bg-white border border-divider rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="md:w-80 p-8 bg-slate-50/50 border-r border-divider space-y-4">
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary text-white rounded text-[10px] font-bold uppercase tracking-widest leading-none">
                {story.id}
              </div>
              <Typography variant="h3" className="text-slate-900">{story.title}</Typography>
              <div className="p-4 bg-white border border-divider rounded-xl italic text-[11px] text-slate-500 leading-relaxed font-medium">
                "{story.story}"
              </div>
            </div>
            <div className="flex-1 p-8 space-y-6">
              <Typography variant="label" className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Acceptance Criteria</Typography>
              <div className="space-y-3">
                {story.ac.map((item, j) => (
                  <div key={j} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100/50">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <Typography variant="body" className="text-[13px] text-slate-700 leading-normal">{item}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BusinessRulesDocumentation = () => {
  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <Typography variant="h2" className="text-primary italic tracking-tight">System & Business Rules</Typography>
        <Typography variant="sub" className="text-slate-500 max-w-3xl font-medium">
          Logical architecture, clinical data flow, evidence processing pipelines, and system configuration rules.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
              <Database size={16} />
            </div>
            <Typography variant="h3" className="font-serif">Data Flow & Processing</Typography>
          </div>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-w-prose">
            <p>1. <span className="font-bold text-primary">Source Origination:</span> Clinical data points are introduced via Sessions, Assessments, or external Documents.</p>
            <p>2. <span className="font-bold text-primary">Extraction & Transformation:</span> Unstructured sources are destructured into atomic <code>EvidenceItem</code> units. Enriched with ML scores (Confidence, Relevance, Impact), metadata (type, subtype), and linked to parent structural dependencies.</p>
            <p>3. <span className="font-bold text-primary">Review Workspace:</span> Normalized items populate the Evidence Workspace, where they undergo validation against the clinical hypothesis.</p>
            <p>4. <span className="font-bold text-primary">Actionable Outputs:</span> Verified evidence items securely populate downstream analyses such as Case Formulations and formal Clinical Reports.</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Activity size={16} />
            </div>
            <Typography variant="h3" className="font-serif">Entity Taxonomy</Typography>
          </div>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-w-prose">
             <p><span className="font-bold text-emerald-800">Verbatim:</span> Direct quotes from sessions. Represented internally as <code>type: "verbatim"</code> and badged as VERBATIM.</p>
             <p><span className="font-bold text-emerald-800">Behavioural:</span> Clinician-observed behaviors. Represented as <code>type: "behavioural"</code> and badged as BEHAVIOURAL.</p>
             <p><span className="font-bold text-emerald-800">Extract:</span> Information parsed from unstructured documents. Represented as <code>type: "extract"</code> or <code>type: "document"</code>.</p>
             <p><span className="font-bold text-emerald-800">Observation:</span> Structured parameters extracted from clinical assessments or qualitative forms. Represented as <code>type: "qualitative"</code>, <code>type: "observation"</code>, or <code>type: "assessment"</code>.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-divider pb-4">
          <Typography variant="h3" className="font-serif italic text-primary">Badge Scoring Logic</Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100">
             <div className="flex justify-between items-center mb-4">
                <Typography variant="label" className="font-bold text-emerald-800">High Confidence</Typography>
                <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">Score ≥ 0.75</div>
             </div>
             <p className="text-xs text-emerald-700 leading-relaxed">Rendered as green/balanced. Represents highly reliable, highly relevant, or high-impact findings.</p>
           </div>
           <div className="p-6 bg-amber-50 rounded-xl border border-amber-100">
             <div className="flex justify-between items-center mb-4">
                <Typography variant="label" className="font-bold text-amber-800">Mid Confidence</Typography>
                <div className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">0.40 ≤ Score &lt; 0.75</div>
             </div>
             <p className="text-xs text-amber-700 leading-relaxed">Rendered as amber/mood. Requires closer attention, often accompanied by warnings.</p>
           </div>
           <div className="p-6 border border-rose-100 bg-rose-50 rounded-xl">
             <div className="flex justify-between items-center mb-4">
                <Typography variant="label" className="font-bold text-rose-800">Low Confidence</Typography>
                <div className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">Score &lt; 0.40</div>
             </div>
             <p className="text-xs text-rose-700 leading-relaxed">Rendered as rose/reflection. Subject to significant uncertainty or limited relevance.</p>
           </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-divider rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={20} className="text-indigo-600" />
            <Typography variant="h3" className="font-serif text-indigo-900">Workspace Execution Rules</Typography>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
           <div className="space-y-3">
             <Typography variant="label" className="font-bold text-slate-800 tracking-wide">1. Accordion Unlocking Pipeline</Typography>
             <p className="text-sm text-slate-600 leading-relaxed">
               The EvidenceWorkspace implements a <b>controlled layout progression</b> governed by sequential accordion interactions. When a primary review section concludes and advances, preceding accordions automatically collapse to isolate focus. Unlocking subsequent modules depends on prior completion stages.
             </p>
           </div>
           <div className="space-y-3">
             <Typography variant="label" className="font-bold text-slate-800 tracking-wide">2. Conflict Resolution Protocols</Typography>
             <p className="text-sm text-slate-600 leading-relaxed">
                When <code>hasConflict</code> flag triggers, unlocking "allAccepted" states are natively blocked. Explicit actions required: <br/><br/>
                • <b>Accept:</b> Clinical override to validate discrepancy.<br/>
                • <b>Reject/Decline:</b> Invalidate findings (requires friction/modal).<br/>
                • <b>Modify:</b> Manual amending of raw text.<br/>
                • <b>Defer:</b> Suspend definitively item assessment.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const SectionDivider = ({ title, icon, subtitle }: { title: string; icon: React.ReactNode; subtitle?: string }) => (
  <div className="pt-32 pb-16 border-b border-divider mb-12 flex flex-col gap-4 scroll-mt-32">
    <div className="flex items-center gap-4 text-primary">
       <div className="p-4 bg-white rounded-2xl shadow-sm border border-divider">
         {icon}
       </div>
       <Typography variant="h2" className="text-4xl italic tracking-tight">{title}</Typography>
    </div>
    {subtitle && <Typography variant="body" className="text-slate-500 font-medium max-w-xl text-lg">{subtitle}</Typography>}
  </div>
);

const PropsTable = ({ props }: { props: PropEntry[] }) => (
  <div className="overflow-x-auto rounded-xl border border-divider">
    <table className="w-full text-left text-xs">
      <thead className="bg-slate-50 border-b border-divider uppercase tracking-wider text-[10px] font-bold text-slate-500">
        <tr>
          <th className="px-4 py-3">Prop</th>
          <th className="px-4 py-3">Type</th>
          <th className="px-4 py-3">Default</th>
          <th className="px-4 py-3">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-divider">
        {props.map((prop, i) => (
          <tr key={i} className="hover:bg-slate-50/50">
            <td className="px-4 py-3 font-mono text-primary font-semibold">{prop.name}</td>
            <td className="px-4 py-3 font-mono text-slate-500">{prop.type}</td>
            <td className="px-4 py-3 font-mono text-slate-400">{prop.default || '-'}</td>
            <td className="px-4 py-3 text-slate-600 leading-relaxed">{prop.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ComponentShowcase = ({ 
  name, 
  description, 
  preview, 
  props, 
  usability, 
  accessibility, 
  keyboard,
  antipatterns,
  sourceCode 
}: ComponentShowcaseProps) => {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  return (
    <div className="space-y-8 scroll-mt-32" id={name.toLowerCase().replace(/\s+/g, '-')}>
      <div className="flex flex-col gap-2 border-b border-divider pb-4">
        <div className="flex items-center gap-3">
          <Typography variant="h3" className="font-serif font-semibold italic">{name}</Typography>
          <Badge variant="soft" className="text-[10px] uppercase tracking-tighter">
            {name.includes('Badge') || name.includes('State') || name.includes('Header') ? 'Shared' : 'Atomic UI'}
          </Badge>
        </div>
        <Typography variant="body" className="text-slate-500 max-w-4xl">{description}</Typography>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('preview')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-2",
                view === 'preview' ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <MousePointer2 size={12} />
              Live Preview
            </button>
            <button 
              onClick={() => setView('code')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-2",
                view === 'code' ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Code size={12} />
              Source Code
            </button>
          </div>
        </div>

        <div className="min-h-[320px] rounded-2xl border border-divider overflow-hidden bg-white shadow-sm relative group">
          {view === 'preview' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] p-12">
               <div className="relative z-10 w-full max-w-2xl flex items-center justify-center">
                 {preview}
               </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#0f172a] overflow-auto custom-scrollbar">
              <pre className="p-8 text-slate-300 text-[11px] font-mono leading-relaxed">
                <code>{sourceCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
             <Typography variant="label-micro" className="text-primary font-bold tracking-widest flex items-center gap-2">
               <Info size={12} />
               Usability & Best Practices
             </Typography>
             <ul className="space-y-3">
               {usability.map((note, i) => (
                 <li key={i} className="text-xs text-slate-600 flex gap-3 leading-relaxed">
                   <div className="w-1 h-1 rounded-full bg-primary shrink-0 mt-1.5" />
                   {note}
                 </li>
               ))}
             </ul>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-3 p-4 bg-emerald-50 content-border rounded-xl border border-emerald-100/50">
               <Typography variant="label-micro" className="text-emerald-700 font-bold flex items-center gap-2">
                 <Accessibility size={12} />
                 Accessibility
               </Typography>
               <ul className="space-y-2">
                 {accessibility.map((note, i) => (
                   <li key={i} className="text-[10px] text-emerald-800 leading-relaxed">• {note}</li>
                 ))}
               </ul>
            </div>
            <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
               <Typography variant="label-micro" className="text-blue-700 font-bold flex items-center gap-2">
                 <Keyboard size={12} />
                 Keyboard Interactions
               </Typography>
               <ul className="space-y-2">
                 {keyboard.map((note, i) => (
                   <li key={i} className="text-[10px] text-blue-800 leading-relaxed">• {note}</li>
                 ))}
               </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
             <Typography variant="label-micro" className="text-error font-bold tracking-widest flex items-center gap-2">
               <AlertCircle size={12} />
               Common Anti-patterns
             </Typography>
             <div className="p-5 bg-error-light/10 border border-error/10 rounded-xl space-y-3">
               {antipatterns.map((bad, i) => (
                 <div key={i} className="flex gap-3 items-start">
                   <X size={14} className="text-error shrink-0 mt-0.5" />
                   <p className="text-xs text-error/80 leading-relaxed italic">{bad}</p>
                 </div>
               ))}
             </div>
          </div>

          <div className="space-y-3">
             <Typography variant="label-micro" className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">API Reference</Typography>
             <PropsTable props={props} />
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateShowcase = ({ name, description, preview, sourceCode }: TemplateShowcaseProps) => {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  return (
    <div className="space-y-8 scroll-mt-32" id={name.toLowerCase().replace(/\s+/g, '-')}>
      <div className="flex flex-col gap-2 border-b border-divider pb-4">
        <div className="flex items-center gap-3">
          <Typography variant="h3" className="font-serif font-semibold italic">{name}</Typography>
          <Badge variant="brand" className="text-[10px] uppercase tracking-tighter">Template</Badge>
        </div>
        <Typography variant="body" className="text-slate-500 max-w-4xl">{description}</Typography>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('preview')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-2",
                view === 'preview' ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <MousePointer2 size={12} />
              Full View Preview
            </button>
            <button 
              onClick={() => setView('code')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-2",
                view === 'code' ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Code size={12} />
              Boilerplate Code
            </button>
          </div>
        </div>

        <div className="h-[600px] rounded-2xl border border-divider overflow-hidden bg-white shadow-sm transition-all duration-500">
          {view === 'preview' ? (
            <div className="h-full bg-slate-100 overflow-hidden">
               {preview}
            </div>
          ) : (
            <div className="h-full bg-[#0f172a] overflow-auto custom-scrollbar">
              <pre className="p-8 text-slate-300 text-[11px] font-mono leading-relaxed">
                <code>{sourceCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function StyleGuide() {
  const [activeTab, setActiveTab] = useState("Preview");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const categories = [
    {
      title: "Foundations",
      icon: <Layers size={14} />,
      items: [
        { label: "Logo", id: "logo" },
        { label: "Typography", id: "typography" },
        { label: "Color Palette", id: "colorpalette" },
        { label: "Corner Radius", id: "cornerradius" },
        { label: "Spacing", id: "spacing" },
        { label: "Design Tokens", id: "designtokens" },
      ]
    },
    {
      title: "UI Primitives",
      icon: <Grid size={14} />,
      items: [
        { label: "Buttons", id: "button" },
        { label: "Badges", id: "badge" },
        { label: "Avatars", id: "avatar" },
        { label: "Separators", id: "separator" },
        { label: "Skeletons", id: "skeleton" },
      ]
    },
    {
      title: "Forms & Controls",
      icon: <Type size={14} />,
      items: [
        { label: "Inputs", id: "input" },
        { label: "Textareas", id: "textarea" },
        { label: "Selects", id: "select" },
        { label: "Searchable Select", id: "searchableselect" },
        { label: "Checkboxes", id: "checkbox" },
        { label: "Switches", id: "switch" },
        { label: "Labels", id: "label" },
        { label: "Filters", id: "filterbar" },
      ]
    },
    {
      title: "Layout & Structure",
      icon: <Layout size={14} />,
      items: [
        { label: "Cards", id: "card" },
        { label: "Base Cards", id: "basecard" },
        { label: "Section Headers", id: "sectionheader" },
        { label: "Breadcrumbs", id: "breadcrumbs" },
        { label: "Layouts", id: "detailviewlayout" },
        { label: "Collapsible Section", id: "collapsiblesection" },
      ]
    },
    {
      title: "Clinical Indicators",
      icon: <Activity size={14} />,
      items: [
        { label: "Status Badges", id: "statusbadge" },
        { label: "Confidence", id: "confidencebadge" },
        { label: "Relevance", id: "relevancebadge" },
        { label: "Impact", id: "impactbadge" },
        { label: "Sys Badge", id: "sysbadge" },
        { label: "File Type Badge", id: "filetypebadge" },
      ]
    },
    {
      title: "Navigation & Progress",
      icon: <Route size={14} />,
      items: [
        { label: "Tabs", id: "tabs" },
        { label: "Tab Bar", id: "tabbar" },
        { label: "Pagination", id: "tablefooter" },
        { label: "Progress Banners", id: "progressbanner" },
        { label: "Threadline Navbar", id: "threadlinenavbar" },
      ]
    },
    {
      title: "Workspace Specializations",
      icon: <Network size={14} />,
      items: [
        { label: "Assessment Gate", id: "assessmentgate" },
        { label: "Workspace Status Bar", id: "workspacestatusbar" },
        { label: "Clinical Notes Sidebar", id: "clinicalnotessidebar" },
        { label: "Assessment Compare Sidebar", id: "assessmentcomparesidebar" },
        { label: "Review Categories", id: "reviewcategory" },
        { label: "Review Items", id: "reviewitem" },
        { label: "Interp Rows", id: "interprow" },
        { label: "Accordion Tags", id: "accordiontags" },
        { label: "Report Sections", id: "reportsection" },
        { label: "Evidence Action", id: "evidenceworkspacectas" },
      ]
    },
    {
      title: "Data & Visuals",
      icon: <Grid size={14} />,
      items: [
        { label: "Data Points", id: "datapoint" },
        { label: "Evidence Cards", id: "evidencecard" },
        { label: "Entity Cards", id: "entitycard" },
        { label: "Assessment Cards", id: "assessmentcard" },
        { label: "Condition Tables", id: "conditiontable" },
        { label: "Graphs", id: "graphs" },
      ]
    },
    {
      title: "Overlays & Feedback",
      icon: <AlertCircle size={14} />,
      items: [
        { label: "Alerts", id: "alerts" },
        { label: "Progress", id: "progress" },
        { label: "Toasts", id: "toast" },
        { label: "Modals", id: "modal" },
        { label: "Conflicts", id: "conflictresolutionmodal" },
        { label: "Empty States", id: "emptystate" },
      ]
    },
    {
      title: "Templates",
      icon: <Database size={14} />,
      items: [
        { label: "List View Boilerplate", id: "list-view-boilerplate" },
        { label: "Detail View Boilerplate", id: "detail-view-boilerplate" },
        { label: "Workspace Boilerplate", id: "clinical-workspace-boilerplate" },
        { label: "Form Boilerplate", id: "standard-form-boilerplate" },
      ]
    },
    {
      title: "Product Design",
      icon: <Compass size={14} />,
      items: [
        { label: "User Journey", id: "userjourney" },
        { label: "User Stories", id: "userstories" },
        { label: "Business Rules", id: "businessrules" },
      ]
    }
  ];

  return (
    <div className="flex bg-workspace-bg min-h-screen relative">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed bottom-6 right-6 z-[60] xl:hidden p-4 bg-primary text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <aside 
        className={cn(
          "bg-white border-r border-divider sticky top-0 h-screen flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-50",
          sidebarCollapsed ? "w-20" : "w-72",
          // Mobile overrides
          "fixed inset-y-0 left-0 xl:sticky",
          mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full xl:translate-x-0"
        )}
      >
        <div className={cn("p-6 border-b border-divider bg-slate-50/50 flex items-center justify-between", sidebarCollapsed && "justify-center px-0", mobileMenuOpen && "xl:justify-between xl:px-6")}>
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-brand shrink-0">
                <Layers size={18} />
              </div>
              <div className="flex flex-col">
                <Typography variant="h3" className="text-primary italic tracking-tight whitespace-nowrap">Registry</Typography>
                <Typography variant="caption" className="text-slate-400 font-medium whitespace-nowrap">DS v1.0</Typography>
              </div>
            </div>
          )}
          {sidebarCollapsed && !mobileMenuOpen && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-brand">
              <Layers size={18} />
            </div>
          )}
          {mobileMenuOpen && (
             <button onClick={() => setMobileMenuOpen(false)} className="xl:hidden p-2 text-slate-400 hover:text-primary">
               <X size={18} />
             </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-3 px-3">
              <div className={cn(
                "flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4",
                (sidebarCollapsed && !mobileMenuOpen) && "justify-center px-0"
              )}>
                <span className="p-1.5 bg-slate-100 rounded-md text-slate-500 shrink-0">{cat.icon}</span>
                {(!sidebarCollapsed || mobileMenuOpen) && <span>{cat.title}</span>}
              </div>
              <div className="space-y-1">
                {cat.items.map((item) => (
                  <a 
                    key={item.id} 
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    title={(sidebarCollapsed && !mobileMenuOpen) ? item.label : undefined}
                    className={cn(
                      "group flex items-center px-3 py-2 text-[11px] font-bold text-slate-500 hover:text-primary hover:bg-primary-light/30 rounded-lg transition-all border border-transparent hover:border-primary/10",
                      (sidebarCollapsed && !mobileMenuOpen) ? "justify-center" : "justify-between"
                    )}
                  >
                    {!sidebarCollapsed || mobileMenuOpen ? (
                      <>
                        <span className="truncate">{item.label}</span>
                        <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary group-hover:scale-125 transition-all" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-divider bg-slate-50/50 flex flex-col gap-2">
           <button 
             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
             className="hidden xl:flex items-center justify-center w-full h-9 rounded-lg border border-divider bg-white hover:bg-slate-50 text-slate-500 hover:text-primary transition-all"
           >
             {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
             {!sidebarCollapsed && <span className="ml-2 text-[10px] font-bold uppercase tracking-widest">Collapse</span>}
           </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 max-w-[1200px] mx-auto px-12 pb-48 overflow-x-hidden pt-20">
        <div className="space-y-48">
          {/* CATEGORY: FOUNDATIONS */}
          <SectionDivider title="Foundations" icon={<Layers size={24} />} subtitle="Core atomic elements and styling primitives." />

          <div id="logo">
            <ComponentShowcase 
              name="Logo"
              description="The Threadline brand logo."
              preview={
                 <div className="p-8 flex gap-8 items-center bg-slate-50 rounded-xl justify-center w-full">
                   <Logo size={48} showText={true} />
                   <Logo size={32} showText={false} />
                 </div>
              }
              props={[
                { name: "size", type: "number", default: "32", description: "Size of the svg." },
                { name: "showText", type: "boolean", default: "true", description: "Shows the wordmark." },
                { name: "color", type: "string", default: "#06302c", description: "Base fill color." }
              ]}
              usability={["Used in navbars and loaders."]}
              accessibility={["Use aria-hidden if it's purely decorative."]}
              keyboard={["N/A"]}
              antipatterns={["Distorting the SVG or changing primary brand colors unnecessarily."]}
              sourceCode={LogoRaw}
            />
          </div>

          <div id="typography">
            <ComponentShowcase 
              name="Typography"
            description="Managed hierarchy system. Serif titles for context, Sans for interactive precision."
            preview={
              <div className="space-y-8 w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-divider">
                <div className="space-y-1">
                  <Typography variant="h1" className="italic">Clinical Assessment</Typography>
                  <Typography variant="sub">Subject: Patient #992-B</Typography>
                </div>
                <Separator />
                <div className="space-y-4">
                  <Typography variant="h3">Observations</Typography>
                  <Typography variant="body">
                    Patient presented with standard symptoms. Speech was fluent but rapid, indicating elevated anxiety levels during intake.
                  </Typography>
                </div>
                <Typography variant="label-micro" className="text-primary font-bold">VERIFIED AUGUST 2026</Typography>
              </div>
            }
            props={[
              { name: "variant", type: "string", default: "'body'", description: "Semantic level: h1-h3, sub, body, caption, label-micro." },
              { name: "as", type: "string", description: "HTML tag override (e.g. 'span' instead of 'p')." }
            ]}
            usability={[
              "Use 'h1' exclusively for page-level headers.",
              "Capitals in 'label-micro' are handled by class, enter code as mixed case."
            ]}
            accessibility={[
              "Font-size is relative (rem) for user scaling.",
              "Color variants adhere to AA contrast standards."
            ]}
            keyboard={["N/A"]}
            antipatterns={[
              "Don't skip heading levels (e.g. H1 followed immediately by H3).",
              "Avoid using body text for tertiary metadata."
            ]}
            sourceCode={TypographyRaw}
          />
          </div>

          <div id="colorpalette">
            <ComponentShowcase 
              name="Color Palette"
              description="Brand and semantic colors used throughout the application."
              preview={
                <div className="flex flex-wrap gap-4 w-full">
                  {[{bg: "bg-primary", text: "Primary", hex: "var(--color-primary)", colorClass: "text-white"},
                    {bg: "bg-primary-light", text: "Primary Light", hex: "var(--color-primary-light)", colorClass: "text-primary"},
                    {bg: "bg-success", text: "Success", hex: "var(--color-success)", colorClass: "text-white"},
                    {bg: "bg-error", text: "Error", hex: "var(--color-error)", colorClass: "text-white"},
                    {bg: "bg-warning", text: "Warning", hex: "var(--color-warning)", colorClass: "text-white"}
                  ].map((c) => (
                     <div key={c.text} className={`w-32 h-32 rounded-xl flex flex-col justify-end p-3 ${c.bg} shadow-sm border border-divider/50`}>
                       <div className={`font-semibold text-sm ${c.colorClass}`}>{c.text}</div>
                     </div>
                  ))}
                </div>
              }
              props={[]}
              usability={["Semantic colors should be used for states (success/error).", "Primary is for the main brand color."]}
              accessibility={["Ensure sufficient contrast.", "Don't use alone to indicate state."]}
              keyboard={["N/A"]}
              antipatterns={["Avoid changing these globally or using too many colors."]}
              sourceCode={"// Tailwind configuration in index.css"}
            />
          </div>

          <div id="cornerradius">
            <ComponentShowcase 
              name="Corner Radius"
              description="Standardized border-radius values to create a cohesive look."
              preview={
                <div className="flex flex-wrap gap-6 items-end">
                  {[
                    {radiusClass: "rounded-md", name: "md", desc: "Inputs & Checkboxes"},
                    {radiusClass: "rounded-lg", name: "lg", desc: "Buttons"},
                    {radiusClass: "rounded-xl", name: "xl", desc: "Cards & Modals"},
                    {radiusClass: "rounded-full", name: "full", desc: "Pills & Avatars"}
                  ].map((c) => (
                    <div key={c.name} className="flex flex-col items-center gap-2">
                      <div className={`w-20 h-20 bg-primary ${c.radiusClass}`}></div>
                      <div className="text-center">
                        <div className="font-mono text-xs font-bold text-slate-600">.{c.radiusClass}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              }
              props={[]}
              usability={["Use consistent radius based on component size and intent."]}
              accessibility={["Minimal impact on accessibility."]}
              keyboard={["N/A"]}
              antipatterns={["Mixing completely square elements with highly rounded elements without logic."]}
              sourceCode={"// Standard Tailwind border-radius classes"}
            />
          </div>

          <div id="spacing">
            <ComponentShowcase 
              name="Spacing"
              description="Spacing scale used for margins and padding."
              preview={
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  {[4, 6, 8, 12, 16, 24, 32].map((s) => (
                    <div key={s} className="flex items-center gap-4">
                       <span className="w-16 font-mono text-xs text-right text-slate-500">{s}px (p-{s/4})</span>
                       <div className="bg-primary/20 h-6" style={{ width: s }}></div>
                    </div>
                  ))}
                </div>
              }
              props={[]}
              usability={["Stick to the multiples of 4 for consistent spacing."]}
              accessibility={["Adequate spacing is crucial for readability and focus."]}
              keyboard={["N/A"]}
              antipatterns={["Using arbitrary pixel values instead of the spacing scale."]}
              sourceCode={"// Standard Tailwind spacing classes"}
            />
          </div>

          <div id="designtokens">
            <ComponentShowcase 
              name="Design Tokens"
              description="Semantic variables mapping visual decisions to functional intent."
              preview={
                <div className="flex flex-col w-full text-sm">
                  <div className="grid grid-cols-3 gap-4 border-b border-divider pb-2 mb-4 text-slate-500 font-bold">
                    <div>Token</div>
                    <div>Value</div>
                    <div>Usage</div>
                  </div>
                  {[
                    { token: "--color-primary", value: "#06302c", usage: "Main brand color, active states, primary buttons." },
                    { token: "--color-primary-light", value: "#0a4540", usage: "Hover states for primary elements." },
                    { token: "--color-success", value: "#10b981", usage: "High confidence, completion, positive trends." },
                    { token: "--color-warning", value: "#f59e0b", usage: "Mid confidence, warnings, anomalies." },
                    { token: "--color-error", value: "#ef4444", usage: "Low confidence, destructive actions, critical errors." },
                    { token: "--color-divider", value: "#e2e8f0", usage: "Borders, separators, structural outlines." },
                    { token: "--font-sans", value: "Inter", usage: "General UI text, data values, interactive elements." },
                    { token: "--font-serif", value: "Playfair Display", usage: "Headers, empty states, expressive typography." },
                  ].map((t) => (
                    <div key={t.token} className="grid grid-cols-3 gap-4 py-3 border-b border-divider/50 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="font-mono text-xs text-primary font-bold">{t.token}</div>
                      <div className="font-mono text-xs text-slate-500">{t.value}</div>
                      <div className="text-slate-600 text-xs">{t.usage}</div>
                    </div>
                  ))}
                </div>
              }
              props={[]}
              usability={["Use semantic tokens instead of hardcoded hex values.", "Tokens ensure consistency if the base palette changes."]}
              accessibility={["Contrast requirements apply equally to tokens."]}
              keyboard={["N/A"]}
              antipatterns={["Creating unique hex values for one-off elements when a token exists."]}
              sourceCode={"// index.css"}
            />
          </div>

          {/* CATEGORY: UI PRIMITIVES */}
          <SectionDivider title="UI Primitives" icon={<Grid size={24} />} subtitle="Atomic UI elements for core interactions." />

          {/* 1. BUTTON */}
          <div id="button">
            <ComponentShowcase 
              name="Button"
          description="The workhorse of interaction. Supports multiple semantic states, loading indicators, and icon integration."
          preview={
            <div className="flex flex-wrap gap-6 items-center justify-center p-8 bg-white rounded-2xl">
              <Button variant="brand" icon={<Plus size={16} />}>Create Session</Button>
              <Button variant="outline" iconRight={<ArrowRight size={16} />}>Analyze Data</Button>
              <Button variant="ghost" size="icon"><Search size={18} /></Button>
              <Button variant="danger" icon={<AlertTriangle size={16} />}>Delete Record</Button>
              <Button loading>Processing</Button>
            </div>
          }
          props={[
            { name: "variant", type: "'primary' | 'brand' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: "Semantic styling variant." },
            { name: "size", type: "'sm' | 'md' | 'lg' | 'icon'", default: "'md'", description: "Scale of the button." },
            { name: "loading", type: "boolean", default: "false", description: "Shows spinner and disables interaction." },
            { name: "icon", type: "ReactNode", description: "Left-aligned icon." },
          ]}
          usability={[
            "Primary actions should use the 'brand' variant.",
            "Always include labels unless the action is universally understood (e.g. Search, Close).",
            "Destructive actions MUST use the 'danger' variant."
          ]}
          accessibility={[
            "Maintains 44px touch target on mobile.",
            "Includes clear focus-visible rings.",
            "Wait states use ARIA-busy attributes."
          ]}
          keyboard={[
            "Space/Enter triggers the click event.",
            "Tab moves focus between buttons."
          ]}
          antipatterns={[
            "Avoid placing two brand-variant buttons side-by-side.",
            "Don't use generic 'Success' buttons for non-confirmed state changes."
          ]}
          sourceCode={ButtonRaw}
        />
        </div>

        {/* 2. BADGE */}
        <div id="badge">
          <ComponentShowcase 
            name="Badge"
          description="Compact status and categorization markers. Used for metadata tagging."
          preview={
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Badge variant="brand">Active</Badge>
              <Badge variant="success">Completed</Badge>
              <Badge variant="error" className="animate-pulse">Urgent</Badge>
              <Badge variant="soft">Protocol #12</Badge>
            </div>
          }
          props={[
            { name: "variant", type: "'default' | 'brand' | 'success' | 'info' | 'error' | 'soft'", default: "'default'", description: "Visual style mapping." },
            { name: "label", type: "string", description: "Quick label alternative to children." }
          ]}
          usability={[
            "Limit labels to 1-2 words for legibility.",
            "Use 'soft' for secondary metadata that shouldn't draw high visual attention."
          ]}
          accessibility={[
            "Sufficient contrast ratios for background/text pairings.",
            "Purely decorative icons are ignored by screen readers."
          ]}
          keyboard={[
            "Non-interactive by default unless onClick is provided."
          ]}
          antipatterns={[
            "Don't use Badges as buttons for primary navigation.",
            "Avoid over-categorization using too many colored badges on one screen."
          ]}
          sourceCode={BadgeRaw}
        />
        </div>

        <div id="skeleton">
          <ComponentShowcase 
            name="Skeleton"
            description="Loading state placeholder used to maintain layout stability."
            preview={
              <div className="w-full max-w-md p-6 bg-white border border-divider rounded-xl space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            }
            props={[
              { name: "className", type: "string", description: "Define dimensions and shape." }
            ]}
            usability={[
              "Matches the geometric footprint of the final content.",
              "Subtle pulsing animation reduces perceived waiting time."
            ]}
            accessibility={["Aria-hidden='true' to avoid confusing screen readers."]}
            keyboard={["N/A"]}
            antipatterns={[
              "Don't use as permanent UI elements.",
              "Avoid using complex skeletons if simple spinners suffice."
            ]}
            sourceCode={SkeletonRaw}
          />
        </div>

        {/* 3. AVATAR */}
        <div id="avatar">
          <ComponentShowcase 
            name="Avatar"
          description="A circular representation of users or clinical subjects."
          preview={
            <div className="flex gap-8 items-end justify-center">
              <div className="text-center space-y-2">
                <Avatar size="lg" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop" />
                <p className="text-[10px] font-bold text-slate-400">LARGE (56px)</p>
              </div>
              <div className="text-center space-y-2">
                <Avatar size="md" />
                <p className="text-[10px] font-bold text-slate-400">FALLBACK</p>
              </div>
              <div className="text-center space-y-2">
                <Avatar size="sm" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop" />
                <p className="text-[10px] font-bold text-slate-400">SMALL (32px)</p>
              </div>
            </div>
          }
          props={[
            { name: "src", type: "string", description: "Image source URL." },
            { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Predefined dimensions." },
            { name: "fallback", type: "ReactNode", description: "Custom icon if image fails." }
          ]}
          usability={[
            "Ensure subject is centered in source image.",
            "Use small size for inline mentions (e.g. 'Last reviewed by...')."
          ]}
          accessibility={[
            "Empty alt text for decorative usage.",
            "Contrast border ensures visibility on white backgrounds."
          ]}
          keyboard={["Role='img' if essential data."]}
          antipatterns={[
            "Don't use Avatars for group representations (use Icon instead).",
            "Avoid low-resolution source images."
          ]}
          sourceCode={AvatarRaw}
        />
        </div>

        {/* 12. SEPARATOR */}
        <div id="separator">
          <ComponentShowcase 
            name="Separator"
          description="A thin visual line used to group and organize layout sections."
          preview={
            <div className="w-full max-w-md space-y-4">
              <div className="h-20 bg-slate-50 flex items-center justify-center text-[10px] uppercase font-bold text-slate-400">Header Area</div>
              <Separator />
              <div className="h-40 bg-slate-50 flex items-center justify-center text-[10px] uppercase font-bold text-slate-400">Main Content</div>
            </div>
          }
          props={[
            { name: "className", type: "string", description: "Add margins or colors." }
          ]}
          usability={["Defaults to 1px thickness.", "Matches system 'divider' color."]}
          accessibility={["Role='separator' but often ignored as decorative."]}
          keyboard={["N/A"]}
          antipatterns={["Don't use separators as the ONLY way to divide content (use spacing too)."]}
          sourceCode={SeparatorRaw}
        />
        </div>

        {/* CATEGORY: FORMS & CONTROLS */}
        <SectionDivider title="Forms & Controls" icon={<Type size={24} />} subtitle="Components for data capture and state management." />

        {/* 5. INPUT */}
        <div id="input">
          <ComponentShowcase 
            name="Input"
          description="Data capture component with integrated labeling and validation feedback."
          preview={
            <div className="w-full max-w-sm space-y-6">
              <Input label="Patient Name" placeholder="e.g. John Doe" icon={<User size={16} />} />
              <Input label="Access Code" type="password" placeholder="••••••••" />
              <Input label="Search Workspace" icon={<Search size={16} />} className="rounded-full" />
            </div>
          }
          props={[
            { name: "label", type: "string", description: "Floating-style label text." },
            { name: "icon", type: "ReactNode", description: "Prefix icon." },
            { name: "error", type: "string", description: "Validation error message." }
          ]}
          usability={[
            "Labels should be concise (1-3 words).",
            "Placeholder should provide an EXAMPLE value, not instructions."
          ]}
          accessibility={[
            "Unique ID generation for label/input pairing.",
            "Visible focus ring for keyboard navigation."
          ]}
          keyboard={[
            "Tab to navigate.",
            "Clear indicator when system receives focus."
          ]}
          antipatterns={[
            "Don't use placeholder as a substitute for a label.",
            "Avoid excessive use of icons if the field is self-explanatory."
          ]}
          sourceCode={InputRaw}
        />
        </div>

        {/* 6. TEXTAREA */}
        <div id="textarea">
          <ComponentShowcase 
            name="Textarea"
          description="Extended text input for clinical notes and long-form descriptors."
          preview={
            <div className="w-full max-w-xl">
              <Textarea 
                label="Diagnosis Summary" 
                placeholder="Include detailed analysis of criteria matching..." 
                rows={6}
              />
            </div>
          }
          props={[
            { name: "rows", type: "number", default: "3", description: "Initial visible vertical scale." },
            { name: "autoSize", type: "boolean", description: "Expand as user types." }
          ]}
          usability={[
            "Use for any input expected to exceed 12 words.",
            "Set a reasonable 'rows' count based on expected content length."
          ]}
          accessibility={[
            "Screen readers announce field description.",
            "High color contrast for typed text."
          ]}
          keyboard={["Tab-out requires explicit focus movement."]}
          antipatterns={[
            "Don't use Textarea for single-line inputs like Names or Emails.",
            "Avoid tiny scrollable textareas (prefer longer static heights)."
          ]}
          sourceCode={TextareaRaw}
        />
        </div>

        {/* 7. SELECT */}
        <div id="select">
          <ComponentShowcase 
            name="Select"
          description="Managed dropdown for picking from a constrained set of options."
          preview={
            <div className="w-full max-w-sm">
              <Select 
                label="Classification"
                options={[
                  { value: 'critical', label: 'Critical' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'research', label: 'Research' }
                ]}
              />
            </div>
          }
          props={[
            { name: "options", type: "Array", description: "List of {value, label} pairs." },
            { name: "onChange", type: "function", description: "Returns selected value string." }
          ]}
          usability={[
            "Use for list lengths between 3 and 10 items.",
            "Always include a logical default or empty state."
          ]}
          accessibility={[
            "ARIA-expanded state tracked for dropdown visibility.",
            "Correct semantic option elements used internally."
          ]}
          keyboard={[
            "Arrow Up/Down to navigate options.",
            "Enter/Space to select."
          ]}
          antipatterns={[
            "Don't use Select for binary Yes/No (use Switch or Checkbox).",
            "Avoid using for lists longer than 15 items (use SearchableSelect)."
          ]}
          sourceCode={SelectRaw}
        />
        </div>

        {/* 8. SEARCHABLE SELECT */}
        <div id="searchableselect">
          <ComponentShowcase 
            name="SearchableSelect"
          description="Advanced selector with real-time filtering for deep datasets."
          preview={
            <div className="w-full max-w-md">
               <SearchableSelect 
                 label="Medical Condition"
                 placeholder="Search ICD-10 or DSM-5..."
                 options={[
                   { value: 'gad', label: 'Generalized Anxiety Disorder' },
                   { value: 'mdd', label: 'Major Depressive Disorder' },
                   { value: 'ptsd', label: 'Post-Traumatic Stress Disorder' },
                   { value: 'ocd', label: 'Obsessive-Compulsive Disorder' }
                 ]}
                 value={searchVal}
                 onChange={setSearchVal}
               />
            </div>
          }
          props={[
            { name: "options", type: "Array", description: "Array of items to filter." },
            { name: "value", type: "string", description: "Controlled value." }
          ]}
          usability={[
            "Ideal for ICD/DSM databases or user directories.",
            "Input field remains focused while filtering."
          ]}
          accessibility={[
            "Announces the number of found results to screen readers.",
            "Highlights matching text in filtered list."
          ]}
          keyboard={[
            "Esc to clear or close.",
            "Enter confirms the top filtered result."
          ]}
          antipatterns={[
            "Don't use for very short lists (adds unnecessary friction).",
            "Avoid using if list items have very similar starting text."
          ]}
          sourceCode={SearchableSelectRaw}
        />
        </div>

        {/* 9. CHECKBOX */}
        <div id="checkbox">
          <ComponentShowcase 
            name="Checkbox"
          description="Selection control for multi-pick scenarios or protocol acknowledgments."
          preview={
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox checked />
                <Label>Clinical guidelines reviewed</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox />
                <Label>Consent form signed</Label>
              </div>
            </div>
          }
          props={[
            { name: "checked", type: "boolean", description: "Controlled state." },
            { name: "onCheckedChange", type: "function", description: "Callback for state change." }
          ]}
          usability={[
            "Labels should always be clickable to toggle the checkbox.",
            "Group related checkboxes under a single header."
          ]}
          accessibility={[
            "Standard checkbox roles.",
            "Focus ring encompasses the box and label if possible."
          ]}
          keyboard={["Space to toggle."]}
          antipatterns={[
            "Don't use for instant-on actions (use Switch for immediate effects).",
            "Avoid deep nesting of checkboxes."
          ]}
          sourceCode={CheckboxRaw}
        />
        </div>

        {/* 10. SWITCH */}
        <div id="switch">
          <ComponentShowcase 
            name="Switch"
          description="Binary toggle for settings that apply immediately."
          preview={
            <div className="flex flex-col gap-6 items-center">
              <div className="flex items-center gap-3">
                <Label>Debug Mode</Label>
                <Switch checked />
              </div>
              <div className="flex items-center gap-3">
                <Label>Notifications</Label>
                <Switch />
              </div>
            </div>
          }
          props={[
            { name: "checked", type: "boolean", description: "Current state." },
            { name: "disabled", type: "boolean", description: "Prevents interaction." }
          ]}
          usability={[
            "Use for high-level UI preferences or 'live' modes.",
            "Includes smooth slide animation for tactile feedback."
          ]}
          accessibility={[
            "WCAG 2.1 compliant focus states.",
            "ARIA-switch role used."
          ]}
          keyboard={["Space/Enter to toggle."]}
          antipatterns={[
            "Don't use for form submissions (use Checkbox inside forms).",
            "Avoid using without a clear label."
          ]}
          sourceCode={SwitchRaw}
        />
        </div>

        {/* 11. LABEL */}
        <div id="label">
          <ComponentShowcase 
            name="Label"
          description="Atomic text component for input fields and descriptors."
          preview={<Label className="text-primary font-bold">Input Descriptor</Label>}
          props={[
            { name: "htmlFor", type: "string", description: "ID of associated input." }
          ]}
          usability={["Required field markers should be added via CSS or separate icon."]}
          accessibility={["Ensures screen readers announce input purpose."]}
          keyboard={["Clicking label focuses the input."]}
          antipatterns={["Avoid using for general body text (use Typography)."]}
          sourceCode={LabelRaw}
        />
        </div>

        <div id="filterbar">
          <ComponentShowcase 
            name="FilterBar"
            description="A horizontal toolbar for filtering and searching deep lists."
            preview={
              <div className="w-full bg-slate-50 p-4 rounded-xl border border-divider">
                <FilterBar 
                  search=""
                  setSearch={() => {}}
                  statusFilter="All Status"
                  setStatusFilter={() => {}}
                  catFilters={["Mood Disorders", "Anxiety Disorders"]}
                  toggleCat={() => {}}
                  catOpen={false}
                  setCatOpen={() => {}}
                />
              </div>
            }
            props={[
              { name: "searchPlaceholder", type: "string", default: "'Search...'", description: "Placeholder for the search input." },
              { name: "filters", type: "Array", description: "Config for dropdown filters." }
            ]}
            usability={["Used at the top of list views.", "Combines search and multiple categorization toggles."]}
            accessibility={["Accessible labels for all controls."]}
            keyboard={["Tab through search and filter buttons."]}
            antipatterns={["Avoid too many filters that wrap logic into multi-line layouts."]}
            sourceCode={FilterBarRaw}
          />
        </div>

        {/* CATEGORY: LAYOUT & STRUCTURE */}
        <SectionDivider title="Layout & Structure" icon={<Layout size={24} />} subtitle="Visual architectural patterns and containers." />

        {/* 13. CARD */}
        <div id="card">
          <ComponentShowcase 
            name="Card"
          description="The primary container for information grouping. Provides elevation and structure."
          preview={
            <Card className="w-full max-w-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                       <FileText size={16} /> Patient Report
                    </CardTitle>
                    <CardDescription>Ref: clinical-assessment-902</CardDescription>
                  </div>
                  <Badge variant="success">Final</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg flex gap-3 italic text-xs text-slate-600">
                    <Info size={14} className="text-primary shrink-0" />
                    Latest analysis indicates 89% criteria match for MDD symptoms.
                  </div>
                  <Button variant="outline" className="w-full" size="sm">Modify Details</Button>
                </div>
              </CardContent>
            </Card>
          }
          props={[
            { name: "className", type: "string", description: "Custom container styles." },
            { name: "hoverable", type: "boolean", description: "Add subtle scale effect." }
          ]}
          usability={[
            "Group fields that share a single clinical context.",
            "CardHeader is optimal for identifiers and ID numbers."
          ]}
          accessibility={["Sectioning content for easier screen reader navigation."]}
          keyboard={["N/A"]}
          antipatterns={[
            "Don't nest Cards more than two levels deep.",
            "Avoid massive cards that require excessive vertical scrolling."
          ]}
          sourceCode={CardRaw}
        />
        </div>

        <div id="basecard">
          <ComponentShowcase 
            name="BaseCard"
            description="A foundational wrapper that provides hover interactions over the standard Card."
            preview={
               <div className="w-full max-w-sm">
                  <BaseCard hoverable className="p-6">
                    <Typography variant="h4">Interactive Card</Typography>
                    <Typography variant="body" className="mt-2 text-slate-500">I respond to hover state. Click me or hover over me.</Typography>
                  </BaseCard>
               </div>
            }
            props={[
              { name: "hoverable", type: "boolean", description: "Enables hover cursor and border changes." },
              { name: "active", type: "boolean", description: "Forces active border state." }
            ]}
            usability={["Wraps Card with standard interaction states."]}
            accessibility={["Ensure it is focusable if it has an onClick."]}
            keyboard={["Space/Enter triggers onClick."]}
            antipatterns={["N/A"]}
            sourceCode={BaseCardRaw}
          />
        </div>

        <div id="sectionheader">
          <ComponentShowcase 
            name="SectionHeader"
            description="The primary layout header for functional workspaces."
            preview={
              <div className="w-full bg-white p-8 border border-divider rounded-2xl">
                <SectionHeader 
                  title="Patients Workspace"
                  subtitle="Manage subjects, active conditions, and clinical session history."
                  actions={<div className="flex gap-2"><Button variant="outline" size="sm">Export All</Button><Button variant="brand" size="sm">Add Patient</Button></div>}
                />
              </div>
            }
            props={[
              { name: "title", type: "string", description: "Main H2 header." },
              { name: "actions", type: "ReactNode", description: "Toolbar elements." }
            ]}
            usability={[
              "Page titles use Serif font logic.",
              "Responsive layout switches actions to full-width on mobile."
            ]}
            accessibility={["Logical header hierarchy."]}
            keyboard={["Actions are in tab list order."]}
            antipatterns={[
              "Avoid overflowing actions (max 3-4 buttons).",
              "Don't omit the subtitle if the workspace purpose isn't obvious."
            ]}
            sourceCode={SectionHeaderRaw}
          />
        </div>

        <div id="breadcrumbs">
          <ComponentShowcase 
            name="Breadcrumbs"
            description="Navigation trail for deep clinical workspaces."
            preview={
              <div className="p-4 bg-slate-50 rounded-lg">
                 <Breadcrumbs 
                   crumbs={["Clients", "John Archer", "Assessments", "DSM-5 Review"]}
                 />
              </div>
            }
            props={[
              { name: "crumbs", type: "string[]", description: "List of labels for the trail." }
            ]}
            usability={[
              "Last item is automatically highlighted and non-clickable.",
              "Chevron separators provide clear visual hierarchy."
            ]}
            accessibility={["Aria-label='Breadcrumb' on nav container."]}
            keyboard={["Tab-accessible links."]}
            antipatterns={["Avoid breadcrumbs for flat navigation (less than 2 levels deep)."]}
            sourceCode={BreadcrumbsRaw}
          />
        </div>

        <div id="detailviewlayout">
          <ComponentShowcase 
            name="DetailViewLayout"
            description="A standardized structural template for entity management views."
            preview={
              <div className="w-full max-w-3xl h-[400px] border border-divider rounded-xl overflow-hidden flex flex-col bg-slate-50">
                 <div className="p-4 bg-white border-b border-divider font-bold text-xs uppercase tracking-widest text-slate-400">Layout Preview</div>
                 <div className="flex-1 p-8 flex flex-col gap-6">
                   <Skeleton className="h-12 w-1/3" />
                   <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-24 col-span-2" />
                      <Skeleton className="h-24" />
                   </div>
                   <Skeleton className="h-48 w-full" />
                 </div>
              </div>
            }
            props={[
              { name: "header", type: "ReactNode", description: "Top action area." },
              { name: "sidebar", type: "ReactNode", description: "Contextual secondary content." }
            ]}
            usability={[
              "Maintains 1:3 ratio for main content and lateral context.",
              "Responsive collapsing for mobile viewports."
            ]}
            accessibility={["Main landmark used for primary content."]}
            keyboard={["N/A"]}
            antipatterns={["Don't use for simple list views."]}
            sourceCode={DetailViewLayoutRaw}
          />
        </div>

        {/* 20. REMOVED */}

        {/* 28. REMOVED */}

        {/* 29. REMOVED */}

        {/* CATEGORY: OVERLAYS & FEEDBACK */}
        <SectionDivider title="Overlays & Feedback" icon={<Bell size={24} />} subtitle="Modals, toasts, and contextual status messaging." />

        <div id="alerts">
          <ComponentShowcase 
            name="Alert"
            description="Inline callout for important system context."
            preview={
              <div className="flex flex-col gap-4 w-full max-w-lg">
                <Alert variant="default" title="Note">This patient has missing clinical information.</Alert>
                <Alert variant="warning" title="Warning">Potential medication conflict detected.</Alert>
                <Alert variant="error" title="Critical Issue">Cannot save changes. Please try again.</Alert>
                <Alert variant="success" title="Resolved">The assessment has been approved successfully.</Alert>
              </div>
            }
            props={[
              { name: "variant", type: "'default' | 'success' | 'warning' | 'error'", default: "'default'", description: "Semantic alert tier." },
              { name: "title", type: "string", description: "Bold header text." },
              { name: "icon", type: "ReactNode", description: "Overrides default variant icon." }
            ]}
            usability={[
              "Use for persistent or context-aware messages that require user reading.",
            ]}
            accessibility={["Role='alert' automatically sets."]}
            keyboard={["N/A"]}
            antipatterns={["Avoid stacking multiple alerts if possible.", "Don't use for transient successes (use Toast)."]}
            sourceCode={AlertRaw}
          />
        </div>

        {/* 14. MODAL */}
        <div id="modal">
          <ComponentShowcase 
            name="Modal"
            description="Blocking overlay for critical tasks and focused interaction."
            preview={
              <div className="flex flex-col items-center gap-4">
                <Button onClick={() => setShowModal(true)}>Trigger System Modal</Button>
                <Typography variant="caption" className="text-slate-400">Previews a blocking overlay with backdrop blur.</Typography>
              </div>
            }
            props={[
              { name: "isOpen", type: "boolean", description: "Controls visibility." },
              { name: "onClose", type: "function", description: "Fired on backdrop/close click." },
              { name: "title", type: "string", description: "Header caption." }
            ]}
            usability={[
              "Backdrop blur (12px) focuses user attention on the tasks.",
              "Keep modals focused on ONE specific action."
            ]}
            accessibility={[
              "Focus trapping prevents tabbing out of modal.",
              "ARIA-modal attribute set to true."
            ]}
            keyboard={[
              "Esc to close.",
              "Tab cycles through interactive elements within the modal."
            ]}
            antipatterns={[
              "Don't use modals for simple success messages (use Toast).",
              "Avoid modals that contain other modals."
            ]}
            sourceCode={ModalRaw}
          />
        </div>

        {/* 15. TOAST */}
        <div id="toast">
          <ComponentShowcase 
            name="Toast"
            description="Bottom-navighed notification for transient system state updates."
            preview={
              <div className="flex flex-col items-center gap-4">
                <Button variant="outline" onClick={() => setShowToast(true)}>Trigger Notification</Button>
                <Typography variant="caption" className="text-slate-400 italic">Appears at bottom-center of screen.</Typography>
              </div>
            }
            props={[
              { name: "message", type: "string", description: "Body text." },
              { name: "visible", type: "boolean", description: "State trigger." },
              { name: "onClose", type: "function", description: "Called after delay." }
            ]}
            usability={[
              "Best for CRUD confirmation (e.g. 'Patient Saved').",
              "Auto-dismisses after 3000ms by default."
            ]}
            accessibility={[
              "Role='alert' for immediate reading by screen readers.",
              "Animated entrance/exit."
            ]}
            keyboard={["N/A"]}
            antipatterns={[
              "Don't use for critical errors that require user action (use Modal).",
              "Avoid stacked toasts if possible."
            ]}
            sourceCode={ToastRaw}
          />
        </div>

        {/* 16. PROGRESS */}
        <div id="progress">
          <ComponentShowcase 
            name="Progress"
            description="Visual completion indicator for data processing or file uploads."
            preview={
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-primary">
                  <span>CLINICAL ANALYSIS</span>
                  <span>82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            }
            props={[
              { name: "value", type: "number", default: "0", description: "Percentage (0-100)." },
              { name: "variant", type: "'brand' | 'success'", default: "'brand'", description: "Color mapping." }
            ]}
            usability={[
              "Updates should be smooth or debounced.",
              "Include a label explaining WHAT is being processed."
            ]}
            accessibility={[
              "ARIA-valuenow reflects current progress.",
              "Progress role used."
            ]}
            keyboard={["N/A"]}
            antipatterns={[
              "Don't use for indeterminate states (use a Spinner instead).",
              "Avoid using for very fast processes (under 500ms)."
            ]}
            sourceCode={ProgressRaw}
          />
        </div>

        {/* 17. SKELETON */}
        {/* 23. REMOVED */}

        {/* 22. STATUS BADGE */}
        {/* CATEGORY: CLINICAL INDICATORS */}
        <SectionDivider title="Clinical Indicators" icon={<Activity size={24} />} subtitle="Domain-specific markers for assessment metadata." />

        <div id="statusbadge">
          <ComponentShowcase 
            name="StatusBadge"
            description="High-level semantic status indicator for clinical records."
            preview={
              <div className="flex flex-wrap gap-6 items-center justify-center p-8 bg-white border border-divider rounded-2xl">
                <div className="text-center space-y-2"><StatusBadge status="approved" /><p className="text-[9px] font-bold text-slate-400">APPROVED</p></div>
                <div className="text-center space-y-2"><StatusBadge status="missing" /><p className="text-[9px] font-bold text-slate-400">MISSING</p></div>
                <div className="text-center space-y-2"><StatusBadge status="in-progress" /><p className="text-[9px] font-bold text-slate-400">IN PROGRESS</p></div>
                <div className="text-center space-y-2"><StatusBadge status="evidence" /><p className="text-[9px] font-bold text-slate-400">EVIDENCE</p></div>
              </div>
            }
            props={[
              { name: "status", type: "'approved' | 'missing' | 'in-progress' | 'evidence'", description: "Clinical lifecycle state." }
            ]}
            usability={[
              "Icons provide redundancy for color-deficient users.",
              "Consistent sizing for table layouts."
            ]}
            accessibility={["High-contrast color profiles for readable text."]}
            keyboard={["N/A"]}
            antipatterns={[
              "Don't use for general tags (use Badge).",
              "Avoid changing the colors mapped to these statuses."
            ]}
            sourceCode={StatusBadgeRaw}
          />
        </div>

        {/* 23. CONFIDENCE BADGE */}
        <div id="confidencebadge">
          <ComponentShowcase 
            name="ConfidenceBadge"
            description="Visual indicator of AI mapping precision."
            preview={
              <div className="flex gap-8 items-center justify-center">
                 <ConfidenceBadge confidence="high" />
                 <ConfidenceBadge confidence="medium" />
                 <ConfidenceBadge confidence="low" />
              </div>
            }
            props={[
              { name: "confidence", type: "'high' | 'medium' | 'low'", description: "Calculated ML score." }
            ]}
            usability={[
              "Low confidence mappings should always trigger user review mode.",
              "Color transitions from Teal (Safe) to Orange (Review)."
            ]}
            accessibility={["Explicit labels (e.g. 'Low Confidence') used."]}
            keyboard={["N/A"]}
            antipatterns={["Avoid using for human-verified data (uses different badges)."]}
            sourceCode={ConfidenceBadgeRaw}
          />
        </div>

        <div id="relevancebadge">
          <ComponentShowcase 
            name="RelevanceBadge"
            description="Visual indicator of relevance."
            preview={
              <div className="flex gap-8 items-center justify-center">
                 <RelevanceBadge relevance="high" />
                 <RelevanceBadge relevance="medium" />
                 <RelevanceBadge relevance="low" />
              </div>
            }
            props={[
              { name: "relevance", type: "'high' | 'medium' | 'low'", description: "Calculated relevance." }
            ]}
            usability={[
              "Shows how relevant an item is.",
            ]}
            accessibility={["Explicit labels used."]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={RelevanceBadgeRaw}
          />
        </div>

        <div id="impactbadge">
          <ComponentShowcase 
            name="ImpactBadge"
            description="Visual indicator of impact."
            preview={
              <div className="flex gap-8 items-center justify-center">
                 <ImpactBadge impact="high" />
                 <ImpactBadge impact="medium" />
                 <ImpactBadge impact="low" />
              </div>
            }
            props={[
              { name: "impact", type: "'high' | 'medium' | 'low'", description: "Calculated impact." }
            ]}
            usability={[
              "Shows the impact level of an item.",
            ]}
            accessibility={["Explicit labels used."]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={ImpactBadgeRaw}
          />
        </div>

        {/* 24. EMPTY STATE */}
        <div id="emptystate">
          <ComponentShowcase 
            name="EmptyState"
            description="The 'zero-data' UI pattern used to guide users forward."
            preview={
               <div className="w-full border border-divider border-dashed rounded-2xl p-8 bg-slate-50">
                 <EmptyState 
                   icon={FileText}
                   title="No Clinical Notes Found"
                   description="Patient transcript has not been uploaded yet for this session."
                   actionLabel="Upload Transcript"
                   onAction={() => {}}
                 />
               </div>
            }
            props={[
              { name: "icon", type: "LucideIcon", description: "Central visual focal point." },
              { name: "actionLabel", type: "string", description: "CTA button text." }
            ]}
            usability={[
              "Always provide a clear action or description of NEXT steps.",
              "Icon should be representative of the missing data type."
            ]}
            accessibility={["Screen readers focus on title first."]}
            keyboard={["Action button is in normal tab order."]}
            antipatterns={[
              "Don't leave users stranded with only a 'No Data' title.",
              "Avoid using complex imagery (stick to Lucide icons)."
            ]}
            sourceCode={EmptyStateRaw}
          />
        </div>

        {/* 26. SYS BADGE */}
        <div id="sysbadge">
          <ComponentShowcase 
            name="SysBadge"
            description="A specialized system-generated data badge, typically used for AI insights."
            preview={
              <div className="flex gap-4 items-center justify-center">
                <SysBadge />
                <SysBadge className="bg-primary-light border-primary/10 text-primary" />
              </div>
            }
            props={[
              { name: "className", type: "string", description: "Standard tailwind overrides." }
            ]}
            usability={[
              "Use for any data point that was not manually entered by HR/Clinician.",
              "Visual style differentiates it from standard status badges."
            ]}
            accessibility={["Sparkle icon indicates automated origin."]}
            keyboard={["N/A"]}
            antipatterns={["Don't use for human-verified confirmed states."]}
            sourceCode={SysBadgeRaw}
          />
        </div>

        <div id="filetypebadge">
          <ComponentShowcase 
            name="FileTypeBadge"
            description="A component used to visually display a file type."
            preview={
              <div className="flex gap-4 items-center justify-center">
                <FileTypeBadge type="PDF" />
                <FileTypeBadge type="DOCX" />
                <FileTypeBadge type="XLS" />
                <FileTypeBadge type="TXT" />
              </div>
            }
            props={[
              { name: "type", type: "string", description: "The type of the file." },
              { name: "className", type: "string", description: "Standard tailwind overrides." },
              { name: "showIcon", type: "boolean", default: "true", description: "Toggles icon visibility." }
            ]}
            usability={[
              "Used mostly in Document Workspaces.",
            ]}
            accessibility={["N/A"]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={FileTypeBadgeRaw}
          />
        </div>

        {/* CATEGORY: DATA & VISUALS */}
        <SectionDivider title="Data & Visuals" icon={<BarChart3 size={24} />} subtitle="Information-dense displays for clinical evidence." />

        <div id="datapoint">
          <ComponentShowcase 
            name="DataPoint"
          description="Key-Value pair layout for structured clinical metadata."
          preview={
            <div className="grid grid-cols-2 gap-12 p-8 bg-slate-50 rounded-xl border border-divider">
               <DataPoint label="Diagnosis" value="Major Depressive Disorder" />
               <DataPoint label="Severity" value={<Badge variant="error" className="h-4 text-[9px] uppercase tracking-tighter">High Risk</Badge>} />
               <DataPoint label="Provider" value="Dr. Sarah Chen" />
               <DataPoint label="Last Update" value="Today, 09:42 AM" />
            </div>
          }
          props={[
            { name: "label", type: "string", description: "Key name." },
            { name: "value", type: "ReactNode", description: "Data content." }
          ]}
          usability={[
            "Align labels consistently on the left or top.",
            "Use small badges for status-based values."
          ]}
          accessibility={["Label-Value associations maintained."]}
          keyboard={["N/A"]}
          antipatterns={[
            "Don't use for paragraph-length text.",
            "Avoid missing labels."
          ]}
          sourceCode={DataPointRaw}
        />
        </div>

        <div id="evidencecard">
          <ComponentShowcase 
            name="Evidence Card"
            description="Standard card for displaying clinical evidence snippets with metadata, status badges, and quick actions."
            preview={
              <div className="w-full max-w-lg">
                <EvidenceCard 
                  evidence={{
                    id: "ev-demo-1",
                    text: "I feel like my heart is racing whenever I have to speak in front of others.",
                    type: "verbatim",
                    timestamp: "05:12",
                    tags: ['Physical', 'Social'],
                    isUserGenerated: false,
                    hasConflict: true
                  }}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            }
            props={[
              { name: "evidence", type: "any", description: "The evidence object containing text, type, and metadata." },
              { name: "onEdit", type: "function", description: "Callback for edit action." },
              { name: "onDelete", type: "function", description: "Callback for delete action (returns evidence ID)." },
              { name: "onClick", type: "function", description: "Callback for clicking the card." }
            ]}
            usability={[
              "Encapsulates complex evidence rendering logic.",
              "Automates badge selection based on content type (Verbatim vs Observation)."
            ]}
            accessibility={["Interactive elements have distinct hover and focus states."]}
            keyboard={["Standard button tab order for actions."]}
            antipatterns={["Overloading the card with more than 3 secondary metadata points."]}
            sourceCode={EvidenceCardRaw}
          />
        </div>

        <div id="entitycard">
          <ComponentShowcase 
            name="EntityCard"
            description="The base container for all clinical entities (Patients, Sessions, Assessments)."
            preview={
              <div className="w-full max-w-2xl">
                <EntityCard 
                  title="John Archer"
                  summary="Active since Feb 2026. Last session conducted 4 days ago."
                  statusBadge={<StatusBadge status="approved" />}
                  metadata={[
                    { label: "ID", value: "PRT-902" },
                    { label: "Age", value: "34" },
                    { label: "Risk", value: <Badge variant="error" className="h-4 py-0 text-[9px]">High</Badge> }
                  ]}
                  rightAction={<Button variant="outline" size="sm">Modify</Button>}
                />
              </div>
            }
            props={[
              { name: "title", type: "string", description: "Main entity name." },
              { name: "statusBadge", type: "ReactNode", description: "Top-level status marker." },
              { name: "metadata", type: "Array", description: "Label/Value pairs for details." }
            ]}
            usability={[
              "Hover animations are disabled by default for static cards.",
              "Click handlers animate the border to the brand color."
            ]}
            accessibility={["Semantic header levels used."]}
            keyboard={["Supports tab-focus triggers if onClick is present."]}
            antipatterns={["Don't overload with more than 4 metadata points."]}
            sourceCode={EntityCardRaw}
          />
        </div>

        <div id="assessmentcard">
          <ComponentShowcase 
            name="AssessmentCard"
            description="A specialized EntityCard used for tracking assessment status and links."
            preview={
              <div className="w-full max-w-2xl">
                <AssessmentCard 
                  title="K-10 Assessment"
                  subtitle="Clinical measure of psychological distress."
                  status="in-progress"
                  date="May 11, 2026"
                  overallImpression="Elevated distress levels observed."
                  onViewResult={() => {}}
                />
              </div>
            }
            props={[
              { name: "status", type: "string", description: "Standard status keywords." },
              { name: "overallImpression", type: "string", description: "Quick clinical summary." }
            ]}
            usability={[
              "Includes integrated 'Copy Link' functionality for non-completed assessments.",
              "Visual hierarchy prioritizes the 'View Workspace' action."
            ]}
            accessibility={["Button roles correctly identified."]}
            keyboard={["Full keyboard support for copy-to-clipboard action."]}
            antipatterns={["Avoid using for non-assessment data types."]}
            sourceCode={AssessmentCardRaw}
          />
        </div>

        <div id="conditiontable">
          <ComponentShowcase 
            name="ConditionTable"
            description="A specialized table for listing clinical conditions with sorting support."
            preview={
              <div className="w-full bg-white border border-divider rounded-xl overflow-hidden">
                 <ConditionTable 
                   paged={[
                     { id: "1", name: "Generalized Anxiety Disorder", status: "Approved", category: "Anxiety Disorders", guideline: "DSM-5-TR", updated: "2026-05-01" } as any,
                     { id: "2", name: "Major Depressive Disorder", status: "In Review", category: "Mood Disorders", guideline: "DSM-5-TR", updated: "2026-05-04" } as any
                   ]}
                   sortField="name"
                   sortOrder="asc"
                   onSort={() => {}}
                   onRowClick={() => {}}
                 />
              </div>
            }
            props={[
              { name: "paged", type: "Condition[]", description: "Array of condition objects." },
              { name: "onSort", type: "function", description: "Sort field change handler." }
            ]}
            usability={[
              "Column headers are interactive if sorting is supported.",
              "Rows provide subtle hover states for row-level actions."
            ]}
            accessibility={["Table headers focusable for sorting."]}
            keyboard={["Arrow keys can be used to navigate rows if focused."]}
            antipatterns={["Don't use for small datasets where a list card is better."]}
            sourceCode={ConditionTableRaw}
          />
        </div>

        <div id="graphs">
          <ComponentShowcase 
            name="Graphs (Recharts)"
            description="Standard data visualization using Recharts."
            preview={
              <div className="w-full bg-white border border-divider rounded-xl overflow-hidden p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Mon', entries: 4 },
                    { name: 'Tue', entries: 3 },
                    { name: 'Wed', entries: 7 },
                    { name: 'Thu', entries: 2 },
                    { name: 'Fri', entries: 5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="entries" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            }
            props={[
              { name: "data", type: "Array", description: "Array of data objects to visualize." }
            ]}
            usability={[
              "Use for visualizing longitudinal data.",
              "Keep tooltips concise."
            ]}
            accessibility={["Provide ARIA labels describing the chart trend."]}
            keyboard={["N/A"]}
            antipatterns={["Cluttering the chart with too many data points."]}
            sourceCode={"// Uses Recharts library"}
          />
        </div>

        {/* CATEGORY: NAVIGATION & PROGRESS */}
        <SectionDivider title="Navigation & Progress" icon={<Route size={24} />} subtitle="Moving between views and managing workspace hierarchy." />

        {/* 18. TABS */}
        <div id="tabs">
          <ComponentShowcase 
            name="Tabs"
            description="Workspace segmenter for navigating multi-view data."
            preview={
              <div className="w-full max-w-lg">
                <Tabs 
                  tabs={['Overview', 'Analysis', 'Evidence', 'Protocol']} 
                  active={activeTab} 
                  onSelect={setActiveTab} 
                />
                <div className="mt-8 p-12 bg-slate-50 border border-divider border-dashed rounded-xl flex items-center justify-center">
                   <Typography variant="body-sm" className="italic text-slate-400">Viewing {activeTab} Data</Typography>
                </div>
              </div>
            }
            props={[
              { name: "tabs", type: "string[]", description: "List of tab names." },
              { name: "active", type: "string", description: "Currently selected key." }
            ]}
            usability={[
              "Keep tab count between 2 and 6 for visibility.",
              "Labels should be 1-word nouns."
            ]}
            accessibility={[
              "ARIA-selected attribute updated dynamically.",
              "Correct tablist/tab/tabpanel structure."
            ]}
            keyboard={[
              "Arrow keys navigate tab list.",
              "Home/End for first/last tab."
            ]}
            antipatterns={[
              "Don't use for main app navigation (use Navbar).",
              "Avoid multi-line tabs."
            ]}
            sourceCode={TabsRaw}
          />
        </div>

        {/* 19. TABLE FOOTER */}
        <div id="tablefooter">
          <ComponentShowcase 
            name="TableFooter"
            description="Managed pagination and result count indicator for lists."
            preview={
              <div className="w-full border border-divider rounded-lg overflow-hidden bg-white">
                <div className="h-32 flex items-center justify-center italic text-xs text-slate-300">Data Table Content</div>
                <TableFooter 
                  count={128} 
                  rpp={10} 
                  setRpp={() => {}} 
                  page={0} 
                  setPage={() => {}} 
                  total={13} 
                  s={1} 
                  e={10} 
                />
              </div>
            }
            props={[
              { name: "count", type: "number", description: "Total records." },
              { name: "rpp", type: "number", description: "Rows per page." },
              { name: "page", type: "number", description: "Current page index (0-based)." },
              { name: "total", type: "number", description: "Total pages." },
              { name: "s", type: "number", description: "Start index." },
              { name: "e", type: "number", description: "End index." }
            ]}
            usability={[
              "Auto-calculates 'Showing X of Y' display text.",
              "Arrows are disabled at logical boundaries (Page 1 or End)."
            ]}
            accessibility={[
              "Pagination links announced clearly.",
              "Button states reflect disabled status."
            ]}
            keyboard={["Enter/Space to trigger page jump."]}
            antipatterns={[
              "Don't show pagination if total records < pageSize.",
              "Avoid placing inside scrollable table containers."
            ]}
            sourceCode={TableFooterRaw}
          />
        </div>

        <div id="progressbanner">
          <ComponentShowcase 
            name="ProgressBanner"
            description="A top-aligned banner showing systemic progress toward a goal."
            preview={
              <div className="w-full relative bg-slate-100 rounded-xl overflow-hidden">
                 <ProgressBanner 
                   title="Assessment Lifecycle"
                   subtitle="Patient workspace configuration"
                   current={6} 
                   total={10} 
                   progressLabel="steps verified"
                   actionLabel="Finalize Review"
                   onAction={() => {}}
                   isActionActive={true}
                   breakdown={[
                     { label: "Identity", current: 1, total: 1 },
                     { label: "Symptoms", current: 4, total: 6 },
                     { label: "History", current: 1, total: 3 }
                   ]}
                 />
              </div>
            }
            props={[
              { name: "title", type: "string", description: "Main banner title." },
              { name: "current", type: "number", description: "Current progress count." },
              { name: "total", type: "number", description: "Total target count." },
              { name: "breakdown", type: "array", description: "Segmented progress details." }
            ]}
            usability={[
              "Pinned to top of assessment workspaces.",
              "Provides immediate context for remaining required work."
            ]}
            accessibility={["Color-coded based on completion tiers."]}
            keyboard={["N/A"]}
            antipatterns={["Don't use for small processing tasks (use Progress bar)."]}
            sourceCode={ProgressBannerRaw}
          />
        </div>

        <div id="tabbar">
          <ComponentShowcase 
            name="TabBar"
            description="The Threadline specific Tab Bar component."
            preview={
              <div className="w-full bg-slate-50 border border-divider rounded-xl p-4">
                 <TabBar 
                   tabs={["Overview", "Evidence", "Documents", "Clinical Notes"]}
                   active="Evidence"
                   onSelect={() => {}}
                   badges={{ Evidence: 3, Documents: 1 }}
                 />
              </div>
            }
            props={[
              { name: "tabs", type: "string[]", description: "Array of tab labels." },
              { name: "active", type: "string", description: "Currently active tab." },
              { name: "badges", type: "Record<string, number>", description: "Notification counts on tabs." }
            ]}
            usability={["Domain-specific navigation."]}
            accessibility={["Use aria controls for the tab panels."]}
            keyboard={["Keyboard navigation across tabs."]}
            antipatterns={["N/A"]}
            sourceCode={TabBarRaw}
          />
        </div>

        <div id="threadlinenavbar">
          <ComponentShowcase 
            name="ThreadlineNavbar"
            description="The main navigation header for the application."
            preview={
              <div className="w-full">
                 <ThreadlineNavbar />
              </div>
            }
            props={[]}
            usability={["Top level navigation."]}
            accessibility={["ARIA landmark role."]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={ThreadlineNavbarRaw}
          />
        </div>

        {/* CATEGORY: WORKSPACE SPECIALIZATIONS */}
        <SectionDivider title="Workspace Specializations" icon={<Network size={24} />} subtitle="Complex domain-specific components for clinical review." />

        {/* 30. REVIEW ITEM */}
        <div id="reviewcategory">
          <ComponentShowcase 
            name="Review Category"
            description="A collapsible container for grouping related clinical markers or evidence items during the mapped validation flow."
            preview={
              <div className="w-full max-w-sm bg-white border border-divider rounded-xl overflow-hidden shadow-sm">
                <ReviewCategory
                  title="Social Communication"
                  isOpen={true}
                  items={[
                    { id: "e1", label: "Eye Contact Deficit", type: "criteria", score: "0.85" },
                    { id: "e2", label: "Parallel Play Only", type: "criteria", score: "0.92" }
                  ]}
                  activeType="criteria"
                  activeItemLabel="e1"
                  deferredItems={[]}
                  acceptedItems={["e2"]}
                  rejectedItems={{}}
                  onSelect={(id) => console.log('Selected', id)}
                >
                   <div className="p-3 bg-slate-50 border-t border-divider">
                     <Typography variant="caption" className="text-slate-400 font-medium italic">Additional nested content can go here.</Typography>
                   </div>
                </ReviewCategory>
              </div>
            }
            props={[
              { name: "title", type: "string", description: "Display name for the category." },
              { name: "items", type: "any[]", description: "List of items to render as ReviewItems." },
              { name: "activeType", type: "string", description: "Currently active selection type." },
              { name: "activeItemLabel", type: "string", description: "ID of currently active item." },
              { name: "deferredItems", type: "string[]", description: "List of IDs in deferred state." },
              { name: "acceptedItems", type: "string[]", description: "List of IDs in accepted state." },
              { name: "rejectedItems", type: "Record<string, string>", description: "Map of rejected IDs to rationale." }
            ]}
            usability={[
              "Primary structural unit for the Evidence Workspace.",
              "Supports lazy rendering via CollapsibleSection."
            ]}
            accessibility={["Keyboard focusable headers for collapse toggle."]}
            keyboard={["Enter/Space to toggle collapse."]}
            antipatterns={["Nesting categories more than 2 levels deep."]}
            sourceCode={ReviewCategoryRaw}
          />
        </div>

        <div id="reviewitem">
          <ComponentShowcase 
            name="ReviewItem"
            description="A line-item component for individual data verification tasks."
            preview={
              <div className="w-full max-w-2xl bg-white border border-divider rounded-xl overflow-hidden">
                 <ReviewItem 
                   id="rev-1"
                   title="Finding A: Depressed Mood"
                   description="Patient mentions 'feeling down most of the day' for the past 3 weeks."
                   source="Intake Transcript - Page 4"
                   confidence="high"
                   onApprove={() => {}}
                   onReject={() => {}}
                 />
                 <Separator />
                 <ReviewItem 
                   id="rev-2"
                   title="Finding B: Sleep Disturbance"
                   description="Reports waking up at 3am consistently."
                   source="Intake Transcript - Page 5"
                   confidence="medium"
                   onApprove={() => {}}
                   onReject={() => {}}
                 />
              </div>
            }
            props={[
              { name: "title", type: "string", description: "Item title." },
              { name: "confidence", type: "string", description: "AI confidence tier." }
            ]}
            usability={[
              "Dual-action buttons (Approve/Reject) allow for quick verification flow.",
              "Source attribution links back to original evidence."
            ]}
            accessibility={["Buttons use semantic aria-labels."]}
            keyboard={["Shortcuts can be mapped to Approve/Reject actions."]}
            antipatterns={["Don't hide the description; it's essential for the review decision."]}
            sourceCode={ReviewItemRaw}
          />
        </div>

        {/* 34. INTERP ROW */}
        <div id="interprow">
          <ComponentShowcase 
            name="InterpRow"
            description="A clinical interpretation row that supports AI insights and manual editing."
            preview={
              <div className="w-full max-w-2xl bg-white border border-divider rounded-xl overflow-hidden flex flex-col">
                 <InterpRow 
                   title="Clinical Impression"
                   content="Patient demonstrates classic presentation of moderate psychological distress with primary indicators in Criterion A and C."
                   defaultOpen={true}
                   editable={true}
                 />
                 <Separator />
                 <InterpRow 
                   title="AI Observation"
                   content="Analysis of intake transcript suggests elevated baseline anxiety levels compared to previous assessment (Session #902)."
                 />
              </div>
            }
            props={[
              { name: "title", type: "string", description: "Header text." },
              { name: "content", type: "string", description: "Body text content." },
              { name: "editable", type: "boolean", description: "Enables manual edit mode." }
            ]}
            usability={[
              "Built on top of CollapsibleSection.",
              "Integrated SysBadge indicates non-edited AI content."
            ]}
            accessibility={["Standard interactive elements used for edit icons."]}
            keyboard={["Enter/Space to toggle collapse."]}
            antipatterns={["Don't use for binary data points (use DataPoint)."]}
            sourceCode={InterpRowRaw}
          />
        </div>

        {/* 35. REPORT SECTION */}
        <div id="reportsection">
          <ComponentShowcase 
            name="ReportSection"
            description="A semantic wrapper for report content segments."
            preview={
              <div className="w-full max-w-2xl bg-white border border-divider rounded-xl overflow-hidden">
                 <ReportSection title="Clinical Findings" reviewBadge={<Badge variant="success">Verified</Badge>}>
                    <div className="p-4 text-sm text-text-secondary">
                      All findings for Generalized Anxiety Disorder (F41.1) met based on comprehensive review of intake and sessions.
                    </div>
                 </ReportSection>
              </div>
            }
            props={[
              { name: "title", type: "string", description: "Section header title." },
              { name: "noCollapse", type: "boolean", description: "Disables expand/collapse logic." },
              { name: "reviewBadge", type: "ReactNode", description: "Optional verification marker." }
            ]}
            usability={[
              "Includes a persistent edit icon for rapid refinement.",
              "Visual style matches clinical report hierarchy."
            ]}
            accessibility={["Correct heading level mapping."]}
            keyboard={["Standard collapsible triggers."]}
            antipatterns={["Don't use for small data points that don't need grouping."]}
            sourceCode={ReportSectionRaw}
          />
        </div>

        {/* 36. CONFLICT RESOLUTION MODAL */}
        <div id="conflictresolutionmodal">
          <ComponentShowcase 
            name="ConflictResolutionModal"
            description="A specialized modal for handling multi-source data inconsistencies."
            preview={
              <div className="flex items-center justify-center py-12">
                 <Button onClick={() => openModal('conflict')}>Open Conflict Demo</Button>
                 <ConflictResolutionModal 
                   isOpen={activeModal === 'conflict'}
                   conflicts={[
                     { description: "Intake says 24 years old, Transcript says 26." },
                     { description: "Clinical note lists 3 symptoms, Intake lists 2." }
                   ]}
                   onResolve={() => alert('Resolving...')}
                   onSkip={closeModal}
                 />
              </div>
            }
            props={[
              { name: "conflicts", type: "array", description: "List of conflict objects." },
              { name: "isOpen", type: "boolean", description: "Modal visibility state." }
            ]}
            usability={[
              "Uses high-visibility Error theme (red) to signal urgency.",
              "Limits conflict list height to maintain focus on actions."
            ]}
            accessibility={["Focus trapped within modal correctly."]}
            keyboard={["ESC to skip (close)."]}
            antipatterns={["Don't use for generic success/info messages."]}
            sourceCode={ConflictResolutionModalRaw}
          />
        </div>

        {/* 37. EVIDENCE WORKSPACE CTAS */}
        <div id="evidenceworkspacectas">
          <ComponentShowcase 
            name="EvidenceWorkspaceCTAs"
            description="Large, high-contrast action buttons for data verification."
            preview={
              <div className="w-full max-w-2xl">
                 <EvidenceWorkspaceCTAs 
                   type="session"
                   onAccept={() => {}}
                   onReject={() => {}}
                   onModify={() => {}}
                   onDefer={() => {}}
                 />
              </div>
            }
            props={[
              { name: "type", type: "string", description: "Context type (session, criteria, etc.)." },
              { name: "onAccept", type: "function", description: "Handler for positive verification." }
            ]}
            usability={[
              "Uses large touch targets (48px+ height).",
              "Color-coded borders reinforce action intent (Success, Error, Brand)."
            ]}
            accessibility={["Icons have implicit descriptive meaning."]}
            keyboard={["Often mapped to 1-4 number keys in workspace contexts."]}
            antipatterns={["Don't use inside small tables or compact lists."]}
            sourceCode={EvidenceWorkspaceCTAsRaw}
          />
        </div>

        <div id="accordiontags">
          <ComponentShowcase 
            name="AccordionTags"
            description="Collapsible lists of grouped tags and extracted evidence snippets."
            preview={
              <div className="w-full">
                 <AccordionTags 
                   tags={["Anxiety", "Depression"]}
                   findings={[
                     { text: "Patient reports severe worry.", tags: ["anxiety"], type: "verbatim", sourceSession: "Session 1" },
                     { text: "Frequent low moods.", tags: ["depression"], type: "clinical_note", sourceSession: "Session 2" }
                   ]}
                 />
              </div>
            }
            props={[
              { name: "tags", type: "string[]", description: "List of top level tags." },
              { name: "findings", type: "any[]", description: "Array of extracted text snippets." }
            ]}
            usability={["Used inside the clinical evidence panel."]}
            accessibility={["N/A"]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={AccordionTagsRaw}
          />
        </div>

        <div id="assessmentgate">
          <ComponentShowcase 
            name="AssessmentGate"
            description="Blocks views until an assessment is selected."
            preview={
              <div className="w-full h-[600px] border border-divider overflow-hidden bg-slate-50 relative pointer-events-none">
                 <AssessmentGate onNavigateToAssessments={() => {}}>
                    <div className="p-8 text-center text-slate-400">Content that would be visible if selected</div>
                 </AssessmentGate>
              </div>
            }
            props={[
              { name: "onNavigateToAssessments", type: "function", description: "Callback to route." }
            ]}
            usability={["Contextual blocker."]}
            accessibility={["N/A"]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={AssessmentGateRaw}
          />
        </div>

        <div id="clinicalnotessidebar">
          <ComponentShowcase 
            name="ClinicalNotesSidebar"
            description="A minimal sidebar for taking or viewing notes concurrently."
            preview={
              <div className="w-full h-[600px] border border-divider overflow-hidden relative" style={{ transform: 'scale(1)'}}>
                 <div className="absolute right-0 top-0 bottom-0 pointer-events-none">
                   <ClinicalNotesSidebar assessmentId="test" clientId="test" />
                 </div>
              </div>
            }
            props={[]}
            usability={["Pinned on the right side of workspaces."]}
            accessibility={["N/A"]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={ClinicalNotesSidebarRaw}
          />
        </div>

        <div id="assessmentcomparesidebar">
          <ComponentShowcase 
            name="AssessmentCompareSidebar"
            description="Shows the prior snapshot to compare longitudinal progression."
            preview={
              <div className="w-full h-[600px] border border-divider overflow-hidden relative" style={{ transform: 'scale(1)'}}>
                 <div className="absolute left-0 top-0 bottom-0 pointer-events-none">
                   <AssessmentCompareSidebar activeConditions={[]} />
                 </div>
              </div>
            }
            props={[]}
            usability={["Used in condition tracker."]}
            accessibility={["N/A"]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={AssessmentCompareSidebarRaw}
          />
        </div>

        <div id="workspacestatusbar">
          <ComponentShowcase 
            name="WorkspaceStatusBar"
            description="Floating cognitive loop tracker and error flagger."
            preview={
              <WorkspaceAlertsProvider>
                <div className="w-full bg-slate-50 p-6 pointer-events-none">
                   <WorkspaceStatusBar onNavigate={() => {}} />
                </div>
              </WorkspaceAlertsProvider>
            }
            props={[]}
            usability={["Provides system state awareness."]}
            accessibility={["N/A"]}
            keyboard={["N/A"]}
            antipatterns={["N/A"]}
            sourceCode={WorkspaceStatusBarRaw}
          />
        </div>

        {/* CATEGORY: TEMPLATES */}
        <SectionDivider title="Templates" icon={<Database size={24} />} subtitle="Full-screen patterns for functional application views." />

        <Separator className="my-24" />
        
        <div className="space-y-4 mb-12">
          <Typography variant="h2" className="text-primary italic tracking-tight">Layout Templates & Boilerplates</Typography>
          <Typography variant="sub" className="text-slate-500">
            Full-screen patterns combining multiple components into high-fidelity functional views.
          </Typography>
        </div>

        {/* 40. LIST VIEW TEMPLATE */}
        <div id="list-view-boilerplate">
          <TemplateShowcase 
            name="List View Boilerplate"
            description="A standard administrative list with structured filters, keyword search, and density-optimized tables."
            preview={<ListViewTemplate />}
            sourceCode={ListViewTemplateRaw}
          />
        </div>

        {/* 41. DETAIL VIEW TEMPLATE */}
        <div id="detail-view-boilerplate">
          <TemplateShowcase 
            name="Detail View Boilerplate"
            description="A comprehensive entity management view using DetailViewLayout with master-detail sidebars."
            preview={<DetailViewTemplate />}
            sourceCode={DetailViewTemplateRaw}
          />
        </div>

        {/* 42. WORKSPACE TEMPLATE */}
        <div id="clinical-workspace-boilerplate">
          <TemplateShowcase 
            name="Clinical Workspace Boilerplate"
            description="High-density 3-column analysis workspace with clinical index, review area, and AI insights."
            preview={<WorkspaceTemplate />}
            sourceCode={WorkspaceTemplateRaw}
          />
        </div>

        {/* 43. FORM TEMPLATE */}
        <div id="standard-form-boilerplate">
          <TemplateShowcase 
            name="Standard Form Boilerplate"
            description="A semantic form layout with validation-ready inputs, segmented areas, and clear action footers."
            preview={<FormTemplate />}
            sourceCode={FormTemplateRaw}
          />
        </div>

        {/* CATEGORY: STRATEGY */}
        <SectionDivider title="User Journey" icon={<Compass size={24} />} subtitle="Technical and functional mapping of the core clinical lifecycle." />
        
        <div id="userjourney">
          <UserJourneyDocumentation />
        </div>

        <div id="userstories">
          <UserStoriesDocumentation />
        </div>

        <div id="businessrules">
          <BusinessRulesDocumentation />
        </div>
      </div>
    </div>

      <Toast message="Action performed successfully!" visible={showToast} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Diagnostic Review"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel Review</Button>
            <Button variant="brand" onClick={() => setShowModal(false)}>Finalize Analysis</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Typography variant="body" className="leading-relaxed">
            Please confirm that the clinical findings gathered matches the DSM-5 findings for this subject. Finalization will notify the primary physician.
          </Typography>
          <div className="p-4 bg-primary-light border border-primary/10 rounded-xl flex items-start gap-3">
             <AlertCircle className="text-primary mt-0.5" size={16} />
             <Typography variant="caption" className="text-primary font-medium italic">
                System confidence for this report is High (92%). Use manual override if discrepancies are found in transcript #002.
             </Typography>
          </div>
        </div>
      </Modal>
    </div>
  );
}
