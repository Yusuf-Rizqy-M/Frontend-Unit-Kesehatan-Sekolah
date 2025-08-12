import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import axios from 'axios';
import UKS2Img from '../../assets/img/uks2.png';

const KelasPage = () => {
  const [grades, setGrades] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editGrade, setEditGrade] = useState(null);
  const [formData, setFormData] = useState({ name: '', department_id: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [departments, setDepartments] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    document.title = 'Kelas';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan. Silakan masuk kembali.');
        }

        const gradesResponse = await axios.get('https://api-uks.rplrus.com/api/grades', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });
        console.log('API Response (Grades):', gradesResponse.data);
        const activeGrades = gradesResponse.data.filter(grade => grade.status === 'active');
        console.log('Filtered Active Grades:', activeGrades);
        if (activeGrades.length === 0) {
          showToastMessage('Tidak ada kelas aktif yang ditemukan. Silakan tambahkan kelas baru.', 'error');
        }
        setGrades(activeGrades);

        const departmentsResponse = await axios.get('https://api-uks.rplrus.com/api/departments', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });
        console.log('API Response (Departments):', departmentsResponse.data);
        const activeDepartments = departmentsResponse.data.filter(dept => dept.status === 'active');
        setDepartments(activeDepartments);
      } catch (err) {
        console.error('Kesalahan saat mengambil data:', err.response || err.message);
        const errorMessage =
          err.response?.status === 401
            ? "Akses tidak diizinkan: Token tidak valid atau kadaluarsa. Silakan masuk kembali."
            : err.response?.data?.message || 'Gagal memuat data kelas atau jurusan. Silakan coba lagi.';
        showToastMessage(errorMessage, 'error');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormData({ name: '', department_id: '' });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (grade) => {
    setEditGrade(grade);
    setFormData({
      name: grade.name || '',
      department_id: departments.find((d) => d.name === grade.department_name)?.id || '',
    });
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditGrade(null);
    setFormData({ name: '', department_id: '' });
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.department_id) {
      showToastMessage('Semua kolom wajib diisi', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan. Silakan masuk kembali.');
      }

      const response = await axios.post(
        'https://api-uks.rplrus.com/api/grades',
        {
          name: formData.name,
          department_id: parseInt(formData.department_id),
          status: 'active',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newGrade = {
        ...response.data.data,
        department_name: departments.find((d) => d.id === parseInt(formData.department_id))?.name || 'Tidak Diketahui',
      };
      setGrades([...grades, newGrade]);
      closeModals();
      showToastMessage("Kelas berhasil ditambahkan", "success");
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Akses tidak diizinkan: Token tidak valid atau kadaluarsa. Silakan masuk kembali."
          : err.response?.data?.message || 'Gagal menambahkan kelas. Silakan coba lagi.';
      showToastMessage(errorMessage, 'error');
    }
  };

  const handleEdit = async () => {
    if (!formData.name || !formData.department_id) {
      showToastMessage('Semua kolom wajib diisi', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan. Silakan masuk kembali.');
      }

      const response = await axios.put(
        `https://api-uks.rplrus.com/api/grades/${editGrade.id}`,
        {
          name: formData.name,
          department_id: parseInt(formData.department_id),
          status: 'active',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGrades(
        grades.map((grade) =>
          grade.id === editGrade.id
            ? {
                ...grade,
                ...response.data.data,
                department_name: departments.find((d) => d.id === parseInt(formData.department_id))?.name || 'Tidak Diketahui',
              }
            : grade
        )
      );
      closeModals();
      showToastMessage("Kelas berhasil diperbarui", "success");
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Akses tidak diizinkan: Token tidak valid atau kadaluarsa. Silakan masuk kembali."
          : err.response?.data?.message || 'Gagal memperbarui kelas. Silakan coba lagi.';
      showToastMessage(errorMessage, 'error');
    }
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan. Silakan masuk kembali.');
      }

      await axios.delete(`https://api-uks.rplrus.com/api/grades/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrades(grades.filter(grade => grade.id !== deleteId));
      setIsConfirmModalOpen(false);
      showToastMessage("Kelas berhasil dihapus", "success");
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Akses tidak diizinkan: Token tidak valid atau kadaluarsa. Silakan masuk kembali."
          : err.response?.data?.message || 'Gagal menghapus kelas. Silakan coba lagi.';
      showToastMessage(errorMessage, 'error');
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
              <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold">Kelas</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
                aria-label="Tambah kelas baru"
              >
                <FaPlus className="w-5 h-5" />
                <span>Tambah Kelas</span>
              </button>
            </div>

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

            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm rounded-[10px]" role="grid">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-300">
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">No</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Nama</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Jurusan</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {grades.length > 0 ? (
                    grades.map((grade, index) => (
                      <tr key={grade.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{index + 1}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{grade.name}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{grade.department_name}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(grade)}
                              className="text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                              aria-label={`Edit kelas ${grade.name}`}
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(grade.id)}
                              className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                              aria-label={`Hapus kelas ${grade.name}`}
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
                        Tidak ada data kelas aktif
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-gray-500 dark:text-gray-300 text-sm">
              <span>Menampilkan {grades.length} kelas</span>
            </div>

            {isCreateModalOpen && (
              <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Tambah Kelas</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Nama</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-teal-100 dark:bg-gray-700"
                        placeholder="Masukkan nama kelas"
                        aria-label="Nama kelas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Jurusan</label>
                      <select
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-teal-100 dark:bg-gray-700"
                        aria-label="Pilih jurusan"
                      >
                        <option value="">Pilih Jurusan</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={closeModals}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                      aria-label="Batal menambah kelas"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleCreate}
                      className="px-4 py-2 bg-teal-500 dark:bg-teal-600 text-white rounded-md hover:bg-teal-600 dark:hover:bg-teal-700"
                      aria-label="Simpan kelas baru"
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
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Kelas</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Nama</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-teal-100 dark:bg-gray-700"
                        placeholder="Masukkan nama kelas"
                        aria-label="Nama kelas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Jurusan</label>
                      <select
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-teal-100 dark:bg-gray-700"
                        aria-label="Pilih jurusan"
                      >
                        <option value="">Pilih Jurusan</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={closeModals}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                      aria-label="Batal mengedit kelas"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-teal-500 dark:bg-teal-600 text-white rounded-md hover:bg-teal-600 dark:hover:bg-teal-700"
                      aria-label="Simpan perubahan kelas"
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
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Yakin Ingin Menghapus Kelas?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Tindakan ini akan menghapus data kelas dari sistem secara permanen. Pastikan Anda telah menyimpan data penting sebelum melanjutkan.
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                        onClick={() => setIsConfirmModalOpen(false)}
                        aria-label="Batal menghapus kelas"
                      >
                        Batal
                      </button>
                      <button
                        className="px-6 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                        onClick={handleDelete}
                        aria-label="Hapus kelas"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default KelasPage;