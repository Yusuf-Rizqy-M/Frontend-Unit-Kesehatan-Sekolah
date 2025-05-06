import React, { useState, useEffect } from "react";
import LayoutProfile from "../../components/user/layout_profile";
import ProfileImg from "../../assets/img/doctor_img_rounded.png";
import MaleIcon from "../../assets/img/gendermale.png";
import FemaleIcon from "../../assets/img/genderfemale.png";
import NeutralIcon from "../../assets/img/genderno.png"; // Impor ikon untuk gender null

const InfoProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk memanggil API
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const response = await fetch("https://api-uks.rplrus.com/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const result = await response.json();
      if (result.status) {
        setProfileData(result.data);
      } else {
        throw new Error(result.message || "Failed to retrieve profile");
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Panggil API saat komponen dimuat
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Data default untuk form, sesuai dengan respons API
  const defaultFormFields = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Nomor Telepon", key: "phone_number" },
    { label: "Jenis Kelamin", key: "gender" },
    { label: "Nama Jurusan", key: "name_department" },
    { label: "Kelas", key: "class" },
    { label: "Nama Orang Tua", key: "name_parent" },
    { label: "Nomor Telepon Orang Tua", key: "no_hp_parent" },
    { label: "Nama Walikelas", key: "name_walikelas" },
    { label: "Absent", key: "absent" },
  ];

  // Fungsi untuk memilih ikon dan teks berdasarkan jenis kelamin
  const getGenderInfo = (gender) => {
    if (gender === "male") {
      return { icon: MaleIcon, text: "Male" };
    } else if (gender === "female") {
      return { icon: FemaleIcon, text: "Female" };
    }
    return { icon: NeutralIcon, text: "No Gender" }; // Untuk gender null atau tidak valid
  };

  return (
    <LayoutProfile>
      <div className="bg-[#E3F7F6]">
        <main className="bg-[#F9FCFD] min-h-screen overflow-y-auto pt-10 px-6 lg:px-16 py-10">
          <h2 className="text-xl font-semibold border-b-2 border-gray-400 pb-2 text-[#303030] text-left w-[80%]">
            Info Profile
          </h2>

          {loading && <p>Loading profile data...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
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
      
            </div>
          )}
        </main>
      </div>
    </LayoutProfile>
  );
};

export default InfoProfile;