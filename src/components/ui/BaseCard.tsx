import * as React from "react";
import { cn } from "../../lib/utils";
import { Card } from "./Card";

export interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  active?: boolean;
}

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(({
  className,
  hoverable = false,
  active = false,
  onClick,
  ...props
}, ref) => {
  return (
    <Card
      ref={ref}
      onClick={onClick}
      className={cn(
        "group transition-all duration-300 border-divider",
        (hoverable || onClick) ? "cursor-pointer hover:border-primary/50" : "cursor-default",
        active ? "border-primary/50" : "",
        className
      )}
      {...props}
    />
  );
});

BaseCard.displayName = "BaseCard";
