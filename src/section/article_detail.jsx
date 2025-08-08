import Layout from '../components/user/layout';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api-uks.rplrus.com/api/articles/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setArticle(data.data);
        } else {
          setError(data.message || 'Article not found');
        }
      })
      .catch(error => {
        console.error('Error fetching article:', error);
        setError('Error fetching article. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const renderSafeHTML = (htmlContent) => {
    if (!htmlContent) return '';
    
    return DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br'],
      ALLOWED_ATTR: []
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <main className="w-full px-4 md:px-20 py-10 bg-white min-h-screen">
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p className="text-gray-500 mt-4">Memuat artikel...</p>
          </div>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="w-full px-4 md:px-20 py-10 bg-white min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-[#2A8F9E] text-white rounded-lg hover:bg-[#1C4245] transition-colors"
            >
              Kembali
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <main className="w-full px-4 md:px-20 py-10 bg-white min-h-screen">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Artikel tidak ditemukan</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-[#2A8F9E] text-white rounded-lg hover:bg-[#1C4245] transition-colors"
            >
              Kembali
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="w-full px-4 md:px-20 py-10 bg-white min-h-screen">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2A8F9E] hover:text-[#1C4245] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-[#1C4245] mb-4 leading-tight">
              {article.title}
            </h1>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              {article.created_at && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(article.created_at)}
                </span>
              )}
              
              {article.category && (
                <span className="px-3 py-1 bg-[#2A8F9E] text-white text-xs rounded-full">
                  {article.category.title || 'Kategori'}
                </span>
              )}
            </div>

            {/* Featured Image */}
            {article.image && (
              <div className="mb-8">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-auto max-h-96 object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </header>

          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none
                       prose-p:text-[#1C4245] prose-p:leading-relaxed
                       prose-strong:text-[#1C4245] prose-strong:font-semibold
                       prose-em:text-[#1C4245] 
                       prose-blockquote:text-[#1C4245] prose-blockquote:border-l-4 
                       prose-blockquote:border-[#2A8F9E] prose-blockquote:pl-6
                       prose-blockquote:italic prose-blockquote:bg-gray-50 prose-blockquote:py-4
                       prose-ul:text-[#1C4245] prose-ol:text-[#1C4245]
                       prose-li:text-[#1C4245] prose-li:leading-relaxed
                       prose-h1:text-[#1C4245] prose-h1:text-2xl prose-h1:font-bold
                       prose-h2:text-[#1C4245] prose-h2:text-xl prose-h2:font-semibold
                       prose-h3:text-[#1C4245] prose-h3:text-lg prose-h3:font-medium
                       prose-headings:mb-4 prose-headings:mt-8
                       prose-p:mb-4"
            dangerouslySetInnerHTML={{ 
              __html: renderSafeHTML(article.description) 
            }}
          />

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-center">
              <button 
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-[#2A8F9E] text-white rounded-lg hover:bg-[#1C4245] transition-colors font-medium"
              >
                Kembali ke Daftar Artikel
              </button>
            </div>
          </footer>
        </article>
      </main>
    </Layout>
  );
}

export default ArticleDetail;