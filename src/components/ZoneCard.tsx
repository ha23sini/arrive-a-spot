import { Zone } from '@/types/parking';
import { Car, Bike } from 'lucide-react';

interface ZoneCardProps {
  zone: Zone;
  onClick: () => void;
}

const ZoneCard = ({ zone, onClick }: ZoneCardProps) => {
  const hasCars = zone.totalCarSlots > 0;
  const hasBikes = zone.totalBikeSlots > 0;

  return (
    <div className="zone-card" onClick={onClick}>
      <h3 className="font-heading font-semibold text-card-foreground mb-3">{zone.name}</h3>
      <div className="space-y-2">
        {hasCars && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Car className="h-4 w-4" /> Cars
            </div>
            <span className={zone.availableCarSlots > 0 ? 'slot-badge-available' : 'slot-badge-full'}>
              {zone.availableCarSlots}/{zone.totalCarSlots}
            </span>
          </div>
        )}
        {hasBikes && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bike className="h-4 w-4" /> Bikes
            </div>
            <span className={zone.availableBikeSlots > 0 ? 'slot-badge-available' : 'slot-badge-full'}>
              {zone.availableBikeSlots}/{zone.totalBikeSlots}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneCard;
