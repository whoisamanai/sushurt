import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { auth } from '../services/firebase';

interface SignupFormState {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupUiState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialForm: SignupFormState = {
  email: '',
  password: '',
  confirmPassword: ''
};

const initialUi: SignupUiState = {
  loading: false,
  error: null,
  success: null
};

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupFormState>(initialForm);
  const [ui, setUi] = useState<SignupUiState>(initialUi);

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setUi((prev) => ({ ...prev, error: null }));
  }, [form.email, form.password, form.confirmPassword]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password.length < 6) {
      setUi((prev) => ({ ...prev, error: 'Password should be at least 6 characters.', success: null }));
      return;
    }

    if (form.confirmPassword && form.password !== form.confirmPassword) {
      setUi((prev) => ({ ...prev, error: 'Passwords do not match.', success: null }));
      return;
    }

    setUi((prev) => ({ ...prev, loading: true, error: null, success: null }));

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      setUi((prev) => ({ ...prev, success: 'Account created successfully! Redirecting...' }));
      setTimeout(() => navigate('/dashboard', { replace: true }), 700);
    } catch (error) {
      const message = error instanceof FirebaseError ? error.message : 'Signup failed.';
      setUi((prev) => ({ ...prev, error: message }));
    } finally {
      setUi((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="auth-shell">
      <form className="card form-card auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </label>

        <label>
          Confirm Password (optional)
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
          />
        </label>

        {ui.error && <p className="error-text">{ui.error}</p>}
        {ui.success && <p className="success-text">{ui.success}</p>}

        <button type="submit" disabled={ui.loading}>
          {ui.loading ? <Spinner size="sm" label="Creating account..." /> : 'Sign up'}
        </button>

        <p>
          Already have an account?{' '}
          <Link to="/login" className="subtle-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
