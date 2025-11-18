import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardScreen } from '@/components/screens/DashboardScreen';
import { ContractsScreen } from '@/components/screens/ContractsScreen';
import { AnalyticsScreen } from '@/components/screens/AnalyticsScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/contracts" element={<ContractsScreen />} />
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </AppShell>
      <Toaster />
    </Router>
  );
}

export default App;
