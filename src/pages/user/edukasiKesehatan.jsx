import Layout from '../../components/user/layout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import EducationCard from '../../widget/educationcard';
import UKS2Img from '../../assets/img/uks2.png';
import Clean from '../../assets/img/cleaannn.png';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

function EdukasiKesehatan() {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryIcon, setCategoryIcon] = useState(Clean);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const createExcerpt = (htmlContent, maxLength = 200) => {
    if (!htmlContent) return '';
    
    const cleanHTML = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br'],
      ALLOWED_ATTR: []
    });
    
    const textContent = cleanHTML.replace(/<[^>]*>/g, '');
    
    if (textContent.length <= maxLength) {
      return cleanHTML;
    }
    
    const truncatedText = textContent.substring(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    const finalText = lastSpaceIndex > 0 ? truncatedText.substring(0, lastSpaceIndex) : truncatedText;
    
    return DOMPurify.sanitize(`<p>${finalText}...</p>`);
  };

  const fetchArticleDetails = async (articleId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api-uks.rplrus.com/api/categories/${categoryId}/article/${articleId}`);
      const data = await response.json();
      if (data.status) {
        setSelectedArticle(data.data);
        setIsModalOpen(true);
      } else {
        setError(data.message || 'Failed to load article details');
      }
    } catch (error) {
      console.error('Error fetching article details:', error);
      setError('Error fetching article details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = categoryId ? 'Artikel Kesehatan' : 'Edukasi Kesehatan';
    
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);

    fetch('https://api-uks.rplrus.com/api/categories')
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setCategories(data.data);
          
          if (categoryId) {
            const matchedCategory = data.data.find(cat => cat.id.toString() === categoryId);
            
            if (matchedCategory) {
              setCategoryTitle(matchedCategory.title);
              setCategoryIcon(matchedCategory.image || Clean);
              
              fetch(`https://api-uks.rplrus.com/api/categories/${categoryId}/articles`)
                .then(response => response.json())
                .then(articleData => {
                  if (articleData.status) {
                    setArticles(articleData.data);
                  } else {
                    setError(articleData.message || 'Failed to load articles');
                  }
                })
                .catch(error => {
                  console.error('Error fetching articles:', error);
                  setError('Error fetching articles. Please try again later.');
                })
                .finally(() => setLoading(false));
            } else {
              setError('Category not found');
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        } else {
          setError('Failed to load categories');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories. Please try again later.');
        setLoading(false);
      });
  }, [categoryId]);

  useEffect(() => {
    if (categoryId && articles.length === 0 && !loading && !error) {
      const timer = setTimeout(() => {
        navigate('/edukasikesehatan');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [categoryId, articles, loading, error, navigate]);

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
            animation: spin 1.2s ease-in-out infinite;
          }
          .spinner-ring.outer {
            border-top-color: #4FB7BD;
            border-bottom-color: #93D3CC;
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
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          .animate-slide-up {
            animation: slideUp 0.5s ease-in-out;
          }
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #2A8F9E;
            color: white;
            border: none;
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: background 0.3s;
          }
          .modal-close:hover {
            background: #005A79;
          }
          .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #2A8F9E;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .back-button:hover {
            background: #005A79;
            transform: translateX(-4px);
          }
          .back-button svg {
            width: 1.25rem;
            height: 1.25rem;
          }
          .responsive-image {
            max-width: 50%;
            height: auto;
            object-fit: cover;
            border-radius: 0.5rem;
            margin-left: 0;
            margin-right: auto;
          }
          @media (max-width: 640px) {
            .back-button {
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
            }
            .back-button svg {
              width: 1rem;
              height: 1rem;
            }
            .responsive-image {
              max-width: 100%;
              height: auto;
            }
          }
          @media (min-width: 641px) and (max-width: 1024px) {
            .responsive-image {
              max-width: 80%;
              height: auto;
            }
          }
          @media (min-width: 1025px) {
            .responsive-image {
              max-width: 50%;
              height: auto;
            }
          }
        `}
      </style>
      <main className="animate-fade-in">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p className="text-gray-500 mt-4 animate-pulse">Memuat...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 animate-slide-up">{error}</p>
        ) : !categoryId ? (
          <>
            <section className="relative w-full flex justify-center items-center bg-white mb-12 sm:mb-16 md:mb-20 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] mt-[20px] sm:mt-[-50px] md:mt-[-150px] lg:mt-[-250px] animate-fade-in px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:w-[1200px]">
                <div className="bg-[#75CCD1] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] flex items-center shadow-md p-4 sm:p-6 md:p-8 lg:p-12 pt-3 sm:pt-4 md:pt-6 pl-6 sm:pl-8 md:pl-10 lg:pl-12 transform transition-all duration-500 hover:shadow-lg min-h-[120px] sm:min-h-[150px] md:min-h-[180px] lg:h-[200px]">
                  <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-left leading-tight animate-slide-up">
                    Jelajahi <br /> berbagai <span className="text-[#005A79]">Edukasi kesehatan</span>
                  </h2>
                </div>
              </div>
            </section>

            <h2 className="-mt-2 sm:-mt-8 md:-mt-12 lg:-mt-17 text-xl sm:text-2xl md:text-3xl font-semibold text-[#2A8F9E] text-center animate-slide-up px-4">
              Apa yang ingin <span className="text-[#005A79]">dibaca?</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6 sm:mt-8 md:mt-10 px-4">
              {categories.map(category => (
                <Link key={category.id} to={`/edukasi-kesehatan/${category.id}`}>
                  <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <EducationCard title={category.title} icon={category.image} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <section className="w-full px-4 md:px-20 py-5 bg-white animate-fade-in">
            <div className="flex items-center justify-start mb-8">
              <button 
                onClick={() => navigate('/edukasikesehatan')} 
                className="back-button"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Edukasi Kesehatan
              </button>
            </div>

            <div className="text-center mb-12">
              <img
                src={categoryIcon}
                alt={`${categoryTitle} Icon`}
                className="mx-auto w-40 h-40 mb-2 transform transition-transform duration-300 hover:scale-110"
              />
              <h2 className="text-xl md:text-2xl font-semibold text-[#2A8F9E] animate-slide-up">
                Artikel tentang <span className="text-[#2A8F9E]">{categoryTitle}</span>
              </h2>
              <hr className="mt-2 border-t border-gray-200 w-3/4 mx-auto transition-all duration-500" />
            </div>

            <div className="space-y-12">
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <div
                    key={article.id}
                    className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-200 pb-6 cursor-pointer hover:bg-gray-50 transition-all duration-300 p-4 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-full md:w-3/5 text-left pl-4 md:pl-6">
                      <h3 className="text-base md:text-lg font-semibold text-[#1C4245] mb-2 hover:text-[#2A8F9E] transition-colors duration-200">
                        {article.title}
                      </h3>
                      <div 
                        className="text-sm text-[#1C4245] prose prose-sm max-w-none
                                   prose-p:text-[#1C4245] prose-strong:text-[#1C4245] 
                                   prose-em:text-[#1C4245] prose-blockquote:text-[#1C4245]
                                   prose-blockquote:border-l-[#2A8F9E] prose-blockquote:pl-4
                                   prose-ul:text-[#1C4245] prose-ol:text-[#1C4245]
                                   prose-li:text-[#1C4245] prose-h1:text-[#1C4245]
                                   prose-h2:text-[#1C4245] prose-h3:text-[#1C4245]"
                        dangerouslySetInnerHTML={{ 
                          __html: createExcerpt(article.description, 300) 
                        }}
                      />
                      <p 
                        className="text-xs text-[#2A8F9E] mt-3 font-medium transform transition-transform duration-200 hover:translate-x-1"
                        onClick={() => navigate(`/edukasi-kesehatan/${categoryId}/${article.id}`)}
                      >
                        Klik untuk baca selengkapnya →
                      </p>
                    </div>
                    <div className="w-full md:w-2/5">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-auto object-cover rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 responsive-image"
                        onError={(e) => (e.target.src = Clean)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center animate-slide-up">
                  <p className="text-gray-500 mb-4">Tidak ada artikel yang ditemukan untuk kategori ini. Anda akan diarahkan kembali dalam 5 detik...</p>
                  <button 
                    onClick={() => navigate('/edukasikesehatan')} 
                    className="back-button"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {isModalOpen && selectedArticle && (
          <div className="modal">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
              <div className="text-center mb-6">
                <button 
                  onClick={() => navigate('/edukasikesehatan')} 
                  className="back-button inline-flex items-center gap-2 bg-[#2A8F9E] text-white px-4 py-2 rounded-md hover:bg-[#005A79]"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali
                </button>
                <img
                  src={require('../../assets/img/heart-icon.png')}
                  alt="Heart Icon"
                  className="mx-auto w-12 h-12 mb-2"
                />
                <h2 className="text-xl md:text-2xl font-semibold text-[#2A8F9E] mb-2">
                  Artikel tentang <span className="text-[#2A8F9E]">{categoryTitle}</span>
                </h2>
                <p className="text-sm text-[#1C4245] max-w-lg mx-auto">
                  Our Health Haven is equipped with essential medical facilities to ensure students receive the best care in a safe and comfortable environment.
                </p>
              </div>
              {Array(3).fill().map((_, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold text-[#2A8F9E] mb-2">Pemeriksaan Kesehatan</h3>
                  <p className="text-sm text-[#1C4245] mb-4 max-w-lg mx-auto">
                    Our Health Haven is equipped with essential medical facilities to ensure students receive the best care in a safe and comfortable environment.
                  </p>
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="responsive-image image-left"
                    onError={(e) => (e.target.src = Clean)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default EdukasiKesehatan;