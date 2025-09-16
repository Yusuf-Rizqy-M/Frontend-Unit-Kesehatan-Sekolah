import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import axios from 'axios';
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

const RekamMedisGuru = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const usersPerPage = 10;
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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

  // Set tab title and favicon
  useEffect(() => {
    document.title = 'Rekam Medis Guru';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);
  }, []);

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

  // Fetch teachers data
  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    if (!token) {
      setError('Token autentikasi tidak ditemukan. Silakan Login.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get('https://api-uks.rplrus.com/api/he', {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: 'active' }, // Match backend's 'aktif' status
      });
      if (response.data.status && response.data.data) {
        const activeTeachers = response.data.data.filter(teacher => teacher.status === 'aktif');
        const mappedTeachers = activeTeachers.map(teacher => ({
          id: teacher.id,
          name: teacher.nama,
          gender: teacher.jenis_kelamin || 'Belum Terisi',
          subject: teacher.mata_pelajaran || 'Belum Terisi',
          phone: teacher.no_hp || 'Belum Terisi',
          email: teacher.email || 'Belum Terisi',
          address: teacher.alamat || 'Belum Terisi',
        }));
        setTeachers(mappedTeachers);
      } else {
        setError(response.data.message || 'Invalid response format');
        setTeachers([]);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized: Token tidak valid atau kedaluwarsa. Silakan Login lagi.');
      } else if (err.response && err.response.status === 403) {
        setError('Akses ditolak: Hanya admin yang dapat mengakses data ini.');
      } else {
        setError('Terjadi kesalahan saat mengambil data guru: ' + err.message);
      }
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filter teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? teacher.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredTeachers.length / usersPerPage) || 1;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate page range for pagination
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

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleNavigateToDetails = (teacher) => {
    const path = `/MedicalRecordGuru/${teacher.id}`;
    navigate(path, { state: { teacher } });
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-100 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {showToast && (
              <div
                className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${
                  toastType === 'success' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                } px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50`}
              >
                <div
                  className={`rounded-full p-1 ${
                    toastType === 'success' ? 'bg-green-600 dark:bg-green-500' : 'bg-red-600 dark:bg-red-500'
                  }`}
                >
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
                <span className="font-medium text-sm">{toastMessage}</span>
              </div>
            )}
            <h2 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-200 border-b-2 border-green-500 dark:border-green-400 pb-2 mb-8 inline-block">
              Rekam Medis Guru
            </h2>
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
                {error}
                <button
                  onClick={fetchTeachers}
                  className="ml-4 px-4 py-1 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600"
                >
                  Retry
                </button>
              </div>
            )}
            <div className="bg-[#9BC7B6] dark:bg-[#1a2a5e] rounded-[10px] p-4 flex items-center gap-4 mb-6">
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
                  placeholder="Cari Guru"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 rounded-[10px] bg-white dark:bg-gray-800 text-[#6D9C9D] dark:text-gray-200 placeholder-[#6D9C9D] dark:placeholder-gray-400 focus:outline-none"
                />
              </div>
              <select
                value={roleFilter}
                onChange={handleRoleChange}
                className="w-[120px] rounded-[10px] bg-white dark:bg-gray-800 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none"
              >
                <option value="">Peran</option>
                <option value="guru">Guru</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-3 text-left text-gray-800 dark:text-gray-200">ID</th>
                    <th className="p-3 text-left text-gray-800 dark:text-gray-200">Nama</th>
                    <th className="p-3 text-left text-gray-800 dark:text-gray-200">Jenis Kelamin</th>
                    <th className="p-3 text-left text-gray-800 dark:text-gray-200">Mata Pelajaran</th>
                    <th className="p-3 text-left text-gray-800 dark:text-gray-200">No. HP</th>
                    <th className="p-3 text-left text-gray-800 dark:text-gray-200"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500 dark:text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : currentTeachers.length > 0 ? (
                    currentTeachers.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="border-b-4 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-3 text-gray-800 dark:text-gray-200">{teacher.id}</td>
                        <td className="p-3 text-gray-800 dark:text-gray-200">{teacher.name}</td>
                        <td className="p-3 text-gray-800 dark:text-gray-200">{teacher.gender}</td>
                        <td className="p-3 text-gray-800 dark:text-gray-200">{teacher.subject}</td>
                        <td className="p-3 text-gray-800 dark:text-gray-200">{teacher.phone}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleNavigateToDetails(teacher)}
                            className="text-xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                          >
                            ›
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500 dark:text-gray-400">
                        Tidak ada data guru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-300">
              <p>
                Showing {filteredTeachers.length === 0 ? 0 : indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredTeachers.length)} of{' '}
                {filteredTeachers.length}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50 dark:border-gray-600"
                >
                  ← Sebelumnya
                </button>
                {getPageRange().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page
                        ? 'bg-green-600 dark:bg-green-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50 dark:border-gray-600"
                >
                  Berikutnya →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
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
      `}</style>
    </div>
  );
};

export default RekamMedisGuru;
