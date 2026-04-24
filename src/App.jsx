import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import RegisterType from "./pages/RegisterType/RegisterType";
import RegisterProfessional from "./pages/RegisterProfessional/RegisterProfessional";
import RegisterProfessionalAthlete from "./pages/RegisterProfessionalAthlete/RegisterProfessionalAthlete";
import RegisterAmateur from "./pages/RegisterAmateur/RegisterAmateur";
import RegisterMedicalCommittee from "./pages/RegisterMedicalCommittee/RegisterMedicalCommittee";
import Dashboard from "./pages/Dashboard/Dashboard";
import AmateurDashboard from "./pages/AmateurDashboard/AmateurDashboard";
import ProfessionalAthleteDashboard from "./pages/ProfessionalAthleteDashboard/ProfessionalAthleteDashboard";
import Athletes from "./pages/Athletes/Athletes";
import AthleteDetail from "./pages/Athletes/AthleteDetail";
import Analyses from "./pages/Analyses/Analyses";
import AnalysisDetail from "./pages/Analyses/AnalysisDetail";
import Sessions from "./pages/Sessions/Sessions";
import UploadAnalysis from "./pages/UploadAnalysis/UploadAnalysis";
import Plans from "./pages/Plans/Plans";
import Fisioterapia from "./pages/SessoesMedicas/Fisioterapia";
import Nutricao from "./pages/SessoesMedicas/Nutricao";
import Psicologia from "./pages/SessoesMedicas/Psicologia";

function ProtectedRoute({ element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--at-black)",
        }}
      >
        <div
          className="spinner-border"
          style={{ color: "var(--at-primary)" }}
        />
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

function RoleRoute({ allow, element, fallback = "/dashboard" }) {
  const { user } = useAuth();
  return allow.includes(user?.role) ? (
    element
  ) : (
    <Navigate to={fallback} replace />
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterType />} />
        <Route
          path="/register/professional"
          element={<RegisterProfessional />}
        />
        <Route
          path="/register/professional-athlete"
          element={<RegisterProfessionalAthlete />}
        />
        <Route path="/register/amateur" element={<RegisterAmateur />} />
        <Route
          path="/register/medical-committee"
          element={<RegisterMedicalCommittee />}
        />
        <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              user?.role === "amateur" ? (
                <AmateurDashboard />
              ) : user?.role === "professional-athlete" ? (
                <ProfessionalAthleteDashboard />
              ) : (
                <Dashboard />
              )
            }
          />
          <Route
            path="atletas"
            element={
              <RoleRoute allow={["professional"]} element={<Athletes />} />
            }
          />
          <Route
            path="atletas/:id"
            element={
              <RoleRoute allow={["professional"]} element={<AthleteDetail />} />
            }
          />
          <Route path="analises" element={<Analyses />} />
          <Route path="analises/:id" element={<AnalysisDetail />} />
          <Route path="sessoes" element={<Sessions />} />
          <Route
            path="saude/fisioterapia"
            element={
              <RoleRoute
                allow={["professional", "professional-athlete", "medical-committee"]}
                element={<Fisioterapia />}
              />
            }
          />
          <Route
            path="saude/nutricao"
            element={
              <RoleRoute
                allow={["professional", "professional-athlete", "medical-committee"]}
                element={<Nutricao />}
              />
            }
          />
          <Route
            path="saude/psicologia"
            element={
              <RoleRoute
                allow={["professional", "professional-athlete", "medical-committee"]}
                element={<Psicologia />}
              />
            }
          />
          <Route
            path="fisioterapia"
            element={<Navigate to="/saude/fisioterapia" replace />}
          />
          <Route path="planos" element={<Plans />} />
          <Route path="upload" element={<UploadAnalysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
