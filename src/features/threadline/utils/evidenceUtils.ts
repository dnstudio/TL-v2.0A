export const getEvidenceBadgeProps = (
  type?: string,
  status?: string,
  context?: string,
) => {
  const normalizedType = type?.toString()?.toLowerCase();
  const normalizedContext = context?.toString()?.toLowerCase();

  if (normalizedType === "verbatim") {
    return {
      status: status || "processing",
      label: "VERBATIM",
      className: "bg-secondary-focus text-secondary-focus-text border-0",
    };
  }

  if (normalizedType === "behavioural") {
    return {
      status: status || "completed",
      label: "BEHAVIOURAL",
      className: "bg-secondary-balance text-secondary-balance-text border-0",
    };
  }

  if (
    normalizedType === "extract" ||
    normalizedType === "document" ||
    normalizedContext === "document"
  ) {
    return {
      status: status || "uploaded",
      label: "EXTRACT",
      className:
        "bg-secondary-connection text-secondary-connection-text border-0",
    };
  }

  if (
    normalizedType === "qualitative" ||
    normalizedType === "observation" ||
    normalizedContext === "assessment" ||
    normalizedType === "assessment"
  ) {
    return {
      status: status || "ready",
      label: "OBSERVATION",
      className: "bg-secondary-sleep text-secondary-sleep-text border-0",
    };
  }

  return {
    status: status || "completed",
    label: type || "Finding",
    className: "bg-slate-100 text-slate-900 border-0",
  };
};
