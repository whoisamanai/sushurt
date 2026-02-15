import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPatient } from '../services/patientService';
import { PatientInput } from '../types/patient';

const initialForm: PatientInput = {
  name: '',
  fatherName: '',
  address: '',
  mobile: '',
  complaint: ''
};

export default function PatientForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<PatientInput>(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof PatientInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to add patients.');
      return;
    }

    setSaving(true);

    try {
      const patientId = await createPatient(user.uid, form);
      navigate(`/preview/${patientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save patient record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrap">
      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="row-space-between">
          <h1>New Patient Registration</h1>
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
        <label>
          Patient Name
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
        </label>
        <label>
          Father Name
          <input
            value={form.fatherName}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            required
          />
        </label>
        <label>
          Address
          <textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} required />
        </label>
        <label>
          Mobile Number
          <input
            value={form.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            required
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit mobile number"
          />
        </label>
        <label>
          Complaint
          <textarea
            value={form.complaint}
            onChange={(e) => handleChange('complaint', e.target.value)}
            required
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save & Preview'}
        </button>
      </form>
    </div>
  );
}
