import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaTrash, FaEye, FaEdit, FaPlus, FaPlusCircle, FaMinusCircle } from "react-icons/fa";

// Hardcoded medicine data
const initialMedicines = [
  {
    id: 1,
    nama_obat: "Paracetamol",
    stok: 100,
    deskripsi: "Obat untuk menurunkan demam dan meredakan nyeri",
    tanggal_kadaluarsa: "2026-12-31",
    kategori: "Analgesik",
    gambar: "/images/paracetamol.jpg",
    status: "active"
  },
  {
    id: 2,
    nama_obat: "Amoxicillin",
    stok: 50,
    deskripsi: "Antibiotik untuk infeksi bakteri",
    tanggal_kadaluarsa: "2025-06-30",
    kategori: "Antibiotik",
    gambar: "/images/amoxicillin.jpg",
    status: "active"
  },
  {
    id: 3,
    nama_obat: "Ibuprofen",
    stok: 75,
    deskripsi: "Obat anti-inflamasi nonsteroid",
    tanggal_kadaluarsa: "2027-03-15",
    kategori: "Analgesik",
    gambar: "/images/ibuprofen.jpg",
    status: "active"
  }
];

const ManajemenInventaris = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicines, setMedicines] = useState(initialMedicines);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockAction, setStockAction] = useState('add'); // 'add' or 'subtract'
  const [stockAmount, setStockAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deleteId, setDeleteId] = useState(null);

  const [newMedicine, setNewMedicine] = useState({
    nama_obat: '',
    stok: '',
    deskripsi: '',
    tanggal_kadaluarsa: '',
    kategori: '',
    gambar: null,
  });

  const [editMedicine, setEditMedicine] = useState({
    id: null,
    nama_obat: '',
    stok: '',
    deskripsi: '',
    tanggal_kadaluarsa: '',
    kategori: '',
    gambar: null,
  });

  // Simulate fetching medicines
  const fetchMedicines = () => {
    setLoading(true);
    setTimeout(() => {
      setMedicines(initialMedicines.filter(med => med.status === 'active'));
      setLoading(false);
    }, 500);
  };

  // Simulate fetching medicine details
  const fetchMedicineDetails = (id) => {
    const medicine = medicines.find(med => med.id === id);
    if (medicine) {
      setSelectedMedicine(medicine);
      setIsModalOpen(true);
    } else {
      showToastMessage('Obat tidak ditemukan', 'error');
    }
  };

  // Handle input change for add form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewMedicine(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle input change for edit form
  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditMedicine(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
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
  const handleAddMedicine = (e) => {
    e.preventDefault();
    const newId = medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1;
    const newMedicineData = {
      id: newId,
      nama_obat: newMedicine.nama_obat,
      stok: parseInt(newMedicine.stok),
      deskripsi: newMedicine.deskripsi,
      tanggal_kadaluarsa: newMedicine.tanggal_kadaluarsa,
      kategori: newMedicine.kategori,
      gambar: newMedicine.gambar ? URL.createObjectURL(newMedicine.gambar) : "/placeholder.png",
      status: "active"
    };

    setMedicines(prev => [...prev, newMedicineData]);
    showToastMessage('Obat berhasil ditambahkan', 'success');
    setIsAddModalOpen(false);
    setNewMedicine({
      nama_obat: '',
      stok: '',
      deskripsi: '',
      tanggal_kadaluarsa: '',
      kategori: '',
      gambar: null,
    });
  };

  // Update medicine
  const handleUpdateMedicine = (e) => {
    e.preventDefault();
    setMedicines(prev => prev.map(med => 
      med.id === editMedicine.id ? {
        ...med,
        nama_obat: editMedicine.nama_obat,
        stok: parseInt(editMedicine.stok),
        deskripsi: editMedicine.deskripsi,
        tanggal_kadaluarsa: editMedicine.tanggal_kadaluarsa,
        kategori: editMedicine.kategori,
        gambar: editMedicine.gambar instanceof File ? URL.createObjectURL(editMedicine.gambar) : editMedicine.gambar
      } : med
    ));
    showToastMessage('Obat berhasil diperbarui', 'success');
    setIsEditModalOpen(false);
  };

  // Delete medicine (soft delete)
  const handleDelete = () => {
    setMedicines(prev => prev.map(med => 
      med.id === deleteId ? { ...med, status: 'inactive' } : med
    ));
    showToastMessage('Obat berhasil dinonaktifkan', 'success');
    setIsConfirmModalOpen(false);
  };

  // Handle stock update
  const handleStockUpdate = (e) => {
    e.preventDefault();
    const amount = parseInt(stockAmount);
    if (isNaN(amount) || amount <= 0) {
      showToastMessage('Jumlah stok tidak valid', 'error');
      return;
    }

    setMedicines(prev => prev.map(med => 
      med.id === editMedicine.id ? {
        ...med,
        stok: stockAction === 'add' ? med.stok + amount : Math.max(0, med.stok - amount)
      } : med
    ));
    showToastMessage(stockAction === 'add' ? 'Stok berhasil ditambahkan' : 'Stok berhasil dikurangi', 'success');
    setIsStockModalOpen(false);
    setStockAmount('');
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
              <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold">Manajemen Obat</h2>
              <button
                className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
                onClick={() => setIsAddModalOpen(true)}
                aria-label="Tambah obat baru"
              >
                <FaPlus className="w-5 h-5" />
                <span>Tambah Obat</span>
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
              <div className="text-center text-gray-500 dark:text-gray-400">Tidak ada data obat tersedia.</div>
            ) : (
              <table className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-300">
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">No</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Nama Obat</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Stok</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Kategori</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium">Tanggal Kadaluarsa</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">Gambar</th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMedicines.map((medicine, index) => (
                    <tr key={medicine.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{medicine.nama_obat}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{medicine.stok}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{medicine.kategori}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{medicine.tanggal_kadaluarsa}</td>
                      <td className="py-3 px-4 text-center">
                        <img
                          src={medicine.gambar || "/placeholder.png"}
                          alt={medicine.nama_obat}
                          className="w-6 object-contain inline-block"
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                            onClick={() => fetchMedicineDetails(medicine.id)}
                            aria-label="Lihat detail obat"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                            onClick={() => {
                              setEditMedicine(medicine);
                              setIsEditModalOpen(true);
                            }}
                            aria-label="Edit obat"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                            onClick={() => {
                              setDeleteId(medicine.id);
                              setIsConfirmModalOpen(true);
                            }}
                            aria-label="Hapus obat"
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
                            aria-label="Tambah stok obat"
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
                            aria-label="Kurangi stok obat"
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

        {/* Modal Tambah Obat */}
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
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Tambah Obat</h3>
              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nama Obat:</span>
                  </label>
                  <input
                    type="text"
                    name="nama_obat"
                    value={newMedicine.nama_obat}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan nama obat"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Stok:</span>
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={newMedicine.stok}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan jumlah stok"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Deskripsi:</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    value={newMedicine.deskripsi}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan deskripsi obat"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Tanggal Kadaluarsa:</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal_kadaluarsa"
                    value={newMedicine.tanggal_kadaluarsa}
                    onChange={handleInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
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
                    placeholder="Masukkan kategori obat"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Unggah Gambar:</span>
                  </label>
                  <button
                    type="button"
                    className="flex items-center justify-center w-full rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => document.getElementById("file-input-add").click()}
                    aria-label="Unggah gambar obat"
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
                    <span>{newMedicine.gambar ? newMedicine.gambar.name : "Unggah Gambar"}</span>
                  </button>
                  <input
                    id="file-input-add"
                    type="file"
                    name="gambar"
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
                    onClick={() => setIsAddModalOpen(false)}
                    aria-label="Batal tambah obat"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700"
                    aria-label="Tambah obat"
                  >
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Obat */}
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
              <h3 className="text-xl_masks1.0.0.0
                font-bold text-gray-800 dark:text-gray-200 mb-4">Edit Obat</h3>
              <form onSubmit={handleUpdateMedicine} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Nama Obat:</span>
                  </label>
                  <input
                    type="text"
                    name="nama_obat"
                    value={editMedicine.nama_obat}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan nama obat"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Stok:</span>
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={editMedicine.stok}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan jumlah stok"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Deskripsi:</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    value={editMedicine.deskripsi}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
                    placeholder="Masukkan deskripsi obat"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Tanggal Kadaluarsa:</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal_kadaluarsa"
                    value={editMedicine.tanggal_kadaluarsa}
                    onChange={handleEditInputChange}
                    className="input w-full rounded-lg bg-teal-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    aria-required="true"
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
                    placeholder="Masukkan kategori obat"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Unggah Gambar:</span>
                  </label>
                  <button
                    type="button"
                    className="flex items-center justify-center w-full rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => document.getElementById("file-input-edit").click()}
                    aria-label="Unggah gambar obat"
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
                    <span>{editMedicine.gambar ? (typeof editMedicine.gambar === 'string' ? 'Gambar Terpilih' : editMedicine.gambar.name) : "Unggah Gambar"}</span>
                  </button>
                  <input
                    id="file-input-edit"
                    type="file"
                    name="gambar"
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
                    onClick={() => setIsEditModalOpen(false)}
                    aria-label="Batal edit obat"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700"
                    aria-label="Simpan perubahan obat"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Obat */}
        {isModalOpen && selectedMedicine && (
          <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg z-60 relative">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nama Obat</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.nama_obat}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Stok</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.stok}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Deskripsi</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.deskripsi}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Tanggal Kadaluarsa</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.tanggal_kadaluarsa}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Kategori</label>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded">{selectedMedicine.kategori}</div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Gambar</label>
                <img
                  src={selectedMedicine.gambar || "/placeholder.png"}
                  alt={selectedMedicine.nama_obat}
                  className="w-full h-32 object-contain rounded"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Kembali dari detail obat"
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
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Yakin Ingin Menonaktifkan Obat?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Tindakan ini akan menonaktifkan data obat dari sistem secara permanen. Pastikan Anda telah menyimpan data penting sebelum melanjutkan.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                    onClick={() => setIsConfirmModalOpen(false)}
                    aria-label="Batal hapus obat"
                  >
                    Batal
                  </button>
                  <button
                    className="px-6 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                    onClick={handleDelete}
                    aria-label="Nonaktifkan obat"
                  >
                    Nonaktifkan
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