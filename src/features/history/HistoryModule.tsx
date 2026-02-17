import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { deleteRecord, fetchRecords } from '../../services/patientService';
import { useModuleContext } from '../../context/ModuleContext';
import PrintPreview from '../print/PrintPreview';
import type { Patient } from '../../types/patient';

export default function HistoryModule() {
  const { userId, setLoading, setHistoryCount, openOverlay, closeOverlay } = useModuleContext();
  const [records, setRecords] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!userId) {
        setRecords([]);
        setHistoryCount(0);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const items = await fetchRecords(userId);
        setRecords(items);
        setHistoryCount(items.length);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to fetch records.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [setHistoryCount, setLoading, userId]);

  const handleDelete = async (recordId: string) => {
    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    const confirmed = window.confirm('Delete this record permanently?');
    if (!confirmed) {
      return;
    }

    setDeletingId(recordId);
    setLoading(true);
    try {
      await deleteRecord(userId, recordId);
      setRecords((prev) => {
        const next = prev.filter((item) => item.id !== recordId);
        setHistoryCount(next.length);
        return next;
      });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete record.');
    } finally {
      setDeletingId(null);
      setLoading(false);
    }
  };

  const handlePreview = (record: Patient) => {
    openOverlay(<PrintPreview entryData={record} onClose={closeOverlay} />);
  };

  return (
    <section className="workspace-card">
      <h2>History</h2>
      {error && <p className="error-text">{error}</p>}
      {!error && records.length === 0 && <p>No records found.</p>}

      <ul className="patient-list">
        {records.map((record) => (
          <motion.li key={record.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <strong>{record.name || 'Unnamed'}</strong>
              <p>{record.mobile}</p>
            </div>
            <div className="row-actions">
              <button type="button" className="ghost-button" onClick={() => handlePreview(record)}>
                Preview
              </button>
              <button
                type="button"
                className="danger-btn"
                disabled={deletingId === record.id}
                onClick={() => record.id && void handleDelete(record.id)}
              >
                {deletingId === record.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
