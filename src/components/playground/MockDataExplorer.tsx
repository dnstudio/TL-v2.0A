import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronDown, 
  Download, 
  ExternalLink, 
  User, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Database,
  ClipboardList,
  MessageSquare,
  FileBox,
  Hash
} from "lucide-react";
import { MOCK_CLIENTS, MOCK_ASSESSMENTS, MOCK_DOCUMENTS, MOCK_CLIENT_DATA } from "../../features/threadline/mockData";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

type Category = 'Clients' | 'Assessments' | 'Documents' | 'Sessions';

export function MockDataExplorer() {
  const [activeCategory, setActiveCategory] = useState<Category>('Clients');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filterRef, setFilterRef] = useState<string>("all");

  const rawData = useMemo(() => {
    switch (activeCategory) {
      case 'Clients':
        return MOCK_CLIENTS;
      case 'Assessments':
        return Object.entries(MOCK_CLIENT_DATA).flatMap(([clientId, data]) => {
          const assessments = (data.assessments || []).map(assessment => ({
            ...assessment,
            clientId,
            clientName: MOCK_CLIENTS.find(c => c.id === clientId)?.name || clientId
          }));
          
          // Deduplicate by title, keeping the last one
          const seen = new Set();
          return [...assessments].reverse().filter(a => {
            const key = `${clientId}-${a.title}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }).reverse();
        });
      case 'Documents':
        return Object.entries(MOCK_CLIENT_DATA).flatMap(([clientId, data]) => {
          const documents = (data.documents || []).map(doc => ({
            ...doc,
            clientId,
            clientName: MOCK_CLIENTS.find(c => c.id === clientId)?.name || clientId
          }));

          // Deduplicate by name, keeping the last one
          const seen = new Set();
          return [...documents].reverse().filter(d => {
            const key = `${clientId}-${d.name}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }).reverse();
        });
      case 'Sessions':
        return Object.entries(MOCK_CLIENT_DATA).flatMap(([clientId, data]) => 
          (data.sessions || []).map(session => ({
            ...session,
            clientId,
            clientName: MOCK_CLIENTS.find(c => c.id === clientId)?.name || clientId
          }))
        );
      default:
        return [];
    }
  }, [activeCategory]);

  const filteredData = useMemo(() => {
    let data = [...rawData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter((item: any) => {
        const searchString = JSON.stringify(item).toLowerCase();
        return searchString.includes(lowerSearch);
      });
    }

    if (activeCategory === 'Clients' && filterRef !== "all") {
      data = data.filter((client: any) => client.ref === filterRef);
    }

    if (sortConfig !== null) {
      data.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [rawData, searchTerm, sortConfig, filterRef, activeCategory]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const uniqueRefs = useMemo(() => Array.from(new Set(MOCK_CLIENTS.map(c => c.ref))), []);

  const renderClientsTable = () => (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-200">
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors" onClick={() => requestSort('name')}>
            <div className="flex items-center gap-2">Client <ArrowUpDown size={12} /></div>
          </th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors" onClick={() => requestSort('id')}>
            <div className="flex items-center gap-2">ID <ArrowUpDown size={12} /></div>
          </th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors" onClick={() => requestSort('ref')}>
            <div className="flex items-center gap-2">Reference <ArrowUpDown size={12} /></div>
          </th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinicians</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Consent</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {filteredData.map((client: any) => (
          <tr key={client.id} className="hover:bg-slate-50 transition-colors">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200"><User size={14} /></div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{client.name}</div>
                  <div className="text-xs text-slate-400 font-mono italic">{client.extId}</div>
                </div>
              </div>
            </td>
            <td className="p-4 text-sm font-mono text-slate-500">#{client.id}</td>
            <td className="p-4 text-sm text-slate-600">{client.ref}</td>
            <td className="p-4">
              <div className="flex flex-wrap gap-1">
                {client.clinicians.map((c: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium border border-blue-100/50">{c}</span>
                ))}
              </div>
            </td>
            <td className="p-4">
              {client.consent ? 
                <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase"><CheckCircle2 size={10} /> Active</span> : 
                <span className="inline-flex items-center gap-1 text-amber-500 text-[10px] font-bold uppercase"><AlertCircle size={10} /> Pending</span>
              }
            </td>
            <td className="p-4">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mb-1">Last Session</div>
              <div className="text-xs text-slate-600">{client.last.split(' – ')[0]}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderAssessmentsTable = () => (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-200">
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider" onClick={() => requestSort('score')}>
            <div className="flex items-center gap-2">Score <ArrowUpDown size={12} /></div>
          </th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Info</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {filteredData.map((item: any, idx: number) => (
          <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><ClipboardList size={14} /></div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{item.title}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{item.subtitle}</div>
                </div>
              </div>
            </td>
            <td className="p-4">
              <div className="text-xs font-medium text-slate-700">{item.clientName}</div>
              <div className="text-[10px] text-slate-400">ID: {item.clientId}</div>
            </td>
            <td className="p-4 text-sm font-mono text-slate-500">#{item.id}</td>
            <td className="p-4">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                item.status === 'completed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                item.status === 'in-progress' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                "bg-slate-100 text-slate-500 border border-slate-200"
              )}>
                {item.status}
              </span>
            </td>
            <td className="p-4">
              {item.score ? (
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold text-slate-900">{item.score}</div>
                  <div className="text-[10px] text-slate-400">({item.percentile})</div>
                </div>
              ) : <span className="text-slate-300">—</span>}
            </td>
            <td className="p-4">
              <div className="text-xs text-slate-600 line-clamp-1 max-w-[300px]">{item.description}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderDocumentsTable = () => (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-200">
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Name</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Version</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Added At</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {filteredData.map((doc: any, idx: number) => (
          <tr key={doc.id || idx} className="hover:bg-slate-50 transition-colors">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200"><FileBox size={14} /></div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {doc.id}</div>
                </div>
              </div>
            </td>
            <td className="p-4">
              <div className="text-xs font-medium text-slate-700">{doc.clientName}</div>
              <div className="text-[10px] text-slate-400">ID: {doc.clientId}</div>
            </td>
            <td className="p-4">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">{doc.type}</span>
            </td>
            <td className="p-4 text-xs text-slate-600">{doc.version}</td>
            <td className="p-4">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                doc.status === 'uploaded' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                doc.status === 'required' ? "bg-red-50 text-red-600 border border-red-100" :
                "bg-amber-50 text-amber-600 border border-amber-100"
              )}>
                {doc.status || 'uploaded'}
              </span>
            </td>
            <td className="p-4 text-xs text-slate-500">
              {doc.uploadDate || doc.creationDate || '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSessionsTable = () => (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-200">
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Session Info</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Focus</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Evidence</th>
          <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {filteredData.map((session: any, idx: number) => (
          <tr key={session.id || idx} className="hover:bg-slate-50 transition-colors">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200"><Calendar size={14} /></div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{session.date}</div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {session.id || 'N/A'}</div>
                </div>
              </div>
            </td>
            <td className="p-4">
              <div className="text-xs font-medium text-slate-700">{session.clientName}</div>
              <div className="text-[10px] text-slate-400">ID: {session.clientId}</div>
            </td>
            <td className="p-4">
              <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase border border-indigo-100 w-fit">{session.focus}</div>
            </td>
            <td className="p-4">
              <div className="flex items-center gap-1 text-slate-600">
                <MessageSquare size={12} className="text-slate-400" />
                <span className="text-sm font-bold">{(session.evidence || []).length}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="text-xs text-slate-500 italic line-clamp-1 max-w-[300px]">{session.notes}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="text-primary" size={18} />
              <h1 className="text-xl font-serif font-semibold text-slate-900">Mock Data Explorer</h1>
            </div>
            <p className="text-sm text-slate-500">Live inspection of all application mock datasets</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-white">
              <Download size={14} className="mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 -mb-6 pb-2">
          {(['Clients', 'Assessments', 'Documents', 'Sessions'] as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchTerm("");
                setSortConfig(null);
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all relative",
                activeCategory === cat ? "text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {cat}
              {activeCategory === cat && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder={`Search in ${activeCategory.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeCategory === 'Clients' && (
            <div className="flex items-center gap-2">
               <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    value={filterRef}
                    onChange={(e) => setFilterRef(e.target.value)}
                  >
                    <option value="all">All References</option>
                    {uniqueRefs.map(ref => (
                      <option key={ref} value={ref}>{ref}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredData.length > 0 ? (
          <>
            {activeCategory === 'Clients' && renderClientsTable()}
            {activeCategory === 'Assessments' && renderAssessmentsTable()}
            {activeCategory === 'Documents' && renderDocumentsTable()}
            {activeCategory === 'Sessions' && renderSessionsTable()}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center gap-2 text-slate-400 font-serif lg:text-lg">
              <Search size={40} className="mb-2 opacity-20" />
              No {activeCategory.toLowerCase()} matching your search
              <p className="text-xs font-sans text-slate-400 italic">Try a different term</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div>Showing <span className="font-bold text-slate-700">{filteredData.length}</span> of {rawData.length} items</div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-200/50 rounded text-[10px] font-mono">
            <Hash size={10} />
            Total Mocks: {MOCK_CLIENTS.length + MOCK_ASSESSMENTS.length + MOCK_DOCUMENTS.length + Object.keys(MOCK_CLIENT_DATA).length}
          </div>
        </div>
        <div className="font-mono opacity-50 px-2 py-1 bg-white border border-slate-200 rounded">
          Source: features/threadline/mockData.ts
        </div>
      </div>
    </div>
  );
}
