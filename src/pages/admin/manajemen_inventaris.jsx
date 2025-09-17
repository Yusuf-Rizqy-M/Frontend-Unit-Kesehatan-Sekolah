import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaTrash, FaEye, FaEdit, FaPlus, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { api } from '../../services/authServiceInventaris';
import UKS2Img from '../../assets/img/uks2.png';

const ManajemenInventaris = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockAction, setStockAction] = useState('add');
  const [stockAmount, setStockAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deleteId, setDeleteId] = useState(null);

  const [newMedicine, setNewMedicine] = useState({
    nama_barang: '',
    jumlah: '',
    kategori: '',
    kondisi: 'baik',
  });

  const [editMedicine, setEditMedicine] = useState({
    id: null,
    nama_barang: '',
    jumlah: '',
    kategori: '',
    kondisi: 'baik',
  });

  // Set document title and favicon
  useEffect(() => {
    document.title = 'Manajemen Inventaris';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);

    // Cleanup to prevent duplicate favicon elements
    return () => {
      const existingFavicon = document.querySelector("link[rel='icon']");
      if (existingFavicon && existingFavicon.href === UKS2Img) {
        document.head.removeChild(existingFavicon);
      }
    };
  }, []);

  // Get token from localStorage or sessionStorage
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fetch medicines from API
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await api.get('/inventaris', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedicines(response.data.filter(med => med.status === 'active'));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data inventaris');
      setLoading(false);
    }
  };

  // Fetch medicine details (local fallback since GET /inventaris/{id} is not confirmed)
  const fetchMedicineDetails = (id) => {
    const medicine = medicines.find(med => med.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setIsModalOpen(true);
    } else {
      showToastMessage('Barang tidak ditemukan', 'error');
    }
  };

  // Handle input change for add form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input change for edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditMedicine(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle stock amount change
  const handleStockAmountChange = (e) => {
    setStockAmount(e.target.value);
  };

  // Show toast notification
  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Add medicine
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await api.post('/inventaris', {
        nama_barang: newMedicine.nama_barang,
        jumlah: parseInt(newMedicine.jumlah),
        kategori: newMedicine.kategori,
        kondisi: newMedicine.kondisi,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMedicines(prev => [...prev, response.data.data]);
      showToastMessage(response.data.message, 'success');
      setIsAddModalOpen(false);
      setNewMedicine({
        nama_barang: '',
        jumlah: '',
        kategori: '',
        kondisi: 'baik',
      });
    } catch (err) {
      showToastMessage(err.response?.data?.message || 'Gagal menambahkan barang', 'error');
    }
  };

  // Update medicine
  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await api.put(`/inventaris/${editMedicine.id}`, {
        nama_barang: editMedicine.nama_barang,
        jumlah: parseInt(editMedicine.jumlah),
        kategori: editMedicine.kategori,
        kondisi: editMedicine.kondisi,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMedicines(prev => prev.map(med => 
        med.id === editMedicine.id ? response.data.data : med
      ));
      showToastMessage(response.data.message || 'Barang berhasil diperbarui', 'success');
      setIsEditModalOpen(false);
    } catch (err) {
      showToastMessage(err.response?.data?.message || 'Gagal memperbarui barang', 'error');
    }
  };

  // Delete medicine
  const handleDelete = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await api.delete(`/inventaris/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMedicines(prev => prev.filter(med => med.id !== deleteId));
      showToastMessage(response.data.message, 'success');
      setIsConfirmModalOpen(false);
    } catch (err) {
      showToastMessage(err.response?.data?.message || 'Gagal menghapus barang', 'error');
    }
  };

  // Handle stock update
  const handleStockUpdate = async (e) => {
    e.preventDefault();
    const amount = parseInt(stockAmount);
    if (isNaN(amount) || amount <= 0) {
      showToastMessage('Jumlah stok tidak valid', 'error');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const newJumlah = stockAction === 'add' 
        ? parseInt(editMedicine.jumlah) + amount 
        : Math.max(0, parseInt(editMedicine.jumlah) - amount);

      const response = await api.put(`/inventaris/${editMedicine.id}`, {
        nama_barang: editMedicine.nama_barang,
        jumlah: newJumlah,
        kategori: editMedicine.kategori,
        kondisi: editMedicine.kondisi,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMedicines(prev => prev.map(med => 
        med.id === editMedicine.id ? { ...med, jumlah: newJumlah } : med
      ));
      showToastMessage(stockAction === 'add' ? 'Stok berhasil ditambahkan' : 'Stok berhasil dikurangi', 'success');
      setIsStockModalOpen(false);
      setStockAmount('');
    } catch (err) {
      showToastMessage(err.response?.data?.message || 'Gagal memperbarui stok', 'error');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(medicines.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem);

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow p-6">
          <style>
            {`
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
            `}
          </style>
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold">Manajemen Inventaris</h2>
              <button
                className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
                onClick={() => setIsAddModalOpen(true)}
                aria-label="Tambah barang baru"
              >
                <FaPlus className="w-5 h-5" />
                <span>Tambah Barang</span>
              </button>
            </div>

            {/* Toast Notification */}
            {showToast && (
              <div
                className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${
                  toastType === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                } px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50`}
              >
                <div
                  className={`rounded-full p-1 ${
                    toastType === "success" ? "bg-green-600" : "bg-red-600"
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

            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Memuat...</div>
            ) : error ? (
              <div className="text-center text-red-500 dark:text-red-400">{error}</div>
            ) : medicines.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Tidak ada data inventaris tersedia.</div>
            ) : (
              <table className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-300">
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">No</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Nama Barang</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Jumlah</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Kategori</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Kondisi</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMedicines.map((medicine, index) => (
                    <tr key={medicine.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{medicine.nama_barang}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{medicine.jumlah}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{medicine.kategori}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{medicine.kondisi}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                            onClick={() => fetchMedicineDetails(medicine.id)}
                            aria-label="Lihat detail barang"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                            onClick={() => {
                              setEditMedicine(medicine);
                              setIsEditModalOpen(true);
                            }}
                            aria-label="Edit barang"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                            onClick={() => {
                              setDeleteId(medicine.id);
                              setIsConfirmModalOpen(true);
                            }}
                            aria-label="Hapus barang"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                            onClick={() => {
                              setEditMedicine(medicine);
                              setStockAction('add');
                              setIsStockModalOpen(true);
                            }}
                            aria-label="Tambah stok barang"
                          >
                            <FaPlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                            onClick={() => {
                              setEditMedicine(medicine);
                              setStockAction('subtract');
                              setIsStockModalOpen(true);
                            }}
                            aria-label="Kurangi stok barang"
                          >
                            <FaMinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
              <span>
                Menampilkan {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, medicines.length)} dari {medicines.length}
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
                    aria-label={`Halaman ${pageNumber}`}
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
                    aria-label={`Halaman ${totalPages}`}
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
          </div>
        </main>

        {/* Modal Tambah Barang */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Tutup modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Tambah Barang</h3>
              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nama Barang:</span>
                  </label>
                  <input
                    type="text"
                    name="nama_barang"
                    value={newMedicine.nama_barang}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan nama barang"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Jumlah:</span>
                  </label>
                  <input
                    type="number"
                    name="jumlah"
                    value={newMedicine.jumlah}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan jumlah stok"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Kategori:</span>
                  </label>
                  <input
                    type="text"
                    name="kategori"
                    value={newMedicine.kategori}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan kategori barang"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Kondisi:</span>
                  </label>
                  <select
                    name="kondisi"
                    value={newMedicine.kondisi}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                  >
                    <option value="baik">Baik</option>
                    <option value="rusak ringan">Rusak Ringan</option>
                    <option value="rusak berat">Rusak Berat</option>
                  </select>
                </div>
                {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => setIsAddModalOpen(false)}
                    aria-label="Batal tambah barang"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700"
                    aria-label="Tambah barang"
                  >
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Barang */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Tutup modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Barang</h3>
              <form onSubmit={handleUpdateMedicine} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nama Barang:</span>
                  </label>
                  <input
                    type="text"
                    name="nama_barang"
                    value={editMedicine.nama_barang}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan nama barang"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Jumlah:</span>
                  </label>
                  <input
                    type="number"
                    name="jumlah"
                    value={editMedicine.jumlah}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan jumlah stok"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Kategori:</span>
                  </label>
                  <input
                    type="text"
                    name="kategori"
                    value={editMedicine.kategori}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan kategori barang"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Kondisi:</span>
                  </label>
                  <select
                    name="kondisi"
                    value={editMedicine.kondisi}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                  >
                    <option value="baik">Baik</option>
                    <option value="rusak ringan">Rusak Ringan</option>
                    <option value="rusak berat">Rusak Berat</option>
                  </select>
                </div>
                {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => setIsEditModalOpen(false)}
                    aria-label="Batal edit barang"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700"
                    aria-label="Simpan perubahan barang"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Barang */}
        {isModalOpen && selectedMedicine && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg z-60 relative">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nama Barang</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.nama_barang}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Jumlah</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.jumlah}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Kategori</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.kategori}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Kondisi</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.kondisi}</div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Kembali dari detail barang"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Yakin Ingin Menghapus Barang?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Tindakan ini akan menghapus data barang dari sistem secara permanen. Pastikan Anda telah menyimpan data penting sebelum melanjutkan.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                    onClick={() => setIsConfirmModalOpen(false)}
                    aria-label="Batal hapus barang"
                  >
                    Batal
                  </button>
                  <button
                    className="px-6 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                    onClick={handleDelete}
                    aria-label="Hapus barang"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Tambah/Kurangi Stok */}
        {isStockModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() => setIsStockModalOpen(false)}
                aria-label="Tutup modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {stockAction === 'add' ? 'Tambah Stok' : 'Kurangi Stok'}
              </h3>
              <form onSubmit={handleStockUpdate} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Jumlah:</span>
                  </label>
                  <input
                    type="number"
                    value={stockAmount}
                    onChange={handleStockAmountChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan jumlah stok"
                    min="1"
                  />
                </div>
                {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => setIsStockModalOpen(false)}
                    aria-label="Batal"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700"
                    aria-label={stockAction === 'add' ? 'Tambah stok' : 'Kurangi stok'}
                  >
                    {stockAction === 'add' ? 'Tambah' : 'Kurangi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManajemenInventaris;