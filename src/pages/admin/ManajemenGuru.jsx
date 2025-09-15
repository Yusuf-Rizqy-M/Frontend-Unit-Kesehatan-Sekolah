import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { User, AlertTriangle } from 'lucide-react';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
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
      const response = await axios.get('https://api-uks.rplrus.com/api/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: 'active' }
      });

      if (response.data.status) {
        const userData = response.data.data;
        const activeTeachers = userData.filter(user => user.status === 'active' && user.role === 'guru');
        setUsers(activeTeachers);
        setTotalTeachers(activeTeachers.length);
      } else {
        setError('Gagal mengambil data guru: ' + response.data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized: Token admin tidak valid atau kedaluwarsa. Silakan masuk lagi.');
      } else {
        setError('Terjadi kesalahan saat mengambil data guru: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (id) => {
    setModalLoading(true);
    setModalError(null);
    const token = getToken();

    try {
      const response = await axios.get(`https://api-uks.rplrus.com/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        setSelectedUser(response.data.data);
        return response.data.data;
      } else {
        setModalError('Gagal mengambil detail guru: ' + response.data.message);
        return null;
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setModalError('Unauthorized: Token admin tidak valid atau kedaluwarsa. Silakan masuk lagi.');
      } else {
        setModalError('Kesalahan saat mengambil detail guru: ' + (err.response?.data?.message || err.message));
      }
      return null;
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
      const response = await axios.delete(`https://api-uks.rplrus.com/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        await fetchUsers();
        showToastMessage(response.data.message);
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      } else {
        showToastMessage('Gagal menghapus guru: ' + response.data.message, 'error');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        showToastMessage('Unauthorized: Token admin tidak valid atau kedaluwarsa. Silakan masuk lagi.', 'error');
      } else {
        showToastMessage('Terjadi kesalahan saat menghapus guru: ' + (err.response?.data?.message || err.message), 'error');
      }
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const isActive = user.status === 'active';
    const isGuru = user.role === 'guru';
    return matchesSearch && isActive && isGuru;
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

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setShowViewModal(false);
      setShowEditModal(false);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      setUserToDelete(null);
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
        <style jsx>{`
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
                        <td className="px-4 py-2">{user.name || '-'}</td>
                        <td className="px-4 py-2">{user.gender || '-'}</td>
                        <td className="px-4 py-2">{user.phone_number || '-'}</td>
                        <td className="px-4 py-2">{user.email || '-'}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <FaEye
                            className="text-gray-500 hover:text-blue-600 cursor-pointer"
                            onClick={() => handleViewClick(user.id)}
                            aria-label={`Lihat detail guru ${user.name}`}
                          />
                          <FaEdit
                            className="text-gray-500 hover:text-yellow-500 cursor-pointer"
                            onClick={() => handleEditClick(user.id)}
                            aria-label={`Edit guru ${user.name}`}
                          />
                          <FaTrash
                            className="text-gray-500 hover:text-red-500 cursor-pointer"
                            onClick={() => handleDeleteClick(user.id, user.name)}
                            aria-label={`Hapus guru ${user.name}`}
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
                      <p><strong>Nama:</strong> {selectedUser.name || '-'}</p>
                      <p><strong>Email:</strong> {selectedUser.email || '-'}</p>
                      <p><strong>Peran:</strong> {selectedUser.role || '-'}</p>
                      <p><strong>Nomor Telepon:</strong> {selectedUser.phone_number || '-'}</p>
                      <p><strong>Jenis Kelamin:</strong> {selectedUser.gender || '-'}</p>
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
                  ) : modalError ? (
                    <p className="text-red-500">{modalError}</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Edit fitur belum tersedia untuk saat ini.</p>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
                      aria-label="Batal mengedit guru"
                    >
                      Tutup
                    </button>
                  </div>
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