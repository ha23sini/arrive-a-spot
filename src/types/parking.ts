export type UserRole = 'student' | 'faculty' | 'security';
export type VehicleType = 'car' | 'bike';

export interface Zone {
  id: string;
  name: string;
  totalCarSlots: number;
  availableCarSlots: number;
  totalBikeSlots: number;
  availableBikeSlots: number;
  securityOnly: boolean;
}

export interface UserSession {
  id: string;
  role: UserRole;
  phone: string;
  vehicleStatus: 'none' | 'parked';
  vehicleType?: VehicleType;
  zone?: string;
  entryTime?: Date;
  exitTime?: Date;
  extendedMinutes: number;
}

export interface Visitor {
  vehicleNumber: string;
  vehicleType: VehicleType;
  status: 'parked' | 'exited';
  entryTime: Date;
  exitTime?: Date;
  duration?: number;
}
