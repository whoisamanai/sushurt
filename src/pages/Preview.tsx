import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPatientById } from '../services/patientService';
import { Patient } from '../types/patient';

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatient() {
      if (!user || !id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getPatientById(user.uid, id);
        if (!data) {
          setError('Patient record not found.');
        } else {
          setPatient(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patient details.');
      } finally {
        setLoading(false);
      }
    }

    void fetchPatient();
  }, [id, user]);

  if (loading) {
    return <p className="center-message">Loading preview...</p>;
  }

  if (error) {
    return (
      <div className="page-wrap">
        <div className="card">
          <p className="error-text">{error}</p>
          <Link to="/dashboard">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="page-wrap">
      <div className="row-actions no-print">
        <Link to="/dashboard" className="btn-link">
          Dashboard
        </Link>
        <Link to="/new-patient" className="btn-link">
          Add New Patient
        </Link>
        <button type="button" onClick={() => window.print()}>
          Print Slip
        </button>
      </div>

      <article className="slip card">
        <header className="slip-header">
          <h1>SushrutAI Multispeciality Hospital</h1>
          <p>OPD Registration Slip</p>
        </header>

        <section className="slip-grid">
          <p>
            <strong>Patient Name:</strong> {patient.name}
          </p>
          <p>
            <strong>Father Name:</strong> {patient.fatherName}
          </p>
          <p>
            <strong>Mobile:</strong> {patient.mobile}
          </p>
          <p>
            <strong>Date:</strong> {patient.createdAt?.toDate().toLocaleString() ?? '-'}
          </p>
        </section>

        <section>
          <p>
            <strong>Address:</strong> {patient.address}
          </p>
          <p>
            <strong>Complaint:</strong> {patient.complaint}
          </p>
        </section>
      </article>
    </div>
  );
}
