import Layout from '../../components/user/layout';
import { Link } from 'react-router-dom';
import EducationCard from '../../widget/educationcard';
import { useState, useEffect } from 'react';

function EdukasiKesehatan() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api-uks.rplrus.com/api/categories')
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setCategories(data.data);
        }
      })
      .catch(error => console.error('Error fetching categories:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <style>
        {`
          .double-spinner {
            position: relative;
            width: 60px;
            height: 60px;
            margin: 0 auto;
          }
          .spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
          }
          .spinner-ring.outer {
            border-top-color: #4FB7BD;
            border-bottom-color: #4FB7BD;
            animation-direction: normal;
          }
          .spinner-ring.inner {
            border-top-color: #93D3CC;
            border-bottom-color: #93D3CC;
            animation-direction: reverse;
            width: 40px;
            height: 40px;
            top: 10px;
            left: 10px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <main>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p className="text-gray-500 mt-4">Memuat...</p>
          </div>
        ) : (
          <>
            <section className="relative w-full flex justify-center items-center bg-white mb-20 min-h-[300px] mt-[-250px]">
              <div className="w-[1200px] h-[200px] bg-[#75CCD1] rounded-[20px] flex items-center shadow-md pl-12 pt-6">
                <h2 className="text-4xl font-bold text-white text-left leading-tight">
                  Jelajahi <br /> berbagai <span className="text-[#005A79]">Edukasi kesehatan</span>
                </h2>
              </div>
            </section>

            <h2 className="-mt-17 text-3xl font-semibold text-[#2A8F9E] text-center">
              Apa yang ingin <span className="text-[#005A79]">dibaca?</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {categories.map(category => (
                <Link key={category.id} to={`/${category.title.replace(/\s+/g, '')}`}>
                  <EducationCard title={category.title} icon={category.image} />
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}

export default EdukasiKesehatan;