import { useState, useEffect } from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, LogOut, AlertTriangle, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WarningBanner from './WarningBanner';
import LiveClock from './LiveClock';

const SecurityDashboard = () => {
  const { zones, visitors, setSecurityMode, enterVisitorVehicle, exitVisitorVehicle } = useParkingContext();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const crl = zones.find(z => z.id === 'crl');
  const activeVisitors = visitors.filter(v => !v.exitTime);

  const handleEnter = () => {
    setError('');
    if (!vehicleNumber.trim()) { setError('Vehicle number is required'); return; }
    const success = enterVisitorVehicle(vehicleNumber.trim().toUpperCase());
    if (success) {
      toast({ title: 'Vehicle Entered', description: `${vehicleNumber.toUpperCase()} assigned to CRL` });
      setVehicleNumber('');
    } else {
      setError('No slots available at CRL');
    }
  };

  const handleExit = (vn: string) => {
    const success = exitVisitorVehicle(vn);
    if (success) {
      toast({ title: 'Vehicle Exited', description: `${vn} has exited CRL` });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WarningBanner />
      <div className="container max-w-2xl py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setSecurityMode(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <LiveClock />
        </div>

        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Security Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">CRL Zone — Visitors Only</p>

        {crl && (
          <div className="bg-card rounded-xl border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">CRL Availability</span>
              <div className="flex gap-3">
                <span className={crl.availableCarSlots > 0 ? 'slot-badge-available' : 'slot-badge-full'}>
                  Cars: {crl.availableCarSlots}/{crl.totalCarSlots}
                </span>
                <span className={crl.availableBikeSlots > 0 ? 'slot-badge-available' : 'slot-badge-full'}>
                  Bikes: {crl.availableBikeSlots}/{crl.totalBikeSlots}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Vehicle Number"
                value={vehicleNumber}
                onChange={e => setVehicleNumber(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleEnter} className="gap-1">
                <Car className="h-4 w-4" /> Enter
              </Button>
            </div>
            {error && <p className="text-sm text-destructive font-medium mt-2">{error}</p>}
          </div>
        )}

        <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Active Vehicles</h2>
        {activeVisitors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active visitor vehicles</p>
        ) : (
          <div className="space-y-3">
            {activeVisitors.map((v, i) => {
              const durationMs = now.getTime() - v.entryTime.getTime();
              const durationHours = durationMs / (1000 * 60 * 60);
              const h = Math.floor(durationHours);
              const m = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
              const exceeded = durationHours > 5;

              return (
                <div key={i} className={`bg-card rounded-xl border p-4 ${exceeded ? 'border-destructive/40' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-semibold text-card-foreground">{v.vehicleNumber}</span>
                    <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleExit(v.vehicleNumber)}>
                      <LogOut className="h-3 w-3" /> Exit
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Entry: {v.entryTime.toLocaleTimeString()} • Duration: {h}h {m}m
                  </div>
                  {exceeded && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-destructive font-medium">
                      <AlertTriangle className="h-3 w-3" /> Extra charges applicable — Time Exceeded
                    </div>
                  )}
                  {!exceeded && (
                    <div className="text-xs text-success font-medium mt-2">
                      Time Remaining: {Math.floor(5 - durationHours)}h {Math.floor(60 - (m % 60))}m
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Exited vehicles */}
        {visitors.filter(v => v.exitTime).length > 0 && (
          <>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3 mt-8">Exited Vehicles</h2>
            <div className="space-y-3">
              {visitors.filter(v => v.exitTime).map((v, i) => (
                <div key={i} className="bg-card rounded-xl border p-4 opacity-60">
                  <div className="font-heading font-semibold text-card-foreground">{v.vehicleNumber}</div>
                  <div className="text-xs text-muted-foreground">
                    Entry: {v.entryTime.toLocaleTimeString()} • Exit: {v.exitTime!.toLocaleTimeString()}
                    {v.duration !== undefined && ` • Duration: ${v.duration.toFixed(1)}h`}
                  </div>
                  {v.duration !== undefined && v.duration > 5 && (
                    <div className="text-xs text-destructive font-medium mt-1">Extra charges applicable</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
