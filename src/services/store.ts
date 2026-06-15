import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types from original localStore.ts ---

export interface ClientRecord {
  id: string;
  name: string;
  extId: string;
  clinicians: string[];
  ref: string;
  consent: boolean;
  hasConflicts: boolean;
  missingDocs: string[];
  clinicalNotes: {
    author: string;
    timestamp: string;
    text: string;
    tag?: string;
  }[];
  lastUpdated: string;
}

export interface AssessmentRecord {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  date?: string;
  description?: string;
  notes?: string;
  overallImpression?: string;
  score?: string;
  percentile?: string;
  descriptor?: string;
  lifecycleState: 'created' | 'in-progress' | 'deferred' | 'completed';
  deferralDetails?: {
    missingInfo: string;
    nextStep: string;
    deferDate: string;
  };
  reviewedSections: string[];
  reviewedSectionsMap?: Record<string, string[]>;
  reportApproved: boolean;
  reportApprovedAt?: string;
  completenessAcknowledged?: boolean;
  keyFindings?: string;
  clinicalThreadAnalysis?: string;
  physicalArousal?: string;
  cognitiveFocus?: string;
  nextSteps?: any[];
  findings?: any[];
}

export interface EvidenceDecisionStore {
  acceptedItems: { id: string, rationale: string, timestamp: string }[];
  rejectedItems: Record<string, { rationale: string, timestamp: string }>;
  deferredItems: { id: string, reason: 'conflict' | 'missing_document' | 'insufficient_data' | 'timing', timestamp: string }[];
  modifiedItems: { id: string, originalValue: any, newValue: any, timestamp: string }[];
  hasSkippedConflicts: boolean;
  conflictSkippedAt: string | null;
}

export interface SessionRecord {
  id: string;
  date: string;
  focus: string;
  notes: string;
  score?: string;
  relevanceCause?: string;
  addedAt?: string;
  addedBy?: string;
  evidenceLabels?: string[];
  evidence?: any[];
  hasConflict?: boolean;
  description?: string;
  timestamp?: string;
  context?: string;
  referralReason?: string;
  referredTo?: string;
  referredBy?: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadDate: string;
  creationDate: string;
  version: string;
  uploadedAt: string;
  description?: string;
  findings?: any[];
}

export interface CognitiveLoopRecord {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  stepHistory: { step: number, label: string, timestamp: string }[];
  hypothesisText: string | null;
  hypothesisSubmittedAt: string | null;
  impressionFormulated: boolean;
  impressionFormulatedAt: null | string;
  isDeferred: boolean;
  deferredAt: null | string;
  reportApproved: boolean;
  reportApprovedAt: null | string;
  acceptedMappings: { id: string, label: string, confidence: number }[];
  conflicts: { id: string, description: string }[];
  missingDocuments: { id: string, name: string, description?: string }[];
}

// --- Application Store (Active Navigation & Workspace State) ---

interface AppState {
  activeAssessmentId: string | null;
  activeClientId: string | null;
  useGroupedTabs: boolean;
  setActiveAssessmentId: (id: string | null) => void;
  setActiveClientId: (id: string | null) => void;
  setUseGroupedTabs: (value: boolean) => void;
  resetToDefaults: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeAssessmentId: "1",
      activeClientId: "125566",
      useGroupedTabs: true,
      setActiveAssessmentId: (id) => set({ activeAssessmentId: id }),
      setActiveClientId: (id) => set({ activeClientId: id }),
      setUseGroupedTabs: (value) => set({ useGroupedTabs: value }),
      resetToDefaults: () => set({
        activeAssessmentId: "1",
        activeClientId: "125566",
        useGroupedTabs: true,
      }),
    }),
    {
      name: 'app_state',
    }
  )
);

// --- Clinical Data Store (Replacing localStore.ts) ---

interface ClinicalState {
  clients: ClientRecord[];
  assessments: Record<string, AssessmentRecord[]>; // clientId -> assessments
  evidenceDecisions: Record<string, EvidenceDecisionStore>; // clientId:assessmentId -> decisions
  sessions: Record<string, SessionRecord[]>; // clientId -> sessions
  documents: Record<string, DocumentRecord[]>; // clientId -> documents
  cognitiveLoops: Record<string, CognitiveLoopRecord>; // clientId:assessmentId -> loop
  
  // Actions
  setClients: (clients: ClientRecord[]) => void;
  updateAssessment: (clientId: string, assessmentId: string, patch: Partial<AssessmentRecord>) => void;
  setAssessments: (clientId: string, assessments: AssessmentRecord[]) => void;
  setEvidenceDecisions: (clientId: string, assessmentId: string, decisions: EvidenceDecisionStore) => void;
  addSession: (clientId: string, session: SessionRecord) => void;
  setSessions: (clientId: string, sessions: SessionRecord[]) => void;
  addDocument: (clientId: string, doc: DocumentRecord) => void;
  updateDocument: (clientId: string, docId: string, patch: Partial<DocumentRecord>) => void;
  setDocuments: (clientId: string, docs: DocumentRecord[]) => void;
  updateCognitiveLoop: (clientId: string, assessmentId: string, patch: Partial<CognitiveLoopRecord>) => void;
  resetStore: () => void;
  
