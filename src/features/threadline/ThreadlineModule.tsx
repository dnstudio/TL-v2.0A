import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { ClientListScreen } from "./containers/ClientListScreen";
import { PatientListWorkspace } from "./containers/PatientListWorkspace";
import { MainSessionListWorkspace } from "./containers/MainSessionListWorkspace";
import { ResourcesWorkspace } from "./containers/ResourcesWorkspace";
import { UsersWorkspace } from "./containers/UsersWorkspace";
import { AssessmentListScreen } from "./containers/AssessmentListScreen";
import { MainAssessmentListWorkspace } from "./containers/MainAssessmentListWorkspace";
import { MainDocumentListWorkspace } from "./containers/MainDocumentListWorkspace";

interface ThreadlineModuleProps {
  onGuidelinesClick?: () => void;
  type?: 'clients' | 'patients' | 'sessions' | 'assessments' | 'documents' | 'resources' | 'users';
}

export function ThreadlineModule({ onGuidelinesClick, type = 'clients' }: ThreadlineModuleProps) {
  const navigate = useNavigate();

  const getIndexElement = () => {
    switch (type) {
      case 'patients': return <PatientListWorkspace />;
      case 'sessions': return <MainSessionListWorkspace />;
      case 'assessments': return <MainAssessmentListWorkspace />;
      case 'documents': return <MainDocumentListWorkspace />;
      case 'resources': return <ResourcesWorkspace />;
      case 'users': return <UsersWorkspace />;
      default: return <ClientListScreen onSelectClient={(id) => navigate(`/clients/${id}`)} />;
    }
  };

  return (
    <div className="bg-workspace-bg min-h-screen">
      <Routes>
        <Route index element={getIndexElement()} />
        <Route path=":clientId/*" element={<AssessmentListScreenWrapper onBack={() => navigate('/clients')} />} />
      </Routes>
    </div>
  );
}

function AssessmentListScreenWrapper({ onBack }: { onBack: () => void }) {
  const { clientId } = useParams();
  return <AssessmentListScreen clientId={clientId || "125566"} onBack={onBack} />;
}
