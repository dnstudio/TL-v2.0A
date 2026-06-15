import React from "react";
import { Typography } from "@ui/index";
import { cn } from "@lib/utils";
import { CollapsibleSection } from "@ui/index";
import { ReviewItem } from "./ReviewItem";

export function Step({
  label,
  num,
  active,
}: {
  label: string;
  num: number;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors",
          active
            ? "bg-primary text-white scale-110"
            : "bg-gray-100 text-text-disabled",
        )}
      >
        {num}
      </div>
      <Typography
        variant="body-sm"
        className={cn(
          "font-bold",
          active ? "text-primary" : "text-text-disabled",
        )}
      >
        {label}
      </Typography>
    </div>
  );
}

export interface ReviewCategoryProps {
  title: string;
  items: any[];
  activeType: string;
  activeItemLabel: string | null;
  deferredItems: string[];
  acceptedItems: string[];
  partiallyAcceptedItems?: string[];
  rejectedItems: Record<string, string>;
  onSelect: (id: string, type: string) => void;
  onConfidenceAction?: (cause: any) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export function ReviewCategory({
  title,
  items,
  activeType,
  activeItemLabel,
  deferredItems,
  acceptedItems,
  partiallyAcceptedItems = [],
  rejectedItems,
  onSelect,
  onConfidenceAction,
  children,
  disabled = false,
  isOpen,
  onToggle,
}: ReviewCategoryProps) {
  const visibleItems = items.filter((item) => {
    const id = item.id || item.label;
    return !deferredItems.includes(id);
  });

  if (items.length === 0) return null;
  return (
    <CollapsibleSection title={title} disabled={disabled} isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-px">
        {visibleItems.map((item, idx) => {
          const id = item.id || item.label;
          const isActive = activeType === item.type && activeItemLabel === id;

          return (
            <ReviewItem
              key={`${item.type}-${id || idx}-${idx}`}
              label={item.label}
              score={item.score}
              type={item.type}
              active={isActive}
              deferred={deferredItems.includes(id)}
              accepted={acceptedItems.includes(id)}
              partiallyAccepted={partiallyAcceptedItems.includes(id)}
              rejected={!!rejectedItems[id]}
              hasConflict={item.hasConflict}
              isUserGenerated={item.isUserGenerated}
              cause={item.cause}
              onConfidenceAction={onConfidenceAction}
              onClick={() => onSelect(id, item.type)}
            />
          );
        })}
        {children}
      </div>
    </CollapsibleSection>
  );
}
