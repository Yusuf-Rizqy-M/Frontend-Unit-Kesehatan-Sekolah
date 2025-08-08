import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import DOMPurify from "dompurify";

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, 
    { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [], 
    });
};


const SearchBar = ({
  searchQuery,
  onSearchChange,
  categories,
  categoryId,
  onCategoryChange,
}) => (
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
      <option value="all">All Categories</option>
      {categories.length > 0 ? (
        categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))
      ) : (
        <option disabled>No categories available</option>
      )}
    </select>
  </div>
);

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

// ArticleTable component
const ArticleTable = ({
  articles,
  indexOfFirstItem,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto">
    <table
      className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm rounded-[10px]"
      role="grid"
    >
      <thead>
        <tr className="text-left text-gray-500 dark:text-gray-300">
          <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">
            No
          </th>
          <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">
            Name
          </th>
          <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">
            Gambar
          </th>
          <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">
            Deskripsi
          </th>
          <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {articles.length === 0 ? (
          <tr className="border-b border-gray-100 dark:border-gray-700">
            <td
              className="py-3 px-4 text-center text-gray-700 dark:text-gray-200"
              colSpan="5"
            >
              Tidak ada artikel yang ditemukan.
            </td>
          </tr>
        ) : (
          articles.map((article, index) => (
            <tr
              key={article.id}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                {indexOfFirstItem + index + 1}
              </td>
              <td
                className="py-3 px-4 text-gray-700 dark:text-gray-200"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(
                    article.title.length > 60
                      ? `${article.title.substring(0, 60)}....`
                      : article.title
                  ),
                }}
              />
              <td className="py-3 px-4 text-center">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-6 object-contain inline-block"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    No Image
                  </span>
                )}
              </td>
              <td
                className="py-3 px-4 text-gray-700 dark:text-gray-200 italic"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(
                    article.description.length > 60
                      ? `${article.description.substring(0, 60)}....`
                      : article.description
                  ),
                }}
              />
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => onView(article)}
                    aria-label={`Lihat detail artikel ${article.title}`}
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    className="text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                    onClick={() => onEdit(article)}
                    aria-label={`Edit artikel ${article.title}`}
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                    onClick={() => onDelete(article.id)}
                    aria-label={`Hapus artikel ${article.title}`}
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

