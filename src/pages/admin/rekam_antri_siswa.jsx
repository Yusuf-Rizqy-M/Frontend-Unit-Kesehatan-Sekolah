import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { User, Users } from "lucide-react";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

export default function RekamAntrian() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalWaiting, setTotalWaiting] = useState(0);
  const [totalProcessing, setTotalProcessing] = useState(0);
  const [totalSkipped, setTotalSkipped] = useState(0);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [latestQueue, setLatestQueue] = useState(null);
  const [queueData, setQueueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [filterMode, setFilterMode] = useState("today");
  const navigate = useNavigate();

  moment.locale("id");

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fungsi untuk memetakan status API ke status UI
  const mapStatusToUI = (apiStatus) => {
    switch (apiStatus.toLowerCase()) {
      case "done":
        return "Selesai";
      case "waiting":
        return "Waiting";
      case "processing":
        return "Processing";
      case "skipped":
        return "Skipped";
      default:
        return "Unknown";
    }
  };

  // Set tab title and favicon
  useEffect(() => {
    document.title = 'Rekam Antrian Siswa';
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);
  }, []);

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          completedRes,
          waitingRes,
          processingRes,
          skippedRes,
          currentQueueRes,
          latestQueueRes,
          todayQueueRes,
        ] = await Promise.all([
          axios.get("https://api-uks.rplrus.com/api/admin/queues/total-completed-today", config),
          axios.get("https://api-uks.rplrus.com/api/admin/queues/total-waiting-today", config),
          axios.get("https://api-uks.rplrus.com/api/admin/queues/total-processing-today", config),
          axios.get("https://api-uks.rplrus.com/api/admin/queues/total-skipped-today", config),
          axios.get("https://api-uks.rplrus.com/api/queue/current-active", config),
          axios.get("https://api-uks.rplrus.com/api/queues/latest", config),
          axios.get("https://api-uks.rplrus.com/api/admin/queues/today", config),
        ]);

        setTotalCompleted(completedRes.data.data.total_completed || 0);
        setTotalWaiting(waitingRes.data.data.total_waiting || 0);
        setTotalProcessing(processingRes.data.data.total_processing || 0);
        setTotalSkipped(skippedRes.data.data.total_skipped || 0);
        setCurrentQueue(
          currentQueueRes.data.data || { queue_number: "N/A", status: "Unknown", reason: "Unknown" }
        );
        setLatestQueue(
          latestQueueRes.data.data || { queue_number: "N/A", status: "Unknown", reason: "Unknown" }
        );

        let queueDataArray = [];
        if (filterMode === "today") {
          queueDataArray = Array.isArray(todayQueueRes.data.data) ? todayQueueRes.data.data : [];
        } else if (filterMode === "yesterday") {
          const yesterdayQueueRes = await axios.get("https://api-uks.rplrus.com/api/admin/queues/yesterday", config);
          queueDataArray = Array.isArray(yesterdayQueueRes.data.data) ? yesterdayQueueRes.data.data : [];
        } else if (filterMode === "all") {
          const allQueueRes = await axios.get("https://api-uks.rplrus.com/api/admin/queues/history", config);
          queueDataArray = Array.isArray(allQueueRes.data.data) ? allQueueRes.data.data : [];
        }

        const formattedQueueData = queueDataArray.map((item) => ({
          id: item.queue_number != null ? item.queue_number.toString().padStart(3, "0") : "N/A",
          reason: item.reason || "Unknown",
          status: mapStatusToUI(item.status || "Unknown"),
          name: item.user?.name || "Unknown",
          submit: item.created_at ? moment(item.created_at).fromNow(true) : "Unknown",
          rawId: item.id,
          userId: item.user?.id || null,
          student: {
            id: item.user?.id || null,
            name: item.user?.name || "Unknown",
            gender: item.user?.gender || "N/A",
            class: item.user?.class || "N/A",
            name_grades: item.user?.name_grades || "N/A",
            name_department: item.user?.name_department || "N/A",
            phone_number: item.user?.phone_number || null,
            name_parent: item.user?.name_parent || null,
            no_hp_parent: item.user?.no_hp_parent || null,
            name_walikelas: item.user?.name_walikelas || null,
          },
        }));
        setQueueData(formattedQueueData);
      } catch (err) {
        const errorMessage =
          err.response?.status === 401
            ? "Unauthorized access. Please log in again."
            : err.response?.status === 404 && filterMode === "yesterday"
            ? "Data antrian kemarin tidak ditemukan."
            : "Failed to fetch queue data. Please try again later.";
        setError(errorMessage);
        showToastMessage(errorMessage, "error");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (filterMode !== "history") {
      fetchQueueData();
    }
  }, [filterMode]);

  const fetchUserData = async () => {
    try {
      setHistoryLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: "active" },
      };

      const response = await axios.get("https://api-uks.rplrus.com/api/users", config);
      if (response.data.status && Array.isArray(response.data.data)) {
        const mappedUsers = response.data.data
          .filter((user) => user.status === "active")
          .map((user) => ({
            id: user.id,
            name: user.name || "Unknown",
            gender: user.gender || "N/A",
            kelas: user.class || "N/A",
            namaKelas: user.name_grades || "N/A",
            department: user.name_department || "N/A",
            role: user.role || "user",
            phone_number: user.phone_number || null,
            name_parent: user.name_parent || null,
            no_hp_parent: user.no_hp_parent || null,
            name_walikelas: user.name_walikelas || null,
          }));
        setUserData(mappedUsers);
      } else {
        throw new Error(response.data.message || "Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Unauthorized: Invalid or expired token. Please log in again."
          : "Failed to fetch user data: " + err.message;
      setError(errorMessage);
      showToastMessage(errorMessage, "error");
      console.error("Fetch user error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (filterMode === "history" && userData.length === 0) {
      fetchUserData();
    }
  }, [filterMode]);

  const handleNavigateToDetails = (student) => {
    if (student?.id) {
      const path = `/MedicalRecord/${student.id}`;
      navigate(path, { state: { student } });
    } else {
      showToastMessage("ID siswa tidak tersedia.", "error");
    }
  };

  const handleNavigateToHistory = (user) => {
    navigate(`/rekamantri/detailrekamantri/${user.id}`, { state: { user } });
  };

  const handleStatusChange = async (queueId, rawId, newStatus, prevStatus, student) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [queueId]: true }));
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      let response;
      if (newStatus === "Processing") {
        try {
          response = await axios.post(`https://api-uks.rplrus.com/api/admin/queues/${rawId}/process`, {}, config);
        } catch (err) {
          if (err.response?.status === 405) {
            response = await axios.put(`https://api-uks.rplrus.com/api/admin/queues/${rawId}/process`, {}, config);
          } else {
            throw err;
          }
        }
        handleNavigateToDetails(student);
      } else if (newStatus === "Selesai") {
        const medicalRecordRes = await axios.get(`https://api-uks.rplrus.com/api/healthcondition/${student.id}`, config);
        const hasMedicalRecord = medicalRecordRes.data.data?.some(record => record.status === 'active');
        if (!hasMedicalRecord) {
          showToastMessage("Silakan isi rekam medis terlebih dahulu.", "error");
          return;
        }
        try {
          response = await axios.post(`https://api-uks.rplrus.com/api/admin/queues/${rawId}/finish`, {}, config);
        } catch (err) {
          if (err.response?.status === 405) {
            response = await axios.put(`https://api-uks.rplrus.com/api/admin/queues/${rawId}/finish`, {}, config);
          } else {
            throw err;
          }
        }
      } else if (newStatus === "Skipped") {
        try {
          response = await axios.post(`https://api-uks.rplrus.com/api/admin/queues/${rawId}/skip`, {}, config);
        } catch (err) {
          if (err.response?.status === 405) {
            response = await axios.put(`https://api-uks.rplrus.com/api/admin/queues/${rawId}/skip`, {}, config);
          } else {
            throw err;
          }
        }
      } else if (newStatus === "Waiting") {
        // No API endpoint for "Waiting"; update locally
      }

      setQueueData((prev) =>
        prev.map((item) =>
          item.id === queueId ? { ...item, status: newStatus } : item
        )
      );

      setTotalWaiting((prev) => (prevStatus === "Waiting" ? prev - 1 : prev) + (newStatus === "Waiting" ? 1 : 0));
      setTotalProcessing((prev) => (prevStatus === "Processing" ? prev - 1 : prev) + (newStatus === "Processing" ? 1 : 0));
      setTotalCompleted((prev) => (prevStatus === "Selesai" ? prev - 1 : prev) + (newStatus === "Selesai" ? 1 : 0));
      setTotalSkipped((prev) => (prevStatus === "Skipped" ? prev - 1 : prev) + (newStatus === "Skipped" ? 1 : 0));

      if (response?.data?.message) {
        showToastMessage(response.data.message, "success");
      }
    } catch (err) {
      const allowedMethods = err.response?.headers?.allow || "unknown";
      const errorMessage =
        err.response?.status === 401
          ? "Unauthorized: Invalid or expired token. Please log in again."
          : err.response?.status === 405
          ? `Method not allowed for queue ${rawId}. Allowed methods: ${allowedMethods}.`
          : err.response?.data?.message || "Failed to update status. Please try again.";
      setError(errorMessage);
      showToastMessage(errorMessage, "error");
      console.error("Update status error:", err);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [queueId]: false }));
    }
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "Waiting") return "Processing";
    if (currentStatus === "Processing") return "Selesai";
    return null;
  };

  const handleFilterChange = (mode) => {
    setFilterMode(mode);
  };

  const handleRetry = () => {
    setError(null);
    if (filterMode === "history") {
      setHistoryLoading(true);
      setUserData([]);
      fetchUserData();
    } else {
      setLoading(true);
      setQueueData([]);
    }
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

            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold pb-4">
              Rekam Antrian Siswa
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
                <button
                  onClick={handleRetry}
                  className="ml-4 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
                <div className="double-spinner">
                  <div className="spinner-ring outer"></div>
                  <div className="spinner-ring inner"></div>
                </div>
                <p className="text-gray-500 mt-4">Memuat...</p>
              </div>
            ) : (
              <>
                {filterMode === "today" && (
                  <div className="flex gap-10 mb-6">
                    <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                      <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                        <User className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">
                          Total Antrian Selesai hari ini
                        </p>
                        <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">
                          {totalCompleted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                      <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                        <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">
                          Total Antrian Menunggu
                        </p>
                        <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">
                          {totalWaiting}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                      <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                        <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">
                          Total Antrian Diproses
                        </p>
                        <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">
                          {totalProcessing}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[250px]">
                      <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                        <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">
                          Total Antrian Dibatalkan
                        </p>
                        <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">
                          {totalSkipped}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mb-6">
                  <div className="grid grid-cols-12 gap-6 max-w-3xl">
                    <div className="col-span-12 sm:col-span-6">
                      <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow p-6 text-center">
                        <h2 className="text-lg font-semibold text-[#93D3CC] dark:text-white mb-4">
                          Antrian Sekarang
                        </h2>
                        <p className="text-[48px] font-bold text-[#93D3CC] dark:text-white mb-4">
                          {currentQueue?.queue_number || "N/A"}
                        </p>
                        <p className="text-sm text-[#93D3CC] dark:text-white">
                          <span className="font-medium">Status:</span> {currentQueue?.status || "Unknown"}
                        </p>
                        <p className="text-sm text-[#93D3CC] dark:text-white">
                          <span className="font-medium">Reason:</span> {currentQueue?.reason || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                      <div className="bg-[#93D3CC] dark:bg-[#051D4E] rounded-[20px] shadow p-6 text-center">
                        <h2 className="text-lg font-semibold text-white dark:text-white mb-4">
                          Antrian Terakhir
                        </h2>
                        <p className="text-[48px] font-bold text-white dark:text-white mb-4">
                          {latestQueue?.queue_number || "N/A"}
                        </p>
                        <p className="text-sm text-white dark:text-white">
                          <span className="font-medium">Status:</span> {latestQueue?.status || "Unknown"}
                        </p>
                        <p className="text-sm text-white dark:text-white">
                          <span className="font-medium">Reason:</span> {latestQueue?.reason || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mb-4">
                  <button
                    className={`px-6 py-3 rounded-md font-medium w-80 ${
                      filterMode === "today" ? "bg-[#569E80] text-white" : "bg-gray-300 text-gray-800"
                    }`}
                    onClick={() => handleFilterChange("today")}
                  >
                    Hari Ini
                  </button>
                  <button
                    className={`px-6 py-3 rounded-md font-medium w-80 ${
                      filterMode === "all" ? "bg-[#569E80] text-white" : "bg-gray-300 text-gray-800"
                    }`}
                    onClick={() => handleFilterChange("all")}
                  >
                    Semua Data
                  </button>
                  <button
                    className={`px-6 py-3 rounded-md font-medium w-80 ${
                      filterMode === "yesterday" ? "bg-[#569E80] text-white" : "bg-gray-300 text-gray-800"
                    }`}
                    onClick={() => handleFilterChange("yesterday")}
                  >
                    Kemarin
                  </button>
                  <button
                    className={`px-6 py-3 rounded-md font-medium w-80 ${
                      filterMode === "history" ? "bg-[#569E80] text-white" : "bg-gray-300 text-gray-800"
                    }`}
                    onClick={() => handleFilterChange("history")}
                  >
                    History
                  </button>
                </div>

                {filterMode === "history" ? (
                  <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow overflow-hidden">
                    {historyLoading ? (
                      <div className="flex flex-col items-center justify-center h-[200px]">
                        <div className="double-spinner">
                          <div className="spinner-ring outer"></div>
                          <div className="spinner-ring inner"></div>
                        </div>
                        <p className="text-gray-500 mt-4">Memuat history...</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-[#0A2F6A] text-[#1B4A4F] dark:text-white">
                              <th className="p-3 text-left">Nama</th>
                              <th className="p-3 text-left">Jenis Kelamin</th>
                              <th className="p-3 text-left">Kelas</th>
                              <th className="p-3 text-left">Nama Kelas</th>
                              <th className="p-3 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userData.length > 0 ? (
                              userData.map((user) => (
                                <tr
                                  key={user.id}
                                  className="border-b-4 border-gray-200 hover:bg-gray-50 dark:hover:bg-[#0A2F6A]"
                                >
                                  <td className="p-3">{user.name}</td>
                                  <td className="p-3">{user.gender}</td>
                                  <td className="p-3">{user.kelas}</td>
                                  <td className="p-3">{user.namaKelas}</td>
                                  <td className="p-3">
                                    <button
                                      onClick={() => handleNavigateToHistory(user)}
                                      className="text-xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                                      aria-label="Lihat riwayat antrian"
                                    >
                                      ›
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500 dark:text-gray-400">
                                  Tidak ada data siswa.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-[#0A2F6A] text-[#1B4A4F] dark:text-white">
                            <th className="p-3 text-left">Antrian</th>
                            <th className="p-3 text-left">Reason</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Nama</th>
                            <th className="p-3 text-left">Submit Sejak</th>
                          </tr>
                        </thead>
                        <tbody>
                          {queueData.length > 0 ? (
                            queueData.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b-4 border-gray-200 hover:bg-gray-50 dark:hover:bg-[#0A2F6A]"
                              >
                                <td className="p-3 flex items-center">
                                  <span className="inline-block w-6 h-6 bg-[#1B4A4F] rounded-full mr-2"></span>
                                  {item.id}
                                </td>
                                <td className="p-3">{item.reason}</td>
                                <td className="p-3 flex gap-2 items-center">
                                  {updatingStatus[item.id] ? (
                                    <span className="text-gray-500 dark:text-gray-400">Updating...</span>
                                  ) : item.status === "Selesai" ? (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                      Selesai
                                    </span>
                                  ) : (
                                    <>
                                      <button
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                          item.status === "Waiting"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : item.status === "Processing"
                                            ? "bg-blue-100 text-blue-800"
                                            : item.status === "Skipped"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-200 text-gray-800"
                                        } disabled:opacity-50`}
                                        disabled={filterMode !== "today" || !getNextStatus(item.status)}
                                        onClick={() =>
                                          handleStatusChange(
                                            item.id,
                                            item.rawId,
                                            getNextStatus(item.status),
                                            item.status,
                                            item.student
                                          )
                                        }
                                      >
                                        {item.status === "Waiting"
                                          ? "Proses"
                                          : item.status === "Processing"
                                          ? "Selesai"
                                          : item.status}
                                      </button>
                                      {item.status === "Waiting" || item.status === "Processing" ? (
                                        <button
                                          className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 disabled:opacity-50"
                                          disabled={filterMode !== "today"}
                                          onClick={() =>
                                            handleStatusChange(item.id, item.rawId, "Skipped", item.status, item.student)
                                          }
                                        >
                                          Tolak
                                        </button>
                                      ) : null}
                                    </>
                                  )}
                                </td>
                                <td className="p-3">{item.name}</td>
                                <td className="p-3">{item.submit}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center p-4 text-gray-500 dark:text-gray-400">
                                Tidak ada data antrian.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}