import { Routes, Route } from "react-router-dom";
import Home from "./pages/users/home";
import KalkulatorBmi from "./pages/users/kalkulatorbmi";
import Kondisi from "./pages/users/kondisi";
import EdukasiKesehatan from "./pages/users/edukasiKesehatan";
import AboutUs from "./pages/users/about_us";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/KalkulatorBmi" element={<KalkulatorBmi />} />
        <Route path="/Kondisi" element={<Kondisi />} />
        <Route path="/EdukasiKesehatan" element={<EdukasiKesehatan />} />
        <Route path="/AboutUs" element={<AboutUs />} />
      </Routes>
    </>
  );
}

export default App;