  // Getters (convenience helpers to use in selectors)
  getAssessments: (clientId: string) => AssessmentRecord[];
  getEvidenceDecisions: (clientId: string, assessmentId: string) => EvidenceDecisionStore;
  getCognitiveLoop: (clientId: string, assessmentId: string) => CognitiveLoopRecord;
  getClients: () => ClientRecord[];
  getDocuments: (clientId: string) => DocumentRecord[];
}

export const useClinicalStore = create<ClinicalState>()(
  persist(
    (set, get) => ({
      clients: [],
      assessments: {},
      evidenceDecisions: {},
      sessions: {},
      documents: {},
      cognitiveLoops: {},

      setClients: (clients) => set({ clients }),
      
      setAssessments: (clientId, assessments) => set((state) => ({
        assessments: { ...state.assessments, [clientId]: assessments }
      })),

      updateAssessment: (clientId, assessmentId, patch) => set((state) => {
        const clientAssessments = state.assessments[clientId] || [];
        const updated = clientAssessments.map(a => a.id === assessmentId ? { ...a, ...patch } : a);
        return {
          assessments: { ...state.assessments, [clientId]: updated }
        };
      }),

      setEvidenceDecisions: (clientId, assessmentId, decisions) => set((state) => ({
        evidenceDecisions: { ...state.evidenceDecisions, [`${clientId}:${assessmentId}`]: decisions }
      })),

      addSession: (clientId, session) => set((state) => {
        const clientSessions = state.sessions[clientId] || [];
        return {
          sessions: { ...state.sessions, [clientId]: [...clientSessions, session] }
        };
      }),

      setSessions: (clientId, sessions) => set((state) => ({
        sessions: { ...state.sessions, [clientId]: sessions }
      })),

      addDocument: (clientId, doc) => set((state) => {
        const clientDocs = state.documents[clientId] || [];
        return {
          documents: { ...state.documents, [clientId]: [...clientDocs, doc] }
        };
      }),

      updateDocument: (clientId, docId, patch) => set((state) => {
        const clientDocs = state.documents[clientId] || [];
        const updated = clientDocs.map(d => d.id === docId ? { ...d, ...patch } : d);
        return {
          documents: { ...state.documents, [clientId]: updated }
        };
      }),

      setDocuments: (clientId, docs) => set((state) => ({
        documents: { ...state.documents, [clientId]: docs }
      })),

      updateCognitiveLoop: (clientId, assessmentId, patch) => set((state) => {
        const key = `${clientId}:${assessmentId}`;
        const current = state.cognitiveLoops[key] || {
          currentStep: 1,
          stepHistory: [],
          hypothesisText: null,
          hypothesisSubmittedAt: null,
          impressionFormulated: false,
          impressionFormulatedAt: null,
          isDeferred: false,
          deferredAt: null,
          reportApproved: false,
          reportApprovedAt: null,
          acceptedMappings: [],
          conflicts: [],
          missingDocuments: []
        };
        return {
          cognitiveLoops: { ...state.cognitiveLoops, [key]: { ...current, ...patch } }
        };
      }),

      // Getters
      getAssessments: (clientId) => get().assessments[clientId] || [],
      
      getEvidenceDecisions: (clientId, assessmentId) => 
        get().evidenceDecisions[`${clientId}:${assessmentId}`] || {
          acceptedItems: [],
          rejectedItems: {},
          deferredItems: [],
          modifiedItems: [],
          hasSkippedConflicts: false,
          conflictSkippedAt: null
        },

      getCognitiveLoop: (clientId, assessmentId) => 
        get().cognitiveLoops[`${clientId}:${assessmentId}`] || {
          currentStep: 1,
          stepHistory: [],
          hypothesisText: null,
          hypothesisSubmittedAt: null,
          impressionFormulated: false,
          impressionFormulatedAt: null,
          isDeferred: false,
          deferredAt: null,
          reportApproved: false,
          reportApprovedAt: null,
          acceptedMappings: [],
          conflicts: [],
          missingDocuments: []
        },

      getClients: () => get().clients,
      getDocuments: (clientId) => get().documents[clientId] || [],
      resetStore: () => set((state) => {
        const preservedDecisions: Record<string, EvidenceDecisionStore> = {};
        Object.entries(state.evidenceDecisions).forEach(([key, decisions]) => {
          if (Object.keys(decisions.rejectedItems).length > 0) {
            preservedDecisions[key] = {
              acceptedItems: [],
              rejectedItems: decisions.rejectedItems,
              deferredItems: [],
              modifiedItems: [],
              hasSkippedConflicts: false,
              conflictSkippedAt: null
            };
          }
        });
        
        return {
          clients: [],
          assessments: {},
          evidenceDecisions: preservedDecisions,
          sessions: {},
          documents: {},
          cognitiveLoops: {},
        };
      }),
    }),
    {
      name: 'clinical_data_v6',
    }
  )
);
