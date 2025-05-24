import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/user/layout';

function AntreUser() {
  const [reason, setReason] = useState('');
  const [currentQueue, setCurrentQueue] = useState('01');
  const [userQueue, setUserQueue] = useState(null);
  const [hasActiveQueue, setHasActiveQueue] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [latestQueueNumber, setLatestQueueNumber] = useState(null);
  const navigate = useNavigate();

  const apiUrl = 'https://api-uks.rplrus.com/api';
  const token = localStorage.getItem('token');

  // Check for token and redirect to login if missing
  useEffect(() => {
    if (!token) {
      setError('Please log in to continue');
      navigate('/login');
    }
  }, [token, navigate]);

  // Check queue status
  const checkQueueStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/queue/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasActiveQueue(response.data.hasActiveQueue);
    } catch (err) {
      setError('Failed to check queue status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current active queue
  const fetchCurrentActiveQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/queue/current-active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentQueue(response.data.data?.queue_number || '01');
    } catch (err) {
      setError('Failed to fetch current active queue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's current queue
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
      setError('Failed to fetch your queue');
      setUserQueue(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest queue number
  const fetchLatestQueueNumber = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/queues/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLatestQueueNumber(response.data.data?.queue_number || 0);
    } catch (err) {
      setError('Failed to fetch latest queue number');
      console.error(err);
      setLatestQueueNumber(0);
    } finally {
      setLoading(false);
    }
  };

  // Create a new queue
  const handleCreateQueue = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/queues`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data.message);
      setReason('');
      setHasActiveQueue(true);
      await fetchUserQueue();
      await fetchLatestQueueNumber();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create queue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel user's queue
  const handleCancelQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/queues/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Antrian berhasil dibatalkan');
      setUserQueue(null);
      setHasActiveQueue(false);
      setShowNotification(false);
      await fetchCurrentActiveQueue();
      await fetchLatestQueueNumber();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel queue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Polling for real-time updates
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

  // Show notification when currentQueue matches userQueue
  useEffect(() => {
    if (userQueue && currentQueue === userQueue.queue_number) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [currentQueue, userQueue]);

  // Calculate next queue number based on latest queue number
  const getNextQueueNumber = () => {
    if (latestQueueNumber === null) return '01';
    const nextNumber = parseInt(latestQueueNumber, 10) + 1;
    return isNaN(nextNumber) ? '01' : nextNumber.toString().padStart(2, '0');
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
        `}
      </style>
      <section className="bg-white w-full min-h-screen py-20 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          <div className="absolute top-10 left-[-30px] w-[120px] h-[120px] bg-[#FFD1DC] rounded-full opacity-50" />
          <div className="absolute bottom-20 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] opacity-60" />
          <div className="absolute top-[300px] right-[100px] w-[70px] h-[70px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />
          <div className="absolute bottom-[150px] left-[100px] w-[90px] h-[90px] bg-[#B0E0E6] rounded-full opacity-40" />
        </div>

        {/* Loading Indicator */}
        {(loading || hasActiveQueue === null) && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p className="text-gray-500 mt-4">Memuat...</p>
          </div>
        )}

        {/* Notification Popup */}
        {showNotification && (
          <div className="notification-popup">
            <h3>Sekarang Giliranmu!</h3>
            <p>Nomor antrian kamu ({userQueue?.queue_number}) sedang dipanggil. Silakan menuju UKS.</p>
            <button onClick={() => setShowNotification(false)}>Tutup</button>
          </div>
        )}

        {/* Render UI only when not loading and hasActiveQueue is determined */}
        {!loading && hasActiveQueue !== null && (
          <>
            {/* Header Section */}
            <div className="w-full h-[100px] bg-[#4FB7BD] flex items-center justify-center shadow-md p-6 z-10 relative -mt-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">
                {hasActiveQueue ? 'Mohon Menunggu hingga antrean kamu' : 'Dapatkan antrean'}
              </h2>
            </div>

            {/* Error/Success Messages */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {success && <p className="text-green-500 text-center mt-4">{success}</p>}

            {hasActiveQueue ? (
              <>
                <h3 className="mt-10 text-1xl font-medium text-[#1C4245] text-center z-10 relative">
                  Kamu akan diberi notifikasi jika sudah antrian kamu <br />
                  Kamu bisa izin ke guru kamu dengan cara menunjukan web ini <br />
                  Atau menunggu hingga istirahat tiba
                </h3>

                <div className="flex flex-wrap justify-center gap-6 mt-10 z-10 relative">                  {/* Antrean sekarang */}
                  <div className="flex flex-col items-center w-full sm:w-[400px]">
                    <h2 className="text-2xl font-semibold text-[#1C4245] mb-2">Antrean sekarang</h2>
                    <div className="w-[400px] h-[250px] bg-[#93D3CC] rounded-xl shadow-lg flex items-center justify-center">
                      <h1 className="text-white text-7xl font-bold">{currentQueue}</h1>
                    </div>
                  </div>

                  {/* Antrean kamu */}
                  <div className="flex flex-col items-center w-full sm:w-[400px]">
                    <h2 className="text-2xl font-semibold text-[#1C4245] mb-2">Antrean kamu</h2>
                    <div className="w-[400px] h-[250px] bg-[#93D3CC] rounded-xl shadow-lg flex items-center justify-center">
                      <h1 className="text-white text-9xl font-bold">{userQueue?.queue_number || 'N/A'}</h1>
                    </div>
                    {userQueue && (
                      <div className="text-[#1C4245] mt-2 text-center">
                        <p>Status: {userQueue.status}</p>
                        {userQueue.reason && <p>Tujuan: {userQueue.reason}</p>}
                      </div>
                    )}
                  </div>

                  {/* Tombol Batalkan */}
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
                {/* Sub Header */}
                <h2 className="mt-6 text-2xl font-semibold text-[#1C4245] text-center z-10 relative">
                  Antrean sekarang
                </h2>

                {/* Kotak Rectangle */}
                <div className="w-[350px] h-[200px] bg-[#93D3CC] mx-auto mt-6 rounded-xl shadow-lg z-10 relative flex items-center justify-center">
                  <h1 className="text-[#FFFFFF] text-7xl font-bold">{currentQueue}</h1>
                </div>

                {/* Kotak Putih Bawah */}
                <div className="w-[800px] max-w-full bg-white mx-auto mt-10 mb-20 rounded-xl shadow-lg z-10 flex flex-col md:flex-row border border-[#A2A2A2]">
                  {/* Kiri - Form */}
                  <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-2">Tujuan ke UKS :</h3>
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

                  {/* Kanan - Nomor Antrian */}
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
                    <h3 className="text-lg font-semibold text-[#1C4245] mb-4">Nomor antrian anda</h3>
                    <div className="bg-[#93D3CC] w-full h-55 flex items-center justify-center rounded-xl">
                      <span className="text-white text-7xl font-bold">
                        <h1>{getNextQueueNumber()}</h1>
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}

export default AntreUser;