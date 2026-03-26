import { useState } from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import { Zone, VehicleType } from '@/types/parking';
import { Button } from '@/components/ui/button';
import { Car, Bike, ArrowLeft, LogIn, LogOut, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface Props {
  zone: Zone;
  onBack: () => void;
}

const ParkingInterface = ({ zone, onBack }: Props) => {
  const { user, parkVehicle, exitParking } = useParkingContext();
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
  const [showParkAlert, setShowParkAlert] = useState(false);
  const { toast } = useToast();

  if (!user) return null;

  const isParkedHere = user.vehicleStatus === 'parked' && user.zone === zone.id;
  const isParkedElsewhere = user.vehicleStatus === 'parked' && user.zone !== zone.id;

  const handleParkClick = () => {
    if (!selectedType) {
      toast({ title: 'Select vehicle type', description: 'Please select Car or Bike', variant: 'destructive' });
      return;
    }
    // Check time rules
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    const startMinutes = 7 * 60 + 30; // 7:30 AM
    const endFaculty = 19 * 60 + 30; // 7:30 PM
    const endStudent = 18 * 60 + 30; // 6:30 PM
    const endMinutes = user.role === 'faculty' ? endFaculty : endStudent;

    if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
      toast({
        title: 'Outside parking hours',
        description: `Parking allowed ${user.role === 'faculty' ? '7:30 AM – 7:30 PM' : '7:30 AM – 6:30 PM'}`,
        variant: 'destructive',
      });
      return;
    }
    setShowParkAlert(true);
  };

  const confirmPark = () => {
    if (!selectedType) return;
    const success = parkVehicle(zone.id, selectedType);
    if (success) {
      toast({ title: 'Vehicle Parked!', description: `${selectedType === 'car' ? 'Car' : 'Bike'} parked at ${zone.name}` });
    } else {
      toast({ title: 'Parking Failed', description: 'No available slots or already parked', variant: 'destructive' });
    }
    setShowParkAlert(false);
  };

  const handleExit = () => {
    const success = exitParking();
    if (success) {
      toast({ title: 'Exited Successfully', description: `You have exited ${zone.name}` });
    } else {
      toast({ title: 'Exit Failed', description: 'You are not parked here', variant: 'destructive' });
    }
  };

  const hasCars = zone.totalCarSlots > 0;
  const hasBikes = zone.totalBikeSlots > 0;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Zones
      </button>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-xl font-heading font-bold text-card-foreground mb-1">{zone.name}</h2>
        <p className="text-sm text-muted-foreground mb-6">Select vehicle type and action</p>

        {isParkedElsewhere && (
          <div className="mb-4 p-3 rounded-lg bg-accent/20 text-accent-foreground text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            You already have a vehicle parked in another zone.
          </div>
        )}

        {/* Vehicle type selection */}
        {!isParkedHere && !isParkedElsewhere && (
          <div className="flex gap-3 mb-6">
            {hasCars && (
              <button
                onClick={() => setSelectedType('car')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'car'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <Car className="h-8 w-8" />
                <span className="text-sm font-medium">Car</span>
                <span className={zone.availableCarSlots > 0 ? 'slot-badge-available' : 'slot-badge-full'}>
                  {zone.availableCarSlots} available
                </span>
              </button>
            )}
            {hasBikes && (
              <button
                onClick={() => setSelectedType('bike')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'bike'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <Bike className="h-8 w-8" />
                <span className="text-sm font-medium">Bike</span>
                <span className={zone.availableBikeSlots > 0 ? 'slot-badge-available' : 'slot-badge-full'}>
                  {zone.availableBikeSlots} available
                </span>
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!isParkedHere && !isParkedElsewhere && (
            <Button className="flex-1 gap-2" onClick={handleParkClick}>
              <LogIn className="h-4 w-4" /> Park Vehicle
            </Button>
          )}
          {isParkedHere && (
            <Button variant="destructive" className="flex-1 gap-2" onClick={handleExit}>
              <LogOut className="h-4 w-4" /> Exit Parking
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={showParkAlert} onOpenChange={setShowParkAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" /> Important Notice
            </AlertDialogTitle>
            <AlertDialogDescription>
              If you do not click EXIT while leaving, charges will be fined.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPark}>Confirm Park</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ParkingInterface;
