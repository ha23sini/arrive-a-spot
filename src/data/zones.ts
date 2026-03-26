import { Zone } from '@/types/parking';

export const initialZones: Zone[] = [
  { id: 'central', name: 'Central Parking', totalCarSlots: 0, availableCarSlots: 0, totalBikeSlots: 200, availableBikeSlots: 200, securityOnly: false },
  { id: 'dental', name: 'Dental Parking', totalCarSlots: 60, availableCarSlots: 60, totalBikeSlots: 50, availableBikeSlots: 50, securityOnly: false },
  { id: 'dental-slope', name: 'Dental Slope', totalCarSlots: 0, availableCarSlots: 0, totalBikeSlots: 150, availableBikeSlots: 150, securityOnly: false },
  { id: 'teresa', name: 'Teresa Park', totalCarSlots: 0, availableCarSlots: 0, totalBikeSlots: 150, availableBikeSlots: 150, securityOnly: false },
  { id: 'ict', name: 'ICT', totalCarSlots: 40, availableCarSlots: 40, totalBikeSlots: 40, availableBikeSlots: 40, securityOnly: false },
  { id: 'crl', name: 'CRL', totalCarSlots: 40, availableCarSlots: 40, totalBikeSlots: 30, availableBikeSlots: 30, securityOnly: true },
  { id: 'vb', name: 'VB', totalCarSlots: 0, availableCarSlots: 0, totalBikeSlots: 70, availableBikeSlots: 70, securityOnly: false },
  { id: 'coke', name: 'Coke Station', totalCarSlots: 0, availableCarSlots: 0, totalBikeSlots: 30, availableBikeSlots: 30, securityOnly: false },
  { id: 'yellapragada', name: 'Yellapragada', totalCarSlots: 50, availableCarSlots: 50, totalBikeSlots: 100, availableBikeSlots: 100, securityOnly: false },
  { id: 'emergency', name: 'Emergency Parking', totalCarSlots: 0, availableCarSlots: 0, totalBikeSlots: 70, availableBikeSlots: 70, securityOnly: false },
];
