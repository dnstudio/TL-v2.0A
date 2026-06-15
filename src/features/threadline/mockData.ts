export const MOCK_CLIENTS = [
  { 
    name: "Liam Alexander O'Sullivan", 
    id: "125566", 
    extId: "C-8891", 
    clinicians: ["Dr. Sarah Jenkins", "Dr. Mark Ronson"], 
    extra: 0, 
    ref: "St. Jude Hospital", 
    last: "May 02, 2026 – 10:00 AM", 
    consent: true,
    hasConflicts: true,
    missingDocs: []
  },
  { 
    name: "Ella Grace Robinson", 
    id: "125570", 
    extId: "C-3349", 
    clinicians: ["Dr. Emily Blunt"], 
    extra: 0, 
    ref: "Family Practice", 
    last: "Apr 18, 2026 – 11:00 AM", 
    consent: true,
    hasConflicts: false,
    missingDocs: []
  },
  { 
    name: "Chloe Isabella Thompson", 
    id: "125567", 
    extId: "C-9012", 
    clinicians: ["Dr. Sarah Jenkins"], 
    extra: 1, 
    ref: "School Counseling", 
    last: "Apr 28, 2026 – 2:30 PM", 
    consent: false,
    hasConflicts: false,
    missingDocs: ["Consent Form", "Referral Letter", "School Reports"]
  },
  { 
    name: "Sophie Elizabeth Brown", 
    id: "125569", 
    extId: "C-1120", 
    clinicians: ["Dr. Sarah Jenkins", "Dr. Emily Blunt"], 
    extra: 1, 
    ref: "St. Jude Hospital", 
    last: "Apr 20, 2026 – 4:00 PM", 
    consent: true,
    hasConflicts: false,
    missingDocs: ["Standardized Assessment"]
  },
  { 
    name: "Noah James Wilson", 
    id: "125571", 
    extId: "C-1121", 
    clinicians: ["Dr. Sarah Jenkins"], 
    extra: 0, 
    ref: "St. Jude Hospital", 
    last: "May 10, 2026 – 4:00 PM", 
    consent: true,
    hasConflicts: false,
    missingDocs: []
  },
  { 
    name: "Oliver Mason Davies", 
    id: "125572", 
    extId: "C-1122", 
    clinicians: ["Dr. Emily Blunt"], 
    extra: 0, 
    ref: "Family Practice", 
    last: "May 11, 2026 – 10:00 AM", 
    consent: true,
    hasConflicts: false,
    missingDocs: []
  },
  { 
    name: "Cognitive Safety Case Study", 
    id: "125573", 
    extId: "C-1337", 
    clinicians: ["Dr. Sarah Jenkins"], 
    extra: 2, 
    ref: "Multi-Disciplinary Review", 
    last: "May 13, 2026 – 09:00 AM", 
    consent: true,
    hasConflicts: true,
    missingDocs: []
  },
  { 
    name: "Leo Jonathan Sterling", 
    id: "125574", 
    extId: "C-9999", 
    clinicians: ["Dr. Sarah Jenkins", "Dr. Mark Ronson"], 
    extra: 0, 
    ref: "St. Jude Hospital", 
    last: "May 15, 2026 – 09:00 AM", 
    consent: true,
    hasConflicts: false,
    missingDocs: []
  },
  { 
    name: "Resolution Demo Case", 
    id: "125575", 
    extId: "C-1400", 
    clinicians: ["Dr. Sarah Jenkins"], 
    extra: 1, 
    ref: "Neurodevelopmental Center", 
    last: "May 16, 2026 – 11:00 AM", 
    consent: true,
    hasConflicts: true,
    missingDocs: []
  },
  { 
    name: "Conflict Resolution Showcase", 
    id: "125576", 
    extId: "C-1500", 
    clinicians: ["Dr. Sarah Jenkins"], 
    extra: 0, 
    ref: "Specialist Clinic", 
    last: "May 17, 2026 – 09:00 AM", 
    consent: true,
    hasConflicts: true,
    missingDocs: []
  },
];

export const MOCK_ASSESSMENTS = [
  { 
    id: "a-gad7",
    title: "GAD-7 (Generalized Anxiety Disorder)", 
    subtitle: "Feb 10, 2026 • Dr. Sarah Jenkins", 
    status: "completed",
    date: "Feb 10, 2026",
    description: "Evaluates the presence and severity of general anxiety symptoms over the past two weeks.",
    notes: "Client reported improved sleep but sustained anxiety triggers at workplace.",
    overallImpression: "Moderate Anxiety",
    score: "12",
    percentile: "85th",
    descriptor: "Moderate",
    hasConflict: true,
    conflictTargetId: "doc-4",
    conflictTargetLabel: "Medical Records",
    conflictTargetType: "document",
    conflictDescription: "Serious Conflict: Current clinical findings for GAD-7 conflict with historical physiological data in Medical Records regarding sensory processing development."
  },
  { 
    id: "a-phq9",
    title: "PHQ-9 (Patient Health Questionnaire)", 
    subtitle: "Mar 15, 2026 • Dr. Mark Ronson", 
    status: "in-progress",
    date: "Mar 15, 2026",
    description: "Multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.",
    notes: "Pending review of items 7 and 8 with client during next session."
  },
  { 
    id: "a-dass21",
    title: "DASS-21 (Depression Anxiety Stress Scale)", 
    subtitle: "Scheduled • Dr. Sarah Jenkins", 
    status: "not-started",
    date: "Apr 10, 2026",
    description: "A set of three self-report scales designed to measure the negative emotional states of depression, anxiety and stress.",
    notes: "Baseline assessment for new referral."
  },
];

