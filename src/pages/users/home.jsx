import Layout from '../../components/layout';
import HeroSection from '../../components/hero_section';
import FeatureSection from '../../components/feature_section';

function Home() {
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <HeroSection />
        <FeatureSection />
      </main>
    </Layout>
  );
}

export default Home;


