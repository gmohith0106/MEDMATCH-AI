import { Hospital } from '../types/hospital.types';
import { getCurrentIsoDate } from '../utils/dates';

export const hospitalsSeed: Hospital[] = [
  {
    id: 'hospital-citycare-001',
    name: 'CityCare General Hospital',
    location: 'Bengaluru',
    createdAt: getCurrentIsoDate(),
    updatedAt: getCurrentIsoDate(),
    createdBy: 'system-seed'
  }
];
