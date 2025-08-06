import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { FaChevronRight, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import DOMPurify from "dompurify";

// Utility function to sanitize HTML content
const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
};

// Utility function to truncate text to a specified word count
const truncateText = (text, maxWords) => {
  if (!text) return "";
  const plainText = text.replace(/<[^>]+>/g, "");
  const words = plainText.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  const truncated = words.slice(0, maxWords).join(" ");
  return `${truncated}...`;
};

// Modal component for viewing article details
const ArticleDetailModal = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{article.title}</h3>
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover rounded mb-4"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        )}
        <div
          className="text-gray-700 dark:text-gray-200 mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.description) }}
        />
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

ArticleDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  article: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
};

// Modal component for editing article
const ArticleEditModal = ({ isOpen, onClose, article, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    category_id: "",
    _method: "PUT",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        description: article.description || "",
        image: null,
        category_id: article.category_id || "",
        _method: "PUT",
      });
      setPreviewImage(article.image || null);
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("_method", "PUT");

      const response = await fetch(`https://api-uks.rplrus.com/api/articles/${article.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update article");
      }

      if (data.status) {
        onSave({
          id: data.data.id,
          title: data.data.title,
          description: data.data.description,
          image: data.data.image,
          category_id: data.data.category_id,
          status: data.data.status,
          created_at: data.data.created_at,
          updated_at: data.data.updated_at,
        });
        onClose();
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert(error.message || "Failed to update article. Please try again.");
    }
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Article</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ArticleEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  article: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    category_id: PropTypes.number,
  }),
  onSave: PropTypes.func.isRequired,
};

// SearchBar component
const SearchBar = ({ searchQuery, onSearchChange, onAddClick, categories, categoryId, onCategoryChange }) => (
  <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-[#9BC7B6] dark:bg-[#051D4E]">
    <div className="relative flex-1 min-w-0">
      <span className="absolute inset-y-0 left-3 flex items-center text-[#6D9C9D] dark:text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </span>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={onSearchChange}
        onKeyPress={(e) => e.key === "Enter" && onSearchChange(e)}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-white placeholder-[#6D9C9D] dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
    <select
      className="border p-2 bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      value={categoryId}
      onChange={(e) => onCategoryChange(e.target.value)}
    >
      <option value="">Select Category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.title}
        </option>
      ))}
    </select>
    <button
      onClick={onAddClick}
      className="flex items-center justify-center gap-2 w-[150px] px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <span className="text-sm font-medium">Tambahkan</span>
      <FaPlus className="w-4 h-4" />
    </button>
  </div>
);

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

// ArticleTable component
const ArticleTable = ({ articles, onView, onEdit, onDelete }) => (
  <table className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
    <thead>
      <tr className="text-left text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
        <th className="py-3 px-4 font-medium">No</th>
        <th className="py-3 px-4 font-medium">Name</th>
        <th className="py-3 px-4 font-medium">Gambar</th>
        <th className="py-3 px-4 font-medium">Deskripsi</th>
        <th className="py-3 px-4 font-medium text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {articles.length === 0 ? (
        <tr className="border-b border-gray-100 dark:border-gray-700">
          <td className="py-3 px-4 text-center text-black dark:text-gray-200" colSpan="5">
            Tidak ada artikel yang ditemukan.
          </td>
        </tr>
      ) : (
        articles.map((article) => (
          <tr
            key={article.id}
            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{article.id}</td>
            <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{article.title}</td>
            <td className="py-3 px-4">
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/64";
                  }}
                />
              ) : (
                <span className="text-gray-500 dark:text-gray-400">No Image</span>
              )}
            </td>
            <td
              className="py-3 px-4 text-gray-700 dark:text-gray-200 italic"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(truncateText(article.description, 25)) }}
            />
            <td className="py-3 px-4 text-center">
              <button
                className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 mr-2 focus:outline-none"
                onClick={() => onView(article)}
                aria-label={`View article ${article.title}`}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
              <button
                className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 mr-2 focus:outline-none"
                onClick={() => onEdit(article)}
                aria-label={`Edit article ${article.title}`}
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none"
                onClick={() => onDelete(article.id)}
                aria-label={`Delete article ${article.title}`}
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

ArticleTable.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      jurusan: PropTypes.string,
      image: PropTypes.string,
    })
  ).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange, filteredArticles, indexOfFirstItem, itemsPerPage }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-between items-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
      <span>
        Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfFirstItem + itemsPerPage, filteredArticles.length)} of {filteredArticles.length}
      </span>
      <div className="flex space-x-1">
        <button
          className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none ${
              currentPage === pageNumber ? "bg-teal-500 dark:bg-teal-600 text-white" : ""
            }`}
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Go to page ${pageNumber}`}
          >
            {pageNumber}
          </button>
        ))}
        {totalPages > 3 && currentPage < totalPages - 1 && (
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none">
            ...
          </button>
        )}
        {totalPages > 3 && currentPage < totalPages && (
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
            onClick={() => onPageChange(totalPages)}
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </button>
        )}
        <button
          className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  filteredArticles: PropTypes.array.isRequired,
  indexOfFirstItem: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
};

const Article = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchArticles();
    }
  }, [categoryId]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api-uks.rplrus.com/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      if (data.status) {
        setCategories(data.data);
        if (!categoryId && data.data.length > 0) {
          setCategoryId(data.data[0].id);
        }
      } else {
        throw new Error(data.message || "Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api-uks.rplrus.com/api/categories/${categoryId}/articles`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      if (data.status) {
        setArticles(
          data.data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            jurusan: item.jurusan || "N/A",
            image: item.image || "",
            category_id: item.category_id,
          }))
        );
      } else {
        throw new Error(data.message || "Error fetching articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (article) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api-uks.rplrus.com/api/categories/${categoryId}/article/${article.id}`);
      if (!response.ok) throw new Error("Failed to fetch article details");
      const data = await response.json();
      if (data.status) {
        setSelectedArticle(data.data);
        setIsDetailModalOpen(true);
      } else {
        throw new Error(data.message || "Error fetching article details");
      }
    } catch (error) {
      console.error("Error fetching article details:", error);
      setError("Failed to load article details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (article) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`https://api-uks.rplrus.com/api/categories/${categoryId}/article/${article.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch article details");
      }

      const data = await response.json();

      if (data.status) {
        setSelectedArticle(data.data);
        setIsEditModalOpen(true);
      } else {
        throw new Error(data.message || "Error fetching article details");
      }
    } catch (error) {
      console.error("Error fetching article details:", error);
      setError("Failed to load article details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = (updatedArticle) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === updatedArticle.id ? { ...article, ...updatedArticle } : article
      )
    );
  };

  const handleDeleteConfirm = (articleId) => {
    setDeleteId(articleId);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`https://api-uks.rplrus.com/api/articles/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Article not found. It may have been already deleted.");
        }
        throw new Error("Failed to deactivate article");
      }

      const data = await response.json();

      if (data.status) {
        setArticles(articles.filter((article) => article.id !== deleteId));
        setIsConfirmModalOpen(false);
      } else {
        throw new Error(data.message || "Deactivation failed");
      }
    } catch (error) {
      console.error("Error deactivating article:", error);
      setError(error.message || "Failed to deactivate article. Please try again.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);

    if (query) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api-uks.rplrus.com/api/categories/${categoryId}/article/1/summary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search: query }),
        });
        if (!response.ok) throw new Error("Failed to search articles");
        const data = await response.json();
        if (data.status) {
          setArticles([
            {
              id: data.data.id,
              title: data.data.title,
              description: data.data.description,
              jurusan: data.data.jurusan || "N/A",
              image: data.data.image || "",
              category_id: data.data.category_id,
            },
          ]);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Error searching articles:", error);
        setError("Failed to search articles. Please try again.");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    } else {
      fetchArticles();
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleAddClick = () => {
    navigate("/uploadblog");
  };

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
    setCurrentPage(1);
    setSearchQuery("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} toggleDarkMode={toggleDarkMode} />
        <main className="grow p-6">
          <div className="w-full max-w-7xl mx-auto relative">
            <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-6">Articles</h2>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              onAddClick={handleAddClick}
              categories={categories}
              categoryId={categoryId}
              onCategoryChange={handleCategoryChange}
            />
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="animate-spin h-8 w-8 mx-auto text-teal-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              <>
                <ArticleTable
                  articles={currentArticles}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                />
                {filteredArticles.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    filteredArticles={filteredArticles}
                    indexOfFirstItem={indexOfFirstItem}
                    itemsPerPage={itemsPerPage}
                  />
                )}
                <ArticleDetailModal
                  isOpen={isDetailModalOpen}
                  onClose={() => setIsDetailModalOpen(false)}
                  article={selectedArticle}
                />
                <ArticleEditModal
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  article={selectedArticle}
                  onSave={handleSaveEdit}
                />
                {isConfirmModalOpen && (
                  <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
                      <div className="p-6 text-center">
                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                          Yakin ingin Menghapus Artikel?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Fitur ini digunakan untuk menghapus artikel dari sistem secara aman. Seluruh data artikel akan dihapus. Pastikan untuk menyimpan progres Anda sebelum menghapus artikel.
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                            onClick={() => setIsConfirmModalOpen(false)}
                            aria-label="Batal menghapus artikel"
                          >
                            Batal
                          </button>
                          <button
                            className="px-6 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                            onClick={handleDelete}
                            aria-label="Lanjutkan menghapus artikel"
                          >
                            Lanjut Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Article;