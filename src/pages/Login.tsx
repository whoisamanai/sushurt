import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { auth } from '../services/firebase';

interface LoginFormState {
  email: string;
  password: string;
}

interface LoginUiState {
  loading: boolean;
  resetLoading: boolean;
  error: string | null;
  success: string | null;
  showForgotPassword: boolean;
  showCreateAccount: boolean;
}

const initialForm: LoginFormState = {
  email: '',
  password: ''
};

const initialUi: LoginUiState = {
  loading: false,
  resetLoading: false,
  error: null,
  success: null,
  showForgotPassword: false,
  showCreateAccount: false
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<LoginFormState>(initialForm);
  const [ui, setUi] = useState<LoginUiState>(initialUi);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setUi((prev) => ({
      ...prev,
      success: null,
      showForgotPassword: false,
      showCreateAccount: false
    }));
  }, [form.email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUi((prev) => ({ ...prev, loading: true, error: null, success: null }));

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof FirebaseError ? error.message : 'Login failed.';
      const code = error instanceof FirebaseError ? error.code : '';

      setUi((prev) => ({
        ...prev,
        error: message,
        showForgotPassword:
          code === 'auth/wrong-password' ||
          code === 'auth/invalid-credential' ||
          code === 'auth/invalid-login-credentials',
        showCreateAccount: code === 'auth/user-not-found' || code === 'auth/invalid-email'
      }));
    } finally {
      setUi((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setUi((prev) => ({ ...prev, error: 'Please enter your email first.' }));
      return;
    }

    setUi((prev) => ({ ...prev, resetLoading: true, error: null, success: null }));

    try {
      await sendPasswordResetEmail(auth, form.email);
      setUi((prev) => ({
        ...prev,
        success: 'Password reset email sent. Please check your inbox.',
        showForgotPassword: false
      }));
    } catch (error) {
      const message = error instanceof FirebaseError ? error.message : 'Could not send reset email.';
      setUi((prev) => ({ ...prev, error: message }));
    } finally {
      setUi((prev) => ({ ...prev, resetLoading: false }));
    }
  };

  return (
    <div className="auth-shell">
      <form className="card form-card auth-card" onSubmit={handleSubmit}>
        <h1>SushrutAI Login</h1>

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

        {ui.error && <p className="error-text">{ui.error}</p>}
        {ui.success && <p className="success-text">{ui.success}</p>}

        <button type="submit" disabled={ui.loading}>
          {ui.loading ? <Spinner size="sm" label="Signing in..." /> : 'Login'}
        </button>

        {ui.showForgotPassword && (
          <button className="ghost-button" type="button" onClick={() => void handleForgotPassword()} disabled={ui.resetLoading}>
            {ui.resetLoading ? <Spinner size="sm" label="Sending reset email..." /> : 'Forgot Password?'}
          </button>
        )}

        {ui.showCreateAccount && (
          <div className="subtle-box">
            <p>Data not found. Create new account?</p>
            <Link to="/signup" className="subtle-link">
              Create new account
            </Link>
          </div>
        )}

        <p>
          New user?{' '}
          <Link to="/signup" className="subtle-link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
