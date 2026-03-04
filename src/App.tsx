import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import ReportsPage from '@/pages/ReportsPage'
import UsersPage from '@/pages/UsersPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import SquadPage from '@/pages/SquadPage'
import PracticesPage from '@/pages/PracticesPage'
import MatchesPage from '@/pages/MatchesPage'
import PlayerDetailPage from '@/pages/PlayerDetailPage'
import StaffDetailPage from '@/pages/StaffDetailPage'
import MatchDetailPage from '@/pages/MatchDetailPage'
import PracticeDetailPage from '@/pages/PracticeDetailPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/squad" element={<SquadPage />} />
          <Route path="/squad/:id" element={<PlayerDetailPage />} />
          <Route path="/practices" element={<PracticesPage />} />
          <Route path="/practices/:id" element={<PracticeDetailPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:id" element={<MatchDetailPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/staff/:id" element={<StaffDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
