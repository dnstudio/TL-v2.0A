import * as React from "react";
import { cn } from "../../lib/utils";

type TypographyVariant = 
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4"
  | "body" 
  | "body-sm" 
  | "label-micro" 
  | "mono-label" 
  | "infotext"
  | "sub";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "body", as, ...props }, ref) => {
    const Tag = as || (variant === "h1" ? "h1" : variant === "h2" ? "h2" : variant === "h3" ? "h3" : variant === "h4" ? "h4" : "div");

    const variants = {
      h1: "text-[40px] md:text-[46px] font-serif font-bold leading-tight tracking-tight text-text-primary",
      h2: "text-2xl md:text-3xl font-serif font-bold leading-tight tracking-tight text-text-primary",
      h3: "text-[22px] md:text-[26px] font-sans font-semibold leading-snug tracking-tight text-text-primary",
      h4: "text-lg md:text-xl font-sans font-semibold leading-snug tracking-tight text-text-primary",
      body: "text-[15px] font-sans font-normal leading-relaxed text-text-primary",
      "body-sm": "text-sm font-sans font-normal leading-relaxed text-text-secondary",
      "label-micro": "text-[11px] font-sans font-semibold uppercase tracking-wider text-text-secondary",
      "mono-label": "text-xs font-mono tracking-tight text-text-secondary",
      infotext: "text-xs font-sans font-medium text-text-secondary italic leading-relaxed",
      sub: "text-sm font-sans font-medium leading-relaxed text-text-secondary",
    };

    return (
      <Tag
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    );
  }
);
Typography.displayName = "Typography";

export { Typography };
