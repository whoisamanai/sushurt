import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import DashboardLayout from './features/dashboard/DashboardLayout';
import PatientForm from './pages/PatientForm';
import Preview from './pages/Preview';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-patient"
        element={
          <PrivateRoute>
            <PatientForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/preview/:id"
        element={
          <PrivateRoute>
            <Preview />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
