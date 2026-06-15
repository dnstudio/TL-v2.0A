import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  noCollapse?: boolean;
  bg?: string;
  headerAction?: React.ReactNode;
  iconColor?: string;
  className?: string;
  indicatorColor?: string;
  disabled?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = true,
  isOpen: controlledOpen,
  onToggle,
  noCollapse = false,
  bg = "bg-white",
  headerAction,
  className = "",
  indicatorColor,
  disabled = false
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const isOpen = (noCollapse || open) && !disabled;

  const handleToggle = () => {
    if (noCollapse || disabled) return;
    
    if (isControlled) {
      onToggle?.(!controlledOpen);
    } else {
      setInternalOpen(o => !o);
    }
  };

  return (
    <div className={`border border-slate-100 rounded-xl ${bg} overflow-hidden mb-3 ${className} ${disabled ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={handleToggle}
          disabled={noCollapse || disabled}
          className={`flex items-center gap-2.5 flex-1 w-full text-left outline-none ${ (noCollapse || disabled) ? "cursor-default" : "cursor-pointer"}`}
        >
          <div 
            className={`w-2 h-2 shrink-0 rounded-full transition-colors duration-200`} 
            style={{ backgroundColor: disabled ? "#cbd5e1" : (indicatorColor || (isOpen ? "#06302c" : "#cbd5e1")) }}
          />
          <span className="font-sans text-[15px] font-medium text-[#0f172a] flex-1">
            {title}
            {disabled && <span className="ml-2 text-[10px] uppercase font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded tracking-wider">Locked</span>}
          </span>
          {!noCollapse && !disabled && (
            <span className="text-[#64748b] flex items-center ml-auto shrink-0">
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </span>
          )}
          {disabled && (
            <span className="text-slate-300 ml-auto shrink-0">
              <ChevronRight size={18} />
            </span>
          )}
        </button>
        {headerAction && (
          <div className="flex items-center gap-3">
            {headerAction}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="px-5 pb-5 pl-[38px]">
          {children}
        </div>
      )}
    </div>
  );
};
