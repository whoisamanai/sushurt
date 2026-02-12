import { Timestamp } from 'firebase/firestore';

export interface Patient {
  id?: string;
  name: string;
  fatherName: string;
  address: string;
  mobile: string;
  complaint: string;
  createdAt: Timestamp;
}

export type PatientInput = Omit<Patient, 'id' | 'createdAt'>;
