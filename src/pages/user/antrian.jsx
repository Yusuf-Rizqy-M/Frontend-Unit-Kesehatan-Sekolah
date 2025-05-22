import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutProfile from "../../components/user/layout_profile";
import useLogin from "../../hooks/useLogin";

function Antrian() {
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { error: loginError } = useLogin();
  const navigate = useNavigate();

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
        console.log("API response:", result); // Debug response
        // Handle different response structures
        const data = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
        const mappedData = data.map(item => ({
          id: item.id,
          queue_number: item.queue_number,
          tanggal: new Date(item.queue_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).replace(/\//g, "/"),
          tujuan: item.reason,
          status: item.status,
        }));
        setQueueData(mappedData);
        // Cache the data in localStorage
        localStorage.setItem("queueHistoryData", JSON.stringify(mappedData));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // Try to load cached data from localStorage
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
    // Check for cached data first
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
        `}
      </style>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-teal-700 mb-8">
          History Antrian Kamu
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p className="text-gray-500 mt-4">Memuat...</p>
          </div>
        ) : error || loginError ? (
          <div className="text-center text-red-500 text-lg">{error || loginError}</div>
        ) : queueData.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Kamu tidak pernah mengambil antrian
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="border-b border-teal-300 text-gray-800 font-medium">
                <tr>
                  <th className="py-2 px-4">No</th>
                  <th className="py-2 px-4">Tanggal</th>
                  <th className="py-2 px-4">Tujuan</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {queueData.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-4">{item.queue_number}</td>
                    <td className="py-2 px-4">{item.tanggal}</td>
                    <td className="py-2 px-4">{item.tujuan}</td>
                    <td className="py-2 px-4 text-teal-600 font-medium">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LayoutProfile>
  );
}

export default Antrian;