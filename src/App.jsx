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
import AntreAfter from "./pages/user/antre-after";

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

// Routes
import ProtectedRoute from "./routes/protectedRoute";
import UserRoute from "./routes/userRoute";
import NotFound from "./pages/notfound";



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
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/gantipassword" element={<GantiPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* User protected routes */}
        <Route
          path="/"
          element={
            <UserRoute>
              <Home />
            </UserRoute>
          }
        />
        <Route
          path="/kalkulatorbmi"
          element={
            <UserRoute>
              <KalkulatorBmi />
            </UserRoute>
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
            <UserRoute>
              <EdukasiKesehatan />
            </UserRoute>
          }
        />
        <Route
          path="/aboutus"
          element={
            <UserRoute>
              <AboutUs />
            </UserRoute>
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
        <Route
          path="/antreafter"
          element={
            <UserRoute>
              <AntreAfter />
            </UserRoute>
          }
        />

        {/* Edukasi detail routes */}
        <Route
          path="/kesehatanmental"
          element={
            <UserRoute>
              <MentalEdu />
            </UserRoute>
          }
        />
        <Route
          path="/fisikedu"
          element={
            <UserRoute>
              <FisikEdu />
            </UserRoute>
          }
        />
        <Route
          path="/cegahsakit"
          element={
            <UserRoute>
              <CegahSakit />
            </UserRoute>
          }
        />
        <Route
          path="/kebersihandiri"
          element={
            <UserRoute>
              <KebersihanDiri />
            </UserRoute>
          }
        />
        <Route
          path="/polahidupsehat"
          element={
            <UserRoute>
              <PolaHidupSehat />
            </UserRoute>
          }
        />

        {/* Admin dashboard route */}
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
          path="/uploadblog"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UploadBlog />
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
