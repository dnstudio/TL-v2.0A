/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { Search, Plus, MoreVertical, ChevronDown } from "lucide-react";

// UI & Layout
import { 
  Button, 
  Badge, 
  Card, 
  Typography, 
  Input, 
  Select, 
  TableFooter 
} from "../../../components/ui";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { WorkspaceLayout } from "../../../components/layout/WorkspaceLayout";
import { AddClientModal } from "../modals/AddClientModal";
import { cn } from "../../../lib/utils";
import { Client } from "../../../types";

// Domain
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { useClinicalStore } from "@/services/store";

export type ClientStatus = 'new' | 'in-progress' | 'ready' | 'evidence' | 'conflict' | 'idle';

export function deriveClientStatus(
  client: any,
  clientAssessments: any[] = [],
  clientSessions: any[] = [],
  clientDocuments: any[] = []
): ClientStatus {
  if (!client) return 'idle';

  // 5. READY: Client has passed Evidence Review so analysis and report is unlocked.
  const hasCompletedAll = clientAssessments.length > 0 && clientAssessments.every(a => a.status?.toLowerCase() === 'completed' || a.status?.toLowerCase() === 'review pass');
  if (hasCompletedAll) {
    return 'ready';
  }

  const sessionsCount = clientSessions?.length || 0;
  const assessmentsCount = clientAssessments?.filter(a => a.status?.toLowerCase() === 'completed' || a.status?.toLowerCase() === 'review pass').length || 0;
  const documentsCount = clientDocuments?.filter(d => d.status === 'uploaded' || d.status === 'completed' || d.status === 'Ready').length || 0;
  const currentProgress = Math.min(sessionsCount, 2) + Math.min(assessmentsCount, 2) + Math.min(documentsCount, 2);
  const evidenceUnlocked = currentProgress >= 6;

  // 4. CONFLICT: Evidence tab unlocked AND at least one evidence marked as in conflict.
  if (evidenceUnlocked && client.hasConflicts) {
    return 'conflict';
  }

  // 3. EVIDENCE: Evidence tab unlocked.
  if (evidenceUnlocked) {
    return 'evidence';
  }

  const isJustCreated = (!clientSessions || clientSessions.length === 0) && 
                        (!clientAssessments || clientAssessments.every(a => a.status?.toLowerCase() === 'not-started'));

  // 1. NEW: client just created and consent is NO.
  if (isJustCreated && !client.consent) {
    return 'new';
  }

  // 2. IN PROGRESS: client just created and consent is Y (or work has started but not reached evidence)
  return 'in-progress';
}

interface ClientListScreenProps {
  onSelectClient: (id: string) => void;
}

