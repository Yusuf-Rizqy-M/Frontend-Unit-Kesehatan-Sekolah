import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaTrash, FaEye, FaEdit } from "react-icons/fa";
import axios from "axios";
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

const KategoriPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [newCategory, setNewCategory] = useState({ title: "", description: "", image: null });
  const [editCategory, setEditCategory] = useState({ id: null, title: "", description: "", image: null });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Base API URL
  const API_URL = "https://api-uks.rplrus.com/api";

  // Set document title and favicon
  useEffect(() => {
    document.title = 'Kategori';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);
  }, []);

  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }
        const response = await axios.get(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status) {
          setCategories(response.data.data);
        } else {
          setError("Failed to fetch categories: " + response.data.message);
          setToastMessage("Failed to fetch categories.", "error");
          setShowToast(true);
        }
      } catch (err) {
        const errorMessage = err.response?.status === 401
          ? "Unauthorized: Invalid or expired token. Please log in again."
          : "Error fetching categories: " + (err.response?.data?.message || err.message);
        setError(errorMessage);
        setToastMessage("Error fetching categories. Please try again.", "error");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle view button click
  const handleView = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = (category) => {
    setEditCategory({
      id: category.id,
      title: category.title,
      description: category.description,
      image: null,
    });
    setIsEditModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditCategory({ id: null, title: "", description: "", image: null });
    setError(null);
  };

  // Close add modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewCategory({ title: "", description: "", image: null });
    setError(null);
  };

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError("No authentication token found. Please log in.");
      setToastMessage("No authentication token found. Please log in.", "error");
      setShowToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", newCategory.title);
    formData.append("description", newCategory.description);
    if (newCategory.image) {
      formData.append("image", newCategory.image);
    }

    try {
      const response = await axios.post(`${API_URL}/categories`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        setCategories([...categories, response.data.data]);
        closeAddModal();
        setToastMessage("Kategori berhasil dibuat", "success");
        setShowToast(true);
      } else {
        setError("Failed to add category: " + response.data.message);
        setToastMessage("Failed to add category.", "error");
        setShowToast(true);
      }
    } catch (err) {
      const errorMessage = err.response?.status === 401
        ? "Unauthorized: Invalid or expired token. Please log in again."
        : "Error adding category: " + (err.response?.data?.message || err.message);
      setError(errorMessage);
      setToastMessage("Error adding category. Please try again.", "error");
      setShowToast(true);
    }
  };

  // Handle updating a category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError("No authentication token found. Please log in.");
      setToastMessage("No authentication token found. Please log in.", "error");
      setShowToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", editCategory.title);
    formData.append("description", editCategory.description);
    if (editCategory.image) {
      formData.append("image", editCategory.image);
    }
    formData.append("_method", "PUT");

    try {
      const response = await axios.post(`${API_URL}/categories/${editCategory.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        setCategories(categories.map(cat => cat.id === editCategory.id ? response.data.data : cat));
        closeEditModal();
        setToastMessage("Kategori berhasil diedit", "success");
        setShowToast(true);
      } else {
        setError("Failed to update category: " + response.data.message);
        setToastMessage("Failed to update category.", "error");
        setShowToast(true);
      }
    } catch (err) {
      const errorMessage = err.response?.status === 401
        ? "Unauthorized: Invalid or expired token. Please log in again."
        : "Error updating category: " + (err.response?.data?.message || err.message);
      setError(errorMessage);
      setToastMessage("Error updating category. Please try again.", "error");
      setShowToast(true);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  // Handle delete action
  const handleDelete = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError("No authentication token found. Please log in.");
      setToastMessage("No authentication token found. Please log in.", "error");
      setShowToast(true);
      setIsConfirmModalOpen(false);
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/categories/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setCategories(categories.filter(cat => cat.id !== deleteId));
        setIsConfirmModalOpen(false);
        setToastMessage("Kategori berhasil dihapus", "success");
        setShowToast(true);
      } else {
        setError("Failed to delete category: " + response.data.message);
        setToastMessage("Failed to delete category.", "error");
        setShowToast(true);
      }
    } catch (err) {
      const errorMessage = err.response?.status === 401
        ? "Unauthorized: Invalid or expired token. Please log in again."
        : "Error deleting category: " + (err.response?.data?.message || err.message);
      setError(errorMessage);
      setToastMessage("Error deleting category. Please try again.", "error");
      setShowToast(true);
    } finally {
      setDeleteId(null);
      setIsConfirmModalOpen(false);
    }
  };

  // Handle input changes for new category
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setNewCategory({ ...newCategory, [name]: files[0] });
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };

  // Handle input changes for edit category
  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setEditCategory({ ...editCategory, [name]: files[0] });
    } else {
      setEditCategory({ ...editCategory, [name]: value });
    }
  };

  // Function to get the correct image URL
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    return image;
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers for display
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

  // Handle retry for error state
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setCategories([]);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
              <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold">Kategori</h2>
              <button
                className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
                onClick={() => setIsAddModalOpen(true)}
                aria-label="Tambahkan kategori baru"
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
                <span>Tambahkan Kategori</span>
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <div className="double-spinner">
                  <div className="spinner-ring outer"></div>
                  <div className="spinner-ring inner"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">Memuat...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
                <button
                  onClick={handleRetry}
                  className="ml-4 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  aria-label="Coba lagi untuk mengambil data kategori"
                >
                  Retry
                </button>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Tidak ada kategori yang tersedia.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm rounded-[10px]" role="grid">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-300">
                      <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">No</th>
                      <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Nama</th>
                      <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Deskripsi</th>
                      <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">Gambar</th>
                      <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.map((category, index) => (
                      <tr key={category.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{indexOfFirstItem + index + 1}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{category.title}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200 italic">{category.description}</td>
                        <td className="py-3 px-4 text-center">
                          <img
                            src={getImageUrl(category.image)}
                            alt={category.title}
                            className="w-6 object-contain inline-block"
                            onError={(e) => (e.target.src = "/placeholder.png")}
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                              onClick={() => handleView(category)}
                              aria-label={`Lihat detail kategori ${category.title}`}
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              className="text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                              onClick={() => handleEdit(category)}
                              aria-label={`Edit kategori ${category.title}`}
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                              onClick={() => handleDeleteConfirm(category.id)}
                              aria-label={`Hapus kategori ${category.title}`}
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {categories.length > 0 && (
              <div className="flex justify-between items-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
                <span>
                  Showing {categories.length === 0 ? 0 : indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, categories.length)} of {categories.length}
                </span>
                <div className="flex space-x-1">
                  <button
                    className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Halaman sebelumnya"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                      className={`px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 ${currentPage === pageNumber ? "bg-teal-500 dark:bg-teal-600 text-white" : ""}`}
                      onClick={() => handlePageChange(pageNumber)}
                      aria-label={`Pindah ke halaman ${pageNumber}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  {totalPages > 3 && currentPage < totalPages - 1 && (
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">...</button>
                  )}
                  {totalPages > 3 && currentPage < totalPages && (
                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handlePageChange(totalPages)}
                      aria-label={`Pindah ke halaman ${totalPages}`}
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Halaman berikutnya"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
            )}
          </div>
        </main>

        {/* Add Category Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={closeAddModal}
                aria-label="Tutup modal tambah kategori"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Tambah Kategori</h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nama Kategori:</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newCategory.title}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    aria-label="Nama kategori"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Deskripsi:</span>
                  </label>
                  <textarea
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    className="textarea w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    aria-label="Deskripsi kategori"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Tambah Gambar:</span>
                  </label>
                  <button
                    type="button"
                    className="flex items-center justify-center w-full rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => document.getElementById("file-input-add").click()}
                    aria-label="Pilih gambar untuk kategori"
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
                    <span>{newCategory.image ? newCategory.image.name : "Tambah Gambar"}</span>
                  </button>
                  <input
                    id="file-input-add"
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    className="hidden"
                    accept="image/*"
                    aria-hidden="true"
                  />
                </div>
                {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={closeAddModal}
                    aria-label="Batal menambahkan kategori"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700"
                    aria-label="Tambahkan kategori"
                  >
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={closeEditModal}
                aria-label="Tutup modal edit kategori"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Kategori</h3>
              <form onSubmit={handleUpdateCategory} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nama Kategori:</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editCategory.title}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    aria-label="Nama kategori"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Deskripsi:</span>
                  </label>
                  <textarea
                    name="description"
                    value={editCategory.description}
                    onChange={handleEditInputChange}
                    className="textarea w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    aria-label="Deskripsi kategori"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Tambah Gambar:</span>
                  </label>
                  <button
                    type="button"
                    className="flex items-center justify-center w-full rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => document.getElementById("file-input-edit").click()}
                    aria-label="Pilih gambar untuk kategori"
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
                    <span>{editCategory.image ? editCategory.image.name : "Tambah Gambar"}</span>
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
                {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={closeEditModal}
                    aria-label="Batal mengedit kategori"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700"
                    aria-label="Simpan perubahan kategori"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Category Modal */}
        {isModalOpen && selectedCategory && (
          <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg relative animate-scale-in">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={closeModal}
                aria-label="Tutup modal detail kategori"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Detail Kategori</h3>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nama Kategori</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedCategory.title}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Deskripsi:</label>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">{selectedCategory.description}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Gambar:</label>
                <img
                  src={getImageUrl(selectedCategory.image)}
                  alt={selectedCategory.title}
                  className="w-full h-32 object-contain rounded"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={closeModal}
                  aria-label="Kembali dari modal detail kategori"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-scale-in">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Yakin ingin Menghapus Kategori?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Fitur ini digunakan untuk menghapus kategori dari sistem secara aman. Saat pengguna menekan tombol hapus, seluruh pengaturan dan data kategori yang belum tersimpan akan dihapus. Pastikan untuk menyimpan progres Anda sebelum menghapus kategori.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                  onClick={() => setIsConfirmModalOpen(false)}
                  aria-label="Batal menghapus kategori"
                >
                  Batal
                </button>
                <button
                  className="px-6 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                  onClick={handleDelete}
                  aria-label="Konfirmasi menghapus kategori"
                >
                  Lanjut Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for Animations and Spinner */}
      <style jsx>{`
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
          animation: fadeInOut 3s ease-in-out;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
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
      `}</style>
    </div>
  );
};

export default KategoriPage;