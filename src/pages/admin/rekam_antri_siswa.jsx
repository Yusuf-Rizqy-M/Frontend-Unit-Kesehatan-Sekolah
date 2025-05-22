import React, { useEffect, useState } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RekamAntrian() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalWaiting, setTotalWaiting] = useState(0);
  const [totalProcessing, setTotalProcessing] = useState(0);
  const [totalSkipped, setTotalSkipped] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queueData = [
    {
      id: "001",
      reason: "Sakit Kepala",
      status: "Selesai",
      name: "User",
      submit: "1 Menit yang lalu",
    },
    {
      id: "002",
      reason: "Ora sek",
      status: "Menunggu",
      name: "Guest",
      submit: "1 Jam yang lalu",
    },
  ];

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [completedRes, waitingRes, processingRes, skippedRes] = await Promise.all([
          axios.get("https://api-uks.rplrus.com/api/admin/queues/total-completed-today", config),
          axios.get("https://api-uks.rplrus.com/api/admin/queues/total-waiting-today", config),
          axios.get("https://api-uks.rplrus.com/api/admin/queues/total-processing-today", config),
          axios.get("https://api-uks.rplrus.com/api/admin/queues/total-skipped-today", config),
        ]);

        setTotalCompleted(completedRes.data.data.total_completed || 0);
        setTotalWaiting(waitingRes.data.data.total_waiting || 0);
        setTotalProcessing(processingRes.data.data.total_processing || 0);
        setTotalSkipped(skippedRes.data.data.total_skipped || 0);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized access. Please log in again.");
        } else {
          setError("Failed to fetch queue data. Please try again later.");
        }
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold pb-4">
              Rekam Antrian Siswa
            </h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
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

                <div className="flex justify-center mb-6">
                  <div className="grid grid-cols-12 gap-6 max-w-3xl">
                    <div className="col-span-12 sm:col-span-6">
                      <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow p-6 text-center">
                        <h2 className="text-lg font-semibold text-[#93D3CC] dark:text-white mb-4">
                          Antrian Sekarang
                        </h2>
                        <p className="text-[48px] font-bold text-[#93D3CC] dark:text-white mb-4">
                          004
                        </p>
                        <p className="text-sm text-[#93D3CC] dark:text-white">
                          <span className="font-medium">Status:</span> Waiting
                        </p>
                        <p className="text-sm text-[#93D3CC] dark:text-white">
                          <span className="font-medium">Reason:</span> Sakit Kepala
                        </p>
                      </div>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                      <div className="bg-[#93D3CC] dark:bg-[#051D4E] rounded-[20px] shadow p-6 text-center">
                        <h2 className="text-lg font-semibold text-white dark:text-white mb-4">
                          Antrian Terakhir
                        </h2>
                        <p className="text-[48px] font-bold text-white dark:text-white mb-4">
                          50
                        </p>
                        <p className="text-sm text-white dark:text-white">
                          <span className="font-medium">Status:</span> Waiting
                        </p>
                        <p className="text-sm text-white dark:text-white">
                          <span className="font-medium">Reason:</span> Cek Kondisi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mb-4">
                  <button className="px-6 py-3 bg-[#569E80] text-white rounded-md font-medium w-80">
                    Hari Ini
                  </button>
                  <button className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md font-medium w-80">
                    Semua Data
                  </button>
                  <button className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md font-medium w-80">
                    Kemarin
                  </button>
                  <Link to="/historyrekamantri">
                    <button className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md font-medium w-80">
                      History
                    </button>
                  </Link>
                </div>

                <div className="bg-white dark:bg-[#051D4E] rounded-[20px] shadow overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-[#0A2F6A] text-[#1B4A4F] dark:text-white">
                        <th className="px-6 py-3 font-medium">Antrian</th>
                        <th className="px-6 py-3 font-medium">Reason</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Nama</th>
                        <th className="px-6 py-3 font-medium">Submit Sejak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queueData.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-gray-200 dark:border-gray-700 text-[#1B4A4F] dark:text-white"
                        >
                          <td className="px-6 py-4 flex items-center">
                            <span className="inline-block w-6 h-6 bg-[#1B4A4F] rounded-full mr-2"></span>
                            {item.id}
                          </td>
                          <td className="px-6 py-4">{item.reason}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full ${
                                item.status === "Selesai"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">{item.name}</td>
                          <td className="px-6 py-4">{item.submit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}