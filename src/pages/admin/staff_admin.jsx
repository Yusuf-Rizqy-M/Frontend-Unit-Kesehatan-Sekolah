import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import UKS2Img from "../../assets/img/uks2.png"; // Favicon import
import { FaTrash, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";

const StaffPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [newStaff, setNewStaff] = useState({ name: "", role: "", wa: "", image: null });
  const [editStaff, setEditStaff] = useState({ id: null, name: "", role: "", wa: "", image: null });
  const [successMessage, setSuccessMessage] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [waError, setWaError] = useState(null); // State for phone number error

  const API_URL = "https://api-uks.rplrus.com/api";

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  // Initialize theme
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

  useEffect(() => {
    // Mengatur judul tab
    document.title = 'Staff UKS';
    
    // Mengatur favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img; // Menggunakan UKS2Img sebagai favicon
    document.head.appendChild(favicon);
  }, []); // Efek hanya dijalankan sekali saat komponen dimuat

  // Fetch staff data
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get(`${API_URL}/staff`);
        setStaffs(response.data);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  // Handle view button click
  const handleView = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = (staff) => {
    setEditStaff({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      wa: staff.wa,
      image: null,
    });
    setIsEditModalOpen(true);
  };

  // Close modals
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditStaff({ id: null, name: "", role: "", wa: "", image: null });
    setWaError(null); // Clear phone number error
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewStaff({ name: "", role: "", wa: "", image: null });
    setError(null);
    setWaError(null); // Clear phone number error
  };

  // Validate phone number (only numbers and max 15 digits)
  const validatePhoneNumber = (value) => {
    const phoneRegex = /^\d*$/;
    return phoneRegex.test(value) && value.length <= 15;
  };

  // Validate phone number length (8 to 15 digits)
  const isPhoneNumberValid = (value) => {
    return value.length >= 8 && value.length <= 15;
  };

  // Handle input changes for new staff
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "wa") {
      if (validatePhoneNumber(value)) {
        setNewStaff({ ...newStaff, [name]: value });
        setWaError(null);
      } else {
        setWaError(value.length > 15 ? "Nomor WA tidak boleh lebih dari 15 digit" : "Nomor WA hanya boleh berisi angka");
      }
    } else if (name === "image" && files) {
      setNewStaff({ ...newStaff, [name]: files[0] });
    } else {
      setNewStaff({ ...newStaff, [name]: value });
    }
  };

  // Handle input changes for edit staff
  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "wa") {
      if (validatePhoneNumber(value)) {
        setEditStaff({ ...editStaff, [name]: value });
        setWaError(null);
      } else {
        setWaError(value.length > 15 ? "Nomor WA tidak boleh lebih dari 15 digit" : "Nomor WA hanya boleh berisi angka");
      }
    } else if (name === "image" && files) {
      setEditStaff({ ...editStaff, [name]: files[0] });
    } else {
      setEditStaff({ ...editStaff, [name]: value });
    }
  };

  // Handle adding a new staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    // Validate phone number length
    if (!isPhoneNumberValid(newStaff.wa)) {
      setWaError("Nomor WA harus memiliki 8 hingga 15 digit");
      return;
    }

    const formData = new FormData();
    formData.append("name", newStaff.name);
    formData.append("role", newStaff.role);
    formData.append("wa", newStaff.wa);
    if (newStaff.image) {
      formData.append("image", newStaff.image);
    }

    try {
      const response = await axios.post(`${API_URL}/staff`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStaffs([...staffs, response.data.data]);
      closeAddModal();
      setSuccessMessage("Staff berhasil ditambahkan");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Error adding staff: " + (err.response?.data?.message || err.message));
    }
  };

  // Handle updating a staff
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    // Validate phone number length
    if (!isPhoneNumberValid(editStaff.wa)) {
      setWaError("Nomor WA harus memiliki 8 hingga 15 digit");
      return;
    }

    const formData = new FormData();
    formData.append("name", editStaff.name);
    formData.append("role", editStaff.role);
    formData.append("wa", editStaff.wa);
    if (editStaff.image) {
      formData.append("image", editStaff.image);
    }
    formData.append("_method", "PUT");

    try {
      const response = await axios.post(`${API_URL}/staff/${editStaff.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStaffs(staffs.map(staff => staff.id === editStaff.id ? response.data.data : staff));
      closeEditModal();
      setSuccessMessage("Staff berhasil diedit");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Error updating staff: " + (err.response?.data?.message || err.message));
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  // Handle delete action
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No authentication token found. Please log in.");
      setIsConfirmModalOpen(false);
      return;
    }

    try {
      await axios.delete(`${API_URL}/staff/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaffs(staffs.filter(staff => staff.id !== deleteId));
      setIsConfirmModalOpen(false);
      setSuccessMessage("Staff berhasil dihapus");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Error deleting staff: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleteId(null);
    }
  };

  // Function to get the correct image URL
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    // Remove redundant prefix from the image URL
    const prefix = "https://api-uks.rplrus.com/storage/";
    if (image.startsWith(prefix + prefix)) {
      return image.replace(prefix + prefix, prefix);
    }
    return image;
  };

  // Pagination logic
  const totalPages = Math.ceil(staffs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaffs = staffs.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow p-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold">Staff</h2>
              <button
                className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FaPlus className="w-5 h-5" />
                <span>Menambahkan Staff</span>
              </button>
            </div>

            {successMessage && (
              <div
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50"
              >
                <div className="bg-green-600 dark:bg-green-500 rounded-full p-1">
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
                </div>
                <span className="font-medium text-sm">{successMessage}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 dark:text-red-400">{error}</div>
            ) : staffs.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No staff available.</div>
            ) : (
              <table className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-300">
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">No</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Name</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Role</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">WA</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">Image</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStaffs.map((staff, index) => (
                    <tr key={staff.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{staff.name}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{staff.role}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{staff.wa}</td>
                      <td className="py-3 px-4 text-center">
                        <img
                          src={getImageUrl(staff.image)}
                          alt={staff.name}
                          className="w-6 object-contain inline-block"
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                            onClick={() => handleView(staff)}
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                            onClick={() => handleEdit(staff)}
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                            onClick={() => handleDeleteConfirm(staff.id)}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="flex justify-between items-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
              <span>
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, staffs.length)} of {staffs.length}
              </span>
              <div className="flex space-x-1">
                <button
                  className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
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
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
          </div>
        </main>

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={closeAddModal}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Tambah Staff</h3>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nama Staff:</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newStaff.name}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Role:</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={newStaff.role}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nomor WA:</span>
                  </label>
                  <input
                    type="text"
                    name="wa"
                    value={newStaff.wa}
                    onChange={handleInputChange}
                    maxLength={15}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="0812345678"
                  />
                  {waError && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{waError}</p>}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Tambah Gambar:</span>
                  </label>
                  <button
                    type="button"
                    className="flex items-center justify-center w-full rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => document.getElementById("file-input-add").click()}
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
                    <span>{newStaff.image ? newStaff.image.name : "Tambah Gambar"}</span>
                  </button>
                  <input
                    id="file-input-add"
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={closeAddModal}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700">
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={closeEditModal}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Staff</h3>
              <form onSubmit={handleUpdateStaff} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nama Staff:</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editStaff.name}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Role:</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={editStaff.role}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nomor WA:</span>
                  </label>
                  <input
                    type="text"
                    name="wa"
                    value={editStaff.wa}
                    onChange={handleEditInputChange}
                    maxLength={15}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="0812345678"
                  />
                  {waError && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{waError}</p>}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Tambah Gambar:</span>
                  </label>
                  <button
                    type="button"
                    className="flex items-center justify-center w-full rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => document.getElementById("file-input-edit").click()}
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
                    <span>{editStaff.image ? editStaff.image.name : "Tambah Gambar"}</span>
                  </button>
                  <input
                    id="file-input-edit"
                    type="file"
                    name="image"
                    onChange={handleEditInputChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={closeEditModal}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isModalOpen && selectedStaff && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg z-60 relative">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nama</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedStaff.name}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Role</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedStaff.role}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nomor WA:</label>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">{selectedStaff.wa}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Gambar:</label>
                <img
                  src={getImageUrl(selectedStaff.image)}
                  alt={selectedStaff.name}
                  className="w-full h-32 object-contain rounded"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={closeModal}
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}

        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Yakin ingin Menghapus Staff?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Fitur ini digunakan untuk menghapus staff dari sistem secara aman. Seluruh data staff akan dihapus. Pastikan untuk menyimpan progres Anda sebelum menghapus staff.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                    onClick={() => setIsConfirmModalOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="px-6 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                    onClick={handleDelete}
                  >
                    Lanjut Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for Toast Animation */}
      <style jsx>{`
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
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

export default StaffPage;