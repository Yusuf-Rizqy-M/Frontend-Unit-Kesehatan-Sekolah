import Navigation from '../user/navigation';
import Footer from '../user/footer';

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
