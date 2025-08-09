import Layout from '../../components/user/layout';
import { useParams, useNavigate } from 'react-router-dom';
import UKS2Img from '../../assets/img/uks2.png';
import Clean from '../../assets/img/cleaannn.png';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId, articleId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Artikel Detail';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api-uks.rplrus.com/api/categories/${categoryId}/article/${articleId}`);
        const data = await response.json();
        if (data.status) {
          setArticle(data.data);
        } else {
          setError(data.message || 'Failed to load article');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Error fetching article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [categoryId, articleId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
          <div className="double-spinner">
            <div className="spinner-ring outer"></div>
            <div className="spinner-ring inner"></div>
          </div>
          <p className="text-gray-500 mt-4 animate-pulse">Memuat...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500 animate-slide-up mb-6">{error}</p>
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
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center animate-slide-up">
          <p className="text-gray-500 mb-6">Artikel tidak ditemukan.</p>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <style>
        {`
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
            font-size: 0.95rem;
          }
          .back-button:hover {
            background: #005A79;
            transform: translateX(-4px);
          }
          .back-button svg {
            width: 1.25rem;
            height: 1.25rem;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .article-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
          }
          
          .article-content {
            padding: 2rem;
          }
          
          .article-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .article-title {
            color: #2A8F9E;
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
            line-height: 1.3;
            word-wrap: break-word;
            hyphens: auto;
            padding: 0 1rem;
          }
          
          .article-subtitle {
            color: #666;
            font-size: 1.1rem;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          

          
          .article-image-container {
            margin-bottom: 2rem;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #ffffffff;
          }
          
          .article-image {
            width: 70%;
            max-width: 300px;
            height: auto;
            border-radius: 20px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
          }
          
          .article-text {
            color: #0a414aff;
            font-size: 1.1rem;
            line-height: 1.8;
            text-align: justify;
          }
          
          .article-text p {
            margin-bottom: 1.5rem;
          }
          
          .article-text h1, .article-text h2, .article-text h3 {
            color: #2A8F9E;
            margin: 2rem 0 1rem 0;
            font-weight: 600;
          }
          
          .article-text ul, .article-text ol {
            margin: 1rem 0;
            padding-left: 2rem;
          }
          
          .article-text li {
            margin-bottom: 0.5rem;
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
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .container {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
            
            .article-content {
              padding: 1.5rem 1rem;
            }
            
            .article-title {
              font-size: 1.75rem;
            }
            
            .article-subtitle {
              font-size: 1rem;
            }
            
            .article-image {
              width: 85%;
              max-width: none;
            }
            
            .article-text {
              font-size: 1rem;
              line-height: 1.7;
            }
            
            .back-button {
              padding: 0.5rem 1rem;
              font-size: 0.9rem;
            }
          }
          
          @media (max-width: 480px) {
            .article-title {
              font-size: 1.5rem;
              padding: 0 0.5rem;
            }
            
            .article-content {
              padding: 1rem 0.75rem;
            }
          }
        `}
      </style>
      
      <div className="container">
        <div className="py-6">
          <button 
            onClick={() => navigate(`/edukasi-kesehatan/${categoryId}`)} 
            className="back-button animate-fade-in"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Artikel
          </button>
        </div>
        
        <main className="animate-fade-in pb-8">
          <div className="article-container">
            <div className="article-content">
              <div className="article-header">
                <h1 className="article-title">{article.title}</h1>
              </div>
              
              <div className="article-image-container">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                  onError={(e) => (e.target.src = Clean)}
                />
              </div>
              
              <div
                className="article-text"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.description) }}
              />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default ArticleDetail;