export const REQUIRED_DOCUMENTS = ['referral-letter', 'school-report'];

export const MOCK_DOCUMENTS = [
  { id: "doc-1", name: "School Reports", type: "PDF", version: "Updated 2025-02-10", creationDate: "Mar 15, 2026", uploadDate: "Dec 01, 2026", uploadedAt: "2026-12-01T10:00:00Z", status: "uploaded" },
  { id: "doc-2", name: "Letters", type: "Docs", version: "Version 1.0", creationDate: "Apr 22, 2026", uploadDate: "Jan 18, 2027", uploadedAt: "2027-01-18T14:30:00Z", status: "required", description: "Provides initial context, reason for assessment, and primary concerns identified by the referring professional." },
  { 
    id: "doc-4", 
    name: "Medical Records", 
    type: "PDF", 
    version: "Initial", 
    creationDate: "Jun 10, 2026", 
    uploadDate: "Jun 12, 2026", 
    uploadedAt: "2026-06-12T11:00:00Z", 
    status: "optional", 
    description: "Past medical history, medications, and physical health records that may relate to psychological functioning.",
    hasConflict: true,
    conflictTargetId: "ev-gad7",
    conflictTargetLabel: "GAD-7 (Generalized Anxiety Disorder)",
    conflictTargetType: "assessment",
    conflictDescription: "Serious Conflict: History of recurrent ear infections documented here conflicts with current anxiety symptom profiling in GAD-7."
  },
  { id: "doc-5", name: "Previous Assessment Results", type: "PDF", version: "Final", creationDate: "Jan 05, 2026", uploadDate: "Jan 10, 2026", uploadedAt: "2026-01-10T11:00:00Z", status: "optional", description: "Results and reports from previously administered psychological or educational assessments." },
];

