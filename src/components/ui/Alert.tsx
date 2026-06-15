import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error";
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Alert({
  className,
  variant = "default",
  title,
  children,
  icon,
  ...props
}: AlertProps) {
  const IconMap = {
    default: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const IconComponent = IconMap[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-xl border p-4 flex gap-3 text-sm transition-colors",
        {
          "bg-white border-divider text-text-primary": variant === "default",
          "bg-success-light border-success/20 text-success": variant === "success",
          "bg-warning/10 border-warning/20 text-warning": variant === "warning",
          "bg-error-light border-error/20 text-error": variant === "error",
        },
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icon || <IconComponent size={18} />}
      </div>
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
