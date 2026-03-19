import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Athletes from './pages/Athletes/Athletes'
import AthleteDetail from './pages/Athletes/AthleteDetail'
import Analyses from './pages/Analyses/Analyses'
import AnalysisDetail from './pages/Analyses/AnalysisDetail'
import Sessions from './pages/Sessions/Sessions'
import UploadAnalysis from './pages/UploadAnalysis/UploadAnalysis'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="atletas" element={<Athletes />} />
          <Route path="atletas/:id" element={<AthleteDetail />} />
          <Route path="analises" element={<Analyses />} />
          <Route path="analises/:id" element={<AnalysisDetail />} />
          <Route path="sessoes" element={<Sessions />} />
          <Route path="upload" element={<UploadAnalysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