ArticleTable.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ).isRequired,
  indexOfFirstItem: PropTypes.number.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  filteredArticles,
  indexOfFirstItem,
  itemsPerPage,
}) => {
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
        {Math.min(indexOfFirstItem + itemsPerPage, filteredArticles.length)} of{" "}
        {filteredArticles.length}
      </span>
      <div className="flex space-x-1">
        <button
          className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none ${
              currentPage === pageNumber
                ? "bg-teal-500 dark:bg-teal-600 text-white"
                : ""
            }`}
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Pindah ke halaman ${pageNumber}`}
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
            aria-label={`Pindah ke halaman ${totalPages}`}
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
          aria-label="Halaman berikutnya"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState({
    id: null,
    title: "",
    description: "",
    image: null,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const API_URL = "https://api-uks.rplrus.com/api";

  // Toast notification effect
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        showToastMessage("No authentication token found. Please log in.", "error");
        return;
      }
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      if (data.status) {
        setCategories(data.data);
        setCategoryId("all"); // Default to "All Categories"
      } else {
        throw new Error(data.message || "Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
      setCategories([]);
      showToastMessage("Error fetching categories.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchArticles();
    }
  }, [categoryId]);

  const fetchArticles = async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        showToastMessage("No authentication token found. Please log in.", "error");
        return;
      }
      
      let allArticles = [];
      
      if (categoryId === "all") {
        // Fetch articles from all categories
        for (const category of categories) {
          try {
            const response = await fetch(`${API_URL}/categories/${category.id}/articles`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              if (data.status && Array.isArray(data.data)) {
                allArticles = [...allArticles, ...data.data];
              }
            }
          } catch (error) {
            console.warn(`Failed to fetch articles from category ${category.id}:`, error);
          }
        }
      } else {
        // Fetch articles from specific category
        const response = await fetch(`${API_URL}/categories/${categoryId}/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch articles");
        const data = await response.json();
        if (data.status) {
          allArticles = data.data;
        } else {
          throw new Error(data.message || "Error fetching articles");
        }
      }

      setArticles(
        allArticles.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image || "",
          category_id: item.category_id,
        }))
      );
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
      showToastMessage("Error fetching articles. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      showToastMessage("No authentication token found. Please log in.", "error");
      setIsConfirmModalOpen(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/articles/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Article not found. It may have been already deleted."
          );
        }
        throw new Error("Failed to deactivate article");
      }

      const data = await response.json();
      if (data.status) {
        setArticles(articles.filter((article) => article.id !== deleteId));
        setIsConfirmModalOpen(false);
        showToastMessage("Artikel berhasil dihapus", "success");
      } else {
        throw new Error(data.message || "Deactivation failed");
      }
    } catch (error) {
      console.error("Error deactivating article:", error);
      setError(
        error.message || "Failed to deactivate article. Please try again."
      );
      showToastMessage("Error deleting article. Please try again.", "error");
    } finally {
      setDeleteId(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleEdit = (article) => {
    const sanitizedTitle = sanitizeHTML(article.title);
    const sanitizedDescription = sanitizeHTML(article.description);
    console.log("sanitized Title:" , sanitizedTitle);
    console.log("sanitized desc:", sanitizedDescription);
    setEditArticle({
      id: article.id,
      title: sanitizedTitle,
      description: sanitizedDescription,
      image: null,
    });
    setIsEditModalOpen(true);
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditArticle({ id: null, title: "", description: "", image: null });
    setError(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setEditArticle({ ...editArticle, [name]: files[0] });
    } else {
      setEditArticle({ ...editArticle, [name]: sanitizeHTML(value) });
    }
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      showToastMessage("No authentication token found. Please log in.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", editArticle.title);
    formData.append("description", editArticle.description);
    if (editArticle.image) {
      formData.append("image", editArticle.image);
    }
    formData.append("_method", "PUT");

    try {
      const response = await fetch(`${API_URL}/articles/${editArticle.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update article");
      }

      const data = await response.json();
      if (data.status) {
        setArticles(
          articles.map((art) =>
            art.id === editArticle.id
              ? {
                  ...art,
                  title: editArticle.title,
                  description: editArticle.description,
                  image: data.data.image || art.image,
                }
              : art
          )
        );
        closeEditModal();
        showToastMessage("Artikel berhasil diedit", "success");
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating article:", err);
      setError(err.message || "Error updating article. Please try again.");
      showToastMessage("Error updating article. Please try again.", "error");
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);

    if (!query.trim()) {
      // If search is empty, fetch all articles for current category
      fetchArticles();
      return;
    }

    // For search, we'll filter locally instead of using the API endpoint that's causing issues
    const filteredResults = articles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );

    // If we don't have articles loaded yet, try to fetch them first
    if (articles.length === 0) {
      await fetchArticles();
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
  const currentArticles = filteredArticles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="grow p-6">
          <div className="w-full max-w-7xl mx-auto">
            {/* Toast Notification */}
            {showToast && (
              <div
                className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${
                  toastType === "success"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                } px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50`}
              >
                <div
                  className={`rounded-full p-1 ${
                    toastType === "success" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {toastType === "success" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-sm">{toastMessage}</span>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold">
                Articles
              </h2>
              <button
                className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
                onClick={handleAddClick}
                aria-label="Tambahkan artikel baru"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Tambahkan Artikel</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <div className="double-spinner">
                  <div className="spinner-ring outer"></div>
                  <div className="spinner-ring inner"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">
                  Memuat...
                </p>
              </div>
            ) : (
              <>
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearch}
                  categories={categories}
                  categoryId={categoryId}
                  onCategoryChange={handleCategoryChange}
                />
                <ArticleTable
                  articles={currentArticles}
                  indexOfFirstItem={indexOfFirstItem}
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
              </>
            )}

            {/* View Article Modal */}
            {isModalOpen && selectedArticle && (
              <div
                className="fixed inset-0 bg-opacity-30 dark:bg-opacity-50 flex items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg relative animate-scale-in">
                  <button
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                    onClick={closeModal}
                    aria-label="Tutup modal detail artikel"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Detail Artikel
                  </h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Nama Artikel
                    </label>
                    <div
                      className="bg-green-100 dark:bg-green-900 p-3 rounded"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(
                          selectedArticle.title.length > 57
                            ? `${selectedArticle.title.substring(0, 57)}....`
                            : selectedArticle.title
                        ),
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Deskripsi:
                    </label>
                    <div
                      className="bg-blue-100 dark:bg-blue-900 p-3 rounded"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(
                          selectedArticle.description.length > 53
                            ? `${selectedArticle.description.substring(
                                0,
                                53
                              )}....`
                            : selectedArticle.description
                        ),
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Gambar:
                    </label>
                    <img
                      src={selectedArticle.image || "/placeholder.png"}
                      alt={selectedArticle.title}
                      className="w-full h-32 object-contain rounded"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-gray-300 dark:bg-gray-700 text-teal-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      onClick={closeModal}
                      aria-label="Kembali dari modal detail artikel"
                    >
                      Kembali
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Article Modal */}
            {isEditModalOpen && (
              <div
                className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in">
                  <button
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                    onClick={closeEditModal}
                    aria-label="Tutup modal edit artikel"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Edit Artikel
                  </h3>
                  <form onSubmit={handleUpdateArticle} className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                          Nama Artikel:
                        </span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={editArticle.title}
                        onChange={handleEditInputChange}
                        className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400 p-3"
                        required
                        aria-required="true"
                        aria-label="Nama artikel"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                          Deskripsi:
                        </span>
                      </label>
                      <textarea
                        name="description"
                        value={editArticle.description}
                        onChange={handleEditInputChange}
                        className="textarea w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400 p-3"
                        rows="4"
                        required
                        aria-required="true"
                        aria-label="Deskripsi artikel"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                          Tambah Gambar:
                        </span>
                      </label>
                      <button
                        type="button"
                        className="flex items-center justify-center w-full rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                        onClick={() =>
                          document.getElementById("file-input-edit").click()
                        }
                        aria-label="Pilih gambar untuk artikel"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {editArticle.image
                            ? editArticle.image.name
                            : "Tambah Gambar"}
                        </span>
                      </button>
                      <input
                        id="file-input-edit"
                        type="file"
                        name="image"
                        onChange={handleEditInputChange}
                        className="hidden"
                        accept="image/*"
                        aria-hidden="true"
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 dark:text-red-400 text-sm">
                        {error}
                      </p>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2"
                        onClick={closeEditModal}
                        aria-label="Batal mengedit artikel"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 px-4 py-2"
                        aria-label="Simpan perubahan artikel"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {isConfirmModalOpen && (
              <div
                className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in">
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                    Yakin ingin Menghapus Artikel?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Fitur ini digunakan untuk menghapus artikel dari sistem
                    secara aman. Saat pengguna menekan tombol hapus, seluruh
                    pengaturan dan data artikel yang belum tersimpan akan
                    dihapus. Pastikan untuk menyimpan progres Anda sebelum
                    menghapus artikel.
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
                      aria-label="Konfirmasi menghapus artikel"
                    >
                      Lanjut Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Styles */}
        <style>{`
          .animate-scale-in {
            animation: scaleIn 0.2s ease-out;
          }
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-fade-in-out {
            animation: fadeInOut 3s ease-in-out forwards;
          }
          @keyframes fadeInOut {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            10% {
              opacity: 1;
              transform: translateY(0);
            }
            90% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-20px);
            }
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
            animation: spin 1.5s linear infinite;
          }
          .spinner-ring.outer {
            border-top-color: #4fb7bd;
            border-bottom-color: #4fb7bd;
            animation-direction: normal;
          }
          .spinner-ring.inner {
            border-top-color: #93d3cc;
            border-bottom-color: #93d3cc;
            animation-direction: reverse;
            width: 40px;
            height: 40px;
            top: 10px;
            left: 10px;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Article;