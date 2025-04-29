import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './assets/style/index.css'; // dari kombinasi kamu sebelumnya
import './css/style.css'; // dari file kedua kamu
import './charts/ChartjsConfig'; // dari file kedua kamu

// Import pages - User
import Home from './pages/user/home';
import KalkulatorBmi from './pages/user/kalkulatorbmi';
import Kondisi from './pages/user/kondisi';
import EdukasiKesehatan from './pages/user/edukasiKesehatan';
import AboutUs from './pages/user/about_us';
import RegisterPage from './pages/auth/register_page';
import LoginPage from './pages/auth/login_page';
import OtpPage from './pages/auth/ootp_page';
import GantiPasswordPage from './pages/auth/new_password_page';
import MentalEdu from './section/mental-edu';
import FisikEdu from './section/fisik-edu';
import CegahSakit from './section/cegahsakit-edu';
import KebersihanDiri from './section/kebersihandiri-edu';
import PolaHidupSehat from './section/hidupsehat-edu';
import NotFound from './pages/notfound';

// Import Protected Routes
import ProtectedRoute from './routes/protectedRoute';
import UserRoute from './routes/userRoute';

// Import Admin Page
import Dashboard from './pages/admin/Dashboard'; // Admin dashboard

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/gantipassword" element={<GantiPasswordPage />} />

      {/* User Routes (Protected) */}
      <Route path="/" element={<UserRoute><Home /></UserRoute>} />
      <Route path="/kalkulatorbmi" element={<UserRoute><KalkulatorBmi /></UserRoute>} />
      <Route path="/kondisi" element={<UserRoute><Kondisi /></UserRoute>} />
      <Route path="/edukasikesehatan" element={<UserRoute><EdukasiKesehatan /></UserRoute>} />
      <Route path="/aboutus" element={<UserRoute><AboutUs /></UserRoute>} />
      <Route path="/kesehatanmental" element={<UserRoute><MentalEdu /></UserRoute>} />
      <Route path="/fisikedu" element={<UserRoute><FisikEdu /></UserRoute>} />
      <Route path="/cegahsakit" element={<UserRoute><CegahSakit /></UserRoute>} />
      <Route path="/kebersihandiri" element={<UserRoute><KebersihanDiri /></UserRoute>} />
      <Route path="/polahidupsehat" element={<UserRoute><PolaHidupSehat /></UserRoute>} />

      {/* Admin Route */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Not Found */}
      <Route path="/notfound" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
