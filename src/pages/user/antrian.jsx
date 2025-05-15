import LayoutProfile from "../../components/user/layout_profile";

function Antrian() {
  const queueData = [
    { tanggal: "14/05/2024", tujuan: "Cek kondisi", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Cek tinggi", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Tes Tensi", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Vitamin C", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Cek bb", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Cek kondisi", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Cek kondisi", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Cek kondisi", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Cek kondisi", status: "Selesai" },
    { tanggal: "14/05/2024", tujuan: "Cek kondisi", status: "Selesai" },
  ];

  return (
    <LayoutProfile>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-teal-700 mb-8">
          History Antrian Kamu
        </h1>

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
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{item.tanggal}</td>
                  <td className="py-2 px-4">{item.tujuan}</td>
                  <td className="py-2 px-4 text-teal-600 font-medium">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutProfile>
  );
}

export default Antrian;
