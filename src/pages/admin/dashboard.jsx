import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { User, Users } from 'lucide-react';
import DashboardCard05 from '../../partials/dashboard/DashboardCard05';
import DashboardCard10 from '../../partials/dashboard/DashboardCard10';
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    // Set document title
    document.title = 'Dashboard';

    // Set favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img; // Use UKS2Img as favicon
    document.head.appendChild(favicon);
  }, []); // Effect runs only once on component mount

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
            <div className="flex gap-10 mb-6">
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <User className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Siswa</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">{totalStudents}</p>
                </div>
              </div>
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[390px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Keseluruhan user yang pernah antri</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">0</p>
                </div>
              </div>
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[250px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Antrian Hari ini</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">0</p>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-6">
              <DashboardCard05 />
              <DashboardCard10 />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;