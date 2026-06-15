# Threadline Application Requirements

## 1. Project Overview
Threadline is a comprehensive clinical conditions database explorer and diagnostic support platform. It facilitates a streamlined, evidence-informed workflow for mental health practitioners to manage client data, perform structured diagnostics, and generate clinical reports.

## 2. Target User Persona
**Primary User:** Clinical Practitioners and Therapists.
**Goal:** Manage caseloads, synthesize clinical evidence from multiple sources, and produce high-quality diagnostic formulations and reports with clinical oversight.

## 3. Core Modules & Navigation
The application is structured around a tabbed workspace for each client:
1.  **Client Dashboard:** Search and filter assigned clients.
2.  **Profile:** Central repository for personal details and background clinical notes.
3.  **Assessments:** Centralized hub for psychometric testing (e.g., PHQ-9, GAD-7).
4.  **Documents:** Management of collateral documents (e.g., discharge summaries, referral letters).
5.  **Sessions:** Logging and extraction of data from clinical encounters.
6.  **Evidence Workspace:** The core synthesis engine for reviewing findings and checking diagnostic criteria.
7.  **Analysis:** Workspace for defining hypotheses and organizing case formulations.
8.  **Report:** Final diagnostic documentation generation with sequential review safety checks.

## 4. Clinical Progression & Unlock Logic
To ensure clinical rigor, access to advanced modules is gated by data maturity:
*   **Evidence Workspace Unlock:** Requires a "Clinical Snapshot" consisting of:
    *   Minimum **2 Sessions**.
    *   Minimum **2 Completed Assessments**.
    *   Minimum **2 Uploaded/Completed Documents**.
*   **Analysis & Report Unlock:** Requires completion of the **Evidence Review** process:
    *   All identified evidence must be actioned (Accepted/Rejected/Modified).
    *   Bypassed only if the case is manually assigned a "ready/complete" status.

## 5. Evidence Management Protocol
### 5.1 Evidence Taxonomy
Evidence items must be categorized by type to maintain data provenance:
*   **Verbatim:** Direct quotes from sessions.
*   **Behavioural:** Clinician-observed behaviors.
*   **Extract:** Information parsed from unstructured documents.
*   **Observation:** Structured parameters from assessments or qualitative forms.

### 5.2 Verification & Scoring
*   **System vs. Manual:** System-extracted evidence requires a `SysBadge` and manual clinician verification.
*   **ML Scores:** System provides scores (0.0 to 1.0) for **Relevance**, **Impact**, and **Confidence**.
    *   **High (≥ 0.75):** Green/Balanced badge.
    *   **Mid (0.40 - 0.74):** Amber/Warning badge.
    *   **Low (< 0.40):** Rose/Uncertainty badge.

### 5.3 Clinician Decisions
Every evidence artifact must undergo an explicit decision:
*   **Accept:** Validates the point (including manual overrides of low AI confidence).
*   **Reject/Decline:** Invalidates the finding (requires UI friction/confirmation).
*   **Modify:** Amends text or severity to reflect clinical nuance.
*   **Defer:** Parks the item for later, blocking downstream Analysis until resolved.

## 6. Regulatory & Safety Controls
*   **Sequential Review (RISK-006):** Report generation *must* involve individual validation of Evidence Summaries and Formulations. A single "Confirm All" action is prohibited.
*   **Cross-Tab Signalling:** Unresolved conflicts in the Evidence workspace must be signalled globally (e.g., via a warning triangle on the Evidence tab) to prevent oversight during navigation.
*   **Conflict Resolution:** Evidence with a `hasConflict` flag must be explicitly resolved before the "All Accepted" criteria can be met.

## 7. Data Flow Requirements
1.  **Origination:** Data entry via Sessions, Assessments, or Documents.
2.  **Transformation:** Destructuring sources into atomic `EvidenceItem` units.
3.  **Synthesis:** Enrichment with ML scores and metadata.
4.  **Validation:** Review in Evidence Workspace with conflict flagging.
5.  **Output:** Verified items populate Case Formulations and Clinical Reports.

## 8. Technical Environment
*   **Frontend:** React (TypeScript) with Vite.
*   **Styling:** Tailwind CSS.
*   **Animation:** Motion (motion/react).
*   **Icons:** Lucide-react.
*   **State Management:** Zustand (Clinical and App stores).
*   **Verification:** `lint_applet` for code quality; `compile_applet` for build validation.
