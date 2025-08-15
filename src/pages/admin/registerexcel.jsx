import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaUpload, FaFileExcel, FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle, FaDownload } from "react-icons/fa";
import axios from 'axios';
import UKS2Img from '../../assets/img/uks2.png';
import AuthService from '../../services/authService';

const RegisterExcel = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [importResult, setImportResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  useEffect(() => {
    document.title = 'Import Pengguna';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      showToastMessage('File Excel berhasil dipilih', 'success');
    } else {
      showToastMessage('File harus berformat .xlsx', 'error');
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
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
        showToastMessage('Import berhasil diselesaikan!', 'success');
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={false} setSidebarOpen={() => {}} />
        
        <main className="grow p-6">
          <div className="w-full max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-300 rounded-xl shadow-lg">
                  <FaFileExcel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Import Pengguna
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Unggah file Excel untuk menambah pengguna secara massal
                  </p>
                </div>
              </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
              <div className={`fixed top-6 right-6 ${
                  toastType === "success"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                } px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in-right z-50 min-w-[300px]`}
              >
                <div className={`rounded-full p-2 ${
                    toastType === "success" ? "bg-white/20" : "bg-white/20"
                  }`}
                >
                  {toastType === "success" ? (
                    <FaCheckCircle className="h-5 w-5" />
                  ) : (
                    <FaExclamationTriangle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{toastMessage}</p>
                </div>
              </div>
            )}

            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-8 py-6 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <FaCloudUploadAlt className="text-teal-500" />
                  Unggah File Excel
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Pilih file .xlsx yang berisi data pengguna untuk diimport
                </p>
              </div>

              <div className="p-8">
                {/* Drag and Drop Area */}
                <div
                  className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20 scale-105'
                      : file
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="excelFile"
                  />
                  
                  <div className="space-y-4">
                    {file ? (
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                          <FaFileExcel className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                          File Terpilih
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
                          <FaCloudUploadAlt className="w-12 h-12 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Seret file ke sini atau klik untuk memilih
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Hanya file Excel (.xlsx) yang diperbolehkan
                        </p>
                        <label
                          htmlFor="excelFile"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-300 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg"
                        >
                          <FaFileExcel className="w-5 h-5" />
                          Pilih File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                {file && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white shadow-xl transform transition-all duration-200 ${
                        isUploading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:scale-105 hover:shadow-2xl'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span className="text-lg">Mengupload...</span>
                        </>
                      ) : (
                        <>
                          <FaUpload className="w-6 h-6" />
                          <span className="text-lg">Upload dan Import</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            {importResult && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 px-8 py-6 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-500" />
                    Hasil Import
                  </h3>
                </div>

                <div className="p-8">
                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-100 text-sm font-medium">Berhasil Dibuat</p>
                          <p className="text-3xl font-bold">{importResult.created_count}</p>
                        </div>
                        <FaCheckCircle className="w-10 h-10 text-emerald-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-100 text-sm font-medium">Gagal Import</p>
                          <p className="text-3xl font-bold">{importResult.failed_count}</p>
                        </div>
                        <FaExclamationTriangle className="w-10 h-10 text-red-200" />
                      </div>
                    </div>
                  </div>

                  {/* Detailed Results */}
                  <div className="space-y-6">
                    {importResult.created.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                          <FaCheckCircle className="text-green-600" />
                          Pengguna yang Berhasil Dibuat ({importResult.created.length})
                        </h4>
                        <div className="max-h-48 overflow-y-auto">
                          <div className="space-y-2">
                            {importResult.created.map((item, index) => (
                              <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Baris {item.row}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {item.id} • {item.email}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {importResult.failed.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                          <FaExclamationTriangle className="text-red-600" />
                          Pengguna yang Gagal Diimport ({importResult.failed.length})
                        </h4>
                        <div className="max-h-48 overflow-y-auto">
                          <div className="space-y-2">
                            {importResult.failed.map((item, index) => (
                              <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                                <div className="flex items-center gap-3 mb-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Baris {item.row}
                                  </span>
                                </div>
                                <p className="text-xs text-red-600 dark:text-red-400 ml-5">
                                  {item.reason}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default RegisterExcel;