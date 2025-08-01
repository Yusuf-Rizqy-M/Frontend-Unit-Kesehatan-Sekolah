import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

// Auth pages
import LoginPage from "./pages/auth/login_page";
import RegisterPage from "./pages/auth/register_page";
import OtpPage from "./pages/auth/ootp_page";
import GantiPasswordPage from "./pages/auth/new_password_page";
import ForgotPasswordPage from "./pages/auth/forgot_password";

// User pages
import Home from "./pages/user/home";
import KalkulatorBmi from "./pages/user/kalkulatorbmi";
import Kondisi from "./pages/user/kondisi";
import EdukasiKesehatan from "./pages/user/edukasiKesehatan";
import AboutUs from "./pages/user/about_us";
import InfoProfile from "./pages/user/info_profile";
import EditProfile from "./pages/user/edit_profile";
import AntreUser from "./pages/user/antre-user";
import Antrian from "./pages/user/antrian";

// Edukasi sections
import MentalEdu from "./section/mental-edu";
import FisikEdu from "./section/fisik-edu";
import CegahSakit from "./section/cegahsakit-edu";
import KebersihanDiri from "./section/kebersihandiri-edu";
import PolaHidupSehat from "./section/hidupsehat-edu";

// Admin
import Dashboard from "./pages/admin/dashboard";
import ManajemenUser from "./pages/admin/ManajemenUser";
import UploadBlog from "./pages/admin/upload_blog";
import KategoriPage from "./pages/admin/Kategori";
import RekamMedisSiswa from "./pages/admin/rekam_medis_siswa";
import DetailRekamMedisSiswa from "./pages/admin/detail_rekam_medas";
import Staff from "./pages/admin/staff_admin";
import RekamAntri from "./pages/admin/rekam_antri_siswa";
import DetailRekamAntri from "./pages/admin/detail_rekam_antri";
// FIXED: Rename to Article to match usage below
import Article from "./pages/admin/article";
import KelasPage from "./pages/admin/kelas";
import Jurusanpage from "./pages/admin/jurusan";
import Settingpage from "./pages/admin/settings";

// Routes
import ProtectedRoute from "./routes/protectedRoute";
import UserRoute from "./routes/userRoute";
import NotFound from "./pages/notfound";
import HidupSehat from "./section/hidupsehat-edu";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/gantipassword" element={<GantiPasswordPage />} />

        {/* User protected routes */}
        <Route
          path="/"
          element={
            <Home />
          }
        />
        <Route
          path="/kalkulatorbmi"
          element={
            <KalkulatorBmi />
          }
        />
        <Route
          path="/kondisi"
          element={
            <UserRoute>
              <Kondisi />
            </UserRoute>
          }
        />
        <Route
          path="/edukasikesehatan"
          element={
            <EdukasiKesehatan />
          }
        />
        <Route
          path="/aboutus"
          element={

            <AboutUs />
          }
        />
        <Route
          path="/infoprofile"
          element={
            <UserRoute>
              <InfoProfile />
            </UserRoute>
          }
        />
        <Route
          path="/editprofile"
          element={
            <UserRoute>
              <EditProfile />
            </UserRoute>
          }
        />
        <Route
          path="/antreuser"
          element={
            <UserRoute>
              <AntreUser />
            </UserRoute>
          }
        />

        {/* Edukasi detail routes */}
        <Route
          path="/kesehatanmental"
          element={
            <MentalEdu />
          }
        />
        <Route
          path="/kesehatanfisik"
          element={
            <FisikEdu />
          }
        />
        <Route
          path="/PencegahanPenyakit"
          element={
            <CegahSakit />
          }
        />
        <Route
          path="/kebersihandiri"
          element={

            <KebersihanDiri />
          }
        />
        <Route
          path="/polahidupsehat"
          element={
            <PolaHidupSehat />

          }
        />
        <Route
          path="/artikel"
          element={

            <Article />

          }
        />
        <Route
          path="/antrian"
          element={
            <UserRoute>
              <Antrian />
            </UserRoute>
          }
        />

        {/* Admin dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manajemenuser"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManajemenUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kategori"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <KategoriPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rekammedis"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RekamMedisSiswa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff_admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kelas"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <KelasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Settingpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Jurusanpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rekamantri"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RekamAntri />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rekamantri/detailrekamantri/:userId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DetailRekamAntri />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadblog"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UploadBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Article />
            </ProtectedRoute>
          }
        />

        {/* Medical Record Routes */}
        <Route
          path="/MedicalRecord/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DetailRekamMedisSiswa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rekammedis-siswa"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RekamMedisSiswa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;