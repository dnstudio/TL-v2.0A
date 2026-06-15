import { useMemo } from 'react';

export function useGroupedEvidence(
  localSessions: any[],
  assessmentItems: any[],
  documentItems: any[],
  evidenceItems: any[] = []
) {
  return useMemo(() => {
    const allEvidenceSnippets = [
      ...localSessions.flatMap(s => (s.evidence || []).map((f: any) => ({ 
        ...f, 
        sourceSession: s.focus || s.description || 'Clinical Snapshot', 
        sourceTimestamp: s.date, 
        sessionId: s.id, 
        notes: s.notes,
        context: 'session'
      }))),
      ...assessmentItems.flatMap(a => (a.findings || []).map((f: any) => ({ 
        ...f, 
        sourceSession: a.label, 
        sourceTimestamp: a.date || "Apr 21, 2024", 
        sourceAssessmentId: a.id, 
        notes: a.notes,
        context: 'assessment'
      }))),
      ...documentItems.flatMap(d => (d.findings || []).map((f: any) => ({ 
        ...f, 
        sourceSession: d.label, 
        sourceTimestamp: d.date || d.creationDate || "Apr 21, 2024", 
        sourceDocumentId: d.id, 
        notes: d.notes,
        context: 'document'
      }))),
      ...evidenceItems.flatMap(i => {
        const sourceId = i.id || i.label;
        if (i.findings && i.findings.length > 0) {
          return i.findings.map((f: any) => ({
            ...f,
            sourceSession: i.label || i.sessionSource || i.sourceDocumentName || 'Evidence',
            sourceTimestamp: f.timestamp || f.date || i.timestamp || i.date,
            sessionId: f.sessionId || i.sessionId || (i.type === 'evidence' ? sourceId : undefined),
            sourceAssessmentId: f.sourceAssessmentId || i.sourceAssessmentId || (i.type === 'assessment' ? sourceId : undefined),
            sourceDocumentId: f.sourceDocumentId || i.sourceDocumentId || (i.type === 'document' ? sourceId : undefined),
            context: f.sourceDocumentId || i.sourceDocumentId || i.type === 'document' ? 'document' : (f.sourceAssessmentId || i.sourceAssessmentId || i.type === 'assessment' ? 'assessment' : (f.sessionId || i.sessionId || i.type === 'evidence' ? 'session' : 'criteria'))
          }));
        }
        return [{
          ...i,
          sourceSession: i.sessionSource || i.sourceDocumentName || 'Evidence',
          sourceTimestamp: i.timestamp || i.date,
          sessionId: i.sessionId || (i.type === 'evidence' ? sourceId : undefined),
          sourceAssessmentId: i.sourceAssessmentId || (i.type === 'assessment' ? sourceId : undefined),
          sourceDocumentId: i.sourceDocumentId || (i.type === 'document' ? sourceId : undefined),
          context: i.sourceDocumentId || i.type === 'document' ? 'document' : (i.sourceAssessmentId || i.type === 'assessment' ? 'assessment' : 'session')
        }];
      })
    ].filter(f => f.text || f.label || f.verbatim || f.description);

    const tagsMap = new Map<string, any[]>();
    allEvidenceSnippets.forEach(snippet => {
      let tags: string[] = [];
      if (Array.isArray(snippet.tags)) tags = snippet.tags;
      else if (snippet.tag) tags = snippet.tag.split(',').map((t: string) => t.trim()).filter(Boolean);
      
      if (tags.length === 0) tags = ["untagged"];
      
      tags.forEach((t: string) => {
        const lowerT = t.toLowerCase();
        if (!tagsMap.has(lowerT)) tagsMap.set(lowerT, []);
        tagsMap.get(lowerT)!.push(snippet);
      });
    });

    const tagGroups = Array.from(tagsMap.entries()).map(([tag, items]) => ({
      id: `tag-${tag}`,
      label: tag.charAt(0).toUpperCase() + tag.slice(1),
      type: 'tag' as const,
      score: items[0]?.score || "0.95",
      hasConflict: items.some(i => i.hasConflict),
      findings: items
    })).sort((a, b) => b.findings.length - a.findings.length);

    return { tagGroups, allEvidenceSnippets };
  }, [localSessions, assessmentItems, documentItems, evidenceItems]);
}
