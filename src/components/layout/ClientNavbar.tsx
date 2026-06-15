import { ArrowLeft, User as UserIcon, AlertTriangle, FileText } from "lucide-react";
import { cn } from "../../lib/utils";
import { Logo } from "../shared/Logo";
import { Typography } from "../ui";
import { StatusBadge } from "../shared/StatusBadge";

interface ClientNavbarProps {
  clientName: string;
  clientId: string;
  externalId?: string;
  status?: string;
  conflictCount?: number;
  missingDocsCount?: number;
  onBack: () => void;
  onAvatarClick?: () => void;
}

export function ClientNavbar({
  clientName,
  clientId,
  externalId,
  status,
  conflictCount = 0,
  missingDocsCount = 0,
  onBack,
  onAvatarClick
}: ClientNavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-divider h-16 px-6 md:px-[60px] flex items-center justify-between backdrop-blur-md bg-white/90">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => onBack()}>
          <Logo size={28} showText={false} />
        </div>

        <div className="w-px h-6 bg-divider mx-2" />

        {/* Client Info Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-text-secondary"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-baseline gap-2.5">
            <Typography variant="h3" className="text-sm font-serif font-semibold m-0">
              {clientName}
            </Typography>
            <Typography variant="mono-label" className="text-[11px] text-text-secondary translate-y-[0px]">
              #{externalId || clientId}
            </Typography>
          </div>

          <div className="flex items-center gap-2 pl-4 border-l border-divider ml-1">
            {status && (
              <StatusBadge status={status} className="text-[9px] h-4 px-1.5" />
            )}

            {conflictCount > 0 && (
              <div className="px-[8px] py-[2.5px] rounded border border-red-500 text-red-500 text-[9px] font-bold uppercase whitespace-nowrap flex items-center gap-1.5 leading-none bg-transparent h-4">
                <AlertTriangle size={11} className="stroke-[2.5px]" />
                {conflictCount} Conflict{conflictCount !== 1 ? 's' : ''}
              </div>
            )}
            
            {missingDocsCount > 0 && (
              <div className="px-[8px] py-[2.5px] rounded border border-blue-500 text-blue-500 text-[9px] font-bold uppercase whitespace-nowrap flex items-center gap-1.5 leading-none bg-transparent h-4">
                <FileText size={11} className="stroke-[2.5px]" />
                {missingDocsCount} Missing Doc{missingDocsCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <button 
        onClick={onAvatarClick}
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <div className="hidden sm:block text-right">
          <Typography variant="label-micro" className="font-black text-primary">Dr. O. P.</Typography>
          <Typography variant="mono-label" className="text-[9px] text-text-secondary">Clinician</Typography>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#e4e0dc] border-2 border-white flex items-center justify-center overflow-hidden ring-1 ring-divider">
          <Typography variant="label-micro" className="text-primary font-black">OP</Typography>
        </div>
      </button>
    </nav>
  );
}
