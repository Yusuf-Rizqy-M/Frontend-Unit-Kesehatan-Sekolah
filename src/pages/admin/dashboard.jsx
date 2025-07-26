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
    monthly: Array(12).fill(0),
    daily: [],
    hourly: [],
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

  // Fetch today's queue from new API
  const fetchTodayQueue = async (currentToken) => {
    try {
      const response = await fetch('https://api-uks.rplrus.com/api/admin/queues/today', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch today's queue: ${response.status} ${response.statusText}`);
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
        if (!currentToken) throw new Error('No valid token available');
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
          status: entry.status === 'waiting' ? 'Mengantri' : 'Done',
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
      const currentQueueEntry = sortedQueue.find(entry => entry.status === 'Mengantri');
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
        daily: queueData.daily,
        hourly: queueData.hourly,
        totalUsers,
      });
      setTodayQueue(selectedQueue);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message || 'Failed to fetch data');
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
      setTodayQueue([
        { queueNumber: 'Q001', status: 'Mengantri', studentName: 'John Doe', submittedSince: '2025-07-22 08:00' },
        { queueNumber: 'Q002', status: 'Done', studentName: 'Jane Smith', submittedSince: '2025-07-22 07:30' },
        { queueNumber: 'Q003', status: 'Mengantri', studentName: 'Ahmad Yani', submittedSince: '2025-07-22 08:15' },
        { queueNumber: 'Q004', status: 'Done', studentName: 'Siti Nurhaliza', submittedSince: '2025-07-21 16:45' },
        { queueNumber: 'Q005', status: 'Mengantri', studentName: 'Budi Santoso', submittedSince: '2025-07-22 08:30' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAllStats();
  }, []);

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Queue Stats',
      data: queueStats.monthly,
      borderColor: isDarkMode ? '#00C4B4' : '#1B4A4F',
      backgroundColor: isDarkMode ? 'rgba(0, 196, 180, 0.2)' : 'rgba(27, 74, 79, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  }), [queueStats.monthly, isDarkMode]);

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
                <Line data={chartData} options={chartOptions} ref={chartRef} />
              </div>
            </div>

            {/* Student Queue Table */}
            <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow p-6">
              <h2 className="text-xl text-gray-800 dark:text-gray-100 font-bold mb-4">Student Queue</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#1B4A4F] dark:text-white">
                      <th className="px-4 py-2 font-medium">Student Queue Number</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                      <th className="px-4 py-2 font-medium">Student Name</th>
                      <th className="px-4 py-2 font-medium">Submitted Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-2 text-center text-[#1B4A4F] dark:text-white">
                          Loading...
                        </td>
                      </tr>
                    ) : todayQueue.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-2 text-center text-[#1B4A4F] dark:text-white">
                          No queue data available
                        </td>
                      </tr>
                    ) : (
                      todayQueue.map((entry, index) => (
                        <tr
                          key={entry.queueNumber}
                          className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-[#0A2A5E]' : 'bg-white dark:bg-[#051D4E]'}`}
                        >
                          <td className="px-4 py-2 text-[#1B4A4F] dark:text-white">{entry.queueNumber}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                entry.status === 'Done'
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-[#1B4A4F] dark:text-white">{entry.studentName}</td>
                          <td className="px-4 py-2 text-[#1B4A4F] dark:text-white">{entry.submittedSince}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;