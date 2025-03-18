import Layout from '../../components/layout';
import HeroSection from '../../components/hero_section';
import FeatureSection from '../../components/feature_section';
import HealthcareTeam from "../../components/HealthcareTeam";
import Facilities from "../../components/Facilities";
import FAQ from "../../components/FAQ";

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
