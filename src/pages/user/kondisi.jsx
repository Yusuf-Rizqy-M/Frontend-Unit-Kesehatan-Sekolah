import LayoutProfile from "../../components/user/layout_profile";
import { FaUserMd } from 'react-icons/fa';

function Kondisi() {
  const historyData = [
    {
      date: '10/04/2025',
      user: 'Admin uks',
      status: 'Stabil',
      weight: 50,
      height: 160,
      pulse: 50,
      bloodPressure: '117/70/60',
      temperature: 34,
      spo2: '??',
    },
    {
      date: '10/04/2025',
      user: 'Yusuf',
      status: 'Stabil',
      weight: 50,
      height: 160,
      pulse: 50,
      bloodPressure: '117/70/60',
      temperature: 34,
      spo2: '??',
    },
  ];

  return (
    <LayoutProfile>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-teal-700 mb-10">
          History Kondisi Kamu
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {historyData.map((item, index) => (
            <div
              key={index}
              className="border-2 border-teal-300 rounded-xl p-4 shadow-sm bg-white"
            >
              {/* Tanggal */}
              <div className="text-sm font-bold text-black mb-3 border-b border-gray-300 pb-1">
                {item.date}
              </div>

              {/* Header user + status */}
              <div className="flex items-center gap-2 mb-4">
                <FaUserMd className="text-teal-600 w-4 h-4" />
                <div className="text-sm text-gray-800 leading-tight">
                  <div className="font-medium">{item.user}</div>
                  <div className="text-teal-600 text-xs">{item.status}</div>
                </div>
              </div>

              {/* Informasi kondisi */}
              <div className="text-sm text-gray-700 space-y-1.5">
                <span>Berat badan = {item.weight}</span>
                <div>Tinggi badan = {item.height}</div>
                <div>Tensi = {item.bloodPressure}</div>
                <div>Temperature = {item.temperature}</div>
                <div>SpO2 = {item.spo2}</div>
                <span>Nadi = {item.pulse}</span>
              </div>

              {/* Anamnesa dan Terapi */}
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Anamnesa</p>
                  <div className="bg-green-100 h-16 rounded-md"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Terapi</p>
                  <div className="bg-green-100 h-16 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutProfile>
  );
}

export default Kondisi;
