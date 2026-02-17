import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Patient, PatientInput } from '../types';

function mapPatient(recordId: string, data: Record<string, unknown>): Patient {
  return {
    id: recordId,
    name: String(data.name ?? ''),
    fatherName: String(data.fatherName ?? ''),
    address: String(data.address ?? ''),
    mobile: String(data.mobile ?? ''),
    complaint: String(data.complaint ?? ''),
    createdAt: data.createdAt as Patient['createdAt']
  };
}

export async function fetchRecords(userId: string): Promise<Patient[]> {
  const recordsRef = collection(db, 'patients', userId, 'records');
  const recordsQuery = query(recordsRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(recordsQuery);
  return snap.docs.map((item) => mapPatient(item.id, item.data() as Record<string, unknown>));
}

export async function deleteRecord(userId: string, recordId: string): Promise<void> {
  const recordRef = doc(db, 'patients', userId, 'records', recordId);
  await deleteDoc(recordRef);
}

export async function addRecord(userId: string, data: PatientInput): Promise<string> {
  const recordsRef = collection(db, 'patients', userId, 'records');
  const docRef = await addDoc(recordsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Backward-compatible exports used by existing pages.
export async function createPatient(userId: string, payload: PatientInput): Promise<string> {
  return addRecord(userId, payload);
}

export async function getPatientById(userId: string, patientId: string): Promise<Patient | null> {
  const recordRef = doc(db, 'patients', userId, 'records', patientId);
  const recordSnap = await getDoc(recordRef);
  if (!recordSnap.exists()) {
    return null;
  }
  return mapPatient(recordSnap.id, recordSnap.data() as Record<string, unknown>);
}

export async function getRecentPatients(userId: string, count = 10): Promise<Patient[]> {
  const recordsRef = collection(db, 'patients', userId, 'records');
  const recordsQuery = query(recordsRef, orderBy('createdAt', 'desc'), limit(count));
  const snap = await getDocs(recordsQuery);
  return snap.docs.map((item) => mapPatient(item.id, item.data() as Record<string, unknown>));
}
