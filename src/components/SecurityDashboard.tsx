import { useState, useEffect } from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Car, Bike, LogIn, LogOut, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WarningBanner from './WarningBanner';
import LiveClock from './LiveClock';
import parkingIcon from '@/assets/parking-icon.jpeg';
import { VehicleType } from '@/types/parking';

const SecurityDashboard = () => {
  const { zones, visitors, setSecurityMode, enterVisitorVehicle, exitVisitorVehicle } = useParkingContext();
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const crl = zones.find(z => z.id === 'crl');
  const activeVisitors = visitors.filter(v => v.status === 'parked');
  const exitedVisitors = visitors.filter(v => v.status === 'exited');

  const handlePark = () => {
    setError('');
    const vn = vehicleNumber.trim().toUpperCase();
    if (!vn) { setError('Vehicle number is required'); return; }

    const alreadyParked = visitors.find(v => v.vehicleNumber === vn && v.status === 'parked');
    if (alreadyParked) {
      setError('This vehicle is already parked. Please exit first.');
      return;
    }

    const success = enterVisitorVehicle(vn, vehicleType);
    if (success) {
      toast({ title: 'Vehicle Parked', description: `${vn} (${vehicleType}) parked at CRL` });
      setVehicleNumber('');
    } else {
      setError(`No ${vehicleType} slots available at CRL`);
    }
  };

  const handleExit = () => {
    setError('');
    const vn = vehicleNumber.trim().toUpperCase();
    if (!vn) { setError('Vehicle number is required'); return; }

    const parked = visitors.find(v => v.vehicleNumber === vn && v.status === 'parked');
    if (!parked) {
      setError('Vehicle not found or already exited');
      return;
    }

    const success = exitVisitorVehicle(vn);
    if (success) {
      toast({ title: 'Vehicle Exited', description: `${vn} has exited CRL` });
      setVehicleNumber('');
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

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src={parkingIcon} alt="CPS Logo" className="h-12 w-12 rounded-xl object-cover" />
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">CPS</h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">Campus Parking System</p>
          </div>
        </div>

        {/* Slot Availability */}
        {crl && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card rounded-xl border p-5 text-center">
              <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-heading font-bold text-foreground">{crl.availableCarSlots}</div>
              <div className="text-xs text-muted-foreground">/ {crl.totalCarSlots} Car Slots</div>
              <div className={`text-xs font-medium mt-1 ${crl.availableCarSlots > 0 ? 'text-success' : 'text-destructive'}`}>
                {crl.availableCarSlots > 0 ? 'Available' : 'Full'}
              </div>
            </div>
            <div className="bg-card rounded-xl border p-5 text-center">
              <Bike className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-heading font-bold text-foreground">{crl.availableBikeSlots}</div>
              <div className="text-xs text-muted-foreground">/ {crl.totalBikeSlots} Bike Slots</div>
              <div className={`text-xs font-medium mt-1 ${crl.availableBikeSlots > 0 ? 'text-success' : 'text-destructive'}`}>
                {crl.availableBikeSlots > 0 ? 'Available' : 'Full'}
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Type Selection */}
        <div className="bg-card rounded-xl border p-5 mb-6">
          <h2 className="text-lg font-heading font-semibold text-card-foreground mb-4">Park / Exit Vehicle</h2>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setVehicleType('car')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                vehicleType === 'car'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              <Car className="h-4 w-4" /> Car
            </button>
            <button
              onClick={() => setVehicleType('bike')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                vehicleType === 'bike'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              <Bike className="h-4 w-4" /> Bike
            </button>
          </div>

          <Input
            placeholder="Enter Vehicle Number"
            value={vehicleNumber}
            onChange={e => setVehicleNumber(e.target.value)}
            className="mb-4"
          />

          {error && <p className="text-sm text-destructive font-medium mb-4">{error}</p>}

          <div className="flex gap-3">
            <Button onClick={handlePark} className="flex-1 gap-2">
              <LogIn className="h-4 w-4" /> Park
            </Button>
            <Button onClick={handleExit} variant="destructive" className="flex-1 gap-2">
              <LogOut className="h-4 w-4" /> Exit
            </Button>
          </div>
        </div>

        {/* Active Vehicles */}
        <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Active Vehicles ({activeVisitors.length})</h2>
        {activeVisitors.length === 0 ? (
          <p className="text-sm text-muted-foreground mb-6">No active visitor vehicles</p>
        ) : (
          <div className="space-y-3 mb-6">
            {activeVisitors.map((v, i) => {
              const durationMs = now.getTime() - v.entryTime.getTime();
              const durationHours = durationMs / (1000 * 60 * 60);
              const h = Math.floor(durationHours);
              const m = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
              const exceeded = durationHours > 5;

              return (
                <div key={i} className={`bg-card rounded-xl border p-4 ${exceeded ? 'border-destructive/40' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {v.vehicleType === 'car' ? <Car className="h-4 w-4 text-primary" /> : <Bike className="h-4 w-4 text-primary" />}
                      <span className="font-heading font-semibold text-card-foreground">{v.vehicleNumber}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">{v.vehicleType}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Entry: {v.entryTime.toLocaleTimeString()} • Duration: {h}h {m}m
                  </div>
                  {exceeded ? (
                    <div className="flex items-center gap-1 mt-2 text-xs text-destructive font-medium">
                      <AlertTriangle className="h-3 w-3" /> Extra charges applicable — Time Exceeded
                    </div>
                  ) : (
                    <div className="text-xs text-success font-medium mt-2">
                      Time Remaining: {Math.max(0, 4 - h)}h {Math.max(0, 59 - m)}m
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Exited Vehicles */}
        {exitedVisitors.length > 0 && (
          <>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Exited Vehicles ({exitedVisitors.length})</h2>
            <div className="space-y-3">
              {exitedVisitors.map((v, i) => (
                <div key={i} className="bg-card rounded-xl border p-4 opacity-60">
                  <div className="flex items-center gap-2 mb-1">
                    {v.vehicleType === 'car' ? <Car className="h-4 w-4 text-muted-foreground" /> : <Bike className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-heading font-semibold text-card-foreground">{v.vehicleNumber}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Entry: {v.entryTime.toLocaleTimeString()} • Exit: {v.exitTime?.toLocaleTimeString()}
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
