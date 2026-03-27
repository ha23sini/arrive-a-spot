import { useState } from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Shield, GraduationCap, Briefcase } from 'lucide-react';
import WarningBanner from './WarningBanner';

type Tab = 'student' | 'faculty' | 'security';

const LoginScreen = () => {
  const { login, setSecurityMode, enterVisitorVehicle } = useParkingContext();
  const [tab, setTab] = useState<Tab>('student');
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  const handleLogin = () => {
    setError('');
    if (!id.trim()) { setError('ID is required'); return; }
    if (!/^\d{10}$/.test(phone)) { setError('Phone number is invalid'); return; }
    login(id, phone, tab as 'student' | 'faculty');
  };

  const handleSecurityEnter = () => {
    setError('');
    setSecuritySuccess('');
    if (!vehicleNumber.trim()) { setError('Vehicle number is required'); return; }
    setSecurityMode(true);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'student', label: 'Student', icon: <GraduationCap className="h-4 w-4" /> },
    { key: 'faculty', label: 'Faculty', icon: <Briefcase className="h-4 w-4" /> },
    { key: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <WarningBanner />
      <div className="flex flex-col items-center justify-center px-4 py-8 sm:py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground tracking-tight">ARRIVO</h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">Smart Campus Parking</p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="flex gap-2 mb-6">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setError(''); setSecuritySuccess(''); }}
                className={`flex-1 flex items-center justify-center gap-2 ${tab === t.key ? 'login-tab-active' : 'login-tab-inactive'}`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-card rounded-xl border p-6 shadow-sm">
            {tab !== 'security' ? (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold text-card-foreground">
                  {tab === 'student' ? 'Student' : 'Faculty'} Login
                </h2>
                <Input placeholder="Enter your ID" value={id} onChange={e => setId(e.target.value)} />
                <Input placeholder="Phone Number (10 digits)" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} />
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                <Button className="w-full" onClick={handleLogin}>Login</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold text-card-foreground">Security Guard</h2>
                <p className="text-sm text-muted-foreground">Enter visitor vehicle number to assign CRL parking</p>
                <Input
                  placeholder="Vehicle Number"
                  value={vehicleNumber}
                  onChange={e => setVehicleNumber(e.target.value)}
                />
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                {securitySuccess && <p className="text-sm text-success font-medium">{securitySuccess}</p>}
                <Button className="w-full" onClick={handleSecurityEnter}>Enter Vehicle</Button>
                <Button variant="outline" className="w-full" onClick={() => setSecurityMode(true)}>
                  View Security Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
