import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecentPatients } from '../services/patientService';
import { Patient } from '../types/patient';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPatients() {
      if (!user) {
        return;
      }

      try {
        const records = await getRecentPatients(user.uid, 8);
        setPatients(records);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    }

    void loadPatients();
  }, [user]);

  return (
    <div className="page-wrap">
      <div className="card">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.email}</p>
        <div className="row-actions">
          <Link to="/new-patient" className="btn-link">
            Add New Patient
          </Link>
          <button type="button" onClick={() => void logout()}>
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Recent Patients</h2>
        {loading && <p>Loading recent patients...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && patients.length === 0 && <p>No records yet. Add your first patient.</p>}
        <ul className="patient-list">
          {patients.map((patient) => (
            <li key={patient.id}>
              <div>
                <strong>{patient.name}</strong>
                <p>{patient.mobile}</p>
              </div>
              <Link to={`/preview/${patient.id}`}>Preview</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
