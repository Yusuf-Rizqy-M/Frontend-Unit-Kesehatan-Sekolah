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
    today: 12,
    yesterday: 8,
    week: 45,
    all: 320,
    monthly: [10, 15, 12, 20, 18, 25, 22, 28, 15, 10, 8, 5],
    totalUsers: 150,
  });
  const [todayQueue, setTodayQueue] = useState([
    { queueNumber: "Q001", status: "Mengantri", studentName: "Budi Santoso", submittedSince: "21/08/2025 08:30" },
    { queueNumber: "Q002", status: "Selesai", studentName: "Siti Aminah", submittedSince: "21/08/2025 08:45" },
    { queueNumber: "Q003", status: "Mengantri", studentName: "Ahmad Yani", submittedSince: "21/08/2025 09:00" },
    { queueNumber: "Q004", status: "Selesai", studentName: "Rina Sari", submittedSince: "21/08/2025 09:15" },
    { queueNumber: "Q005", status: "Mengantri", studentName: "Dewi Lestari", submittedSince: "21/08/2025 09:30" },
  ]);
  const [loading, setLoading] = useState(false); // Set to false for presentation
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
                    // No fetch for presentation, just clear error
                    setError(null);
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