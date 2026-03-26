import { ParkingProvider, useParkingContext } from '@/context/ParkingContext';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';
import SecurityDashboard from '@/components/SecurityDashboard';

const AppContent = () => {
  const { user, isSecurityMode } = useParkingContext();

  if (isSecurityMode && !user) return <SecurityDashboard />;
  if (!user) return <LoginScreen />;
  return <Dashboard />;
};

const Index = () => (
  <ParkingProvider>
    <AppContent />
  </ParkingProvider>
);

export default Index;
