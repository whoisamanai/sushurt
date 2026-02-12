import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Patient, PatientInput } from '../types/patient';

function mapPatient(docId: string, data: DocumentData): Patient {
  return {
    id: docId,
    name: data.name,
    fatherName: data.fatherName,
    address: data.address,
    mobile: data.mobile,
    complaint: data.complaint,
    createdAt: data.createdAt as Timestamp
  };
}

export async function createPatient(userId: string, payload: PatientInput): Promise<string> {
  const recordsRef = collection(db, 'patients', userId, 'records');
  const docRef = await addDoc(recordsRef, {
    ...payload,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getPatientById(userId: string, patientId: string): Promise<Patient | null> {
  const patientRef = doc(db, 'patients', userId, 'records', patientId);
  const patientSnap = await getDoc(patientRef);

  if (!patientSnap.exists()) {
    return null;
  }

  return mapPatient(patientSnap.id, patientSnap.data());
}

export async function getRecentPatients(userId: string, count = 10): Promise<Patient[]> {
  const recordsRef = collection(db, 'patients', userId, 'records');
  const patientsQuery = query(recordsRef, orderBy('createdAt', 'desc'), limit(count));
  const querySnap = await getDocs(patientsQuery);

  return querySnap.docs.map((docItem) => mapPatient(docItem.id, docItem.data()));
}
