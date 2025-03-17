import Navigation from './navigation';
import Footer from './footer';

function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main className="flex flex-col items-center justify-center min-h-screen bg-white">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
