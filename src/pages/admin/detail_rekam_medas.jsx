import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaEdit, FaTrash } from 'react-icons/fa';
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

const DetailRekamMedisSiswa = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari URL
  const [userData, setUserData] = useState(null); // State untuk data pengguna
  const [searchQuery, setSearchQuery] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Form visibility states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Set document title and favicon
  useEffect(() => {
    document.title = 'Detail Rekam Medis Siswa';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);
  }, []);

  // Retrieve token from storage
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fetch user details berdasarkan ID dari URL
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`https://api-uks.rplrus.com/api/users/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        if (data.status && data.data) {
          setUserData(data.data);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserData(null); // Set null jika gagal untuk menampilkan pesan fallback
      }
    };

    fetchUserDetails();
  }, [id]); // Bergantung pada id dari useParams

  // Fetch medical records untuk pengguna
  useEffect(() => {
    if (!userData?.id) {
      console.error('User ID is missing');
      return;
    }

    const fetchMedicalRecords = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`https://api-uks.rplrus.com/api/healthcondition/${userData.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch medical records: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status && data.data) {
          setMedicalRecords(data.data.filter(record => record.status === 'active') || []);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching medical records:', error);
        setMedicalRecords([]); // Set empty array on error to avoid undefined issues
      }
    };

    fetchMedicalRecords();
  }, [userData?.id]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddRecord = () => {
    setShowAddForm(true);
  };

  const handleViewRecordDetail = (recordId) => {
    const record = medicalRecords.find((r) => r.id_user_condition === recordId);
    setSelectedRecord(record);
    setShowViewForm(true);
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setShowEditForm(true);
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Apakah Anda yakin ingin menonaktifkan rekam medis ini?')) {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(
          `https://api-uks.rplrus.com/api/health-conditions/${userData.id}/${recordId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to mark health condition as inactive');
        }

        setMedicalRecords(medicalRecords.filter((record) => record.id_user_condition !== recordId));
      } catch (error) {
        console.error('Error marking record as inactive:', error);
      }
    }
  };

  const filteredMedicalRecords = medicalRecords.filter((record) =>
    [
      record.anamnesis?.toLowerCase(),
      record.created_at,
      record.therapy?.toLowerCase(),
    ].some((field) => field?.includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredMedicalRecords.length / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredMedicalRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBack = () => {
    navigate('/rekammedis');
  };

  // Add Form Component
  const AddForm = () => {
    const [formData, setFormData] = useState({
      tension: '',
      temperature: '',
      height: '',
      weight: '',
      spo2: '',
      pulse: '',
      therapy: '',
      anamnesis: '',
    });
    const [error, setError] = useState(null);

    const popupRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          setShowAddForm(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
      e.preventDefault();
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://api-uks.rplrus.com/api/health-conditions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userData.id,
            admin_id: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}').id,
            tension: parseInt(formData.tension),
            temperature: parseInt(formData.temperature),
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            spo2: parseInt(formData.spo2),
            pulse: parseInt(formData.pulse),
            therapy: formData.therapy,
            anamnesis: formData.anamnesis,
            status: 'active',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create health condition');
        }

        const newRecord = await response.json();
        setMedicalRecords((prev) => [...prev, newRecord.data]);
        setShowAddForm(false);
      } catch (error) {
        setError(error.message);
        console.error('Error creating health condition:', error);
      }
    };

    const handleCancel = () => {
      setShowAddForm(false);
    };

    return (
      <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 font-sans">
        <div ref={popupRef} className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
          <div className="flex items-center mb-4">
            <button
              onClick={handleCancel}
              className="mr-2 text-teal-800 hover:text-teal-600 transition-colors"
              aria-label="Kembali"
            >
              <svg
                className="w-6 h-6"
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
            <h2 className="text-lg font-semibold text-gray-800">Tambah Rekam Medis</h2>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anamnesis</label>
              <textarea
                name="anamnesis"
                value={formData.anamnesis}
                onChange={handleFormChange}
                placeholder="Masukkan anamnesis"
                className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800 focus:outline-none resize-none"
                required
              />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'Tensi', name: 'tension', placeholder: '120' },
                { label: 'Nadi', name: 'pulse', placeholder: '80' },
                { label: 'Suhu', name: 'temperature', placeholder: '36.5' },
                { label: 'SpO2', name: 'spo2', placeholder: '98' },
                { label: 'Tinggi Badan', name: 'height', placeholder: '170.00' },
                { label: 'Berat Badan', name: 'weight', placeholder: '60.00' },
              ].map(({ label, name, placeholder }, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleFormChange}
                    placeholder={placeholder}
                    className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terapi</label>
              <textarea
                name="therapy"
                value={formData.therapy}
                onChange={handleFormChange}
                placeholder="Masukkan terapi"
                className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800 focus:outline-none resize-none"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-[#B3E5FC] text-teal-800 rounded-lg hover:bg-[#81D4FA] transition-colors font-semibold"
              >
                Batalkan
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#26A69A] text-white rounded-lg hover:bg-[#1E887D] transition-colors font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Form Component
  const EditForm = ({ record }) => {
    const [formData, setFormData] = useState({
      tension: record?.tension || '',
      temperature: record?.temperature || '',
      height: record?.height || '',
      weight: record?.weight || '',
      spo2: record?.spo2 || '',
      pulse: record?.pulse || '',
      therapy: record?.therapy || '',
      anamnesis: record?.anamnesis || '',
    });
    const [error, setError] = useState(null);

    const popupRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          setShowEditForm(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
      e.preventDefault();
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(
          `https://api-uks.rplrus.com/api/health-conditions/${userData.id}/${record.id_user_condition}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tension: parseInt(formData.tension),
              temperature: parseInt(formData.temperature),
              height: parseFloat(formData.height),
              weight: parseFloat(formData.weight),
              spo2: parseInt(formData.spo2),
              pulse: parseInt(formData.pulse),
              therapy: formData.therapy,
              anamnesis: formData.anamnesis,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update health condition');
        }

        const updatedRecord = await response.json();
        setMedicalRecords((prev) =>
          prev.map((r) => (r.id_user_condition === record.id_user_condition ? updatedRecord.data : r))
        );
        setShowEditForm(false);
      } catch (error) {
        setError(error.message);
        console.error('Error updating health condition:', error);
      }
    };

    const handleCancel = () => {
      setShowEditForm(false);
    };

    return (
      <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 font-sans">
        <div ref={popupRef} className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
          <div className="flex items-center mb-4">
            <button
              onClick={handleCancel}
              className="mr-2 text-teal-800 hover:text-teal-600 transition-colors"
              aria-label="Kembali"
            >
              <svg
                className="w-6 h-6"
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
            <h2 className="text-lg font-semibold text-gray-800">Edit Rekam Medis</h2>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anamnesis</label>
              <textarea
                name="anamnesis"
                value={formData.anamnesis}
                onChange={handleFormChange}
                placeholder="Masukkan anamnesis"
                className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800 focus:outline-none resize-none"
                required
              />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'Tensi', name: 'tension', placeholder: '120' },
                { label: 'Nadi', name: 'pulse', placeholder: '80' },
                { label: 'Suhu', name: 'temperature', placeholder: '36.5' },
                { label: 'SpO2', name: 'spo2', placeholder: '98' },
                { label: 'Tinggi Badan', name: 'height', placeholder: '170.00' },
                { label: 'Berat Badan', name: 'weight', placeholder: '60.00' },
              ].map(({ label, name, placeholder }, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleFormChange}
                    placeholder={placeholder}
                    className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terapi</label>
              <textarea
                name="therapy"
                value={formData.therapy}
                onChange={handleFormChange}
                placeholder="Masukkan terapi"
                className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800 focus:outline-none resize-none"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-[#B3E5FC] text-teal-800 rounded-lg hover:bg-[#81D4FA] transition-colors font-semibold"
              >
                Batalkan
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#26A69A] text-white rounded-lg hover:bg-[#1E887D] transition-colors font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // View Form Component
  const ViewForm = ({ record }) => {
    const popupRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          setShowViewForm(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleCancel = () => {
      setShowViewForm(false);
    };

    return (
      <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 font-sans">
        <div ref={popupRef} className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
          <div className="flex items-center mb-4">
            <button
              onClick={handleCancel}
              className="mr-2 text-teal-800 hover:text-teal-600 transition-colors"
              aria-label="Kembali"
            >
              <svg
                className="w-6 h-6"
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
            <h2 className="text-lg font-semibold text-gray-800">Lihat Rekam Medis</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Dibuat</label>
              <p className="w-full p-2 rounded-lg bg-[#E6F0FA] text-gray-800">
                {record.created_at?.split('T')[0] || '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anamnesis</label>
              <p className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800">
                {record.anamnesis || '-'}
              </p>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'Tensi', name: 'tension' },
                { label: 'Nadi', name: 'pulse' },
                { label: 'Suhu', name: 'temperature' },
                { label: 'SpO2', name: 'spo2' },
                { label: 'Tinggi Badan', name: 'height' },
                { label: 'Berat Badan', name: 'weight' },
              ].map(({ label, name }, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <p className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800">
                    {record[name] || '-'}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terapi</label>
              <p className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800">
                {record.therapy || '-'}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-[#B3E5FC] text-teal-800 rounded-lg hover:bg-[#81D4FA] transition-colors font-semibold"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
            {userData ? (
              <div className="bg-[#ffffff] dark:bg-[#051D4E] rounded-[10px] p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Informasi Siswa</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nama:</strong> {userData.name || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Gender:</strong> {userData.gender || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nomor HP:</strong> {userData.phone_number || '-'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Kelas:</strong> {userData.class || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nama Kelas:</strong> {userData.name_grades || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Jurusan:</strong> {userData.name_department || '-'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nama Orang Tua:</strong> {userData.name_parent || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Nomor HP Orang Tua:</strong> {userData.no_hp_parent || '-'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="font-medium">Wali Kelas:</strong> {userData.name_walikelas || '-'}
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
              {currentRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Nomor</th>
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Tanggal</th>
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Anamnesis</th>
                        <th className="p-3 text-left text-gray-800 dark:text-gray-200">Terapi</th>
                        <th className="p-3 text-right w-24 text-gray-800 dark:text-gray-200"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.map((record, index) => (
                        <tr
                          key={index}
                          className="border-b-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="p-3 text-gray-600 dark:text-gray-300">{record.id_user_condition || '-'}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">{record.created_at?.split('T')[0] || '-'}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">{record.anamnesis || '-'}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">{record.therapy || '-'}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-between gap-2 h-full">
                              <div className="flex items-center gap-2">
                                <FaEdit
                                  onClick={() => handleEditRecord(record)}
                                  className="w-5 h-5 text-blue-500 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300"
                                  aria-label="Edit rekam medis"
                                />
                                <FaTrash
                                  onClick={() => handleDeleteRecord(record.id_user_condition)}
                                  className="w-5 h-5 text-red-500 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300"
                                  aria-label="Nonaktifkan rekam medis"
                                />
                              </div>
                              <svg
                                onClick={() => handleViewRecordDetail(record.id_user_condition)}
                                className="w-8 h-8 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
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
                <p className="text-gray-600 dark:text-gray-300">Tidak ada rekam medis tersedia.</p>
              )}
              <div className="flex justify-between items-center mt-6 text-sm dark:text-gray-300">
                <p>
                  Showing{' '}
                  {filteredMedicalRecords.length === 0 ? 0 : indexOfFirstRecord + 1}–
                  {Math.min(indexOfLastRecord, filteredMedicalRecords.length)} of{' '}
                  {filteredMedicalRecords.length}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50"
                  >
                    ← Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded ${currentPage === page
                          ? 'bg-green-600 dark:bg-[#204ECF] text-white'
                          : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50"
                  >
                    Berikutnya →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        {showAddForm && <AddForm />}
        {showEditForm && selectedRecord && <EditForm record={selectedRecord} />}
        {showViewForm && selectedRecord && <ViewForm record={selectedRecord} />}
      </div>
    </div>
  );
};

export default DetailRekamMedisSiswa;