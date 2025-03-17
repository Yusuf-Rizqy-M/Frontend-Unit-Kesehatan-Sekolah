import Layout from '../../components/layout';

function Home() {
  return (
    <Layout>
      <main>
        <h1 className="text-4xl text-teal-300">Welcome to My APP</h1>
        <p className="mt-2 text-gray-600">
          This is a React app built with Vite and Tailwind CSS.
        </p>
      </main>
    </Layout>
  );
}

export default Home;
