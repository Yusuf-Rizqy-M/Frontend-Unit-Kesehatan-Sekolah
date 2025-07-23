import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // Import react-helmet
import Layout from '../../components/user/layout';
import UksImg1 from '../../assets/img/hospital-room-interior.jpg';
import UksImg2 from '../../assets/img/person_bg.png';
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

// Fetch staff data from the API
const fetchPengurusData = async () => {
  try {
    const response = await fetch('https://api-uks.rplrus.com/api/staff');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Map API fields to match the component's expected structure
    const mappedData = data.map(item => ({
      nama: item.name,
      jabatan: item.role,
      deskripsi: `Bertugas sebagai ${item.role.toLowerCase()} untuk mendukung program kesehatan sekolah.`,
      foto: item.image.replace('https://api-uks.rplrus.com/storage/https://api-uks.rplrus.com/storage/', 'https://api-uks.rplrus.com/storage/') || UksImg2,
    }));
    // Cache the data in localStorage
    localStorage.setItem('pengurusData', JSON.stringify(mappedData));
    return mappedData;
  } catch (error) {
    console.error('Error fetching pengurus data:', error);
    // Try to load cached data from localStorage
    const cachedData = localStorage.getItem('pengurusData');
    return cachedData ? JSON.parse(cachedData) : [];
  }
};

export default function AboutUs() {
  const [pengurusData, setPengurusData] = useState([]);
  const [error, setError] = useState(null);

  // Debug title and favicon
  useEffect(() => {
    console.log('AboutUs component mounted');
    console.log('Initial document title:', document.title);
    const favicon = document.querySelector('link[rel="icon"]');
    console.log('Initial favicon href:', favicon ? favicon.href : 'No favicon found');
    console.log('UKS2Img import path:', UKS2Img); // Log the resolved import path

    // Check title and favicon after rendering
    const timeout = setTimeout(() => {
      console.log('Document title after render:', document.title);
      const updatedFavicon = document.querySelector('link[rel="icon"]');
      console.log('Favicon after render:', updatedFavicon ? updatedFavicon.href : 'No favicon found');
      // Attempt to force favicon update
      if (updatedFavicon) {
        updatedFavicon.href = `${UKS2Img}?v=${Date.now()}`;
        console.log('Forced favicon update to:', updatedFavicon.href);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
      console.log('AboutUs component unmounted');
    };
  }, []);

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const cachedData = localStorage.getItem('pengurusData');
      if (cachedData) {
        // Use cached data immediately to avoid delay
        setPengurusData(JSON.parse(cachedData));
      }
      const data = await fetchPengurusData();
      if (data.length === 0 && !cachedData) {
        setError('Gagal memuat data tim kesehatan. Silakan coba lagi nanti.');
      } else {
        setPengurusData(data);
        setError(null);
      }
    };
    loadData();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>About Us</title>
        <link rel="icon" href={`${UKS2Img}?v=${Date.now()}`} /> {/* Use imported UKS2Img with cache-busting */}
      </Helmet>
      <div className="bg-white text-black">
        {/* Section: Apa Itu UKS */}
        <section className="min-h-[80vh] flex items-center px-6 md:px-20 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center w-full">
            <div className="space-y-4 text-left">
              <h2 className="text-2xl font-bold">Apa Itu UKS</h2>
              <div className="w-37 h-1 bg-teal-500 mb-4"></div>
              <p className="text-gray-600 leading-relaxed">
                UKS atau Usaha Kesehatan Sekolah adalah program sekolah yang bertujuan untuk meningkatkan kesehatan peserta didik.
                Melalui UKS, sekolah membiasakan siswa untuk hidup sehat, menjaga kebersihan, dan peduli pada kesehatan diri sendiri maupun lingkungan sekitar.
                Program ini mendukung terciptanya lingkungan sekolah yang bersih, sehat, dan nyaman, sehingga siswa dapat belajar dan berkembang dengan lebih optimal.
              </p>
              <button className="bg-cyan-600 hover:bg-teal-600 text-white px-6 py-2 rounded-lg mt-4 transition">
                Jelajahi Sekarang
              </button>
            </div>
            <img
              src={UksImg1}
              alt="Ruangan Rumah Sakit"
              className="object-cover w-[455px] h-[455px] rounded-md mx-auto"
            />
          </div>
        </section>

        {/* Section: Tujuan UKS */}
        <section className="min-h-[80vh] flex items-center px-6 md:px-20 py-20">
          <div className="grid md:grid-cols-2 gap-6 items-center w-full">
            <img
              src={UksImg1}
              alt="Tujuan UKS"
              className="object-cover w-full max-w-[600px] h-[250px] md:h-[350px] rounded-md mx-auto"
            />
            <div className="space-y-3 text-left">
              <h2 className="text-2xl font-bold">Tujuan UKS</h2>
              <div className="w-36 h-1 bg-teal-500 mb-3"></div>
              <p className="text-gray-600 leading-relaxed text-sm">
                UKS datang untuk membantu siswa menjadi lebih sehat agar bisa belajar lebih baik.
                UKS mengajarkan hidup bersih dan sehat, menjaga kebersihan sekolah, dan memberikan pelayanan kesehatan sederhana di sekolah.
                Dengan begitu, siswa bisa tumbuh dan berkembang dengan optimal.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Mengenal Para Pengurus */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 md:px-20 py-20 text-center">
          <div className="space-y-12 w-full">
            <div>
              <h2 className="text-2xl font-bold">Mengenal Para Pengurus UKS</h2>
              <div className="w-100 h-1 bg-teal-500 mb-4 mx-auto"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
                UKS datang untuk membantu siswa menjadi lebih sehat agar bisa belajar lebih baik.
                UKS mengajarkan hidup bersih dan sehat, menjaga kebersihan sekolah, dan memberikan pelayanan kesehatan sederhana di sekolah.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-16">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : pengurusData.length > 0 ? (
                pengurusData.map((pengurus, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <img
                      src={pengurus.foto}
                      alt={pengurus.nama}
                      className="w-44 h-44 object-cover rounded-full"
                    />
                    <h3 className="font-semibold text-lg">{pengurus.nama}</h3>
                    <p className="text-gray-500 text-sm">{pengurus.jabatan}</p>
                    <p className="text-gray-500 text-sm max-w-xs text-center">
                      {pengurus.deskripsi}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Loading pengurus data...</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}