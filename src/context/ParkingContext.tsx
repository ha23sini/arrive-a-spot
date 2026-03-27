import React, { createContext, useContext, useState, useCallback } from 'react';
import { Zone, UserSession, Visitor } from '@/types/parking';
import { initialZones } from '@/data/zones';

interface ParkingContextType {
  zones: Zone[];
  user: UserSession | null;
  visitors: Visitor[];
  login: (id: string, phone: string, role: 'student' | 'faculty') => void;
  logout: () => void;
  parkVehicle: (zoneId: string, vehicleType: 'car' | 'bike') => boolean;
  exitParking: () => boolean;
  extendTime: (minutes: number) => void;
  enterVisitorVehicle: (vehicleNumber: string, vehicleType: 'car' | 'bike') => boolean;
  exitVisitorVehicle: (vehicleNumber: string) => boolean;
  isSecurityMode: boolean;
  setSecurityMode: (v: boolean) => void;
}

const ParkingContext = createContext<ParkingContextType | null>(null);

export const useParkingContext = () => {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error('useParkingContext must be used within ParkingProvider');
  return ctx;
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [user, setUser] = useState<UserSession | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isSecurityMode, setSecurityMode] = useState(false);

  const login = useCallback((id: string, phone: string, role: 'student' | 'faculty') => {
    setUser({ id, role, phone, vehicleStatus: 'none', extendedMinutes: 0 });
    setSecurityMode(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const parkVehicle = useCallback((zoneId: string, vehicleType: 'car' | 'bike'): boolean => {
    if (!user || user.vehicleStatus === 'parked') return false;
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return false;
    const key = vehicleType === 'car' ? 'availableCarSlots' : 'availableBikeSlots';
    if (zone[key] <= 0) return false;

    setZones(prev => prev.map(z =>
      z.id === zoneId ? { ...z, [key]: z[key] - 1 } : z
    ));
    setUser(prev => prev ? {
      ...prev,
      vehicleStatus: 'parked',
      vehicleType,
      zone: zoneId,
      entryTime: new Date(),
      exitTime: undefined,
      extendedMinutes: 0,
    } : null);
    return true;
  }, [user, zones]);

  const exitParking = useCallback((): boolean => {
    if (!user || user.vehicleStatus !== 'parked' || !user.vehicleType || !user.zone) return false;
    const key = user.vehicleType === 'car' ? 'availableCarSlots' : 'availableBikeSlots';
    const totalKey = user.vehicleType === 'car' ? 'totalCarSlots' : 'totalBikeSlots';
    
    setZones(prev => prev.map(z =>
      z.id === user.zone ? { ...z, [key]: Math.min(z[key] + 1, z[totalKey]) } : z
    ));
    setUser(prev => prev ? {
      ...prev,
      vehicleStatus: 'none',
      exitTime: new Date(),
      zone: undefined,
      vehicleType: undefined,
      entryTime: undefined,
    } : null);
    return true;
  }, [user]);

  const extendTime = useCallback((minutes: number) => {
    setUser(prev => prev ? { ...prev, extendedMinutes: prev.extendedMinutes + minutes } : null);
  }, []);

  const enterVisitorVehicle = useCallback((vehicleNumber: string, vehicleType: 'car' | 'bike'): boolean => {
    const crl = zones.find(z => z.id === 'crl');
    if (!crl) return false;
    const slotKey = vehicleType === 'car' ? 'availableCarSlots' : 'availableBikeSlots';
    if (crl[slotKey] <= 0) return false;

    setZones(prev => prev.map(z =>
      z.id === 'crl' ? { ...z, [slotKey]: z[slotKey] - 1 } : z
    ));
    setVisitors(prev => [...prev, { vehicleNumber, vehicleType, status: 'parked' as const, entryTime: new Date() }]);
    return true;
  }, [zones]);

  const exitVisitorVehicle = useCallback((vehicleNumber: string): boolean => {
    const visitor = visitors.find(v => v.vehicleNumber === vehicleNumber && v.status === 'parked');
    if (!visitor) return false;
    const exitTime = new Date();
    const duration = (exitTime.getTime() - visitor.entryTime.getTime()) / (1000 * 60 * 60);
    const slotKey = visitor.vehicleType === 'car' ? 'availableCarSlots' : 'availableBikeSlots';
    const totalKey = visitor.vehicleType === 'car' ? 'totalCarSlots' : 'totalBikeSlots';

    setVisitors(prev => prev.map(v =>
      v.vehicleNumber === vehicleNumber && v.status === 'parked'
        ? { ...v, status: 'exited' as const, exitTime, duration }
        : v
    ));
    setZones(prev => prev.map(z =>
      z.id === 'crl' ? { ...z, [slotKey]: Math.min(z[slotKey] + 1, z[totalKey]) } : z
    ));
    return true;
  }, [visitors]);

  return (
    <ParkingContext.Provider value={{
      zones, user, visitors, login, logout, parkVehicle, exitParking,
      extendTime, enterVisitorVehicle, exitVisitorVehicle,
      isSecurityMode, setSecurityMode,
    }}>
      {children}
    </ParkingContext.Provider>
  );
};
