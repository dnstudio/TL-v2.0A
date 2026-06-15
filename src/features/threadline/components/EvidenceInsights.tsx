import React, { useState, useMemo } from "react";
import {
  Info,
  Tag,
  Brain,
  History,
  Database,
  Activity,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Typography, Card, DataPoint, Modal } from "@ui/index";
import { SysBadge } from "@shared/SysBadge";
import { mapScoreToConfidence } from "@shared/ConfidenceBadge";

// --- Internal Helper Components ---

export function InsightSectionHeader({
  icon: Icon,
  label,
  info,
}: {
  icon: any;
  label: string;
  info?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-slate-800">
      <Icon size={14} />
      <span className="flex items-center gap-1.5 flex-1 relative z-20">
        <Typography
          variant="label-micro"
          className="font-bold uppercase tracking-wider"
        >
          {label}
        </Typography>
        {info && (
          <div className="group relative flex items-center shrink-0">
            <Info
              size={13}
              className="text-slate-400 hover:text-slate-600 cursor-help transition-colors"
            />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-2.5 bg-slate-800 text-white text-xs rounded-md shadow-xl z-[9999] font-normal normal-case tracking-normal text-center leading-relaxed pointer-events-none">
              {info}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </span>
    </div>
  );
}

export function InsightTrendChart({ data, series }: { data: any[]; series: { key: string; color: string }[] }) {
  if (!data?.length) return null;
  return (
    <div className="h-32 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="label"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8" }}
          />
          <YAxis hide domain={[0, "auto"]} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 3, fill: s.color, strokeWidth: 1, stroke: "#fff" }}
              activeDot={{ r: 5, stroke: s.color, strokeWidth: 0 }}
              name={s.key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CorrelatedExtractsList({
  extractions,
  onNavigate,
}: {
  extractions: any[];
  onNavigate?: (id: string) => void;
}) {
  return (
    <div className="space-y-4 pt-2">
      <InsightSectionHeader
        icon={Tag}
        label="Correlated Extracts"
        info="Other excerpts that share similar tags, sessions, or themes with this piece of evidence."
      />
      <div className="space-y-3">
        {extractions.length > 0 ? (
          extractions.map((se, idx) => (
            <div
              key={se.id || idx}
              className="group p-3 bg-white border border-divider rounded-lg hover:border-primary/20 transition-all cursor-pointer flex gap-3"
              onClick={() => onNavigate?.(se.sessionId)}
            >
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 group-hover:bg-primary transition-colors" />
              <div className="space-y-1">
                <Typography
                  variant="body-sm"
                  className="text-slate-800 line-clamp-2 leading-relaxed"
                >
                  {se.text}
                </Typography>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  <span className="hover:underline">
                    {se.sourceSession || "External"}
                  </span>
                  <span>•</span>
                  <span>{se.timestamp || "No time"}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center border border-dashed border-divider rounded-xl">
            <Typography variant="body-sm" className="text-slate-400 italic">
              No secondary correlations detected in current pool
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export function EvidenceInsightsCard({
  item,
  allSnippets,
  sessions,
  type,
  assessments = [],
  onNavigateToSource,
}: {
  item: any;
  allSnippets: any[];
  sessions: any[];
  type: string;
  assessments?: any[];
  onNavigateToSource?: (srcId: string) => void;
}) {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const isAssessment = type === "assessment";

  const isObservationType = useMemo(() => {
    return (
      item.type?.toString().toUpperCase() === "OBSERVATION" ||
      item.subtype?.toString().toUpperCase() === "OBSERVATION" ||
      item.subtypes?.toString().toUpperCase() === "OBSERVATION"
    );
  }, [item.type, item.subtype, item.subtypes]);

  const isAssessmentType = useMemo(() => {
    return (
      isAssessment ||
      item.type?.toString().toUpperCase() === "ASSESSMENT" ||
      item.subtype?.toString().toUpperCase() === "ASSESSMENT" ||
      item.subtypes?.toString().toUpperCase() === "ASSESSMENT" ||
      !!item.sourceAssessmentId
    );
  }, [isAssessment, item.type, item.subtype, item.subtypes, item.sourceAssessmentId]);

  const showAssessmentEvidence = (isObservationType || isAssessmentType) && !item.sourceDocumentId;

  const isExtractType = useMemo(() => {
    return (
      item.type?.toString().toUpperCase() === "EXTRACT" ||
      item.subtype?.toString().toUpperCase() === "EXTRACT" ||
      item.subtypes?.toString().toUpperCase() === "EXTRACT"
    );
  }, [item.type, item.subtype, item.subtypes]);

  const isDocumentType = useMemo(() => {
    return (
      type === "document" ||
      item.type?.toString().toUpperCase() === "DOCUMENT" ||
      item.subtype?.toString().toUpperCase() === "DOCUMENT" ||
      item.subtypes?.toString().toUpperCase() === "DOCUMENT" ||
      !!item.sourceDocumentId
    );
  }, [type, item.type, item.subtype, item.subtypes, item.sourceDocumentId]);

  const isCriteriaType = useMemo(() => {
    return (
      type === "criteria" || item.type?.toString().toUpperCase() === "CRITERIA"
    );
  }, [type, item.type]);

  const showDocumentInsights = isExtractType || isDocumentType || (isObservationType && !!item.sourceDocumentId);

  const tags = useMemo(
    () =>
      Array.isArray(item.tags)
        ? item.tags
        : (item.tag || item.tagGroups || "")
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean),
    [item.tags, item.tag, item.tagGroups],
  );

  const seriesColors = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1"];

  const tagCounts = useMemo(
    () =>
      tags.map((tag, idx) => {
        const count = allSnippets.filter((s) => {
          const sTags = Array.isArray(s.tags)
            ? s.tags
            : (s.tag || "")
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean);
          return sTags.some((st) => st.toLowerCase() === tag.toLowerCase());
        }).length;
        return { 
          tag, 
          count, 
          color: seriesColors[idx % seriesColors.length] 
        };
      }),
    [tags, allSnippets],
  );

  const maxTagCount = useMemo(
    () => Math.max(...tagCounts.map((tc) => tc.count), 1),
    [tagCounts],
  );

  const trendData = useMemo(
    () =>
      sessions
        .map((s) => {
          const counts: Record<string, number> = {};
          tags.forEach(tag => {
            counts[tag] = allSnippets.filter((sn) => {
              const snTags = Array.isArray(sn.tags)
                ? sn.tags
                : (sn.tag || "")
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter(Boolean);
              const matchesTag = snTags.some((st) =>
                st.toLowerCase() === tag.toLowerCase()
              );
              const snSession = sn.sessionId || "";
              return matchesTag && snSession === s.id;
            }).length;
          });

          return {
            label: new Date(s.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            }),
            ...counts,
          };
        })
        .filter((d: any) => {
          const hasData = tags.some(tag => d[tag] > 0);
          return hasData || sessions.length <= 5;
        }),
    [sessions, allSnippets, tags],
  );

  const seriesData = useMemo(() => {
    return tags.map((tag, idx) => ({
      key: tag,
      color: seriesColors[idx % seriesColors.length]
    }));
  }, [tags]);

  const supportingEvidence = useMemo(
    () =>
      allSnippets
        .filter((s) => {
          if (s.id === item.id) return false;
          const sTags = Array.isArray(s.tags)
            ? s.tags
            : (s.tag || "")
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean);
          return sTags.some((st) =>
            tags.map((t) => t.toLowerCase()).includes(st.toLowerCase()),
          );
        })
        .slice(0, 3),
    [allSnippets, item.id, tags],
  );

  const relatedAssessmentsTrend = useMemo(
    () =>
      isAssessment
        ? assessments
            .filter((a) =>
              a.title
                .toLowerCase()
                .includes(item.label?.split(" ")[0].toLowerCase() || ""),
            )
            .map((a) => ({
              label:
                a.date || (a.subtitle ? a.subtitle.split(" • ")[0] : "Plan"),
              value: parseInt(a.score) || 0,
            }))
            .filter((a) => a.value > 0)
            .sort(
              (a, b) =>
                new Date(a.label).getTime() - new Date(b.label).getTime(),
            )
        : [],
    [isAssessment, assessments, item.label],
  );

  const chartData = useMemo(
    () =>
      isAssessment && relatedAssessmentsTrend.length > 0
        ? relatedAssessmentsTrend
        : trendData,
    [isAssessment, relatedAssessmentsTrend, trendData],
  );

  const confidence = useMemo(
    () => mapScoreToConfidence(parseFloat(item.score || "0")),
    [item.score],
  );

  const suggestedActions = useMemo(() => {
    const label = (item.label || item.title || "").toLowerCase();
    if (label.includes("negative evaluation")) {
      return [
        "Cross-reference with School Reports for social avoidance patterns",
        "Request specific examples of physical symptoms during social interactions",
        "Review collateral from teacher regarding peer group participation",
      ];
    }
    if (label.includes("concern about additional")) {
      return [
        "Administer specialized Panic Disorder inventory",
        "Verify duration and frequency of tactile sensitivity episodes",
        "Seek clarification on 'breathing difficulty' vs adaptive response",
      ];
    }
    return [
      "Review verbatim extracts for qualifying frequency descriptors",
      "Correlate finding with secondary behavioral observations",
      "Flag for discussion in upcoming multidisciplinary review",
    ];
  }, [item.label, item.title]);

  const clinicalQuestions = useMemo(() => {
    const label = (item.label || item.title || "").toLowerCase();
    if (label.includes("negative evaluation")) {
      return [
        "Can you describe what you think others are noticing when you speak?",
        "How does your behavior change when you know you are being observed?",
        "Are there specific people or groups where this fear is less intense?",
      ];
    }
    if (label.includes("concern about additional")) {
      return [
        "When you experienced the breathing difficulty, what was happening just before?",
        "How long does the concern persist after an episode has ended?",
        "Do you find yourself avoiding specific places because of these concerns?",
      ];
    }
    return [
      "How long has this symptom been causing meaningful distress?",
      "In what ways does this impact your daily routine or responsibilities?",
      "Can you recall the first time you noticed this feeling?",
    ];
  }, [item.label, item.title]);

  const sameTestHistorical = useMemo(() => {
    const historical = assessments
      .filter((a) => {
        const itemTitle = (item.label || item.title || "").trim().toLowerCase();
        const assessmentTitle = (a.title || "").trim().toLowerCase();
        return (
          assessmentTitle.includes(itemTitle) ||
          itemTitle.includes(assessmentTitle)
        );
      })
      .map((a) => ({
        label: a.date || (a.subtitle ? a.subtitle.split(" • ")[0] : "N/A"),
        value: parseInt(a.score) || 0,
      }))
      .filter((a) => a.value > 0)
      .sort(
        (a, b) => new Date(a.label).getTime() - new Date(b.label).getTime(),
      );
    return historical;
  }, [assessments, item.label, item.title]);

  const relatedTests = useMemo(
    () =>
      assessments
        .filter(
          (a) =>
            (a.title || "").toLowerCase() !==
            (item.label || item.title || "").toLowerCase(),
        )
        .filter((a) => {
          const itemWords = (item.label || item.title || "")
            .toLowerCase()
            .split(" ");
          const testWords = (a.title || a.label || "").toLowerCase().split(" ");
          return itemWords.some((w) => w.length > 3 && testWords.includes(w));
        })
        .slice(0, 3),
    [assessments, item.label, item.title],
  );

  if (isCriteriaType && confidence === 'high') {
    return null;
  }

  return (
    <>
      <Card className="p-0 bg-white border border-divider shadow-none rounded-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
                <Brain size={18} />
              </div>
              <div>
                <Typography
                  variant="h4"
                  className="font-semibold text-slate-800 tracking-tight"
                >
                  Intelligence Insights
                </Typography>
                <Typography variant="body-xs" className="text-slate-400">
                  Contextual analysis for this identifier
                </Typography>
              </div>
            </div>
            <SysBadge>AI Augmented</SysBadge>
          </div>

          <div className="relative z-10">
            {showAssessmentEvidence ? (
              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Historical Longitudinal Data */}
                  <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 shadow-none">
                    <InsightSectionHeader
                      icon={History}
                      label={`Historical Trend: ${item.label || item.title || "Same Test"} (${sameTestHistorical.length} pts)`}
                      info="Displays historical outcomes for this specific assessment to identify longitudinal patterns."
                    />
                    <div className="h-32 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={
                            sameTestHistorical.length > 0
                              ? sameTestHistorical
                              : chartData
                          }
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="label"
                            fontSize={10}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8" }}
                          />
                          <YAxis hide domain={[0, "auto"]} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              fontSize: "12px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{
                              r: 4,
                              fill: "#0ea5e9",
                              strokeWidth: 2,
                              stroke: "#fff",
                            }}
                            activeDot={{
                              r: 6,
                              stroke: "#0ea5e9",
                              strokeWidth: 0,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 shadow-none">
                    <InsightSectionHeader
                      icon={Database}
                      label="Related Test Context"
                      info="Other assessments mapped to the same finding, supporting corroboration of clinical severity."
                    />
                    <div className="space-y-3 pt-1">
                      {relatedTests.length > 0 ? (
                        relatedTests.map((rt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between border-b border-white/40 last:border-0 pb-2 last:pb-0"
                          >
                            <div className="space-y-0.5">
                              <Typography
                                variant="body-xs"
                                className="font-bold text-slate-700"
                              >
                                {rt.title}
                              </Typography>
                              <Typography
                                variant="body-xs"
                                className="text-slate-400"
                              >
                                {rt.date || rt.subtitle || "Recent"}
                              </Typography>
                            </div>
                            <div className="px-2 py-1 bg-indigo-50 rounded text-[10px] font-bold text-indigo-600 border border-indigo-100">
                              {rt.score}
                            </div>
                          </div>
                        ))
                      ) : (
                        <Typography
                          variant="body-xs"
                          className="text-slate-400 italic"
                        >
                          No related validated tests detected
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : showDocumentInsights ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 items-start">
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 shadow-none overflow-hidden h-full">
                    <div className="space-y-3">
                      <Typography
                        variant="body-xs"
                        className="text-slate-700 leading-relaxed"
                      >
                        Past diagnoses and medications extracted across
                        documents indicate a{" "}
                        <span className="text-primary tracking-tight font-medium">
                          treatment gap
                        </span>{" "}
                        in the last 6 months.
                      </Typography>

                      <button
                        onClick={() => setIsHistoryModalOpen(true)}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group cursor-pointer"
                      >
                        Diagnosis Timeline
                        <ArrowRight
                          size={10}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="pt-0!">
                    <CorrelatedExtractsList
                      extractions={supportingEvidence}
                      onNavigate={onNavigateToSource}
                    />
                  </div>
                </div>
              </div>
            ) : isCriteriaType &&
              (confidence === "low" || confidence === "medium") ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-4">
                    <InsightSectionHeader
                      icon={Activity}
                      label="Suggested Evidence Actions"
                      info="Recommended clinical or investigative next steps based on intelligence analysis of the current data."
                    />
                    <div className="space-y-2">
                      {suggestedActions.map((action, idx) => (
                        <div key={idx} className="flex gap-2 items-start group">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 group-hover:bg-primary transition-colors" />
                          <Typography
                            variant="body-sm"
                            className="text-slate-600 leading-snug"
                          >
                            {action}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-4">
                    <InsightSectionHeader
                      icon={MessageSquare}
                      label="Clinical Questions"
                      info="Targeted qualitative questions to further interrogate and clarify this specific finding."
                    />
                    <div className="space-y-2">
                      {clinicalQuestions.map((question, idx) => (
                        <div key={idx} className="flex gap-2 items-start group">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 group-hover:bg-primary transition-colors" />
                          <Typography
                            variant="body-sm"
                            className="text-slate-600 leading-snug"
                          >
                            {question}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-4">
                    <InsightSectionHeader
                      icon={Tag}
                      label="Tag Saturation"
                      info="A visual breakdown of core themes or tags, emphasizing primary domains of clinical attention based on supporting evidence."
                    />
                    <div className="space-y-3 pt-1">
                      {tagCounts.length > 0 ? (
                        tagCounts.map((tc, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-1.5">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full" 
                                  style={{ backgroundColor: tc.color }} 
                                />
                                <span className="font-medium text-slate-700">
                                  {tc.tag}
                                </span>
                              </div>
                              <span className="text-slate-400 font-bold">
                                {tc.count} items
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(tc.count / maxTagCount) * 100}%`,
                                  }}
                                  style={{ backgroundColor: tc.color }}
                                  className="h-full"
                                />
                            </div>
                          </div>
                        ))
                      ) : (
                        <Typography
                           variant="body-sm"
                          className="text-slate-400 italic"
                        >
                          No tag correlations found
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-4">
                    <InsightSectionHeader
                      icon={Activity}
                      label={
                        isAssessment ? "Score Trajectory" : "Frequency Trend"
                      }
                      info={
                        isAssessment
                          ? "Charts the historical progression of scores over time to identify patterns or shifts in functioning."
                          : "Illustrates how often this topic arises across notes and sessions chronologically."
                      }
                    />
                    <InsightTrendChart 
                      data={chartData} 
                      series={isAssessment ? [{ key: "value", color: "#0ea5e9" }] : seriesData} 
                    />
                  </div>
                </div>

                <CorrelatedExtractsList
                  extractions={supportingEvidence}
                  onNavigate={onNavigateToSource}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-divider z-10 relative bg-white">
          <Typography variant="label-micro" className="text-slate-500">
            Was this insight useful?
          </Typography>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-full hover:bg-green-50 text-slate-400 hover:text-green-600 transition-colors">
              <ThumbsUp size={14} />
            </button>
            <button className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
              <ThumbsDown size={14} />
            </button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Diagnosis Timeline"
        width={480}
      >
        <div className="space-y-6 py-2">
          <div className="grid grid-cols-1 gap-6">
            <DataPoint
              label="2023"
              value={
                <div className="text-slate-800 font-medium pb-2 border-b border-slate-100">
                  MDD Diagnosis (Dr. Smith)
                </div>
              }
            />
            <DataPoint
              label="2024"
              value={
                <div className="text-slate-800 font-medium">
                  Sertraline 50mg prescribed
                </div>
              }
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export function LowScoreWarningBanner({
  score,
  type,
  badgeType = "relevance",
}: {
  score?: string;
  type: string;
  badgeType?: "relevance" | "confidence" | "impact";
}) {
  if (!score || parseFloat(score) >= 0.4) return null;

  const label =
    type === "session"
      ? "Session"
      : type === "tag"
        ? "Tag Group"
        : type === "criteria"
          ? "Finding"
          : type === "nextstep"
            ? "Clinical Plan Item"
            : "Evidence Item";

  const title =
    badgeType === "relevance"
      ? "Low Relevance Warning"
      : badgeType === "confidence"
        ? "Low Confidence Warning"
        : "Low Impact Warning";

  const getDescription = () => {
    if (badgeType === "confidence") {
      return `The automated extraction has flagged this ${label.toLowerCase()} as having low assessment confidence. Please verify the source material to ensure this finding meets the clinical threshold for inclusion.`;
    }
    if (badgeType === "impact") {
      return `This clinical plan item has been flagged as having low potential impact. Consider if this next step is necessary for resolving diagnostic ambiguity or if a higher-impact alternative should be prioritized.`;
    }
    return `The automated extraction has flagged this ${label.toLowerCase()} as having low diagnostic relevance. Please verify if these observations should be included in the clinical rationale.`;
  };

  return (
    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
      <Info size={20} className="shrink-0 text-slate-900 mt-0.5" />
      <div className="space-y-1">
        <Typography variant="body" className="font-semibold text-slate-900">
          {title}
        </Typography>
        <Typography variant="body-sm" className="text-slate-900/90">
          {getDescription()}
        </Typography>
      </div>
    </div>
  );
}
