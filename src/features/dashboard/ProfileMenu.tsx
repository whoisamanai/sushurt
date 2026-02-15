import { signOut } from 'firebase/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { useModuleContext } from '../../context/ModuleContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { userId, setLoading } = useModuleContext();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const shortId = userId ? userId.slice(0, 6).toUpperCase() : 'GUEST';

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="profile-area">
      <button type="button" className="profile-trigger" onClick={() => setOpen((prev) => !prev)}>
        Profile
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="profile-dropdown" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <p className="profile-email-text">{user?.email ?? 'No email'}</p>
            <p className="profile-id-text">ID: {shortId}</p>
            <button type="button" className="danger-btn" onClick={() => void handleLogout()}>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
