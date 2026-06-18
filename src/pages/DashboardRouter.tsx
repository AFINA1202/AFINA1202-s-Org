import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentLKPD from './StudentLKPD';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

export default function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <Routes>
      {user.role === 'admin' && (
        <>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </>
      )}
      
      {user.role === 'guru' && (
        <>
          <Route path="/guru" element={<TeacherDashboard />} />
          <Route path="*" element={<Navigate to="/guru" replace />} />
        </>
      )}
      
      {user.role === 'siswa' && (
        <>
          <Route path="/lkpd" element={<StudentLKPD />} />
          <Route path="*" element={<Navigate to="/lkpd" replace />} />
        </>
      )}
    </Routes>
  );
}
