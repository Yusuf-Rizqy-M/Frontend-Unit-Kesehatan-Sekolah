import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import axios from 'axios';
import api from '../../api/auth';
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

const JurusanPage = () => {
  const [departments, setDepartments] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [formData, setFormData] = useState({ name: '', desc: '' });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // Set document title
    document.title = 'Jurusan';

    // Set favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img; // Use UKS2Img as favicon
    document.head.appendChild(favicon);

    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan login.');
        }

        const response = await axios.get('https://api-uks.rplrus.com/api/departments', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });
        console.log('API Response (Departments):', response.data);
        const activeDepartments = response.data.filter(dept => dept.status === 'active');
        console.log('Filtered Active Departments:', activeDepartments);
        if (activeDepartments.length === 0) {
          setError('Tidak ada jurusan dengan status aktif ditemukan. Silakan tambah jurusan baru.');
        }
        setDepartments(activeDepartments);
      } catch (err) {
        console.error('Error fetching departments:', err.response || err.message);
        setError(err.response?.data?.message || 'Gagal mengambil data jurusan.');
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormData({ name: '', desc: '' });
    setIsCreateModalOpen(true);
    setError(null);
  };

  const openEditModal = (department) => {
    setEditDepartment(department);
    setFormData({
      name: department.name || '',
      desc: department.desc || '',
    });
    setIsEditModalOpen(true);
    setError(null);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditDepartment(null);
    setFormData({ name: '', desc: '' });
    setError(null);
  };

  const handleCreate = async () => {
    if (!formData.name) {
      setError('Nama jurusan harus diisi');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login.');
      }

      const response = await axios.post(
        'https://api-uks.rplrus.com/api/departments',
        {
          name: formData.name,
          desc: formData.desc || null,
          status: 'active',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDepartments([...departments, response.data.data]);
      closeModals();
      setSuccessMessage("Jurusan berhasil ditambahkan");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat jurusan');
    }
  };

  const handleEdit = async () => {
    if (!formData.name) {
      setError('Nama jurusan harus diisi');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login.');
      }

      const response = await axios.put(
        `https://api-uks.rplrus.com/api/departments/${editDepartment.id}`,
        {
          name: formData.name,
          desc: formData.desc || null,
          status: 'active',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDepartments(
        departments.map((dept) =>
          dept.id === editDepartment.id ? response.data.data : dept
        )
      );
      closeModals();
      setSuccessMessage("Jurusan berhasil diedit");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengedit jurusan');
    }
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError('Token tidak ditemukan. Silakan login.');
      setIsConfirmModalOpen(false);
      return;
    }

    try {
      await axios.delete(`https://apiliaison href="https://api-uks.rplrus.com/api/departments/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(departments.filter(dept => dept.id !== deleteId));
      setIsConfirmModalOpen(false);
      setSuccessMessage("Jurusan berhasil dinonaktifkan");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error deactivating department: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50 dark:bg-gray-900">
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={false} setSidebarOpen={() => {}} />
        <main className="grow p-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold">Jurusan</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
                aria-label="Menambahkan jurusan baru"
              >
                <FaPlus className="w-5 h-5" />
                <span>Menambahkan Jurusan</span>
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

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm mb-4" role="alert">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm rounded-[10px]" role="grid">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-300">
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">No</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Nama</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Deskripsi</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.length > 0 ? (
                    departments.map((dept, index) => (
                      <tr key={dept.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{index + 1}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{dept.name}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{dept.desc || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(dept)}
                              className="text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                              aria-label={`Edit jurusan ${dept.name}`}
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(dept.id)}
                              className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                              aria-label={`Hapus jurusan ${dept.name}`}
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-3 px-4 text-gray-700 dark:text-gray-200 text-center">
                        Tidak ada data jurusan aktif
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
              <span>Showing {departments.length > 0 ? `1-${departments.length} of ${departments.length}` : '0 of 0'}</span>
              <div className="flex space-x-1">
                <button
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 opacity-50 cursor-not-allowed"
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
                <button
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 bg-teal-500 dark:bg-teal-600 text-white"
                  aria-label="Pindah ke halaman 1"
                >
                  1
                </button>
                <button
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 opacity-50 cursor-not-allowed"
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

            {isCreateModalOpen && (
              <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Tambah Jurusan</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Nama</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-teal-100 dark:bg-gray-700"
                        placeholder="Masukkan nama jurusan (e.g., RPL)"
                        aria-label="Nama jurusan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Deskripsi</label>
                      <input
                        type="text"
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-teal-100 dark:bg-gray-700"
                        placeholder="Masukkan deskripsi jurusan (opsional)"
                        aria-label="Deskripsi jurusan"
                      />
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={closeModals}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                      aria-label="Batal"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleCreate}
                      className="px-4 py-2 bg-teal-500 dark:bg-teal-600 text-white rounded-md hover:bg-teal-600 dark:hover:bg-teal-700"
                      aria-label="Simpan jurusan baru"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isEditModalOpen && (
              <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Jurusan</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Nama</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-teal-100 dark:bg-gray-700"
                        placeholder="Masukkan nama jurusan (e.g., RPL)"
                        aria-label="Nama jurusan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Deskripsi</label>
                      <input
                        type="text"
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-teal-100 dark:bg-gray-700"
                        placeholder="Masukkan deskripsi jurusan (opsional)"
                        aria-label="Deskripsi jurusan"
                      />
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={closeModals}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                      aria-label="Batal"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-teal-500 dark:bg-teal-600 text-white rounded-md hover:bg-teal-600 dark:hover:bg-teal-700"
                      aria-label="Simpan perubahan jurusan"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isConfirmModalOpen && (
              <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Yakin ingin Menonaktifkan Jurusan?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Fitur ini digunakan untuk menonaktifkan jurusan dari sistem secara aman. Seluruh data jurusan akan dinonaktifkan. Pastikan untuk menyimpan progres Anda sebelum menonaktifkan jurusan.
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
                        Lanjut Nonaktifkan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default JurusanPage;