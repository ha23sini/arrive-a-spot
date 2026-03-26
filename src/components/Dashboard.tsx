import { useState } from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import ZoneCard from './ZoneCard';
import ParkingInterface from './ParkingInterface';
import ParkingTimer from './ParkingTimer';
import CampusMap from './CampusMap';
import LiveClock from './LiveClock';
import WarningBanner from './WarningBanner';
import { Button } from '@/components/ui/button';
import { LogOut, Car, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { user, zones, logout } = useParkingContext();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  if (!user) return null;

  const visibleZones = zones.filter(z => !z.securityOnly);
  const selectedZone = zones.find(z => z.id === selectedZoneId);
  const parkedZone = user.vehicleStatus === 'parked' ? zones.find(z => z.id === user.zone) : null;

  return (
    <div className="min-h-screen bg-background">
      <WarningBanner />

      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-4xl flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-foreground leading-none">ARRIVO</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {user.role} • {user.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LiveClock />
            <Button variant="outline" size="sm" onClick={logout} className="gap-1">
              <LogOut className="h-3 w-3" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-6 px-4 space-y-6">
        {/* Timer */}
        <ParkingTimer />

        {/* Parked status */}
        {parkedZone && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground">
              🅿️ Currently parked at <strong>{parkedZone.name}</strong> ({user.vehicleType})
            </p>
          </div>
        )}

        {selectedZone ? (
          <ParkingInterface zone={selectedZone} onBack={() => setSelectedZoneId(null)} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">Parking Zones</h2>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowMap(!showMap)}>
                <MapPin className="h-3 w-3" /> {showMap ? 'Hide Map' : 'View Map'}
              </Button>
            </div>

            {showMap && <CampusMap />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleZones.map(zone => (
                <ZoneCard key={zone.id} zone={zone} onClick={() => setSelectedZoneId(zone.id)} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
