import { signOut } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import CenterLoader from '../components/CenterLoader';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../services/firebase';
import { Patient } from '../types/patient';

interface DashboardState {
  records: Patient[];
  loading: boolean;
  deletingId: string | null;
  error: string | null;
}

function getSectionFromPath(pathname: string): 'overview' | 'new-entry' | 'history' {
  if (pathname.includes('/dashboard/new-entry') || pathname.includes('/dashboard/new-patient')) {
    return 'new-entry';
  }
  if (pathname.includes('/dashboard/history')) {
    return 'history';
  }
  return 'overview';
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userId: string | null = auth.currentUser?.uid ?? user?.uid ?? null;
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchingSection, setSwitchingSection] = useState(false);
  const [state, setState] = useState<DashboardState>({
    records: [],
    loading: false,
    deletingId: null,
    error: null
  });

  const activeSection = useMemo(() => getSectionFromPath(location.pathname), [location.pathname]);
  const historyCount = state.records.length;
  const shortUserId = userId ? userId.slice(0, 6).toUpperCase() : 'GUEST';

  const fetchRecords = useCallback(async () => {
    if (!userId) {
      setState((prev) => ({ ...prev, records: [], loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const recordsRef = collection(db, 'patients', userId, 'records');
      const recordsQuery = query(recordsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(recordsQuery);

      const items: Patient[] = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          name: String(data.name ?? ''),
          fatherName: String(data.fatherName ?? ''),
          address: String(data.address ?? ''),
          mobile: String(data.mobile ?? ''),
          complaint: String(data.complaint ?? ''),
          createdAt: data.createdAt
        } as Patient;
      });

      setState((prev) => ({ ...prev, records: items }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load records.'
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [userId]);

  useEffect(() => {
    if (activeSection !== 'history') {
      return;
    }
    void fetchRecords();
  }, [activeSection, fetchRecords]);

  useEffect(() => {
    setSwitchingSection(true);
    const timer = window.setTimeout(() => setSwitchingSection(false), 220);
    return () => window.clearTimeout(timer);
  }, [activeSection]);

  const handleDelete = async (patientId: string) => {
    if (!userId) {
      setState((prev) => ({ ...prev, error: 'User not authenticated.' }));
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to delete this record?');
    if (!isConfirmed) {
      return;
    }

    setState((prev) => ({ ...prev, deletingId: patientId, error: null }));
    try {
      const recordRef = doc(db, 'patients', userId, 'records', patientId);
      await deleteDoc(recordRef);
      setState((prev) => ({
        ...prev,
        records: prev.records.filter((record) => record.id !== patientId)
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete record.'
      }));
    } finally {
      setState((prev) => ({ ...prev, deletingId: null }));
    }
  };

  const handleLogout = async () => {
    setSwitchingSection(true);
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } finally {
      setSwitchingSection(false);
    }
  };

  return (
    <div className="saas-layout">
      {(switchingSection || state.loading || !!state.deletingId) && <CenterLoader label="Working..." />}

      <aside className="saas-sidebar">
        <div>
          <h1 className="saas-logo">Sushrut</h1>
          <p className="saas-subtitle">AI Automation Platform</p>
        </div>

        <nav className="saas-nav">
          <NavLink end to="/dashboard" className={({ isActive }) => `saas-nav-item ${isActive ? 'active' : ''}`}>
            Overview
          </NavLink>

          <NavLink to="/dashboard/new-entry" className={({ isActive }) => `saas-nav-item ${isActive ? 'active' : ''}`}>
            New Form / New Entry
          </NavLink>

          <NavLink to="/dashboard/history" className={({ isActive }) => `saas-nav-item ${isActive ? 'active' : ''}`}>
            <span>History</span>
            <motion.span
              key={historyCount}
              className="history-badge"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18 }}
            >
              {historyCount}
            </motion.span>
          </NavLink>
        </nav>

        <div className="saas-profile-wrap">
          <button type="button" className="saas-profile-trigger" onClick={() => setProfileOpen((prev) => !prev)}>
            ID: {shortUserId}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div className="saas-profile-menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <button type="button" className="danger-btn" onClick={() => void handleLogout()}>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      <main className="saas-workspace">
        <AnimatePresence mode="wait">
          <motion.section
            key={activeSection}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.24 }}
            className="workspace-panel"
          >
            {activeSection === 'overview' && (
              <div className="workspace-grid">
                <div className="workspace-card">
                  <h2>Automation Overview</h2>
                  <p>Use this dashboard for healthcare, onboarding, public forms, ticketing, and service workflows.</p>
                </div>
                <div className="workspace-card">
                  <h2>Quick Actions</h2>
                  <div className="row-actions">
                    <Link to="/new-patient" className="btn-link">
                      Create New Entry
                    </Link>
                    <Link to="/dashboard/history" className="btn-link">
                      Open History
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'new-entry' && (
              <div className="workspace-card">
                <h2>New Form / New Entry</h2>
                <p>Start a new automation record using your existing entry workflow.</p>
                <Link to="/new-patient" className="btn-link inline-action-btn">
                  Launch Entry Form
                </Link>
              </div>
            )}

            {activeSection === 'history' && (
              <div className="workspace-card">
                <h2>History</h2>
                {state.error && <p className="error-text">{state.error}</p>}
                {!state.error && state.records.length === 0 && <p>No records found.</p>}

                <ul className="patient-list">
                  {state.records.map((record) => (
                    <motion.li key={record.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div>
                        <strong>{record.name || 'Unnamed'}</strong>
                        <p>{record.mobile}</p>
                      </div>
                      <div className="row-actions">
                        <Link to={`/preview/${record.id}`}>Preview</Link>
                        <button
                          type="button"
                          className="danger-btn"
                          disabled={state.deletingId === record.id}
                          onClick={() => record.id && void handleDelete(record.id)}
                        >
                          {state.deletingId === record.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}
