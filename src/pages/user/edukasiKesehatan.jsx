import Layout from '../../components/user/layout';
import { Link, useParams, useNavigate } from 'react-router-dom';
import UKS2Img from '../../assets/img/uks2.png';
import Clean from '../../assets/img/cleaannn.png';
import { useState, useEffect, useRef } from 'react';
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
  const [categoryColors, setCategoryColors] = useState({});
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Function to extract dominant color from image
  const extractDominantColor = (imageUrl, categoryId) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let r = 0, g = 0, b = 0;
          let pixelCount = 0;
          
          // Sample pixels to get average color
          for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel for performance
            if (data[i + 3] > 200) { // Only count opaque pixels
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              pixelCount++;
            }
          }
          
          if (pixelCount > 0) {
            r = Math.floor(r / pixelCount);
            g = Math.floor(g / pixelCount);
            b = Math.floor(b / pixelCount);
            
            // Convert to pastel by mixing with white
            const pastelR = Math.floor((r + 255 * 2) / 3);
            const pastelG = Math.floor((g + 255 * 2) / 3);
            const pastelB = Math.floor((b + 255 * 2) / 3);
            
            const pastelColor = `rgb(${pastelR}, ${pastelG}, ${pastelB})`;
            const darkColor = `rgb(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.8)}, ${Math.floor(b * 0.8)})`;
            
            resolve({ light: pastelColor, dark: darkColor });
          } else {
            // Fallback pastel colors
            const fallbackColors = [
              { light: 'rgb(255, 228, 230)', dark: 'rgba(231, 120, 173, 1)' }, // Pink
              { light: 'rgb(219, 234, 254)', dark: 'rgb(59, 130, 246)' }, // Blue
              { light: 'rgb(220, 252, 231)', dark: 'rgb(16, 185, 129)' },  // Green
              { light: 'rgb(254, 235, 200)', dark: 'rgb(245, 158, 11)' },  // Orange
              { light: 'rgb(237, 233, 254)', dark: 'rgb(139, 92, 246)' }, // Purple
              { light: 'rgb(254, 252, 232)', dark: 'rgb(251, 191, 36)' }   // Yellow
            ];
            resolve(fallbackColors[categoryId % fallbackColors.length]);
          }
        } catch (error) {
          // Fallback if canvas fails
          const fallbackColors = [
            { light: 'rgb(255, 228, 230)', dark: 'rgb(220, 38, 127)' },
            { light: 'rgb(219, 234, 254)', dark: 'rgb(59, 130, 246)' },
            { light: 'rgb(220, 252, 231)', dark: 'rgb(16, 185, 129)' },
            { light: 'rgb(254, 235, 200)', dark: 'rgb(245, 158, 11)' },
            { light: 'rgb(237, 233, 254)', dark: 'rgb(139, 92, 246)' },
            { light: 'rgb(254, 252, 232)', dark: 'rgb(251, 191, 36)' }
          ];
          resolve(fallbackColors[categoryId % fallbackColors.length]);
        }
      };
      
      img.onerror = () => {
        // Fallback colors if image fails to load
        const fallbackColors = [
          { light: 'rgb(255, 228, 230)', dark: 'rgb(220, 38, 127)' },
          { light: 'rgb(219, 234, 254)', dark: 'rgb(59, 130, 246)' },
          { light: 'rgb(220, 252, 231)', dark: 'rgb(16, 185, 129)' },
          { light: 'rgb(254, 235, 200)', dark: 'rgb(245, 158, 11)' },
          { light: 'rgb(237, 233, 254)', dark: 'rgb(139, 92, 246)' },
          { light: 'rgb(254, 252, 232)', dark: 'rgb(251, 191, 36)' }
        ];
        resolve(fallbackColors[categoryId % fallbackColors.length]);
      };
      
      img.src = imageUrl;
    });
  };

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
          
          // Extract colors for each category
          const colorPromises = data.data.map(async (category) => {
            const colors = await extractDominantColor(category.image || Clean, category.id);
            return { id: category.id, colors };
          });
          
          Promise.all(colorPromises).then(colorResults => {
            const colorMap = {};
            colorResults.forEach(({ id, colors }) => {
              colorMap[id] = colors;
            });
            setCategoryColors(colorMap);
          });
          
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
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          .container {
            min-height: 100vh;
            padding: 20px;
          }
          
          .hero-card {
            background: linear-gradient(135deg, #1eb1aaff 0%, #92d9d8ff 100%);
            border-radius: 24px;
            padding: 40px 32px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .hero-title {
            font-size: 48px;
            font-weight: 700;
            color: white;
            line-height: 1.1;
            margin: 0;
          }
          
          .hero-icon {
            position: absolute;
            right: 32px;
            top: 50%;
            transform: translateY(-50%);
            width: 120px;
            height: 120px;
            z-index: 2;
          }
          
          .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .category-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            border: 2px solid #e5e7eb;
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          
          .category-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-color: #3b82f6;
          }
          
          .category-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 16px;
            object-fit: contain;
          }
          
          .category-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            text-transform: capitalize;
          }
          
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
            border: none;
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
          
          @media (max-width: 768px) {
            .hero-title {
              font-size: 32px;
            }
            .hero-icon {
              width: 80px;
              height: 80px;
              right: 20px;
            }
            .hero-card {
              padding: 24px 20px;
            }
            .categories-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
            .category-card {
              height: 160px;
              padding: 16px;
            }
            .category-icon {
              width: 60px;
              height: 60px;
            }
            .category-title {
              font-size: 14px;
            }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .categories-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          @media (min-width: 1025px) {
            .categories-grid {
              grid-template-columns: repeat(5, 1fr);
            }
          }
        `}
      </style>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p style={{ color: '#6b7280', marginTop: '1rem' }}>Memuat...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: '1rem' }}>
            <p>{error}</p>
          </div>
        ) : !categoryId ? (
          <>
            {/* Hero Section */}
            <div className="hero-card">
              <h1 className="hero-title">
                Jelajahi edukasi<br />
                kesehatan
              </h1>
            </div>

            {/* Categories Grid */}
            <div className="categories-grid">
              {categories.map((category, index) => {
                const colors = categoryColors[category.id] || { light: 'rgb(255, 228, 230)', dark: 'rgb(220, 38, 127)' };
                return (
                  <Link key={category.id} to={`/edukasi-kesehatan/${category.id}`} style={{ textDecoration: 'none' }}>
                    <div 
                      className="category-card"
                      style={{ 
                        backgroundColor: colors.light,
                        borderColor: colors.dark 
                      }}
                    >
                      <img 
                        src={category.image || Clean} 
                        alt={category.title}
                        className="category-icon"
                        onError={(e) => (e.target.src = Clean)}
                      />
                      <h3 
                        className="category-title"
                        style={{ color: colors.dark }}
                      >
                        {category.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          // Article list view (existing code for when categoryId exists)
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
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

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <img
                src={categoryIcon}
                alt={`${categoryTitle} Icon`}
                style={{ width: '160px', height: '160px', margin: '0 auto 1rem', objectFit: 'contain' }}
              />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2A8F9E', margin: 0 }}>
                Artikel tentang <span style={{ color: '#2A8F9E' }}>{categoryTitle}</span>
              </h2>
              <hr style={{ marginTop: '1rem', border: 'none', borderTop: '1px solid #e5e7eb', width: '75%', margin: '1rem auto' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <div
                    key={article.id}
                    style={{ 
                      display: 'flex', 
                      gap: '1.5rem', 
                      borderBottom: '1px solid #e5e7eb', 
                      paddingBottom: '1.5rem',
                      cursor: 'pointer',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ flex: '3', paddingLeft: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1C4245', marginBottom: '0.5rem' }}>
                        {article.title}
                      </h3>
                      <div 
                        style={{ fontSize: '0.875rem', color: '#1C4245', marginBottom: '1rem' }}
                        dangerouslySetInnerHTML={{ 
                          __html: createExcerpt(article.description, 300) 
                        }}
                      />
                      <p 
                        style={{ fontSize: '0.75rem', color: '#2A8F9E', fontWeight: '500', cursor: 'pointer' }}
                        onClick={() => navigate(`/edukasi-kesehatan/${categoryId}/${article.id}`)}
                      >
                        Klik untuk baca selengkapnya →
                      </p>
                    </div>
                    <div style={{ flex: '2' }}>
                      <img
                        src={article.image}
                        alt={article.title}
                        style={{ 
                          width: '100%', 
                          height: 'auto', 
                          objectFit: 'cover', 
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        onError={(e) => (e.target.src = Clean)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    Tidak ada artikel yang ditemukan untuk kategori ini. Anda akan diarahkan kembali dalam 5 detik...
                  </p>
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
          </div>
        )}

        {/* Modal for article details */}
        {isModalOpen && selectedArticle && (
          <div className="modal">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button 
                  onClick={() => navigate('/edukasikesehatan')} 
                  className="back-button"
                  style={{ marginBottom: '1rem' }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2A8F9E', marginBottom: '0.5rem' }}>
                  Artikel tentang <span style={{ color: '#2A8F9E' }}>{categoryTitle}</span>
                </h2>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#2A8F9E', marginBottom: '0.5rem' }}>
                  {selectedArticle.title}
                </h3>
                <div
                  style={{ fontSize: '0.875rem', color: '#1C4245', marginBottom: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: selectedArticle.description }}
                />
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="responsive-image"
                  onError={(e) => (e.target.src = Clean)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EdukasiKesehatan;