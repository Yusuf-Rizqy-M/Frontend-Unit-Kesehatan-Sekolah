import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/user/layout";
import UKS2Img from "../../assets/img/uks2.png"; 

const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      console.log("Toast is visible:", message); 
      const timer = setTimeout(() => {
        onClose();
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-72 max-w-96 animate-slide-in`}
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white bg-opacity-20">
        <span className="text-sm font-bold">{icon}</span>
      </div>
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

function AntreUser() {
  const [reason, setReason] = useState("");
  const [currentQueue, setCurrentQueue] = useState("01");
  const [userQueue, setUserQueue] = useState(null);
  const [hasActiveQueue, setHasActiveQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [latestQueueNumber, setLatestQueueNumber] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const navigate = useNavigate();
  const apiUrl = "https://api-uks.rplrus.com/api";
  const token = localStorage.getItem("token");

  const showToast = (message, type = "info") => {
    setToast({
      isVisible: true,
      message,
      type,
    });
    console.log("Toast shown:", message, type);
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
    console.log("Toast closed");
  };

  // Utility function to calculate dynamic font size based on text length
  const getDynamicFontSize = (text) => {
    if (!text) return "text-5xl"; // Default for empty text
    const length = text.length;
    if (length <= 2) return "text-9xl"; // For short queue numbers (e.g., "01")
    if (length <= 6) return "text-6xl"; // For medium text (e.g., "KOSONG")
    return "text-5xl"; // For longer text (e.g., "MENUNGGU")
  };

  useEffect(() => {
    if (!token) {
      showToast("Silakan masuk untuk melanjutkan", "error");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    document.title = "Antrian Pasien";
    const favicon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    favicon.rel = "icon";
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);

    setTimeout(() => {
      showToast("Sistem antrian siap digunakan", "info");
    }, 1000);
  }, []);

  const checkQueueStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/queue/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasActiveQueue(response.data.hasActiveQueue);
    } catch (err) {
      showToast("Gagal memeriksa status antrean", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentActiveQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/queue/current-active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentQueue(response.data.data?.queue_number || "KOSONG");
    } catch (err) {
      showToast("Gagal mengambil antrean aktif saat ini", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/queues/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const queueData = response.data;
      if (queueData && queueData.queue_number) {
        setUserQueue(queueData);
      } else {
        setUserQueue(null);
      }
    } catch (err) {
      showToast("Gagal mengambil antrean Anda", "error");
      setUserQueue(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestQueueNumber = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/queues/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLatestQueueNumber(response.data.data?.queue_number || 0);
    } catch (err) {
      showToast("Gagal mengambil nomor antrean terbaru", "error");
      console.error(err);
      setLatestQueueNumber(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQueue = async () => {
    if (!reason.trim()) {
      showToast("Harap mengisi alasan", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/queues`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Antrian berhasil dibuat!", "success");
      setReason("");
      setHasActiveQueue(true);
      await fetchUserQueue();
      await fetchLatestQueueNumber();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Gagal membuat antrean",
        "error"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/queues/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Antrian berhasil dibatalkan!", "success");
      setUserQueue(null);
      setHasActiveQueue(false);
      setShowNotification(false);
      await fetchCurrentActiveQueue();
      await fetchLatestQueueNumber();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Gagal membatalkan antrean",
        "error"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchInitialData = async () => {
      await checkQueueStatus();
      await fetchCurrentActiveQueue();
      await fetchUserQueue();
      await fetchLatestQueueNumber();
    };

    fetchInitialData();

    const interval = setInterval(() => {
      checkQueueStatus();
      fetchCurrentActiveQueue();
      fetchUserQueue();
      fetchLatestQueueNumber();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (userQueue && currentQueue === userQueue.queue_number) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [currentQueue, userQueue]);

  const getNextQueueNumber = () => {
    if (latestQueueNumber === null) return "01";
    const nextNumber = parseInt(latestQueueNumber, 10) + 1;
    return isNaN(nextNumber) ? "01" : nextNumber.toString().padStart(2, "0");
  };

  const getCurrentQueueDisplay = () => {
    if (!currentQueue || currentQueue === "KOSONG") {
      return "KOSONG";
    }
    return currentQueue;
  };

  const getUserQueueDisplay = () => {
    if (!userQueue || !userQueue.queue_number) {
      return {
        text: "MENUNGGU",
        fontSize: getDynamicFontSize("MENUNGGU"),
      };
    }
    return {
      text: userQueue.queue_number,
      fontSize: getDynamicFontSize(userQueue.queue_number),
    };
  };

  return (
    <Layout>
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
          .notification-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            border: 2px solid #4FB7BD;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            text-align: center;
            max-width: 400px;
            width: 90%;
          }
          .notification-popup h3 {
            color: #1C4245;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .notification-popup p {
            color: #1C4245;
            margin-bottom: 20px;
          }
          .notification-popup button {
            background: #4FB7BD;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: medium;
            transition: background 0.3s;
          }
          .notification-popup button:hover {
            background: #3a8f94;
          }
          .animate-slide-in {
            animation: slideInRight 0.3s ease-out;
          }
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .queue-box {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            word-break: break-word;
            padding: 0 1rem;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
      <section className="bg-white w-full min-h-screen py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-1 pointer-events-none">
          <div className="absolute top-10 left-[-30px] w-[120px] h-[120px] bg-[#FFD1DC] rounded-full opacity-50" />
          <div className="absolute bottom-20 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] opacity-60" />
          <div className="absolute top-[300px] right-[100px] w-[70px] h-[70px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />
          <div className="absolute bottom-[150px] left-[100px] w-[90px] h-[90px] bg-[#B0E0E6] rounded-full opacity-40" />
        </div>

        {(loading || hasActiveQueue === null) && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p className="text-gray-500 mt-4">Memuat...</p>
          </div>
        )}

        {showNotification && (
          <div className="notification-popup">
            <h3>Sekarang Giliranmu!</h3>
            <p>
              Nomor antrian kamu ({userQueue?.queue_number}) sedang dipanggil.
              Silakan menuju UKS.
            </p>
            <button onClick={() => setShowNotification(false)}>Tutup</button>
          </div>
        )}

        {!loading && hasActiveQueue !== null && (
          <>
            <div className="w-full h-[100px] bg-[#4FB7BD] flex items-center justify-center shadow-md p-6 z-10 relative -mt-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">
                {hasActiveQueue
                  ? "Mohon Menunggu hingga antrean kamu"
                  : "Dapatkan antrean"}
              </h2>
            </div>
            {hasActiveQueue ? (
              <>
                <h3 className="mt-10 text-1xl font-medium text-[#1C4245] text-center z-10 relative">
                  Kamu akan diberi notifikasi jika sudah antrian kamu <br />
                  Kamu bisa izin ke guru kamu dengan cara menunjukan web ini{" "}
                  <br />
                  Atau menunggu hingga istirahat tiba
                </h3>

                <div className="flex flex-wrap justify-center gap-6 mt-10 z-10 relative">
                  <div className="flex flex-col items-center w-full sm:w-[400px]">
                    <h2 className="text-2xl font-semibold text-[#1C4245] mb-2">
                      Antrean sekarang
                    </h2>
                    <div className="w-[400px] h-[250px] bg-[#93D3CC] rounded-xl shadow-lg flex items-center justify-center">
                      <h1 className={`text-white font-bold queue-box ${getDynamicFontSize(getCurrentQueueDisplay())}`}>
                        {getCurrentQueueDisplay()}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-col items-center w-full sm:w-[400px]">
                    <h2 className="text-2xl font-semibold text-[#1C4245] mb-2">
                      Antrean kamu
                    </h2>
                    <div className="w-[400px] h-[250px] bg-[#93D3CC] rounded-xl shadow-lg flex items-center justify-center">
                      <h1 className={`text-white font-bold queue-box ${getUserQueueDisplay().fontSize}`}>
                        {getUserQueueDisplay().text}
                      </h1>
                    </div>
                    {userQueue && (
                      <div className="text-[#1C4245] mt-2 text-center">
                        <p>Status: {userQueue.status}</p>
                        {userQueue.reason && <p>Tujuan: {userQueue.reason}</p>}
                      </div>
                    )}
                  </div>

                  <div className="w-full flex justify-center mt-8">
                    <button
                      className="px-6 py-3 bg-red-100 text-red-700 border border-red-500 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCancelQueue}
                      disabled={!userQueue || !token || loading}
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-6 text-2xl font-semibold text-[#1C4245] text-center z-10 relative">
                  Antrean sekarang
                </h2>

                <div className="w-[350px] max-w-[90vw] h-[200px] bg-[#93D3CC] mx-auto mt-6 mb-8 rounded-xl shadow-lg z-10 relative flex items-center justify-center px-4">
                  <h1 className={`text-[#FFFFFF] font-bold queue-box ${getDynamicFontSize(getCurrentQueueDisplay())}`}>
                    {getCurrentQueueDisplay()}
                  </h1>
                </div>

                <div className="w-[800px] max-w-full bg-white mx-auto mt-10 mb-20 rounded-xl shadow-lg z-10 flex flex-col md:flex-row border border-[#A2A2A2]">
                  <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-2">
                        Tujuan ke UKS :
                      </h3>
                      <textarea
                        className="w-full h-24 bg-green-100 rounded-lg p-3 text-gray-700 resize-none"
                        placeholder="Tulis tujuanmu ke UKS..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button
                        className="flex-1 border border-teal-500 text-teal-700 py-2 rounded-lg hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleCreateQueue}
                        disabled={!token || loading}
                      >
                        Buat Antrian
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block w-px bg-gray-300"></div>

                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
                    <h3 className="text-lg font-semibold text-[#1C4245] mb-4">
                      Nomor antrian anda
                    </h3>
                    <div className="bg-[#93D3CC] w-full h-55 flex items-center justify-center rounded-xl">
                      <h1 className={`text-white font-bold queue-box ${getDynamicFontSize(getNextQueueNumber())}`}>
                        {getNextQueueNumber()}
                      </h1>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={closeToast}
        />
      </section>
    </Layout>
  );
}

export default AntreUser;