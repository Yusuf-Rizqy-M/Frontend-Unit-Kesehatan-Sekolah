import { Routes, Route } from "react-router-dom";
import Home from "./pages/users/home";
import KalkulatorBmi from "./pages/users/kalkulatorbmi";
import Kondisi from "./pages/users/kondisi";
import EdukasiKesehatan from "./pages/users/edukasiKesehatan";
import AboutUs from "./pages/users/about_us";
import RegisterPage from "./pages/auth/register_page";
import LoginPage from "./pages/auth/login_page";



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
      </Routes>
    </>
  );
}

export default App;
