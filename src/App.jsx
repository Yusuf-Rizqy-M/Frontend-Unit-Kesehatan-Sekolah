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
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kalkulatorbmi" element={<KalkulatorBmi />} />
        <Route path="/kondisi" element={<Kondisi />} />
        <Route path="/edukasikesehatan" element={<EdukasiKesehatan />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/registerpage" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ootp" element={<OtpPage />} />
        <Route path="/newpass" element={<GantiPasswordPage />} />
        <Route path="/KesehatanMental" element={<MentalEdu/>} />
        <Route path="/FisikEdu" element={<FisikEdu/>} />
        <Route path="/CegahSakit" element={<CegahSakit/>} />
        <Route path="/KebersihanDiri" element={<KebersihanDiri/>} />
        <Route path="/PolaHidupSehat" element={<PolaHidupSehat/>} />

      </Routes>
    </>
  );
}

export default App;
