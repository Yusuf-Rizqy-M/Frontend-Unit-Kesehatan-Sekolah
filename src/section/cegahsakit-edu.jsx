import Layout from '../components/user/layout';
import Shieldy from '../assets/img/shieldy2.png';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

function CegahSakit() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState('Pencegahan Penyakit'); // Default title
  const [categoryIcon, setCategoryIcon] = useState(Shieldy); // Default icon
  const { category } = useParams(); // Get category from URL (e.g., "pencegahan-penyakit")
  const navigate = useNavigate();

  // Function to create a safe HTML excerpt from description
  const createExcerpt = (htmlContent, maxLength = 300) => {
    if (!htmlContent) return '';
    
    // Sanitize the HTML content
    const cleanHTML = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br'],
      ALLOWED_ATTR: []
    });
    
    // Remove HTML tags for length calculation
    const textContent = cleanHTML.replace(/<[^>]*>/g, '');
    
    if (textContent.length <= maxLength) {
      return cleanHTML;
    }
    
    // Truncate and add ellipsis, preserving HTML structure
    const truncatedText = textContent.substring(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    const finalText = lastSpaceIndex > 0 ? truncatedText.substring(0, lastSpaceIndex) : truncatedText;
    
    return DOMPurify.sanitize(`<p>${finalText}...</p>`);
  };

  useEffect(() => {
    // Map URL category to API-friendly format
    const formattedCategory = category?.replace(/\s+/g, '-').toLowerCase() || 'pencegahan-penyakit';

    // Fetch categories to get ID and metadata
    fetch('https://api-uks.rplrus.com/api/categories')
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          const matchedCategory = data.data.find(
            cat => cat.title.replace(/\s+/g, '-').toLowerCase() === formattedCategory
          );
          if (matchedCategory) {
            setCategoryTitle(matchedCategory.title); // Set display title
            setCategoryIcon(matchedCategory.image || Shieldy); // Set category icon

            // Fetch articles for the category
            fetch(`https://api-uks.rplrus.com/api/categories/${matchedCategory.id}/articles`)
              .then(response => response.json())
              .then(articleData => {
                if (articleData.status) {
                  setArticles(articleData.data); // Store articles
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
          setError('Failed to load categories');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories. Please try again later.');
        setLoading(false);
      });
  }, [category]);

  console.log("CegahSakit component rendered");

  return (
    <Layout>
      <main>
        <section className="w-full px-4 md:px-20 py-5 bg-white">
          {/* Section Title */}
          <div className="text-center mb-12">
            <img
              src={categoryIcon}
              alt={`${categoryTitle} Icon`}
              className="mx-auto w-40 h-40 mb-2"
            />
            <h2 className="text-xl md:text-2xl font-semibold text-[#2A8F9E]">
              Artikel tentang <span className="text-[#2A8F9E]">{categoryTitle}</span>
            </h2>
            <hr className="mt-2 border-t border-gray-200 w-3/4 mx-auto" />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
              <div className="double-spinner">
                <div className="spinner-ring outer"></div>
                <div className="spinner-ring inner"></div>
              </div>
              <p className="text-gray-500 mt-4">Memuat...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {/* Articles */}
          {!loading && !error && (
            <div className="space-y-12">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 border-b border-gray-200 pb-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-4 rounded-lg"
                    onClick={() => navigate(`/article/${article.id}`)}
                  >
                    {/* Text */}
                    <div className="w-full md:w-3/5 text-left pl-4 md:pl-6">
                      <h3 className="text-base md:text-lg font-semibold text-[#1C4245] mb-2 hover:text-[#2A8F9E] transition-colors">
                        {article.title}
                      </h3>
                      <div 
                        className="text-sm text-[#1C4245] prose prose-sm max-w-none
                                   prose-p:text-[#1C4245] prose-strong:text-[#1C4245] 
                                   prose-em:text-[#1C4245] prose-blockquote:text-[#1C4245]
                                   prose-blockquote:border-l-[#2A8F9E] prose-blockquote:pl-4
                                   prose-ul:text-[#1C4245] prose-ol:text-[#1C4245]
                                   prose-li:text-[#1C4245] prose-h1:text-[#1C4245]
                                   prose-h2:text-[#1C4245] prose-h3:text-[#1C4245]
                                   prose-h4:text-[#1C4245] prose-h5:text-[#1C4245]
                                   prose-h6:text-[#1C4245]"
                        dangerouslySetInnerHTML={{ 
                          __html: createExcerpt(article.description, 300) 
                        }}
                      />
                      <p className="text-xs text-[#2A8F9E] mt-3 font-medium">
                        Klik untuk baca selengkapnya →
                      </p>
                    </div>

                    {/* Image */}
                    <div className="w-full md:w-2/5">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-auto object-cover rounded-xl shadow-sm p-20px hover:shadow-md transition-shadow duration-200"
                        onError={(e) => (e.target.src = Shieldy)} // Fallback image
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Tidak ada artikel yang ditemukan untuk kategori ini.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}

export default CegahSakit;