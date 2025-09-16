import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { User, AlertTriangle } from 'lucide-react';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';
import UKS2Img from '../../assets/img/uks2.png';

export default function ManajemenGuru() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    jenis_kelamin: '',
    mata_pelajaran: '',
    alamat: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});
  const usersPerPage = 10;

  // Set document title and favicon
  useEffect(() => {
    document.title = 'Manajemen Guru';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);
  }, []);

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nama) {
      errors.nama = 'Nama wajib diisi';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.nama)) {
      errors.nama = 'Nama hanya boleh berisi huruf dan spasi';
    }
    if (!formData.email) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email tidak valid';
    }
    if (!formData.no_hp) {
      errors.no_hp = 'Nomor telepon wajib diisi';
    } else if (!/^\d+$/.test(formData.no_hp)) {
      errors.no_hp = 'Nomor telepon hanya boleh berisi angka';
    }
    if (!formData.jenis_kelamin) {
      errors.jenis_kelamin = 'Jenis kelamin wajib dipilih';
    }
    if (!formData.mata_pelajaran) {
      errors.mata_pelajaran = 'Mata pelajaran wajib diisi';
    }
    return errors;
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError('Token admin tidak ditemukan. Silakan masuk sebagai admin.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://api-uks.rplrus.com/api/gurus', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        const userData = response.data.data;
        const activeTeachers = userData.filter(user => user.status === 'active');
        setUsers(activeTeachers);
      } else {
        setError('Gagal mengambil data guru: ' + response.data.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data guru: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalTeachers = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get('https://api-uks.rplrus.com/api/gurus', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        const activeTeachers = response.data.data.filter(user => user.status === 'active');
        setTotalTeachers(activeTeachers.length);
      }
    } catch (err) {
      console.error('Error fetching total teachers:', err);
    }
  };

  const fetchUserDetails = async (id) => {
    setModalLoading(true);
    setModalError(null);
    const token = getToken();

    try {
      const response = await axios.get(`https://api-uks.rplrus.com/api/gurus/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        setSelectedUser(response.data.data);
        setFormData({
          nama: response.data.data.nama || '',
          email: response.data.data.email || '',
          no_hp: response.data.data.no_hp || '',
          jenis_kelamin: response.data.data.jenis_kelamin || '',
          mata_pelajaran: response.data.data.mata_pelajaran || '',
          alamat: response.data.data.alamat || '',
          status: response.data.data.status || 'active'
        });
        return response.data.data;
      } else {
        setModalError('Gagal mengambil detail guru: ' + response.data.message);
        return null;
      }
    } catch (err) {
      setModalError('Kesalahan saat mengambil detail guru: ' + (err.response?.data?.message || err.message));
      return null;
    } finally {
      setModalLoading(false);
    }
  };

  const createUser = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setModalLoading(true);
    setModalError(null);
    const token = getToken();

    try {
      const response = await axios.post('https://api-uks.rplrus.com/api/gurus', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        await fetchUsers();
        await fetchTotalTeachers();
        showToastMessage('Guru berhasil ditambahkan');
        setShowCreateModal(false);
        setFormData({
          nama: '',
          email: '',
          no_hp: '',
          jenis_kelamin: '',
          mata_pelajaran: '',
          alamat: '',
          status: 'active'
        });
        setFormErrors({});
      } else {
        setModalError('Gagal menambahkan guru: ' + response.data.message);
      }
    } catch (err) {
      setModalError('Kesalahan saat menambahkan guru: ' + (err.response?.data?.message || err.message));
    } finally {
      setModalLoading(false);
    }
  };

  const updateUser = async (id) => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setModalLoading(true);
    setModalError(null);
    const token = getToken();

    try {
      const response = await axios.put(`https://api-uks.rplrus.com/api/gurus/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        await fetchUsers();
        showToastMessage('Guru berhasil diperbarui');
        setShowEditModal(false);
        setSelectedUser(null);
        setFormErrors({});
      } else {
        setModalError('Gagal memperbarui guru: ' + response.data.message);
      }
    } catch (err) {
      setModalError('Kesalahan saat memperbarui guru: ' + (err.response?.data?.message || err.message));
    } finally {
      setModalLoading(false);
    }
  };

  const softDeleteUser = async (id) => {
    const token = getToken();
    if (!token) {
      showToastMessage('Token admin tidak ditemukan. Silakan masuk sebagai admin.', 'error');
      return;
    }

    try {
      const response = await axios.delete(`https://api-uks.rplrus.com/api/gurus/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        await fetchUsers();
        await fetchTotalTeachers();
        showToastMessage(response.data.message);
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      } else {
        showToastMessage('Gagal menonaktifkan guru: ' + response.data.message, 'error');
      }
    } catch (err) {
      showToastMessage('Terjadi kesalahan saat menonaktifkan guru: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDeleteClick = (id, name) => {
    setUserToDelete({ id, name });
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      softDeleteUser(userToDelete.id);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'nama') {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'no_hp') {
      filteredValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: filteredValue }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  useEffect(() => {
    fetchUsers();
    fetchTotalTeachers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nama?.toLowerCase().includes(searchQuery.toLowerCase());
    const isActive = user.status === 'active';
    return matchesSearch && isActive;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const getPageRange = () => {
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrent = maxPagesToShow - maxPagesBeforeCurrent - 1;
      startPage = Math.max(1, currentPage - maxPagesBeforeCurrent);
      endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleViewClick = (id) => {
    fetchUserDetails(id).then(() => {
      if (!modalError) setShowViewModal(true);
    });
  };

  const handleEditClick = (id) => {
    fetchUserDetails(id).then(() => {
      if (!modalError) setShowEditModal(true);
    });
  };

  const handleCreateClick = () => {
    setFormData({
      nama: '',
      email: '',
      no_hp: '',
      jenis_kelamin: '',
      mata_pelajaran: '',
      alamat: '',
      status: 'active'
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setShowViewModal(false);
      setShowEditModal(false);
      setShowCreateModal(false);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      setUserToDelete(null);
      setModalError(null);
      setFormErrors({});
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden font-sans">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <div className="double-spinner">
                  <div className="spinner-ring outer"></div>
                  <div className="spinner-ring inner"></div>
                </div>
                <p className="text-gray-500 mt-4">Memuat...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden font-sans">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
                <button
                  onClick={() => fetchUsers()}
                  className="ml-4 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  aria-label="Coba lagi untuk mengambil data guru"
                >
                  Mencoba kembali
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
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

            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-white font-bold mb-6">Manajemen Guru</h1>

            <div className="flex gap-6 mb-6">
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <User className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Guru</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">{totalTeachers}</p>
                </div>
              </div>
              <button
                onClick={handleCreateClick}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                aria-label="Tambah guru baru"
              >
                Tambah Guru
              </button>
            </div>

            <div className="bg-[#9BC7B6] dark:bg-[#051D4E] rounded-[10px] p-4 mb-6">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-[#6D9C9D] dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="
                    w-full pl-10 pr-4 py-2 rounded-[10px]
                    bg-white dark:bg-gray-700
                    text-[#6D9C9D] dark:text-white
                    placeholder-[#6D9C9D] dark:placeholder-gray-400
                    focus:outline-none
                  "
                  aria-label="Cari guru berdasarkan nama"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-white" role="grid">
                <thead className="text-teal-600 uppercase text-xs border-b border-[#CDDDFF]">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Jenis Kelamin</th>
                    <th className="px-4 py-3">No HP</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <tr key={user.id} className="border-b border-[#CDDDFF]">
                        <td className="px-4 py-2">{indexOfFirstUser + index + 1}</td>
                        <td className="px-4 py-2">{user.nama || '-'}</td>
                        <td className="px-4 py-2">{user.jenis_kelamin || '-'}</td>
                        <td className="px-4 py-2">{user.no_hp || '-'}</td>
                        <td className="px-4 py-2">{user.email || '-'}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <FaEye
                            className="text-gray-500 hover:text-blue-600 cursor-pointer"
                            onClick={() => handleViewClick(user.id)}
                            aria-label={`Lihat detail guru ${user.nama}`}
                          />
                          <FaEdit
                            className="text-gray-500 hover:text-yellow-500 cursor-pointer"
                            onClick={() => handleEditClick(user.id)}
                            aria-label={`Edit guru ${user.nama}`}
                          />
                          <FaTrash
                            className="text-gray-500 hover:text-red-500 cursor-pointer"
                            onClick={() => handleDeleteClick(user.id, user.nama)}
                            aria-label={`Hapus guru ${user.nama}`}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500 dark:text-gray-400">
                        Tidak ada guru yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6 text-sm dark:text-gray-300">
              <p>Showing {filteredUsers.length === 0 ? 0 : indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}</p>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50"
                  aria-label="Halaman sebelumnya"
                >
                  {'<'}
                </button>
                {getPageRange().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page
                        ? 'bg-teal-500 dark:bg-[#204ECF] text-white'
                        : 'text-gray-400 dark:text-gray-300'
                    }`}
                    aria-label={`Pindah ke halaman ${page}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50"
                  aria-label="Halaman berikutnya"
                >
                  {'>'}
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && userToDelete && (
              <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay" onClick={handleModalClick}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md text-center shadow-lg animate-scale-in">
                  <div className="flex justify-center mb-4">
                    <div className="p-2 rounded-full border-2 border-orange-500">
                      <AlertTriangle className="w-12 h-12 text-orange-500" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-orange-600 mb-2">Nonaktifkan Akun {userToDelete.name}?</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Fitur ini digunakan untuk menonaktifkan akun guru "{userToDelete.name}" secara aman. Setelah dinonaktifkan, akun tidak akan muncul di sistem hingga diaktifkan kembali oleh admin. Pastikan Anda yakin sebelum melanjutkan.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={cancelDelete}
                      className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                      aria-label={`Batal menonaktifkan akun ${userToDelete.name}`}
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      aria-label={`Konfirmasi menonaktifkan akun ${userToDelete.name}`}
                    >
                      Lanjutkan, Nonaktifkan Akun
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View Modal for User Details */}
            {showViewModal && selectedUser && (
              <div 
                className="fixed inset-0 bg-transparent flex items-center justify-center z-50 modal-overlay"
                onClick={handleModalClick}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md animate-scale-in">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Detail Guru</h2>
                  {modalLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="double-spinner">
                        <div className="spinner-ring outer"></div>
                        <div className="spinner-ring inner"></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-4">Memuat...</p>
                    </div>
                  ) : modalError ? (
                    <p className="text-red-500">{modalError}</p>
                  ) : (
                    <div className="space-y-2">
                      <p><strong>Nama:</strong> {selectedUser.nama || '-'}</p>
                      <p><strong>Email:</strong> {selectedUser.email || '-'}</p>
                      <p><strong>Mata Pelajaran:</strong> {selectedUser.mata_pelajaran || '-'}</p>
                      <p><strong>Nomor Telepon:</strong> {selectedUser.no_hp || '-'}</p>
                      <p><strong>Jenis Kelamin:</strong> {selectedUser.jenis_kelamin || '-'}</p>
                      <p><strong>Alamat:</strong> {selectedUser.alamat || '-'}</p>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                      aria-label="Tutup modal detail guru"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Create Modal for Adding New Teacher */}
            {showCreateModal && (
              <div 
                className="fixed inset-0 bg-transparent flex items-center justify-center z-50 modal-overlay"
                onClick={handleModalClick}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md animate-scale-in">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tambah Guru</h2>
                  {modalLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="double-spinner">
                        <div className="spinner-ring outer"></div>
                        <div className="spinner-ring inner"></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-4">Memuat...</p>
                    </div>
                  ) : (
                    <>
                      {modalError && <p className="text-red-500 mb-4">{modalError}</p>}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Nama</label>
                          <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          />
                          {formErrors.nama && <p className="text-red-500 text-xs mt-1">{formErrors.nama}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          />
                          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Nomor Telepon</label>
                          <input
                            type="text"
                            name="no_hp"
                            value={formData.no_hp}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          />
                          {formErrors.no_hp && <p className="text-red-500 text-xs mt-1">{formErrors.no_hp}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Jenis Kelamin</label>
                          <select
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          >
                            <option value="">Pilih</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                          {formErrors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{formErrors.jenis_kelamin}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Mata Pelajaran</label>
                          <input
                            type="text"
                            name="mata_pelajaran"
                            value={formData.mata_pelajaran}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          />
                          {formErrors.mata_pelajaran && <p className="text-red-500 text-xs mt-1">{formErrors.mata_pelajaran}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Alamat</label>
                          <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-4">
                        <button
                          onClick={() => setShowCreateModal(false)}
                          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
                          aria-label="Batal menambahkan guru"
                        >
                          Batal
                        </button>
                        <button
                          onClick={createUser}
                          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                          aria-label="Simpan guru baru"
                        >
                          Simpan
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Edit Modal for Updating User Details */}
            {showEditModal && selectedUser && (
              <div 
                className="fixed inset-0 bg-transparent flex items-center justify-center z-50 modal-overlay"
                onClick={handleModalClick}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md animate-scale-in">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Edit Detail Guru</h2>
                  {modalLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="double-spinner">
                        <div className="spinner-ring outer"></div>
                        <div className="spinner-ring inner"></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-4">Memuat...</p>
                    </div>
                  ) : (
                    <>
                      {modalError && <p className="text-red-500 mb-4">{modalError}</p>}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Nama</label>
                          <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          />
                          {formErrors.nama && <p className="text-red-500 text-xs mt-1">{formErrors.nama}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          />
                          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Nomor Telepon</label>
                          <input
                            type="text"
                            name="no_hp"
                            value={formData.no_hp}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          />
                          {formErrors.no_hp && <p className="text-red-500 text-xs mt-1">{formErrors.no_hp}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Jenis Kelamin</label>
                          <select
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          >
                            <option value="">Pilih</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                          {formErrors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{formErrors.jenis_kelamin}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Mata Pelajaran</label>
                          <input
                            type="text"
                            name="mata_pelajaran"
                            value={formData.mata_pelajaran}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                          />
                          {formErrors.mata_pelajaran && <p className="text-red-500 text-xs mt-1">{formErrors.mata_pelajaran}</p>}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-300">Alamat</label>
                          <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-4">
                        <button
                          onClick={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                            setFormErrors({});
                          }}
                          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
                          aria-label="Batal mengedit guru"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => updateUser(selectedUser.id)}
                          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                          aria-label="Simpan perubahan guru"
                        >
                          Simpan
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CSS for Animations */}
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
}