import React from 'react';
import { Edit3 as EditIcon } from 'lucide-react';
import { CollapsibleSection } from "@ui/index";

interface ReportSectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  noCollapse?: boolean;
  reviewBadge?: React.ReactNode;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ 
  id,
  title, 
  children, 
  noCollapse, 
  reviewBadge 
}) => {
  return (
    <div id={id}>
      <CollapsibleSection
        title={title}
        noCollapse={noCollapse}
        headerAction={(
          <>
            {reviewBadge}
            <button className="p-1 hover:bg-slate-50 rounded-md transition-colors text-slate-600 hover:text-slate-600">
              <EditIcon size={16} />
            </button>
          </>
        )}
      >
        {children}
      </CollapsibleSection>
    </div>
  );
};
