import { useState, useEffect } from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { Timer, Plus, AlertTriangle } from 'lucide-react';

const ParkingTimer = () => {
  const { user, extendTime } = useParkingContext();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user || user.vehicleStatus !== 'parked' || !user.entryTime) return null;

  const maxHours = user.role === 'faculty' ? 12 : 11; // 7:30-7:30 or 7:30-6:30
  const totalAllowedMs = (maxHours * 60 + user.extendedMinutes) * 60 * 1000;
  const elapsedMs = now.getTime() - user.entryTime.getTime();
  const remainingMs = totalAllowedMs - elapsedMs;
  const exceeded = remainingMs <= 0;

  const absRemaining = Math.abs(remainingMs);
  const hours = Math.floor(absRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((absRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absRemaining % (1000 * 60)) / 1000);

  return (
    <div className={`rounded-xl border p-5 ${exceeded ? 'bg-destructive/5 border-destructive/30' : 'bg-card'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Timer className={`h-5 w-5 ${exceeded ? 'text-destructive' : 'text-primary'}`} />
        <h3 className="font-heading font-semibold text-card-foreground">
          {exceeded ? 'Time Exceeded!' : 'Time Remaining'}
        </h3>
      </div>

      <div className={`timer-display mb-3 ${exceeded ? 'text-destructive animate-pulse-slow' : 'text-foreground'}`}>
        {exceeded ? '-' : ''}{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {exceeded && (
        <div className="flex items-center gap-2 text-sm text-destructive font-medium mb-3">
          <AlertTriangle className="h-4 w-4" />
          Time exceeded! Charges may be applied
        </div>
      )}

      <div className="text-xs text-muted-foreground mb-3">
        Parked at: {user.entryTime.toLocaleTimeString()}
        {user.extendedMinutes > 0 && ` • Extended by ${user.extendedMinutes} min`}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => extendTime(30)}>
          <Plus className="h-3 w-3" /> 30 min
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => extendTime(60)}>
          <Plus className="h-3 w-3" /> 1 hour
        </Button>
      </div>
    </div>
  );
};

export default ParkingTimer;
