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
        <p className="text-center text-red-500 animate-slide-up">{error}</p>
        <button 
          onClick={() => navigate('/edukasikesehatan')} 
          className="back-button mt-4"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Edukasi Kesehatan
        </button>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="text-center animate-slide-up">
          <p className="text-gray-500 mb-4">Artikel tidak ditemukan.</p>
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
            margin-left: 20px;
          }
          .back-button:hover {
            background: #005A79;
            transform: translateX(-4px);
          }
          .back-button svg {
            width: 1.25rem;
            height: 1.25rem;
          }
          .article-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 20px;
          }
          .article-header {
            text-align: center;
            margin-bottom: 1.5rem;
          }
          .article-title {
            color: #2A8F9E;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          .article-subtitle {
            color: #666;
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          .article-image {
            width: 100%;
            height: auto;
            object-fit: cover;
            margin-bottom: 1.5rem;
            border-radius: 8px;
          }
          .article-text {
            color: #333;
            font-size: 1rem;
            line-height: 1.6;
            text-align: justify;
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
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
        `}
      </style>
      <main className="animate-fade-in">
        <div className="flex items-center justify-start mb-8">
          <button 
            onClick={() => navigate(`/edukasi-kesehatan/${categoryId}`)} 
            className="back-button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Artikel
          </button>
        </div>
        <div className="article-content">
          <div className="article-header">
            <h1 className="article-title">{article.title}</h1>
            <p className="article-subtitle">
              Our Health Haven is equipped with essential medical facilities to ensure students receive the best care in a safe and comfortable environment.
            </p>
          </div>
          <img
            src={article.image}
            alt={article.title}
            className="article-image"
            onError={(e) => (e.target.src = Clean)}
          />
          <div
            className="article-text"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.description) }}
          />
        </div>
      </main>
    </Layout>
  );
}

export default ArticleDetail;