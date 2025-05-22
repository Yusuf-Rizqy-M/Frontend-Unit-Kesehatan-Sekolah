import React, { useState, useEffect } from "react";
import DoctorCard from "../widget/doctorcard";
import axios from "axios";

function HealthcareTeam() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://api-uks.rplrus.com/api/staff";

  // Fetch staff data from API with caching
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get(API_URL);
        if (!response.status === 200) {
          throw new Error('Network response was not ok');
        }
        const data = response.data;
        // Cache the data in localStorage
        localStorage.setItem('healthcareTeamData', JSON.stringify(data));
        setStaffs(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        // Try to load cached data from localStorage
        const cachedData = localStorage.getItem('healthcareTeamData');
        if (cachedData) {
          setStaffs(JSON.parse(cachedData));
          setLoading(false);
          setError(null);
        } else {
          setError("Gagal memuat data tim kesehatan: " + err.message);
          setLoading(false);
        }
      }
    };

    // Check for cached data first
    const cachedData = localStorage.getItem('healthcareTeamData');
    if (cachedData) {
      setStaffs(JSON.parse(cachedData));
      setLoading(false);
    }
    fetchStaffs();
  }, []);

  // Function to clean image URL
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    const prefix = "https://api-uks.rplrus.com/storage/";
    if (image.startsWith(prefix + prefix)) {
      return image.replace(prefix + prefix, prefix);
    }
    return image;
  };

  // Function to clean WhatsApp number (remove +)
  const cleanWhatsApp = (wa) => {
    return wa.replace(/^\+/, "");
  };

  return (
    <section className="relative mt-12 w-full flex justify-center bg-white mb-16 overflow-visible">
      {/* BACKGROUND - Tetap hardcoded sebagai desain */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-[-30px] w-[120px] h-[120px] bg-[#F1FFE2] rounded-full opacity-50" />
        <div className="absolute bottom-50 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] opacity-60" />
        <div className="absolute bottom-50 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] rotate-20 opacity-60" />
        <div className="absolute top-[300px] right-[300px] w-[70px] h-[70px] bg-[#FFD1DC] rotate-12 rounded-md opacity-50" />
        <div className="absolute bottom-[150px] left-[-100px] w-[90px] h-[90px] bg-[#B0E0E6] rounded-full opacity-40" />
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl w-full space-y-12 px-4 relative z-10">
        <div className="text-center w-full">
          <h2 className="text-[20px] font-semibold text-[#2D3E50]">Our Healthcare Team</h2>
          <div className="w-full border-b-4 border-teal-400 mx-auto max-w-[200px]" />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Memuat...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : staffs.length === 0 ? (
          <div className="text-center text-gray-500">Tidak ada data tim kesehatan.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 px-6">
            {staffs.map((staff) => (
              <DoctorCard
                key={staff.id}
                name={staff.name}
                specialty={staff.role}
                whatsapp={cleanWhatsApp(staff.wa)}
                image={getImageUrl(staff.image)} // Gambar dari API
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HealthcareTeam;