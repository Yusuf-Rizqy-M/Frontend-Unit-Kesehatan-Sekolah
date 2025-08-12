import React, { useEffect, useState } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

export default function DetailRekamAntrian() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const { userId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const student = state?.student || {};

  moment.locale("id");

  // Set document title dan favicon
  useEffect(() => {
    document.title = 'Detail Rekam Antrian';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);
  }, []);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fungsi untuk memetakan status API ke status UI dalam bahasa Indonesia
  const mapStatusToUI = (apiStatus) => {
    switch (apiStatus.toLowerCase()) {
      case "done":
        return "Selesai";
      case "waiting":
        return "Menunggu";
      case "processing":
        return "Sedang Diproses";
      case "skipped":
        return "Dibatalkan";
      default:
        return "Tidak Diketahui";
    }
  };

  useEffect(() => {
    const fetchQueueHistory = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          throw new Error("Token autentikasi tidak ditemukan. Silakan masuk kembali.");
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Mengambil riwayat antrian pengguna
        const response = await axios.get(
          `https://api-uks.rplrus.com/api/admin/queue/history/user/${userId}`,
          config
        );
        const queueDataArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        if (queueDataArray.length === 0) {
          setError("Tidak ada riwayat antrian untuk siswa ini.");
          showToastMessage("Tidak ada riwayat antrian untuk siswa ini.", "error");
        }
        const formattedQueueData = queueDataArray.map((item) => ({
          id:
            item.queue_number != null
              ? item.queue_number.toString().padStart(3, "0")
              : "Tidak Ada",
          reason: item.reason || "Tidak Diketahui",
          status: mapStatusToUI(item.status || "Tidak Diketahui"),
          submit: item.created_at
            ? moment(item.created_at).fromNow(true)
            : "Tidak Diketahui",
          rawId: item.id,
          queueDate: item.queue_date
            ? moment(item.queue_date).format("DD MMMM YYYY")
            : "Tidak Diketahui",
        }));
        setQueueData(formattedQueueData);
      } catch (err) {
        console.error("Kesalahan saat memuat riwayat antrian:", err);
        if (err.response?.status === 404) {
          setError("Tidak ada riwayat antrian untuk siswa ini.");
          showToastMessage("Tidak ada riwayat antrian untuk siswa ini.", "error");
        } else if (err.response?.status === 401) {
          setError("Akses tidak diizinkan. Silakan masuk kembali.");
          showToastMessage("Akses tidak diizinkan. Silakan masuk kembali.", "error");
        } else {
          setError(
            "Gagal memuat riwayat antrian: " +
              (err.response?.data?.message || err.message)
          );
          showToastMessage("Gagal memuat riwayat antrian. Silakan coba lagi nanti.", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchQueueHistory();
    } else {
      setError("ID siswa tidak valid.");
      showToastMessage("ID siswa tidak valid.", "error");
      setLoading(false);
    }
  }, [userId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setQueueData([]);
  };

  const handleBack = () => {
    navigate("/rekamantri");
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <style>
            {`
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
              .animate-fade-in-out {
                animation: fadeInOut 3s ease-in-out;
              }
              @keyframes fadeInOut {
                0% { opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { opacity: 0; }
              }
            `}
          </style>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Notifikasi Toast */}
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
                  {toastType === "error" ? (
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
                  ) : (
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
                  )}
                </div>
                <span className="font-medium text-sm">{toastMessage}</span>
              </div>
            )}

            <div className="flex items-center mb-4">
              <button
                onClick={handleBack}
                className="mr-2 text-teal-800 hover:text-teal-600 transition-colors"
                aria-label="Kembali ke halaman rekam antrian"
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
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Detail Rekam Antrian
              </h2>
            </div>

            {/* Informasi Siswa */}
            <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-[#93D3CC] dark:text-white mb-4">
                Informasi Siswa
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white">
                    <span className="font-medium">Nama:</span>{" "}
                    {student.name || "Tidak Diketahui"}
                  </p>
                  <p className="text-sm text-[#1B4A4F] dark:text-white">
                    <span className="font-medium">Jenis Kelamin:</span>{" "}
                    {student.gender || "Tidak Diketahui"}
                  </p>
                  <p className="text-sm text-[#1B4A4F] dark:text-white">
                    <span className="font-medium">Kelas:</span>{" "}
                    {student.kelas || "Tidak Diketahui"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white">
                    <span className="font-medium">Nama Kelas:</span>{" "}
                    {student.namaKelas || "Tidak Diketahui"}
                  </p>
                  <p className="text-sm text-[#1B4A4F] dark:text-white">
                    <span className="font-medium">Jurusan:</span>{" "}
                    {student.department || "Tidak Diketahui"}
                  </p>
                  <p className="text-sm text-[#1B4A4F] dark:text-white">
                    <span className="font-medium">Nomor Telepon:</span>{" "}
                    {student.phone_number || "Tidak Diketahui"}
                  </p>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
                <button
                  onClick={handleRetry}
                  className="ml-4 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  aria-label="Coba lagi untuk memuat riwayat antrian"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <div className="double-spinner">
                  <div className="spinner-ring outer"></div>
                  <div className="spinner-ring inner"></div>
                </div>
                <p className="text-gray-500 mt-4">Memuat...</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" role="grid">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-[#0A2F6A] text-[#1B4A4F] dark:text-white">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Nomor Antrian</th>
                        <th className="p-3 text-left">Alasan</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Tanggal Antrian</th>
                        <th className="p-3 text-left">Diajukan Sejak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queueData.length > 0 ? (
                        queueData.map((item) => (
                          <tr
                            key={item.rawId}
                            className="border-b-4 border-gray-200 hover:bg-gray-50 dark:hover:bg-[#0A2F6A]"
                          >
                            <td className="p-3">{item.rawId}</td>
                            <td className="p-3 flex items-center">
                              <span className="inline-block w-6 h-6 bg-[#1B4A4F] rounded-full mr-2"></span>
                              {item.id}
                            </td>
                            <td className="p-3">{item.reason}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-sm font-medium ${
                                  item.status === "Selesai"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "Menunggu"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : item.status === "Sedang Diproses"
                                    ? "bg-blue-100 text-blue-800"
                                    : item.status === "Dibatalkan"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3">{item.queueDate}</td>
                            <td className="p-3">{item.submit}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center p-4 text-gray-500 dark:text-gray-400"
                          >
                            Tidak ada data riwayat antrian untuk siswa ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}