export const MOCK_EVIDENCE_ITEMS = [
  { id: 'ev-phq9', label: "PHQ-9 (Patient Health Questionnaire)", score: "0.91", type: "assessment", hasConflict: false, findings: [
    { id: 'f-phq9-1', text: 'Reports of persistent low mood and lack of interest in previously enjoyed activities.', timestamp: 'Score: 18', tags: ['Emotional'], type: "observation", sourceAssessmentId: "a-phq9" },
    { id: 'f-phq9-2', text: 'Significant sleep disturbance reported, primarily difficulty falling asleep.', timestamp: 'Sub-scale: Sleep', tags: ['Physical'], type: "observation", sourceAssessmentId: "a-phq9" },
  ] },
  { id: 'ev-gad7', label: "GAD-7 (Generalized Anxiety Disorder)", score: "0.88", type: "assessment", hasConflict: true, conflictTargetId: "doc-4", conflictTargetLabel: "Medical Records", conflictTargetType: "document", conflictDescription: "Serious Conflict: Current clinical findings for GAD-7 conflict with historical physiological data in Medical Records regarding sensory processing development.", findings: [
    { 
      id: 'f-gad7-1', 
      text: 'Frequent excessive worry over workplace responsibilities', 
      timestamp: 'p. 1', 
      tags: ['Environment', 'Emotional'], 
      type: "observation", 
      sourceAssessmentId: "a-gad7", 
      hasConflict: true,
      conflictTargetLabel: 'Medical Records',
      conflictDescription: 'This finding regarding current workplace anxiety conflicts with documented history of recurrent ear infections which suggests a physiological auditory processing baseline.'
    }
  ] },
  { id: 'ev-school', label: "School Reports", score: "0.94", type: "document", hasConflict: false, findings: [
    { id: 'f-ref-1', text: 'Observations suggest a pattern of sensory seeking behavior that is particularly evident during structured tasks.', timestamp: 'p. 4', tags: ['Sensory'], type: "extract", sourceDocumentId: "doc-1", chunkId: "chunk-5", page: 4 },
    { id: 'f-ref-2', text: 'The preschool records indicate that social communication challenge was a primary barrier to peer engagement.', timestamp: 'p. 2', tags: ['Social'], type: "extract", sourceDocumentId: "doc-1", chunkId: "chunk-3", page: 2 },
    { id: 'f-ref-3', text: 'Detailed family history collection reveals a positive history for neurodevelopmental conditions, with an immediate family member previously diagnosed with Autism Spectrum Disorder (ASD).', timestamp: 'p. 9', tags: ['Environment'], type: "extract", sourceDocumentId: "doc-1", chunkId: "chunk-8", page: 9 },
  ] },
  { id: 'ev-letters', label: "Letters", score: "0.82", type: "document", hasConflict: false, findings: [
    { id: 'f-let-1', text: 'Referring physician notes persistent academic underachievement despite high verbal intelligence.', timestamp: 'p. 1', tags: ['Cognitive', 'Behavioral'], type: "extract", sourceDocumentId: "doc-2", chunkId: "chunk-1", page: 1 },
    { id: 'f-let-2', text: 'Past medical history is unremarkable for significant developmental delays or neurological conditions.', timestamp: 'p. 2', tags: ['Medical'], type: "extract", sourceDocumentId: "doc-2", chunkId: "chunk-3", page: 2 },
  ] },
  { id: 'ev-medical', label: "Medical Records", score: "0.78", type: "document", hasConflict: true, conflictTargetId: "ev-gad7", conflictTargetLabel: "GAD-7 (Generalized Anxiety Disorder)", conflictTargetType: "assessment", conflictDescription: "Serious Conflict: History of recurrent ear infections documented here conflicts with current anxiety symptom profiling in GAD-7.", findings: [
    { 
      id: 'f-med-1', 
      text: 'Client has a history of recurrent ear infections in early childhood, which may have impacted auditory processing development.', 
      timestamp: 'p. 5', 
      tags: ['Medical', 'Physical'], 
      type: "extract", 
      sourceDocumentId: "doc-4", 
      chunkId: "chunk-6",
      page: 5,
      hasConflict: true,
      conflictTargetLabel: 'GAD-7 (Generalized Anxiety Disorder)',
      conflictDescription: 'Documented history of recurrent ear infections here suggests a physiological auditory processing baseline that conflicts with the current workplace anxiety reported in the GAD-7.'
    },
  ] },
  { label: "Depressed mood", score: "0.84", type: "criteria", rationale: "Multiple instances of depressed mood and anhedonia reported.", hasConflict: false, status: "Met", tags: ["Emotional", "Behavioral", "Cognitive"], findings: [
    { id: "crit-f-e8", text: "Client sighed deeply and paused for several seconds before answering questions about self-worth.", type: "behavioural", timestamp: "35:00", framework: "Depressive Features", tags: ['Emotional', 'Behavioral'], sessionId: "S-8823" },
    { id: "crit-f-e10", text: "I found it hard to focus on my breath when the room was so quiet.", type: "verbatim", timestamp: "28:10", framework: "Anxiety Management", tags: ['Cognitive', 'Environment'], sessionId: "S-8823" }
  ] },
  { label: "Fear of negative evaluation (Criteria)", score: "0.55", type: "criteria", rationale: "Some indication of fear of others judging, but not pervasive yet.", hasConflict: false, status: "Deferred", tags: ["Social", "Physical", "Cognitive"], cause: "insufficient_data", findings: [
    { id: "crit-f-e1", text: "I feel like my heart is racing whenever I have to speak in front of others.", type: "verbatim", timestamp: "05:12", framework: "Social Anxiety Disorder (SAD)", tags: ['Physical', 'Social'], sessionId: "S-8822" },
    { id: "crit-f-e7", text: "I think everyone is judging how I move and speak.", type: "verbatim", timestamp: "22:30", framework: "Social Anxiety Disorder (SAD)", tags: ['Cognitive', 'Social'], sessionId: "S-8822" }
  ] },
  { label: "Persistent concern about additional", score: "0.32", type: "criteria", rationale: "Limited evidence supporting persistent concern about additional panic attacks.", hasConflict: false, status: "Not Met", tags: ["Physical", "Environment"], findings: [
    { id: "crit-f-e4", text: "Sometimes I just can't breathe properly when the phone rings.", type: "verbatim", timestamp: "15:20", framework: "Panic Disorder", tags: ['Physical', 'Environment'], sessionId: "S-8821" }
  ] },
  { label: "Social Isolation (Clinical Finding)", score: "0.55", type: "criteria", rationale: "Mixed indicators regarding social isolation and withdrawal; further investigation required to clear conflict.", hasConflict: true, status: "Deferred", tags: ["Social", "Behavioral"], cause: "source_conflict", findings: [
    { id: "crit-f-new1", text: "Client isolates in their room during family gatherings.", type: "behavioural", timestamp: "10:15", framework: "Social Interaction", tags: ['Behavioral'], score: "0.85", sessionId: "S-8821" },
    { id: "crit-f-new2", text: "I have many friends at school that I talk to every day.", type: "verbatim", timestamp: "11:20", framework: "Social Interaction", tags: ['Social'], score: "0.90", hasConflict: true, sessionId: "S-8821" },
    { id: "crit-f-new3", text: "Teacher notes state client sits alone at lunch and does not interact.", type: "extract", timestamp: "p. 2", framework: "Social Interaction", tags: ['Environment'], score: "0.88", hasConflict: true, sourceDocumentId: "doc-1" },
    { id: "crit-f-new4", text: "Client mentioned they like to read books over watching movies.", type: "verbatim", timestamp: "14:10", framework: "Hobbies", tags: ['Cognitive'], score: "0.20", sessionId: "S-8821" }, 
    { id: "crit-f-new5", text: "Avoids group activities during recess.", type: "behavioural", timestamp: "09:30", framework: "Social Interaction", tags: ['Behavioral'], score: "0.80", sessionId: "S-8821" }
  ] },
  { label: "Fear of negative evaluation", score: "0.85", type: "nextstep", impact: "High information gain", rationale: "Standardised tool identifies this as the primary driver of social avoidance.", suggestedClinicalFocus: "Social Evaluation", hasConflict: false },
  { label: "Severity of depressive symptoms", score: "0.55", type: "nextstep", impact: "Quantifies symptom severity", rationale: "Client describes significant mood dips but hasn't had clinical scoring since Feb.", suggestedClinicalFocus: "Mood Regulation", hasConflict: false, impactCause: "non_clinical_source" },
  { label: "Duration of mood symptoms", score: "0.32", type: "nextstep", impact: "Medium", rationale: "Establishing timeline is critical for differentiating between episode types.", suggestedClinicalFocus: "Cognitive Functioning", hasConflict: false, impactCause: "background_only" }
];

