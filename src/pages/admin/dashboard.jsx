import React, { useState, useEffect, useRef } from 'react';
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
    monthly: Array(12).fill(0),
    daily: [],
    hourly: [],
    totalUsers: 0,
  });
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
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      if (data.status) {
        const newToken = data.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        return newToken;
      } else throw new Error(data.message || 'Login unsuccessful');
    } catch (err) {
      console.error('Login Error:', err);
      setError('Failed to log in. Check credentials or server.');
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
        daily: data.daily || Array(7).fill(0),
        hourly: data.hourly || Array(6).fill(0),
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
      const monthly = Array(12).fill(0);
      data.forEach(item => {
        if (item.bulan >= 1 && item.bulan <= 12) {
          monthly[item.bulan - 1] = item.total;
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
      if (!response.ok) throw new Error(`Failed to fetch total users: ${response.status}`);
      const data = await response.json();
      if (data.status) {
        return data.total || 0;
      } else {
        throw new Error(data.message || 'Failed to retrieve total users');
      }
    } catch (err) {
      console.error('Total Users Fetch Error:', err);
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
        if (!currentToken) throw new Error('No valid token available');
      }

      // Fetch APIs concurrently
      const [queueData, monthlyData, totalUsers] = await Promise.all([
        fetchQueueStats(currentToken),
        fetchMonthlyStats(currentToken),
        fetchTotalUsers(currentToken),
      ]);

      setQueueStats({
        today: queueData.today,
        yesterday: queueData.yesterday,
        week: queueData.week,
        all: queueData.all,
        monthly: monthlyData,
        daily: queueData.daily,
        hourly: queueData.hourly,
        totalUsers,
      });
      setLoading(false);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message);
      setQueueStats({
        today: 10,
        yesterday: 15,
        week: 50,
        all: 36,
        monthly: [0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0],
        daily: [10, 12, 15, 18, 20, 10, 15],
        hourly: [2, 5, 8, 10, 7, 6],
        totalUsers: 5,
      });
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAllStats();
  }, []);

  // Chart data for yearly stats only
  const getChartData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Queue Stats',
      data: queueStats.monthly,
      borderColor: isDarkMode ? '#00C4B4' : '#1B4A4F',
      backgroundColor: isDarkMode ? 'rgba(0, 196, 180, 0.2)' : 'rgba(27, 74, 79, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
      title: {
        display: true,
        text: 'Yearly Queue Statistics',
        font: { size: 18 },
      },
    },
    scales: {
      y: { beginAtZero: true },
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
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={fetchAllStats}>
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
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Users</p>
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
                <h2 className="text-xl text-gray-800 dark:text-gray-100 font-bold">Statistik Siswa</h2>
                <button
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
              <div className="h-64">
                <Line data={getChartData()} options={chartOptions} ref={chartRef} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;