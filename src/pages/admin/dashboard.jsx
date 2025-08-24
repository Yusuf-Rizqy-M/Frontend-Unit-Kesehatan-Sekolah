import React, { useState, useEffect, useRef, useMemo } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { User, Users } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import UKS2Img from '../../assets/img/UKS2.png';

// Register Chart.js components
ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queueStats, setQueueStats] = useState({
    today: 0,
    yesterday: 0,
    week: 0,
    all: 0,
    monthly: Array(12).fill(0), // Back to monthly data
    totalUsers: 0,
  });
  const [todayQueue, setTodayQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chartRef = useRef(null);

  // Set favicon, title, and sync dark mode
  useEffect(() => {
    document.title = 'Dashboard';
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = UKS2Img;

    // Sync dark mode with Tailwind
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Function to handle login and get token
  const loginAndGetToken = async () => {
    try {
      const response = await fetch('https://api-uks.rplrus.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: 'admin123',
          remember: true,
        }),
      });
      if (!response.ok) throw new Error('Gagal Login');
      const data = await response.json();
      if (data.status) {
        const newToken = data.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        return newToken;
      } else {
        throw new Error(data.message || 'Login berhasil');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Gagal masuk. Periksa kredensial atau server.');
      return null;
    }
  };

  // Fetch queue stats
  const fetchQueueStats = async (currentToken) => {
    try {
      const response = await fetch('https://api-uks.rplrus.com/api/admin/queues/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch queue stats: ${response.status}`);
      const data = await response.json();
      return {
        today: data.today || 0,
        yesterday: data.yesterday || 0,
        week: data.week || 0,
        all: data.all || 0,
      };
    } catch (err) {
      console.error('Queue Stats Fetch Error:', err);
      throw err;
    }
  };

  // Fetch monthly stats
  const fetchMonthlyStats = async (currentToken) => {
    try {
      const response = await fetch('https://api-uks.rplrus.com/api/dashboard/pengunjung', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch monthly stats: ${response.status}`);
      const data = await response.json();
      
      // Initialize array with 12 months
      const monthly = Array(12).fill(0);
      
      // Populate data based on API response
      data.forEach((item) => {
        if (item.bulan >= 1 && item.bulan <= 12) {
          // Ensure the total value is between 1-30 for better visualization
          monthly[item.bulan - 1] = Math.min(Math.max(item.total || 0, 0), 30);
        }
      });
      
      return monthly;
    } catch (err) {
      console.error('Monthly Stats Fetch Error:', err);
      throw err;
    }
  };

  // Fetch total users
  const fetchTotalUsers = async (currentToken) => {
    try {
      const response = await fetch('https://api-uks.rplrus.com/api/users/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      if (!response.ok) throw new Error(`Gagal mengambil total pengguna: ${response.status}`);
      const data = await response.json();
      if (data.status) {
        return data.total || 0;
      } else {
        throw new Error(data.message || 'Gagal mengambil total pengguna');
      }
    } catch (err) {
      console.error('Kesalahan Pengambilan Total Pengguna:', err);
      throw err;
    }
  };

  // Fetch today's queue
  const fetchTodayQueue = async (currentToken) => {
    try {
      const response = await fetch('https://api-uks.rplrus.com/api/admin/queues/today', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      if (!response.ok) throw new Error(`Gagal mengambil antrean hari ini: ${response.status} ${response.statusText}`);
      const data = await response.json();
      return data.data || [];
    } catch (err) {
      console.error('Today Queue Fetch Error:', err);
      throw err;
    }
  };

  // Combined fetch function
  const fetchAllStats = async () => {
    try {
      setLoading(true);
      setError(null);
      let currentToken = token;
      if (!currentToken) {
        currentToken = await loginAndGetToken();
        if (!currentToken) throw new Error('Tidak ada token valid yang tersedia');
      }

      // Fetch all APIs concurrently
      const [queueData, monthlyData, totalUsers, todayQueueData] = await Promise.all([
        fetchQueueStats(currentToken),
        fetchMonthlyStats(currentToken),
        fetchTotalUsers(currentToken),
        fetchTodayQueue(currentToken),
      ]);

      // Process today's queue to select 5 relevant entries
      const sortedQueue = todayQueueData
        .sort((a, b) => a.queue_number - b.queue_number)
        .map(entry => ({
          queueNumber: `Q${entry.queue_number.toString().padStart(3, '0')}`,
          status: entry.status === 'Menunggu' ? 'Mengantri' : 'Selesai',
          studentName: entry.user.name || 'Unknown',
          submittedSince: new Date(entry.created_at).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).replace(',', ''),
        }));

      // Determine current queue position (first 'waiting' entry)
      const currentQueueEntry = sortedQueue.find((entry) => entry.status === 'Mengantri');
      const currentQueueNumber = currentQueueEntry
        ? parseInt(currentQueueEntry.queueNumber.slice(1))
        : sortedQueue.length > 0
        ? parseInt(sortedQueue[0].queueNumber.slice(1))
        : 1;

      // Select 5 entries based on current queue position
      let startIndex;
      if (currentQueueNumber <= 5) {
        startIndex = 0;
      } else {
        startIndex = sortedQueue.findIndex(entry => parseInt(entry.queueNumber.slice(1)) >= currentQueueNumber);
        if (startIndex === -1) startIndex = Math.max(0, sortedQueue.length - 5);
      }
      const selectedQueue = sortedQueue.slice(startIndex, startIndex + 5);

      setQueueStats({
        today: queueData.today,
        yesterday: queueData.yesterday,
        week: queueData.week,
        all: queueData.all,
        monthly: monthlyData,
        totalUsers,
      });
      setTodayQueue(selectedQueue);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message || 'Gagal mengambil data');
      // Don't set any fallback data - just show error state
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAllStats();
  }, []);

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Jumlah Pengunjung',
        data: queueStats.monthly,
        borderColor: isDarkMode ? '#00C4B4' : '#1B4A4F',
        backgroundColor: isDarkMode ? 'rgba(0, 196, 180, 0.2)' : 'rgba(27, 74, 79, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: isDarkMode ? '#00C4B4' : '#1B4A4F',
        pointBorderColor: isDarkMode ? '#00C4B4' : '#1B4A4F',
        pointHoverBackgroundColor: isDarkMode ? '#00E5D3' : '#2A5A5F',
        pointHoverBorderColor: isDarkMode ? '#00E5D3' : '#2A5A5F',
      }],
    };
  }, [queueStats.monthly, isDarkMode]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          color: isDarkMode ? '#ffffff' : '#374151',
        }
      },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#374151',
        bodyColor: isDarkMode ? '#ffffff' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      },
      title: {
        display: true,
        text: 'Statistik Pengunjung Bulanan',
        font: { size: 18 },
        color: isDarkMode ? '#ffffff' : '#374151',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Bulan',
          color: isDarkMode ? '#ffffff' : '#374151',
        },
        ticks: {
          color: isDarkMode ? '#ffffff' : '#374151',
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        }
      },
      y: { 
        beginAtZero: true,
        max: 30, // Set maximum value to 30 for better visualization
        title: {
          display: true,
          text: 'Jumlah Pengunjung (1-30)',
          color: isDarkMode ? '#ffffff' : '#374151',
        },
        ticks: {
          color: isDarkMode ? '#ffffff' : '#374151',
          stepSize: 5, // Show ticks every 5 units
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        }
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
            {error && (
              <div className="p-4 rounded-[10px] bg-red-50 dark:bg-red-900/50 text-red-500 mb-6">
                <p>Error: {error}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    setError(null);
                    fetchAllStats();
                  }}
                >
                  Retry
                </button>
              </div>
            )}
            <div className="flex gap-10 mb-6">
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <User className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Antri</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">
                    {loading ? <span className="inline-block animate-pulse bg-gray-200 h-6 w-20 rounded" /> : error ? '-' : queueStats.all}
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[390px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Pengguna</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">
                    {loading ? <span className="inline-block animate-pulse bg-gray-200 h-6 w-20 rounded" /> : error ? '-' : queueStats.totalUsers}
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[250px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Antrian Minggu Ini</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">
                    {loading ? <span className="inline-block animate-pulse bg-gray-200 h-6 w-20 rounded" /> : error ? '-' : queueStats.week}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-gray-800 dark:text-gray-100 font-bold">Statistik Antrean Harian</h2>
              </div>
              <div className="h-64">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4A4F] dark:border-white"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    Gagal memuat grafik
                  </div>
                ) : (
                  <Line data={chartData} options={chartOptions} ref={chartRef} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;