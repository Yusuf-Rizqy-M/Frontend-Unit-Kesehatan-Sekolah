import { useState, useEffect } from 'react';
import LayoutProfile from "../../components/user/layout_profile";
import { FaUserMd } from 'react-icons/fa';

function Kondisi() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthConditions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('https://api-uks.rplrus.com/api/health-conditions-one', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const result = await response.json();
          if (result.message === 'Data kondisi tidak ditemukan') {
            setHistoryData([]);
          } else {
            throw new Error(result.message || 'Failed to fetch health conditions');
          }
        } else {
          const result = await response.json();
          if (result.status && result.data) {
            setHistoryData(result.data);
            // Cache the data in localStorage
            localStorage.setItem('healthConditionsData', JSON.stringify(result.data));
          } else {
            throw new Error('Invalid response format');
          }
        }
      } catch (err) {
        // Try to load cached data from localStorage
        const cachedData = localStorage.getItem('healthConditionsData');
        if (cachedData) {
          setHistoryData(JSON.parse(cachedData));
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // Check for cached data first
    const cachedData = localStorage.getItem('healthConditionsData');
    if (cachedData) {
      setHistoryData(JSON.parse(cachedData));
      setLoading(false);
    }
    fetchHealthConditions();
  }, []);

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
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-teal-700 mb-10">
          History Kondisi Kamu
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
            <div className="double-spinner">
              <div className="spinner-ring outer"></div>
              <div className="spinner-ring inner"></div>
            </div>
            <p className="text-gray-500 mt-4">Memuat...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg">{error}</div>
        ) : historyData.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Kamu tidak pernah cek kondisi
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {historyData.map((item, index) => (
              <div
                key={index}
                className="border-2 border-teal-300 rounded-xl p-4 shadow-sm bg-white"
              >
                {/* Tanggal */}
                <div className="text-sm font-bold text-black mb-3 border-b border-gray-300 pb-1">
                  {new Date(item.created_at).toLocaleDateString('en-GB')}
                </div>

                {/* Header user + status */}
                <div className="flex items-center gap-2 mb-4">
                  <FaUserMd className="text-teal-600 w-4 h-4" />
                  <div className="text-sm text-gray-800 leading-tight">
                    <div className="font-medium">User ID: {item.user_id}</div>
                    <div className="text-teal-600 text-xs">{item.status}</div>
                  </div>
                </div>

                {/* Informasi kondisi */}
                <div className="text-sm text-gray-700 space-y-1.5">
                  <span>Berat badan = {item.weight} kg</span>
                  <div>Tinggi badan = {item.height} cm</div>
                  <div>Tensi = {item.tension}</div>
                  <div>Temperature = {item.temperature} °C</div>
                  <div>SpO2 = {item.spo2}%</div>
                  <span>Nadi = {item.pulse} bpm</span>
                </div>

                {/* Anamnesa dan Terapi */}
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">Anamnesa</p>
                    <div className="bg-green-100 h-16 rounded-md p-2 text-sm text-gray-700">
                      {item.anamnesis}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">Terapi</p>
                    <div className="bg-green-100 h-16 rounded-md p-2 text-sm text-gray-700">
                      {item.therapy}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutProfile>
  );
}

export default Kondisi;