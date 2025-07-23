import { useEffect } from 'react'; // Impor useEffect untuk mengatur title dan favicon
import Layout from '../../components/user/layout';
import HeroSection from '../../section/hero-home';
import FeatureSection from '../../section/feature-home';
import HealthcareTeam from "../../section/healthcare-home";
import Facilities from "../../section/facilities-home";
import FAQ from "../../section/faq-home";
import UKS2Img from '../../images/uks2.png'; // Impor gambar UKS2Img, sesuaikan path

function Home() {
  useEffect(() => {
    // Mengatur judul tab
    document.title = 'Home';
    
    // Mengatur favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img; // Menggunakan UKS2Img sebagai favicon
    document.head.appendChild(favicon);
  }, []); // Efek hanya dijalankan sekali saat komponen dimuat

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen bg-white">
        <HeroSection />
        <FeatureSection />
        <HealthcareTeam />
        <Facilities />
        <FAQ />
      </main>
    </Layout>
  );
}

export default Home;