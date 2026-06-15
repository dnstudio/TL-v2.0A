import * as React from "react";
import { cn } from "../../lib/utils";
import { Typography } from "./Typography";

interface DataPointProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export function DataPoint({ label, value, className }: DataPointProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <Typography variant="label-micro" className="text-text-primary">
        {label}
      </Typography>
      <div className="text-sm font-medium text-slate-900 leading-snug">
        {value}
      </div>
    </div>
  );
}
