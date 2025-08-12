import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaUpload, FaFileExcel } from "react-icons/fa";
import axios from 'axios';
import UKS2Img from '../../assets/img/uks2.png';
import AuthService from '../../services/authService'; // Adjust path if needed

const RegisterExcel = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [importResult, setImportResult] = useState(null);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    document.title = 'Import Pengguna';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
    } else {
      showToastMessage('File harus berformat .xlsx', 'error');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToastMessage('Pilih file Excel terlebih dahulu', 'error');
      return;
    }

    setIsUploading(true);
    setImportResult(null);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan. Silakan masuk sebagai admin.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://api-uks.rplrus.com/api/users/import-excel', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        setImportResult(response.data.data);
        showToastMessage('Import berhasil', 'success');
      } else {
        throw new Error(response.data.message || 'Import gagal');
      }
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Akses tidak diizinkan: Token tidak valid atau kadaluarsa. Silakan masuk kembali."
          : err.response?.data?.message || 'Gagal mengimport pengguna. Silakan coba lagi.';
      showToastMessage(errorMessage, 'error');
    } finally {
      setIsUploading(false);
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
              <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold">Import Pengguna dari Excel</h2>
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

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Pilih File Excel (.xlsx)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excelFile"
                  />
                  <label
                    htmlFor="excelFile"
                    className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
                  >
                    <FaFileExcel className="w-5 h-5" />
                    <span>Pilih File</span>
                  </label>
                  {file && <span className="text-gray-700 dark:text-gray-200">{file.name}</span>}
                </div>
              </div>
              <button
                onClick={handleUpload}
                disabled={isUploading || !file}
                className="flex items-center gap-2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
              >
                <FaUpload className="w-5 h-5" />
                <span>{isUploading ? 'Mengupload...' : 'Upload dan Import'}</span>
              </button>
            </div>

            {importResult && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Hasil Import</h3>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <p className="mb-2">Dibuat: {importResult.created_count}</p>
                  <p className="mb-2">Gagal: {importResult.failed_count}</p>

                  {importResult.created.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Pengguna yang Dibuat:</h4>
                      <ul className="list-disc pl-5">
                        {importResult.created.map((item, index) => (
                          <li key={index}>
                            Baris {item.row}: ID {item.id}, Email {item.email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {importResult.failed.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Pengguna yang Gagal:</h4>
                      <ul className="list-disc pl-5">
                        {importResult.failed.map((item, index) => (
                          <li key={index}>
                            Baris {item.row}: {item.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegisterExcel;