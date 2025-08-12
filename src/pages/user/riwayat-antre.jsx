import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutProfile from "../../components/user/layout_profile";
import useLogin from "../../hooks/useLogin";
import UKS2Img from "../../assets/img/uks2.png";

function Antrian() {
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { error: loginError } = useLogin();
  const navigate = useNavigate();

  // Set favicon and debug
  useEffect(() => {
    console.log("Antrian component mounted");
    console.log("Initial document title:", document.title);
    console.log("UKS2Img import path:", UKS2Img);
    let favicon = document.querySelector("link[rel='icon']");
    console.log("Initial favicon href:", favicon ? favicon.href : "No favicon found");

    favicon = favicon || document.createElement("link");
    favicon.rel = "icon";
    favicon.href = `${UKS2Img}?v=${Date.now()}`;
    document.head.appendChild(favicon);
    console.log("Set favicon href to:", favicon.href);

    document.title = "History Antrian";

    const timeout = setTimeout(() => {
      console.log("Document title after render:", document.title);
      const updatedFavicon = document.querySelector("link[rel='icon']");
      console.log("Favicon after render:", updatedFavicon ? updatedFavicon.href : "No favicon found");
    }, 1000);

    return () => {
      clearTimeout(timeout);
      console.log("Antrian component unmounted");
    };
  }, []);

  // Format date to Indonesian locale
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  // Get status styling
  const getStatusStyle = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'done':
      case 'selesai':
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: '✅'
        };
      case 'pending':
      case 'menunggu':
      case 'waiting':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: '⏳'
        };
      case 'in progress':
      case 'sedang diproses':
      case 'processing':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: '🔄'
        };
      case 'cancelled':
      case 'dibatalkan':
      case 'canceled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: '❌'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: '📋'
        };
    }
  };

  const fetchQueueHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to continue");
        navigate("/login");
        return;
      }

      const response = await fetch("https://api-uks.rplrus.com/api/queues/history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const result = await response.json();
        if (result.message === "Data antrian tidak ditemukan") {
          setQueueData([]);
        } else {
          throw new Error(result.message || `Failed to fetch queue history: ${response.statusText}`);
        }
      } else {
        const result = await response.json();
        console.log("API response:", result);
        const data = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
        const mappedData = data.map(item => ({
          id: item.id,
          queue_number: item.queue_number,
          tanggal: item.queue_date,
          tujuan: item.reason,
          status: item.status,
        }));
        setQueueData(mappedData);
        localStorage.setItem("queueHistoryData", JSON.stringify(mappedData));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      const cachedData = localStorage.getItem("queueHistoryData");
      if (cachedData) {
        setQueueData(JSON.parse(cachedData));
        setError(null);
      } else {
        setError(err.message === "Please log in to continue" ? err.message : "Tidak dapat terhubung ke server. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("queueHistoryData");
    if (cachedData) {
      setQueueData(JSON.parse(cachedData));
      setLoading(false);
    }
    fetchQueueHistory();
  }, [navigate]);

  return (
    <LayoutProfile>
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
          .card-hover {
            transition: all 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          .queue-card {
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border-left: 4px solid #4FB7BD;
          }
          .status-badge {
            transition: all 0.2s ease;
          }
          .status-badge:hover {
            transform: scale(1.05);
          }
        `}
      </style>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
             Riwayat Antrian Kamu
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Lihat semua riwayat antrian yang pernah kamu ambil</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p className="text-gray-500 mt-4 text-lg">Sedang memuat riwayat...</p>
          </div>
        ) : error || loginError ? (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h3 className="text-red-800 font-semibold text-lg mb-2">Terjadi Kesalahan</h3>
              <p className="text-red-600">{error || loginError}</p>
            </div>
          </div>
        ) : queueData.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-gray-700 font-semibold text-xl mb-2">Belum Ada Riwayat</h3>
              <p className="text-gray-500">Kamu belum pernah mengambil antrian sebelumnya</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-teal-500 to-teal-200 px-4 py-4">
                  <div className="grid grid-cols-4 gap-4 text-white font-semibold text-sm lg:text-base">
                    <div className="flex items-center">
                      <span className="mr-2">🔢</span>No.
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📅</span>Tanggal
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🎯</span>Tujuan
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📊</span>Status
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {queueData.map((item, index) => {
                    const statusStyle = getStatusStyle(item.status);
                    return (
                      <div key={item.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-4 gap-4 items-center">
                          <div className="font-bold text-teal-700 text-lg">
                            {index + 1}
                          </div>
                          <div className="text-gray-700">
                            <div className="font-medium text-sm lg:text-base">{formatDate(item.tanggal)}</div>
                          </div>
                          <div className="text-gray-700 font-medium text-sm lg:text-base">
                            {item.tujuan}
                          </div>
                          <div>
                            <span className={`status-badge inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                              <span className="mr-1">{statusStyle.icon}</span>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {queueData.map((item, index) => {
                const statusStyle = getStatusStyle(item.status);
                return (
                  <div key={item.id} className="queue-card card-hover bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="bg-teal-100 rounded-lg p-2 mr-3">
                          <span className="text-teal-700 font-bold text-base sm:text-lg">{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-gray-500">No.</div>
                          <div className="font-semibold text-gray-800 text-sm sm:text-base">{index + 1}</div>
                        </div>
                      </div>
                      <span className={`status-badge inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        <span className="mr-1">{statusStyle.icon}</span>
                        <span className="hidden sm:inline">{item.status}</span>
                        <span className="sm:hidden">{statusStyle.icon}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start text-gray-600">
                        <span className="mr-2 mt-0.5">📅</span>
                        <span className="text-xs sm:text-sm font-medium leading-relaxed">{formatDate(item.tanggal)}</span>
                      </div>
                      <div className="flex items-start text-gray-600">
                        <span className="mr-2 mt-0.5">🎯</span>
                        <span className="text-xs sm:text-sm font-medium leading-relaxed">{item.tujuan}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 sm:p-6 border border-teal-100">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-teal-800 mb-2 sm:mb-3">📊 Ringkasan</h3>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-teal-700">{queueData.length}</div>
                    <div className="text-xs sm:text-sm text-teal-600">Total Antrian</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-700">
                      {queueData.filter(item => ['done', 'selesai', 'completed'].includes(item.status.toLowerCase())).length}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600">Selesai</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-700">
                      {queueData.filter(item => ['pending', 'menunggu', 'waiting'].includes(item.status.toLowerCase())).length}
                    </div>
                    <div className="text-xs sm:text-sm text-yellow-600">Menunggu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutProfile>
  );
}

export default Antrian;