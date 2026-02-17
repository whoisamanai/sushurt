import { FormEvent, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { addRecord } from "../../../services/patientService"
import { useModuleContext } from '../../context/ModuleContext';
import PrintPreview from '../print/PrintPreview';
import type { Patient, PatientInput } from '../../types';

const initialState: PatientInput = {
  name: '',
  fatherName: '',
  address: '',
  mobile: '',
  complaint: ''
};

export default function NewEntryModule() {
  const {
    userId,
    setLoading,
    setHistoryCount,
    historyCount,
    setActiveModule,
    openOverlay,
    closeOverlay
  } = useModuleContext();

  const [form, setForm] = useState<PatientInput>(initialState);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!form.name || !form.fatherName || !form.address || !form.mobile || !form.complaint) {
      setError('All fields are required.');
      return false;
    }
    return true;
  };

  const buildLocalPatient = (id: string): Patient => ({
    id,
    ...form,
    createdAt: Timestamp.now()
  });

  const handleSaveOnly = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    if (!userId) {
      setError('User not authenticated. Please login again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addRecord(userId, form);
      setForm(initialState);
      setHistoryCount(historyCount + 1);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create record.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewAndPrint = async () => {
    if (!validate()) {
      return;
    }
    if (!userId) {
      setError('User not authenticated. Please login again.');
      return;
    }

    // Decision: save-before-print so preview has a persistent record id and history badge stays consistent.
    setLoading(true);
    setError(null);
    try {
      const id = await addRecord(userId, form);
      const previewPatient = buildLocalPatient(id);
      setHistoryCount(historyCount + 1);

      openOverlay(
        <PrintPreview
          entryData={previewPatient}
          onClose={closeOverlay}
          onPrintComplete={() => {
            setActiveModule('history');
          }}
        />
      );
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to prepare preview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="workspace-card">
      <h2>New Form / New Entry</h2>
      <form className="form-card" onSubmit={handleSaveOnly}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input placeholder="Father Name" value={form.fatherName} onChange={(e) => setForm((p) => ({ ...p, fatherName: e.target.value }))} required />
        <textarea placeholder="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />
        <input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} required />
        <textarea placeholder="Complaint" value={form.complaint} onChange={(e) => setForm((p) => ({ ...p, complaint: e.target.value }))} required />
        {error && <p className="error-text">{error}</p>}

        <div className="row-actions">
          <button type="button" onClick={() => void handlePreviewAndPrint()}>
            Preview & Print
          </button>
          <button type="submit" className="ghost-button">
            Save Only
          </button>
        </div>
      </form>
    </section>
  );
}
