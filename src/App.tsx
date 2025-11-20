import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardScreen } from '@/components/screens/DashboardScreen';
import { ContractsScreen } from '@/components/screens/ContractsScreen';
import { AnalyticsScreen } from '@/components/screens/AnalyticsScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AuthCallback from '@/pages/AuthCallback';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardScreen />} />
                    <Route path="/contracts" element={<ContractsScreen />} />
                    <Route path="/analytics" element={<AnalyticsScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                  </Routes>
                </AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
