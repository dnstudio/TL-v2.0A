/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Condition {
  id: number;
  name: string;
  category: string;
  code: string;
  guideline: string;
  status: string;
  updated: string;
  population: string;
  reviewer: string;
  overview: string;
  refs: string[];
}

export interface DecisionUnit {
  id: number;
  type: string;
  status: string;
  group: string;
  logic: string;
  pop: string;
  source: string;
  ok: boolean;
  explanation?: string;
  notes?: string;
  createdBy?: string;
  lastUpdated?: string;
  version?: string;
  changeNotes?: string;
  sourceLink?: string;
}

export interface Client {
  name: string;
  id: string;
  extId: string;
  clinicians: string[];
  extra: number;
  ref: string;
  last: string;
  consent: boolean;
  hasConflicts: boolean;
  missingDocs: string[];
}

export interface SessionEvidence {
  id: string;
  text: string;
  type: 'verbatim' | 'behavioural';
  timestamp: string;
  framework: string;
  tags: string[];
  chunkId?: string;
  score?: string;
}

export interface Session {
  id?: string;
  date: string;
  focus: string;
  notes: string;
  score?: string;
  context?: string;
  riskIndicators?: string;
  evidence?: SessionEvidence[];
}

export interface Assessment {
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
}

export interface Document {
  id: string;
  name: string;
  type: string;
  version: string;
  creationDate: string;
  uploadDate: string;
  uploadedAt: string | null;
  status: string;
  description?: string;
}

export interface Conflict {
  id: string;
  description: string;
}

export interface GuidelineSection {
  id: string;
  label: string;
}

export type SortDirection = "asc" | "desc";
export type SortField = keyof Condition;

export enum WorkFlowStatus {
  NOT_STARTED = 'not-started',
  REQUIRED = 'required',
  MISSING = 'missing',
  IN_PROGRESS = 'in-progress',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  UPLOADED = 'uploaded',
  READY = 'ready',
  CONFLICT = 'conflicts-unresolved',
  OPTIONAL = 'optional',
  IDLE = 'idle'
}