export function ClientListScreen({ onSelectClient }: ClientListScreenProps) {
  const [search, setSearch] = useState("");
  const [clinicianFilter, setClinicianFilter] = useState("All Clinicians");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const clients = useClinicalStore(state => state.clients);
  const assessments = useClinicalStore(state => state.assessments);
  const sessions = useClinicalStore(state => state.sessions);
  const documents = useClinicalStore(state => state.documents);
  const setClients = useClinicalStore(state => state.setClients);
  const setAssessments = useClinicalStore(state => state.setAssessments);
  const setSessions = useClinicalStore(state => state.setSessions);
  const setDocuments = useClinicalStore(state => state.setDocuments);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const ms = c.name.toLowerCase().includes(search.toLowerCase()) || 
                 c.id.includes(search) || 
                 c.extId.toLowerCase().includes(search.toLowerCase());
      const mc = clinicianFilter === "All Clinicians" || c.clinicians?.includes(clinicianFilter);
      return ms && mc;
    });
  }, [clients, search, clinicianFilter]);

  const pagedClients = filteredClients.slice(page * rpp, (page + 1) * rpp);
  const total = Math.ceil(filteredClients.length / rpp);

  const mainContent = (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30 border-b border-divider">
        <div className="w-full sm:w-[240px]">
          <Select 
            label="Clinician"
            value={clinicianFilter}
            onChange={(e) => setClinicianFilter(e.target.value)}
          >
            <option value="All Clinicians">All Clinicians</option>
            <option value="James Wilson">James Wilson</option>
            <option value="Sara Miller">Sara Miller</option>
            <option value="Olivia Porter">Olivia Porter</option>
          </Select>
        </div>

        <div className="relative w-full sm:w-[320px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <Input 
            placeholder="Search by name, Referral, or ID" 
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-divider">
              {[
                { l: "Name", w: "22%" },
                { l: "Status", w: "15%" },
                { l: "External ID", w: "12%" },
                { l: "Clinicians", w: "20%" },
                { l: "Last Session", w: "15%" },
                { l: "Consent", w: "12%" },
                { l: "", w: "4%" }
              ].map(h => (
                <th key={h.l} className="px-6 py-4 text-left" style={{ width: h.w }}>
                  <div className="flex items-center gap-1.5 group cursor-pointer select-none">
                    <Typography variant="label-micro" className="text-text-primary uppercase tracking-wider">
                      {h.l}
                    </Typography>
                    {h.l && h.l !== "Clinicians" && <ChevronDown size={14} className="text-slate-600 group-hover:text-primary transition-colors" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {pagedClients.map((c) => {
              const status = deriveClientStatus(
                c,
                assessments[c.id] || [],
                sessions[c.id] || [],
                documents[c.id] || []
              );
              return (
                <tr 
                  key={c.id} 
                  className="hover:bg-primary-light/20 transition-colors group cursor-pointer"
                  onClick={() => onSelectClient(c.id)}
                >
                  <td className="px-6 py-5">
                    <div className="space-y-0.5">
                      <Typography variant="body" className="font-semibold text-primary">
                        {c.name}
                      </Typography>
                      <Typography variant="mono-label" className="text-[10px] text-text-secondary uppercase">
                        ID: #{c.id}
                      </Typography>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {status !== 'idle' ? (
                        <StatusBadge status={status} />
                      ) : (
                        <Typography variant="body-sm" className="text-text-disabled">—</Typography>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-text-secondary">
                    <Typography variant="mono-label" className="text-sm">{c.extId}</Typography>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {c.clinicians.map((cl, idx) => (
                        <Badge key={idx} variant="soft" className="text-[11px] px-2 py-0 border-primary/10 text-primary">
                          {cl}
                        </Badge>
                      ))}
                      {c.extra > 0 && (
                        <Typography variant="label-micro" className="mt-1">
                          +{c.extra} more
                        </Typography>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Typography variant="body-sm" className="text-text-secondary">
                      {c.last}
                    </Typography>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={c.consent ? 'completed' : 'missing'} label={c.consent ? "Yes" : "No"} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={16} className="text-gray-400" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TableFooter 
        page={page}
        setPage={setPage}
        rpp={rpp}
        setRpp={setRpp}
        total={total}
        s={page * rpp + 1}
        e={Math.min((page + 1) * rpp, filteredClients.length)}
        count={filteredClients.length}
        className="bg-white border-t border-divider"
      />
    </div>
  );

  return (
    <div className="pb-16 pt-8">
      <WorkspaceLayout 
        singleColumn
        contentClassName="p-0"
        title="Clients"
        small={false}
        subtitle="Manage your diagnostic registry and client relationships."
        headerActions={
          <Button variant="brand" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            Add Client
          </Button>
        }
        mainContent={
          <>
            {mainContent}
            <AddClientModal 
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={(client) => {
                const newClientRecord = {
                  id: client.id,
                  name: client.name,
                  extId: client.externalId || client.id,
                  clinicians: ["James Wilson"],
                  ref: client.referredBy || "Dr. Smith",
                  consent: client.consentObtained?.startsWith("Yes") || false,
                  hasConflicts: false,
                  missingDocs: [],
                  clinicalNotes: [],
                  lastUpdated: new Date().toISOString()
                };
                setClients([...clients, newClientRecord]);
                setAssessments(client.id, []);
                setSessions(client.id, []);
                setDocuments(client.id, []);
                setIsAddModalOpen(false);
              }}
            />
          </>
        }
      />
    </div>
  );
}
