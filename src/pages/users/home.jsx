import Layout from '../../components/user/layout';
import HeroSection from '../../section/hero-home';
import FeatureSection from '../../section/feature-home';
import HealthcareTeam from "../../section/healthcare-home";
import Facilities from "../../section/facilities-home";
import FAQ from "../../section/faq-home";

function Home() {
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
