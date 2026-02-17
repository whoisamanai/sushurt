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
  serverTimestamp,
  type Timestamp
} from "firebase/firestore";

import { db } from "./firebase";
import type { Patient, PatientInput } from "../types";

/* -------------------------------------------------- */
/* Helper Mapper */
/* -------------------------------------------------- */

const mapPatient = (
  recordId: string,
  data: Record<string, unknown>
): Patient => {
  return {
    id: recordId,
    name: String(data.name ?? ""),
    fatherName: String(data.fatherName ?? ""),
    address: String(data.address ?? ""),
    mobile: String(data.mobile ?? ""),
    complaint: String(data.complaint ?? ""),
    createdAt: data.createdAt as Timestamp
  };
};

/* -------------------------------------------------- */
/* Core CRUD Functions */
/* -------------------------------------------------- */

// 🔹 Fetch all records for a user
export const fetchRecords = async (
  userId: string
): Promise<Patient[]> => {
  const recordsRef = collection(db, "patients", userId, "records");
  const recordsQuery = query(recordsRef, orderBy("createdAt", "desc"));

  const snap = await getDocs(recordsQuery);

  return snap.docs.map((docItem) =>
    mapPatient(docItem.id, docItem.data() as Record<string, unknown>)
  );
};

// 🔹 Delete a record
export const deleteRecord = async (
  userId: string,
  recordId: string
): Promise<void> => {
  const recordRef = doc(db, "patients", userId, "records", recordId);
  await deleteDoc(recordRef);
};

// 🔹 Add new record
export const addRecord = async (
  userId: string,
  data: PatientInput
): Promise<string> => {
  const recordsRef = collection(db, "patients", userId, "records");

  const docRef = await addDoc(recordsRef, {
    ...data,
    createdAt: serverTimestamp()
  });

  return docRef.id;
};

/* -------------------------------------------------- */
/* Backward Compatibility (Optional) */
/* -------------------------------------------------- */

// If old modules use these names, keep them exported

export const createPatient = addRecord;

export const getPatientById = async (
  userId: string,
  patientId: string
): Promise<Patient | null> => {
  const recordRef = doc(db, "patients", userId, "records", patientId);
  const recordSnap = await getDoc(recordRef);

  if (!recordSnap.exists()) return null;

  return mapPatient(
    recordSnap.id,
    recordSnap.data() as Record<string, unknown>
  );
};

export const getRecentPatients = async (
  userId: string,
  count = 10
): Promise<Patient[]> => {
  const recordsRef = collection(db, "patients", userId, "records");
  const recordsQuery = query(
    recordsRef,
    orderBy("createdAt", "desc"),
    limit(count)
  );

  const snap = await getDocs(recordsQuery);

  return snap.docs.map((docItem) =>
    mapPatient(docItem.id, docItem.data() as Record<string, unknown>)
  );
};
