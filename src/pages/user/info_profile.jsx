import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutProfile from "../../components/user/layout_profile";
import ProfileImg from "../../assets/img/doctor_img_rounded.png";
import MaleIcon from "../../assets/img/gendermale.png";
import FemaleIcon from "../../assets/img/genderfemale.png";
import NeutralIcon from "../../assets/img/genderno.png";
import UKS2Img from '../../images/uks2.png'; // Impor gambar UKS2Img, sesuaikan path


const InfoProfile = () => {

 useEffect(() => {
      // Mengatur judul tab
      document.title = 'Info Profil';
      
      // Mengatur favicon
      const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = UKS2Img; // Menggunakan UKS2Img sebagai favicon
      document.head.appendChild(favicon);
    }, []); // Efek hanya dijalankan sekali saat komponen dimuat

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch profile data from API
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setError("Silakan masuk untuk melanjutkan");
        navigate("/login");
        return;
      }

      const response = await fetch("https://api-uks.rplrus.com/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || `Failed to fetch profile data: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API response:", result); // Debug response
      // Check if response has expected data
      const data = result.data && typeof result.data === "object" ? result.data : null;
      if (result.status && data) {
        setProfileData(data);
        // Cache the data in localStorage
        localStorage.setItem("profileData", JSON.stringify(data));
      } else {
        throw new Error(result.message || "Format respons tidak valid");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // Try to load cached data from localStorage
      const cachedData = localStorage.getItem("profileData");
      if (cachedData) {
        setProfileData(JSON.parse(cachedData));
        setError(null);
      } else {
        setError(err.message === "Silakan masuk untuk melanjutkan" ? err.message : "Tidak dapat terhubung ke server. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    // Check for cached data first
    const cachedData = localStorage.getItem("profileData");
    if (cachedData) {
      setProfileData(JSON.parse(cachedData));
      setLoading(false);
    }
    fetchProfileData();
  }, [navigate]);

  // Default form fields
  const defaultFormFields = [
    { label: "Nama", key: "name" },
    { label: "Email", key: "email" },
    { label: "Nomor Telepon", key: "phone_number" },
    { label: "Jenis Kelamin", key: "gender" },
    { label: "Nama Jurusan", key: "name_department" },
    { label: "Kelas", key: "class" },
    { label: "Nama Orang Tua", key: "name_parent" },
    { label: "Nomor Telepon Orang Tua", key: "no_hp_parent" },
    { label: "Nama Walikelas", key: "name_walikelas" },
    { label: "Absen", key: "absent" },
  ];

  // Function to select icon and text based on gender
  const getGenderInfo = (gender) => {
    if (gender === "male") {
      return { icon: MaleIcon, text: "Laki- laki" };
    } else if (gender === "female") {
      return { icon: FemaleIcon, text: "Perempuan" };
    }
    return { icon: NeutralIcon, text: "Belum ada data" };
  };

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
      <div className="bg-[#E3F7F6]">
        <main className="bg-[#F9FCFD] min-h-screen overflow-y-auto pt-10 px-6 lg:px-16 py-10">
          <h2 className="text-xl font-semibold border-b-2 border-gray-400 pb-2 text-[#303030] text-left w-[80%]">
            Info Profil
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
              <div className="double-spinner">
                <div className="spinner-ring outer"></div>
                <div className="spinner-ring inner"></div>
              </div>
              <p className="text-gray-500 mt-4">Memuat...</p>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center text-lg">{error}</p>
          ) : !profileData ? (
            <p className="text-gray-600 text-center text-lg">Tidak ada data profil tersedia</p>
          ) : (
            <div className="mt-6 flex flex-col lg:flex-row gap-12">
              {/* Left: Info Form */}
              <div className="lg:w-2/3 w-full space-y-4">
                {defaultFormFields.map((item, i) =>
                  item.label === "Jenis Kelamin" ? (
                    <div key={i} className="flex flex-col text-left">
                      <label className="block text-sm font-medium text-gray-800 mb-1 text-left">
                        {item.label}
                      </label>
                      <div className="flex items-center gap-2 w-[420px]">
                        <img
                          src={getGenderInfo(profileData?.[item.key]).icon}
                          alt="Gender"
                          className="w-8 h-8"
                        />
                        <span className="text-gray-800 font-medium">
                          {getGenderInfo(profileData?.[item.key]).text}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex flex-col text-left">
                      <label className="block text-sm font-medium text-gray-800 mb-1 text-left">
                        {item.label}
                      </label>
                      <input
                        type="text"
                        value={profileData?.[item.key] || ""}
                        readOnly
                        className="w-[600px] px-3 py-2 rounded-lg bg-gray-200 text-gray-800 border border-gray-300 text-sm cursor-default text-left"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Right: Profile Image */}
              <div className="lg:w-1/3 w-full flex justify-center lg:justify-end">
                <img
                  src={ProfileImg}
                  alt="Profile"
                  className="w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </LayoutProfile>
  );
};

export default InfoProfile;