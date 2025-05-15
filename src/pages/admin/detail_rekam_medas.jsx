import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DetailRekamMedisSiswa = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { student } = state || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch medical records from API
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      if (!student?.id) {
        console.error('Student ID is missing');
        setError('Student ID is required');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://api-uks.rplrus.com/api/health-conditions?student_id=${student.id}`
        );
        setMedicalRecords(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching medical records:', err);
        setError('Failed to load medical records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [student?.id]);

  // Handle new or updated records from navigation state
  useEffect(() => {
    if (state?.updatedRecord) {
      setMedicalRecords((prev) =>
        prev.map((r) => (r.id === state.updatedRecord.id ? state.updatedRecord : r))
      );
    } else if (state?.newRecord) {
      setMedicalRecords((prev) => [...prev, state.newRecord]);
    }
  }, [state]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddRecord = () => {
    if (student) {
      navigate('/rekammedis/add', { state: { student } });
    } else {
      console.log('No student data available to add record.');
    }
  };

  const handleViewRecordDetail = (recordId) => {
    const selectedRecord = medicalRecords.find((record) => record.id === recordId);
    navigate(`/rekammedis/view/${recordId}`, {
      state: { student, newRecord: selectedRecord },
    });
  };

  const handleEditRecord = (record) => {
    navigate(`/rekammedis/edit/${record.id}`, { state: { student, record } });
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rekam medis ini?')) {
      try {
        await axios.delete(`https://api-uks.rplrus.com/api/health-conditions/${recordId}`);
        setMedicalRecords(medicalRecords.filter((record) => record.id !== recordId));
      } catch (err) {
        console.error('Error deleting record:', err);
        setError('Failed to delete record. Please try again.');
      }
    }
  };

  const filteredMedicalRecords = medicalRecords.filter((record) =>
    (
      record.anamnesa?.toLowerCase().includes(searchQueryJUSTIFYtoLowerCase()) ||
      record.date?.includes(searchQuery) ||
      record.terapi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? false
  );

  const handleBack = () => {
    navigate('/rekammedis');
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 w-full max-w-9xl mx-auto">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
              aria-label="Kembali"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm font-medium">Kembali</span>
            </button>
            <h2 className="text-2xl md:text-3xl text-gray-800 border-b-2 border-green-500 pb-2 mb-8 inline-block whitespace-nowrap">
              Detail Rekam Medis Siswa
            </h2>
            {student ? (
              <div className="bg-[#ffffff] dark:bg-[#051D4E] rounded-[10px] p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Informasi Siswa</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nama:</strong> {student.name || student.id || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Gender:</strong> {student.gender || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nomor HP:</strong> {student.phone_number || '-'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Kelas:</strong> {student.class || student.kelas || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nama Kelas:</strong> {student.name_grades || student.namaKelas || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Jurusan:</strong> {student.name_department || '-'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nama Orang Tua:</strong> {student.name_parent || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nomor HP Orang Tua:</strong> {student.no_hp_parent || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Wali Kelas:</strong> {student.name_walikelas || '-'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mb-6">Tidak ada data siswa tersedia.</p>
            )}
            <div className="bg-[#9BC7B6] dark:bg-[#051D4E] rounded-[10px] p-4 flex items-center gap-4 mb-6">
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
                  onChange={handleSearchChange}
                  className="
                    w-full pl-10 pr-4 py-2 rounded-[10px]
                    bg-white dark:bg-gray-700
                    text-[#6D9C9D] dark:text-white
                    placeholder-[#6D9C9D] dark:placeholder-gray-400
                    focus:outline-none
                  "
                />
              </div>
              <button
                onClick={handleAddRecord}
                className="
                  w-[150px] rounded-[10px] bg-white dark:bg-gray-700
                  text-[#6D9C9D] dark:text-gray-200
                  py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600
                  focus:outline-none transition-colors
                  flex items-center justify-center gap-2
                "
                aria-label="Tambah Rekam Medis"
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
                <span>Tambah</span>
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-[10px] p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Riwayat Medis</h3>
              {loading && <p className="text-gray-600 dark:text-gray-300">Loading...</p>}
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {filteredMedicalRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Tanggal</th>
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Anamnesa</th>
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Terapi</th>
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Dokter</th>
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedicalRecords.map((record, index) => (
                        <tr
                          key={index}
                          className="border-b-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="p-3 text-gray-600 dark:text-gray-300">{record.date || '-'}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">{record.anamnesa || '-'}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">{record.terapi || '-'}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">{record.doctor || '-'}</td>
                          <td className="p-3 text-left">
                            <div className="flex items-center justify-between gap-2 h-full">
                              <div className="flex items-center gap-2">
                                <FaEdit
                                  onClick={() => handleEditRecord(record)}
                                  className="w-5 h-5 text-blue-500 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300"
                                  aria-label="Edit rekam medis"
                                />
                                <FaTrash
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="w-5 h-5 text-red-500 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300"
                                  aria-label="Hapus rekam medis"
                                />
                              </div>
                              <svg
                                onClick={() => handleViewRecordDetail(record.id)}
                                className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Lihat detail rekam medis"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {loading ? 'Loading...' : 'Tidak ada rekam medis tersedia.'}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailRekamMedisSiswa;