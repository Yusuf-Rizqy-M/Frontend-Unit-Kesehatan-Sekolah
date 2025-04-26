import { Routes, Route } from "react-router-dom";
import Home from "./pages/users/home";
import KalkulatorBmi from "./pages/users/kalkulatorbmi";
import Kondisi from "./pages/users/kondisi";
import EdukasiKesehatan from "./pages/users/edukasiKesehatan";
import AboutUs from "./pages/users/about_us";
import RegisterPage from "./pages/auth/register_page";
import LoginPage from "./pages/auth/login_page";
import OtpPage from "./pages/auth/ootp_page";
import GantiPasswordPage from "./pages/auth/new_password_page";
import MentalEdu from "./section/mental-edu";
import FisikEdu from "./section/fisik-edu";
import CegahSakit from "./section/cegahsakit-edu";
import KebersihanDiri from "./section/kebersihandiri-edu";
import PolaHidupSehat from "./section/hidupsehat-edu";
import ProtectedRoute from "./routes/protectedRoute";
import Dashboard from "./components/admin/dashboard";
import UserRoute from "./routes/userRoute";
import NotFound from "./pages/notfound";

function App() {
  return (
    <>
      <Routes>
        {/* Routes public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/gantipassword" element={<GantiPasswordPage />} />

        {/* Routes user */}
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

        {/* Route admin */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Not Found */}
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
