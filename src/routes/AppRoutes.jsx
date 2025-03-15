import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "../pages/users/home";
import AboutUs from "../pages/users/about_us";
import EdukasiKesehatan from "../pages/users/edukasiKesehatan";
import KalkulatorBmi from "../pages/users/kalkulatorbmi";
import Kondisi from "../pages/users/kondisi";

function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/EdukasiKesehatan" element={<EdukasiKesehatan />} />
          <Route path="/KalkulatorBmi" element={<KalkulatorBmi />} />
          <Route path="/Kondisi" element={<Kondisi />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default AppRoutes;
