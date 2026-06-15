/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { X as CloseIcon } from "lucide-react";

// Layout
import { Navbar, DebugMenu, ClientNavbar } from "@components/layout";
import { cn } from "@lib/utils";

// Features
import { ConditionList } from "./features/conditions/ConditionList";
import { ConditionDetail } from "./features/conditions/ConditionDetail";
import { ThreadlineModule } from "./features/threadline/ThreadlineModule";
import { MainSessionListWorkspace } from "./features/threadline/containers/MainSessionListWorkspace";
import { MainAssessmentListWorkspace } from "./features/threadline/containers/MainAssessmentListWorkspace";
import { MainDocumentListWorkspace } from "./features/threadline/containers/MainDocumentListWorkspace";
import { ChangeLogWorkspace } from "./features/threadline/containers/ChangeLogWorkspace";
import { GlobalModals } from "./features/threadline/modals/GlobalModals";

// UI & Shared
import { StyleGuide } from "./components/playground/StyleGuide";
import { MockDataExplorer } from "./components/playground/MockDataExplorer";
import { Button } from "@ui/index";

// Context & Types
import { Condition } from "./types";
import { ALL_CONDITIONS } from "./constants";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./features/threadline/mockData";
import { useClinicalStore } from "./services/store";

export default function App() {
  return (
    <AppContent />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conditions, setConditions] = useState<Condition[]>(() => [...ALL_CONDITIONS]);
  const [showMockData, setShowMockData] = useState(false);

  const clients = useClinicalStore(state => state.clients);
  const assessments = useClinicalStore(state => state.assessments);
  const sessions = useClinicalStore(state => state.sessions);
  const documents = useClinicalStore(state => state.documents);
  const clinicalStoreData = { clients, assessments, sessions, documents };
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDebugMinimized, setIsDebugMinimized] = useState(true);

  const isClientWorkspace = location.pathname.startsWith('/clients/') && location.pathname !== '/clients';
  const currentClientId = isClientWorkspace ? location.pathname.split('/')[2] : null;
  const currentClient = currentClientId ? MOCK_CLIENTS.find(c => c.id === currentClientId) : null;
  const currentClientData = currentClientId ? MOCK_CLIENT_DATA[currentClientId] : null;

  const handleCreateCondition = (data: { name: string; category: string; guideline: string }) => {
    const newCondition: Condition = {
      id: Math.max(...conditions.map(c => c.id), 0) + 1,
      name: data.name,
      category: data.category,
      guideline: data.guideline,
      code: "NEW",
      status: "Draft",
      updated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + " – " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      population: "N/A",
      reviewer: "Current User",
      overview: "Newly created condition guideline.",
      refs: []
    };
    setConditions([newCondition, ...conditions]);
  };

  const getActiveItem = () => {
    const path = location.pathname;
    const segments = [
      'Conditions', 'Clients', 'Patients', 'Sessions', 
      'Assessments', 'Documents', 'Resources', 'Users', 'Playground',
      'Changelog', 'Debug'
    ];
    for (const seg of segments) {
      if (path.startsWith(`/${seg.toLowerCase()}`)) return seg === 'Changelog' ? 'Change Log' : seg;
    }
    if (path.startsWith('/debug')) return 'Debug';
    return 'Clients';
  };

  const isPlayground = location.pathname === '/playground';

  const getClientStatus = () => {
    if (!currentClient || !currentClientData) return undefined;
    if (currentClientData.conflicts && currentClientData.conflicts.length > 0) return 'Conflict';
    
    const hasInProgress = currentClientData.assessments?.some(a => a.status === 'in-progress');
    if (hasInProgress) return 'In Progress';
    
    const hasReady = currentClientData.assessments?.some(a => a.status === 'ready' || a.status === 'completed');
    if (hasReady) return 'Ready';
    
    return 'New';
  };

  return (
    <div className="font-sans bg-workspace-bg min-h-screen relative text-text-primary selection:bg-primary/10">
      {/* Mock Data Overlay */}
      <AnimatePresence>
        {showMockData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowMockData(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-h-[80vh] overflow-y-auto w-full max-w-4xl shadow-2xl border border-divider"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-semibold">Mock Client Data</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowMockData(false)}>
                  <CloseIcon size={20} />
                </Button>
              </div>
              <pre className="text-xs p-4 bg-gray-50 rounded-lg overflow-x-auto font-mono border border-divider">
                {JSON.stringify(clinicalStoreData, null, 2)}
              </pre>
              <div className="mt-6 flex justify-end">
                <Button variant="brand" onClick={() => setShowMockData(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlayground && (
        isClientWorkspace && currentClient ? (
          <ClientNavbar 
            clientName={currentClient.name}
            clientId={currentClient.id}
            externalId={currentClient.extId}
            status={getClientStatus()}
            conflictCount={currentClientData?.conflicts?.length || 0}
            missingDocsCount={currentClientData?.missingDocuments?.length || 0}
            onBack={() => navigate('/clients')}
            onAvatarClick={() => {}}
          />
        ) : (
          <Navbar 
            onClientsClick={() => navigate('/clients')}
            onPatientsClick={() => navigate('/patients')}
            onSessionsClick={() => navigate('/sessions')}
            onAssessmentsClick={() => navigate('/assessments')}
            onDocumentsClick={() => navigate('/documents')}
            onResourcesClick={() => navigate('/resources')}
            onUsersClick={() => navigate('/users')}
            onConditionsClick={() => navigate('/conditions')}
            onPlaygroundClick={() => navigate('/playground')}
            onAvatarClick={() => {}}
            onChangeLogClick={() => navigate('/changelog')}
            onAddClick={() => {
              const params = new URLSearchParams(location.search);
              params.set("modal", "add_evidence");
              navigate({ search: params.toString() });
            }}
            activeItem={getActiveItem()}
            isAdminView={isAdminView}
          />
        )
      )}

      <main className={cn(
        "pb-8 mt-0",
        isPlayground ? "w-full" : "px-6 md:px-[60px] max-w-[1500px] mx-auto"
      )}>
        <AnimatePresence>
          <motion.div
            key={location.pathname.split('/')[1] || 'root'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/clients" replace />} />
              <Route path="/playground" element={<StyleGuide />} />
              <Route path="/debug/clients" element={<MockDataExplorer />} />
              <Route path="/conditions" element={
                <ConditionList
                  conditions={conditions}
                  onCreateCondition={handleCreateCondition}
                  onRowClick={(row) => navigate(`/conditions/${row.id}`)}
                />
              } />
              <Route path="/conditions/:id" element={<ConditionDetailWrapper conditions={conditions} />} />
              
              {/* Feature Modules */}
              <Route path="/clients/*" element={<ThreadlineModule type="clients" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/patients/*" element={<ThreadlineModule type="patients" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/sessions/*" element={<ThreadlineModule type="sessions" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/assessments/*" element={<ThreadlineModule type="assessments" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/documents/*" element={<ThreadlineModule type="documents" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/resources/*" element={<ThreadlineModule type="resources" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/users/*" element={<ThreadlineModule type="users" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/changelog" element={<ChangeLogWorkspace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <DebugMenu 
        isDebugMinimized={isDebugMinimized}
        setIsDebugMinimized={setIsDebugMinimized}
        isPlayground={isPlayground}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        setShowMockData={setShowMockData}
        onNavigate={navigate}
      />

      <GlobalModals />
    </div>
  );
}

function ConditionDetailWrapper({ conditions }: { conditions: Condition[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const condition = conditions.find(c => c.id === Number(id));
  if (!condition) return <Navigate to="/conditions" replace />;
  return <ConditionDetail row={condition} onBack={() => navigate('/conditions')} />;
}
