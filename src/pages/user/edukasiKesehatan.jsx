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
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Function to create a safe HTML excerpt from description
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

  useEffect(() => {
    // Set favicon and title
    document.title = categoryId ? 'Artikel Kesehatan' : 'Edukasi Kesehatan';
    
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);

    // Fetch categories
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
              
              // Fetch articles for the selected category ID
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
            <section className="relative w-full flex justify-center items-center bg-white mb-20 min-h-[300px] mt-[-250px] animate-fade-in">
              <div className="w-[1200px] h-[200px] bg-[#75CCD1] rounded-[20px] flex items-center shadow-md pl-12 pt-6 transform transition-all duration-500 hover:shadow-lg">
                <h2 className="text-4xl font-bold text-white text-left leading-tight animate-slide-up">
                  Jelajahi <br /> berbagai <span className="text-[#005A79]">Edukasi kesehatan</span>
                </h2>
              </div>
            </section>

            <h2 className="-mt-17 text-3xl font-semibold text-[#2A8F9E] text-center animate-slide-up">
              Apa yang ingin <span className="text-[#005A79]">dibaca?</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-6 mt-10">
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
                    className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 border-b border-gray-200 pb-6 cursor-pointer hover:bg-gray-50 transition-all duration-300 p-4 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/article/${article.id}`)}
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
                      <p className="text-xs text-[#2A8F9E] mt-3 font-medium transform transition-transform duration-200 hover:translate-x-1">
                        Klik untuk baca selengkapnya →
                      </p>
                    </div>
                    <div className="w-full md:w-2/5">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-auto object-cover rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                        onError={(e) => (e.target.src = Clean)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 animate-slide-up">Tidak ada artikel yang ditemukan untuk kategori ini.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default EdukasiKesehatan;