export const MOCK_REPORT_MAPPING_IDS = ["GAD-7", "PHQ-9"];

export const MOCK_CONFLICTS = [
  { id: "c1", description: "Teacher notes contradict parent report on social anxiety" },
  { id: "c2", description: "Inconsistent frequency of reported symptoms across different sessions" },
  { id: "c3", description: "Medical Records suggest a different baseline for anxiety than reported in the GAD-7 assessment." }
];

export const MOCK_MISSING_DOCUMENTS = [
  { id: "d1", name: "School Report", description: "Required for comprehensive understanding of academic performance and behavioral patterns in an educational setting." },
  { id: "d2", name: "Referral Letter", description: "Provides initial context, reason for assessment, and primary concerns identified by the referring professional." }
];

export const MOCK_CLIENT_DATA: Record<string, {
  reportUnlocked?: boolean,
  allAccepted?: boolean,
  sessions: { 
    id?: string, 
    date: string, 
    focus: string, 
    notes: string,
    score?: string,
    relevanceCause?: string,
    evidence?: {
      id: string,
      text: string,
      type: 'verbatim' | 'behavioural',
      timestamp: string,
      framework: string,
      tags: string[],
      chunkId?: string,
      score?: string,
      relevanceCause?: string
    }[]
  }[],
  assessments: { 
    id?: string,
    title: string, 
    subtitle: string, 
    status: string, 
    date?: string, 
    description?: string, 
    notes?: string,
    overallImpression?: string,
    score?: string,
    percentile?: string,
    descriptor?: string,
    relevanceCause?: string,
    hasConflict?: boolean
  }[],
  evidence: { id?: string, type: string, description: string, date: string, label?: string, score?: string, hasConflict?: boolean, verbatim?: string, relevanceCause?: string, cause?: string, sessionId?: string, sourceAssessmentId?: string, sourceDocumentId?: string, findings?: any[] }[],
  analysis: { thread: string, insight: string }[],
  reports: { title: string, date: string }[],
  conflicts?: { id: string, description: string }[],
  missingDocuments?: { id: string, name: string }[],
  documents?: { id: string, name: string, type: string, version: string, creationDate: string, uploadDate: string, uploadedAt: string | null, status: string, hasConflict?: boolean }[]
}> = {
  "125566": {
    sessions: [
      { 
        id: "S-8821",
        date: "2026-05-02", 
        focus: "Anxiety Management", 
        notes: "Review of GAD-7 results.",
        evidence: [
          { id: "e1", text: "I feel like my heart is racing whenever I have to speak in front of others.", type: "verbatim", timestamp: "05:12", framework: "Social Anxiety Disorder (SAD)", tags: ['Physical', 'Social'], chunkId: "chunk-s1-1", score: "0.92" },
          { id: "e2", text: "Client was fidgeting with a pen and looking down frequently during the social recall task.", type: "behavioural", timestamp: "08:30", framework: "Social Anxiety Disorder (SAD)", tags: ['Behavioral', 'Emotional'], chunkId: "chunk-s1-2", score: "0.88" },
          { id: "e3", text: "I often skip lunch in the breakroom to avoid small talk.", type: "verbatim", timestamp: "12:45", framework: "Social Anxiety Disorder (SAD)", tags: ['Behavioral'], chunkId: "chunk-s1-3", score: "0.85" },
          { id: "e4", text: "Sometimes I just can't breathe properly when the phone rings.", type: "verbatim", timestamp: "15:20", framework: "Panic Disorder", tags: ['Physical', 'Environment'], chunkId: "chunk-s1-4", score: "0.28" },
          { id: "e5", text: "Noticeable shallow breathing and increased rate of speech when discussing work deadlines.", type: "behavioural", timestamp: "18:10", framework: "Generalized Anxiety Disorder (GAD)", tags: ['Physical', 'Environment'], chunkId: "chunk-s1-5", score: "0.82" }
        ]
      },
      { 
        id: "S-8822",
        date: "2026-05-03", 
        focus: "Cognitive Restructuring", 
        notes: "Addressing negative thought patterns.",
        score: "0.22",
        relevanceCause: "stale_data",
        evidence: [
          { id: "e6", text: "If I don't get this right, then everything is a failure.", type: "verbatim", timestamp: "10:15", framework: "Cognitive Appraisal", tags: ['Cognitive'], score: "0.94" },
          { id: "e7", text: "I think everyone is judging how I move and speak.", type: "verbatim", timestamp: "22:30", framework: "Social Anxiety Disorder (SAD)", tags: ['Cognitive', 'Social'], score: "0.86" },
          { id: "e8", text: "Client sighed deeply and paused for several seconds before answering questions about self-worth.", type: "behavioural", timestamp: "35:00", framework: "Depressive Features", tags: ['Emotional'], score: "0.72" }
        ]
      },
      { 
        id: "S-8823",
        date: "2026-05-04", 
        focus: "Exposure Therapy", 
        notes: "Practicing mindfulness in high-anxiety triggers.",
        evidence: [
          { id: "e9", text: "Successfully maintained eye contact for 30 seconds during roleplay.", type: "behavioural", timestamp: "15:45", framework: "Social Anxiety Disorder (SAD)", tags: ['Behavioral', 'Social'], score: "0.95" },
          { id: "e10", text: "I found it hard to focus on my breath when the room was so quiet.", type: "verbatim", timestamp: "28:10", framework: "Anxiety Management", tags: ['Cognitive', 'Environment'], score: "0.35", relevanceCause: "ambiguous_link" },
          { id: "e11", text: "Hand tremors subsided significantly during the second half of the exercise.", type: "behavioural", timestamp: "42:20", framework: "Social Anxiety Disorder (SAD)", tags: ['Physical'], score: "0.89" }
        ]
      }
    ],
    assessments: [
      { 
        id: "a-gad7-125566",
        title: "GAD-7 (Generalized Anxiety Disorder)", 
        subtitle: "Feb 10, 2026 • Dr. Sarah Jenkins", 
        status: "completed",
        overallImpression: "Moderate Anxiety",
        score: "12",
        percentile: "85th",
        descriptor: "Moderate",
        hasConflict: true
      },
      { 
        id: "a-phq9-125566",
        title: "PHQ-9 (Patient Health Questionnaire)", 
        subtitle: "Mar 15, 2026 • Dr. Mark Ronson", 
        status: "completed",
        overallImpression: "Moderate Depression",
        score: "14",
        percentile: "88th",
        descriptor: "Moderate"
      },
      {
        id: "a-dass21-125566",
        title: "DASS-21",
        subtitle: "Scheduled • Dr. Sarah Jenkins",
        status: "not-started"
      }
    ],
    evidence: [],
    analysis: [{ thread: "Anxiety", insight: "High social anxiety." }],
    reports: [{ title: "Initial Assessment", date: "2026-04-10" }],
    conflicts: [MOCK_CONFLICTS[0], MOCK_CONFLICTS[2]],
    missingDocuments: [],
    documents: [
      { id: "doc-1", name: "School Reports", type: "PDF", version: "Updated 2025-02-10", creationDate: "Mar 15, 2026", uploadDate: "Dec 01, 2026", uploadedAt: "2026-12-01T10:00:00Z", status: "uploaded" },
      { id: "doc-2", name: "Letters", type: "Docs", version: "Version 1.0", creationDate: "Apr 22, 2026", uploadDate: "May 01, 2026", uploadedAt: "2026-05-01T14:30:00Z", status: "uploaded" },
      { id: "doc-4", name: "Medical Records", type: "PDF", version: "Initial", creationDate: "Jun 10, 2026", uploadDate: "Jun 12, 2026", uploadedAt: "2026-06-12T11:00:00Z", status: "uploaded", hasConflict: true }
    ]
  },
  "125567": {
    sessions: [],
    assessments: [
      { id: "a-gad7-125567", title: "GAD-7 (Generalized Anxiety Disorder)", subtitle: "Scheduled • Dr. Sarah Jenkins", status: "not-started" },
      { id: "a-phq9-125567", title: "PHQ-9 (Patient Health Questionnaire)", subtitle: "Scheduled • Dr. Sarah Jenkins", status: "not-started" }
    ],
    evidence: [],
    analysis: [],
    reports: [],
    conflicts: [],
    missingDocuments: [
      { id: "md-chloe-1", name: "Consent Form" },
      { id: "md-chloe-2", name: "Referral Letter" },
      { id: "md-chloe-3", name: "School Reports" }
    ],
    documents: [
      { id: "doc-chloe-1", name: "School Reports", type: "PDF", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" },
      { id: "doc-chloe-2", name: "Consent Form", type: "Docs", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" },
      { id: "doc-chloe-3", name: "Referral Letter", type: "Docs", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" }
    ]
  },
  "125569": {
    sessions: [
      { id: "s1-125569", date: "2026-04-20", focus: "ADHD Management", notes: "Coping with distractibility." },
      { id: "s2-125569", date: "2026-04-22", focus: "Social Skills", notes: "Roleplay exercise." }
    ],
    assessments: [],
    evidence: [{ id: "ev-log1-125569", type: "document", description: "Tracked productive hours.", date: "2026-04-19", sourceDocumentId: "doc-sophie-1", findings: [{ id: 'f-log-1', text: 'Productive hours identified in morning slots.', type: "extract", sourceDocumentId: "doc-sophie-1" }] }],
    analysis: [{ thread: "Focus", insight: "Morning productivity is higher." }],
    reports: [{ title: "Baseline Report", date: "2026-04-05" }],
    conflicts: [],
    missingDocuments: [MOCK_MISSING_DOCUMENTS[0]],
    documents: [
      { id: "doc-sophie-1", name: "Focus Log & Consent", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-04-20", uploadedAt: "2026-04-20" }
    ]
  },
  "125570": {
    reportUnlocked: true,
    sessions: [
      { id: "s1-125570", date: "2026-04-18", focus: "Goal Setting", notes: "Setting SMART goals." },
      { id: "s2-125570", date: "2026-04-20", focus: "Implementation", notes: "Starting daily checklists." },
      { id: "s3-125570", date: "2026-04-22", focus: "Review", notes: "Adjusting goals based on feedback." }
    ],
    assessments: [],
    evidence: [{ id: "ev-goal-125570", type: "document", description: "Weekly task list.", date: "2026-04-17", label: "Goal Sheet", score: "0.95", sourceDocumentId: "doc-ella-3", findings: [{ id: 'f-goals-1', text: 'All SMART goals for week 1 achieved.', type: "extract", sourceDocumentId: "doc-ella-3" }] }],
    analysis: [{ thread: "Motivation", insight: "Strong internal motivation." }],
    reports: [{ title: "Treatment Plan", date: "2026-04-01" }],
    conflicts: [],
    missingDocuments: [],
    documents: [
      { id: "doc-ella-1", name: "Referral Letter", type: "PDF", version: "Final", creationDate: "2026-04-01", uploadDate: "2026-04-02", uploadedAt: "2026-04-02T10:00:00Z", status: "uploaded" },
      { id: "doc-ella-2", name: "Consent Form", type: "Docs", version: "V1", creationDate: "2026-04-01", uploadDate: "2026-04-02", uploadedAt: "2026-04-02T10:30:00Z", status: "uploaded" },
      { id: "doc-ella-3", name: "Goal Sheet", type: "PDF", version: "1.0", creationDate: "2026-04-15", uploadDate: "2026-04-17", uploadedAt: "2026-04-17", status: "uploaded" }
    ]
  },
  "125571": {
    reportUnlocked: false,
    sessions: [
      { id: "SN-1", date: "2026-05-01", focus: "Initial Consultation", notes: "First intake session." },
      { id: "SN-2", date: "2026-05-05", focus: "Baseline Assessment", notes: "Reviewing history." }
    ],
    assessments: [
      { id: "a1-125571", title: "GAD-7 (Generalized Anxiety Disorder)", subtitle: "Completed", status: "completed", date: "2026-05-02" },
      { id: "a2-125571", title: "PHQ-9 (Patient Health Questionnaire)", subtitle: "Completed", status: "completed", date: "2026-05-03" }
    ],
    evidence: [
      { id: "ev-gad7-125571", type: "assessment", description: "GAD-7 results", date: "2026-05-02", sourceAssessmentId: "a1-125571", findings: [{ id: 'f-gad7-125571-1', text: 'Reports of feeling nervous and on edge.', type: "observation", sourceAssessmentId: "a1-125571" }] },
      { id: "ev-phq9-125571", type: "assessment", description: "PHQ-9 results", date: "2026-05-03", sourceAssessmentId: "a2-125571", findings: [{ id: 'f-phq9-125571-1', text: 'Little interest or pleasure in doing things.', type: "observation", sourceAssessmentId: "a2-125571" }] }
    ],
    analysis: [],
    reports: [],
    documents: [
      { id: "DN-1", name: "Medical History", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-05-01", uploadedAt: "2026-05-01" },
      { id: "DN-2", name: "School Consent", type: "Docs", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-05-01", uploadedAt: "2026-05-01" }
    ]
  },
  "125572": {
    reportUnlocked: false,
    allAccepted: true,
    sessions: [
      { id: "SO-1", date: "2026-05-01", focus: "Intake", notes: "Intake complete." },
      { id: "SO-2", date: "2026-05-05", focus: "Session 2", notes: "Following up." }
    ],
    assessments: [],
    evidence: [],
    analysis: [],
    reports: [],
    documents: [
      { id: "DO-1", name: "ID Document", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-05-01", uploadedAt: "2026-05-01" },
      { id: "DO-2", name: "Insurance Info", type: "Docs", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-05-01", uploadedAt: "2026-05-01" }
    ]
  },
  "125573": {
    reportUnlocked: false,
    allAccepted: false,
    sessions: [
      { 
        id: "CS-001",
        date: "2025-01-15", 
        focus: "Baseline Assessment", 
        notes: "Initial intake. Parent reports high social engagement at home but isolation at school.",
        evidence: [
          { id: "cs-e1", text: "Client plays harmoniously with siblings and initiates several games per hour.", type: "behavioural", timestamp: "10:00", framework: "Social Interaction", tags: ['Environment', 'Behavioral'] }
        ]
      },
      { 
        id: "CS-002",
        date: "2025-06-20", 
        focus: "Mid-Year Review", 
        notes: "Teacher reports 'Extreme isolation' and refusal to speak in group settings.",
        evidence: [
          { id: "cs-e2", text: "Client spent the entire recess standing by the fence alone.", type: "behavioural", timestamp: "11:30", framework: "Social Interaction", tags: ['Environment', 'Behavioral'] }
        ]
      },
      { 
        id: "CS-003",
        date: "2026-05-13", 
        focus: "Contradiction Deep Dive", 
        notes: "Investigating the disconnect between school and home reports.",
        evidence: [
          { id: "cs-e3", text: "I actually love talking to people, I just hate the noise in the classroom.", type: "verbatim", timestamp: "05:20", framework: "Sensory Processing", tags: ['Sensory', 'Cognitive'], chunkId: "chunk-cs-3" },
          { id: "cs-e4", text: "Client covers ears when a chair scrapes, but maintains eye contact while doing so.", type: "behavioural", timestamp: "15:45", framework: "Autism Criteria", tags: ['Sensory', 'Social'] },
          { id: "cs-e5", text: "AI Extract (Low Confidence): Probable Social Anxiety Disorder.", type: "verbatim", timestamp: "20:00", framework: "Diagnosis Logic", tags: ['Cognitive'] }
        ]
      }
    ],
    assessments: [
      { id: "a1-125573", title: "Parent Social Scale", subtitle: "2025-01-15", status: "completed", score: "Low Concern" },
      { id: "a2-125573", title: "Teacher Social Scale", subtitle: "2025-06-20", status: "completed", score: "Extremely High Concern" }
    ],
    evidence: [
      { id: "ev-contradictory-125573", type: "assessment", description: "Teacher observations.", date: "2025-06-20", label: "Contradictory Social Data", score: "0.35", hasConflict: true, sourceAssessmentId: "a2-125573" },
      { id: "ev-positive-125573", type: "assessment", description: "Parent notes.", date: "2025-01-15", label: "Positive Social Affect", score: "0.95", hasConflict: true, sourceAssessmentId: "a1-125573" }
    ],
    analysis: [
      { thread: "Sensory vs Social", insight: "Social withdrawal may be a secondary coping mechanism for sensory overload rather than primary social anxiety." }
    ],
    reports: [],
    conflicts: [
      { id: "cs-c1", description: "Home-School Social Inconsistency: Parent reports high engagement (2025-01) while Teacher reports isolation (2025-06)." },
      { id: "cs-c2", description: "Sensory Processing vs. Social Anxiety: Self-report suggests noise triggers, but AI logic anchors on social avoidance." }
    ],
    missingDocuments: [],
    documents: [
      { id: "cs-doc-1", name: "2025 Progress Report", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2025-06-20", uploadDate: "2025-06-20", uploadedAt: "2025-06-20" },
      { id: "cs-doc-2", name: "Parent Intake Form", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2025-01-15", uploadDate: "2025-01-15", uploadedAt: "2025-01-15" }
    ]
  },
  "125574": {
    reportUnlocked: true,
    allAccepted: true,
    sessions: [
      { 
        id: "LS-1", 
        date: "2026-01-10", 
        focus: "Intake", 
        notes: "Initial psychiatric evaluation.",
        evidence: [
          { id: "le1", text: "Reported difficulty falling asleep for the past 6 months.", type: "verbatim", timestamp: "10:10", framework: "Sleep Hygiene", tags: ['Physical', 'Emotional'], score: "0.85" },
          { id: "le2", text: "Client presents with flat affect during discussion of past traumas.", type: "behavioural", timestamp: "15:20", framework: "Depressive Features", tags: ['Emotional'], score: "0.90" }
        ]
      },
      { 
        id: "LS-2", 
        date: "2026-03-15", 
        focus: "Follow-up", 
        notes: "Symptom tracking.",
        evidence: [
          { id: "le3", text: "Reduced frequency of intrusive thoughts.", type: "verbatim", timestamp: "09:45", framework: "Cognitive Appraisal", tags: ['Cognitive'], score: "0.88" },
          { id: "le4", text: "Reports low energy.", type: "verbatim", timestamp: "10:00", framework: "Fatigue", tags: ['Physical'], score: "0.75" }
        ]
      },
      { 
        id: "LS-3", 
        date: "2026-05-14", 
        focus: "Assessment Follow-up", 
        notes: "Symptom tracking.",
        evidence: [
          { id: "le5", text: "Continues to report persistent low energy.", type: "verbatim", timestamp: "09:45", framework: "Fatigue", tags: ['Physical'], score: "0.80" },
          { id: "le6", text: "Still finding difficulty with mood regulation.", type: "verbatim", timestamp: "10:15", framework: "Mood", tags: ['Emotional'], score: "0.82" }
        ]
      }
    ],
    assessments: [
      { id: "a1-125574", title: "GAD-7 (Generalized Anxiety Disorder)", subtitle: "Jan 10, 2026 • Dr. Sarah Jenkins", status: "completed", date: "2026-01-10", description: "GAD-7 description", notes: "Stable.", overallImpression: "Moderate Anxiety", score: "12", percentile: "75th", descriptor: "Moderate" },
      { id: "a2-125574", title: "GAD-7 (Generalized Anxiety Disorder)", subtitle: "Mar 15, 2026 • Dr. Sarah Jenkins", status: "completed", date: "2026-03-15", description: "GAD-7 description", notes: "Slight improvement.", overallImpression: "Mild Anxiety", score: "9", percentile: "65th", descriptor: "Mild" },
      { id: "a3-125574", title: "GAD-7 (Generalized Anxiety Disorder)", subtitle: "May 01, 2026 • Dr. Sarah Jenkins", status: "completed", date: "2026-05-01", description: "GAD-7 description", notes: "Stable.", overallImpression: "Mild Anxiety", score: "8", percentile: "60th", descriptor: "Mild" },
      { id: "a4-125574", title: "PHQ-9 (Patient Health Questionnaire)", subtitle: "May 01, 2026 • Dr. Sarah Jenkins", status: "completed", date: "2026-05-01", description: "PHQ-9 description", notes: "Improving.", overallImpression: "Minimal Depression", score: "4", percentile: "40th", descriptor: "Minimal" }
    ],
    evidence: [
      { id: "ev-sleep-125574", type: "document", description: "Tracking sleep efficiency.", date: "2026-05-14", label: "Sleep Pattern", score: "0.95", hasConflict: false, sourceDocumentId: "ld1", findings: [{ id: 'f-sleep-1', text: 'Average sleep duration is 6.5 hours.', type: "extract", sourceDocumentId: "ld1" }] },
      { id: "ev-gad-125574", type: "assessment", description: "Recent GAD results", date: "2026-05-01", sourceAssessmentId: "a3-125574", findings: [{ id: 'f-gad-125574-1', text: 'Score reflects mild anxiety levels.', type: "observation", sourceAssessmentId: "a3-125574" }] }
    ],
    analysis: [{ thread: "Anxiety", insight: "Improvements noted." }, { thread: "Mood", insight: "Minimal depression symptoms remains." }],
    reports: [{ title: "Comprehensive Clinical Assessment", date: "2026-05-15" }],
    conflicts: [],
    missingDocuments: [],
    documents: [
      { id: "ld1", name: "Sleep Log", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-05-01", uploadDate: "2026-05-14", uploadedAt: "2026-05-14" },
      { id: "ld2", name: "Intake Assessment", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-01-10", uploadDate: "2026-01-10", uploadedAt: "2026-01-10" }
    ]
  },
  "125575": {
    reportUnlocked: false,
    allAccepted: true,
    sessions: [
      { 
        id: "RD-001",
        date: "2026-05-10", 
        focus: "Comprehensive Intake", 
        notes: "Conflict resolution demonstration case.",
        evidence: [
          { id: "rd-e1", text: "Client demonstrates fluent social interaction and imaginative play during clinical observation.", type: "behavioural", timestamp: "10:00", framework: "Social Communication", tags: ['Behavioral', 'Social'], score: "0.95" },
          { id: "rd-e2", text: "Teacher report indicates significant difficulty with peer play and 'nearly non-existent' social initiation.", type: "verbatim", timestamp: "15:30", framework: "Social Communication", tags: ['Environment', 'Social'], score: "0.92" }
        ]
      },
      { 
        id: "RD-002",
        date: "2026-05-12", 
        focus: "Follow-up Observation", 
        notes: "Gathering more social interaction data.",
        evidence: [
          { id: "rd-e3", text: "Client engaged in parallel play but avoided direct eye contact with peers.", type: "behavioural", timestamp: "11:00", framework: "Social Communication", tags: ['Behavioral'], score: "0.85" }
        ]
      }
    ],
    assessments: [
      { 
        id: "a1-125575",
        title: "Social Communication Checklist", 
        subtitle: "May 10, 2026 • Teacher", 
        status: "ready", // Changed to ready to unlock Evidence Workspace
        overallImpression: "High Concern",
        score: "Extremely Low",
        percentile: "5th",
        descriptor: "Impaired"
      },
      { 
        id: "a2-125575",
        title: "Adaptive Behavior Scale", 
        subtitle: "May 12, 2026 • Parent", 
        status: "ready", // Changed to ready
        overallImpression: "Moderate Concern",
        score: "Low Average",
        percentile: "16th",
        descriptor: "Below Average"
      }
    ],
    evidence: [
      { id: "e1-125575", type: "session", description: "Direct clinical observation.", date: "2026-05-10", label: "Fluent Interaction", score: "0.95", hasConflict: true, sessionId: "RD-001" },
      { id: "e2-125575", type: "document", description: "Teacher qualitative feedback.", date: "2026-05-11", label: "Social Initiation Deficit", score: "0.92", hasConflict: true, sourceDocumentId: "rd-doc-1" },
      { id: "e3-125575", type: "session", description: "Follow-up observation.", date: "2026-05-12", label: "Parallel Play Only", score: "0.85", sessionId: "RD-002" }
    ],
    analysis: [],
    reports: [],
    conflicts: [
      { id: "rd-c1", description: "Cross-Context Conflict: Direct clinical observation (RD-001) shows 'fluent interaction' while Teacher report highlights 'nearly non-existent' initiation." }
    ],
    missingDocuments: [],
    documents: [
      { id: "rd-doc-1", name: "School Summary", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-05-10", uploadDate: "2026-05-10", uploadedAt: "2026-05-10" }
    ]
  },
  "125576": {
    reportUnlocked: false,
    allAccepted: true, // Gate 1 Passed
    sessions: [
      {
        id: "CRS-001",
        date: "2026-05-15",
        focus: "Clinical Interview",
        notes: "Conflict showcase.",
        evidence: [
          { id: "crs-e1", text: "Client reports no significant sensory issues.", type: "verbatim", timestamp: "10:00", framework: "Sensory", tags: ["Sensory"], score: "0.90" }
        ]
      }
    ],
    assessments: [
      { id: "a1-125576", title: "Sensory Profile", subtitle: "May 15, 2026", status: "ready" }
    ],
    evidence: [
      { id: "e1-125576", type: "session", description: "Conflict demonstration session", label: "Sensory Conflict", score: "0.85", hasConflict: true, date: "2026-05-15", sessionId: "CRS-001" }
    ],
    analysis: [],
    reports: [],
    conflicts: [
      { id: "crs-c1", description: "Sensory Conflict: Self-report indicates no issues, but observational data suggests hypersensitivity to loud noises." }
    ],
    missingDocuments: [],
    documents: []
  }
};
