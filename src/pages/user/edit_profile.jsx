import React, { useState, useEffect } from "react";
import LayoutProfile from "../../components/user/layout_profile";
import ProfileImg from "../../assets/img/doctor_img_rounded.png";
import MaleIcon from "../../assets/img/male.png";
import FemaleIcon from "../../assets/img/femenine.png";
import NeutralIcon from "../../assets/img/genderno.png";
import UKS2Img from '../../images/uks2.png'; // Impor gambar UKS2Img, sesuaikan path

const EditProfile = () => {
  useEffect(() => {
    // Mengatur judul tab
    document.title = 'Edit Profile';
    
    // Mengatur favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img; // Menggunakan UKS2Img sebagai favicon
    document.head.appendChild(favicon);
  }, []); // Efek hanya dijalankan sekali saat komponen dimuat

  const gradeOptions = {
    RPL: ["RPL 1", "RPL 2"],
    "Animasi 3D": ["Animasi 3D 1", "Animasi 3D 2", "Animasi 3D 3"],
    "Animasi 2D": ["Animasi 2D 4", "Animasi 2D 5"],
    "DKV DG": ["DKV DG 1", "DKV DG 2", "DKV DG 3"],
    "DKV TG": ["DKV TG 4", "DKV TG 5"],
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    gender: "",
    name_department: "",
    name_grades: "",
    class: "",
    name_parent: "",
    no_hp_parent: "",
    name_walikelas: "",
    absent: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch profile data from API
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
        const data = result.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          gender: data.gender || "",
          name_department: data.name_department || "",
          name_grades: data.name_grades || "",
          class: data.class || "",
          name_parent: data.name_parent || "",
          no_hp_parent: data.no_hp_parent || "",
          name_walikelas: data.name_walikelas || "",
          absent: data.absent || "",
        });
      } else {
        throw new Error(result.message || "Failed to retrieve profile");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for phone number fields (only numbers, max 15 characters)
    if (name === "phone_number" || name === "no_hp_parent") {
      if (/^\d*$/.test(value) && value.length <= 15) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Validation for absent field (numbers between 1 and 40)
    if (name === "absent") {
      if (value === "" || (/^\d*$/.test(value) && value >= 1 && value <= 40)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Validation for name fields (only letters and spaces)
    if (name === "name" || name === "name_parent" || name === "name_walikelas") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Default case for other fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleGenderClick = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const getGenderInfo = (gender) => {
    if (gender === "male") return { icon: MaleIcon, text: "Male" };
    if (gender === "female") return { icon: FemaleIcon, text: "Female" };
    return { icon: NeutralIcon, text: "No Gender" };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowToast(false);

    try {
      // Client-side validation
      if (!formData.name) {
        throw new Error("Name is required.");
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("A valid email is required.");
      }
      if (!formData.phone_number || formData.phone_number.length < 10) {
        throw new Error("Phone number must be at least 10 digits.");
      }
      if (!formData.name_parent) {
        throw new Error("Parent name is required.");
      }
      if (!formData.no_hp_parent || formData.no_hp_parent.length < 10) {
        throw new Error("Parent phone number must be at least 10 digits.");
      }
      if (!formData.name_walikelas) {
        throw new Error("Class teacher name is required.");
      }

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        gender: formData.gender || null,
        class: formData.class || null,
        name_grades: formData.name_grades || null,
        name_department: formData.name_department || null,
        no_hp_parent: formData.no_hp_parent,
        name_parent: formData.name_parent,
        name_walikelas: formData.name_walikelas,
        absent: parseInt(formData.absent) || null,
      };

      const response = await fetch("https://api-uks.rplrus.com/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status) {
        setSuccess("Profile updated successfully!");
        setToastMessage("Profile updated successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } else {
        const errorMessages = result.errors
          ? Object.values(result.errors).flat().join(", ")
          : result.message || "Failed to update profile";
        throw new Error(errorMessages);
      }
    } catch (err) {
      setError(err.message);
      setToastMessage(err.message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutProfile>
      <div className="bg-white min-h-screen py-10 px-6 lg:px-16">
        {showToast && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50 ${
              success ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            <div className={`rounded-full p-1 ${success ? "bg-green-600" : "bg-red-600"}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {success ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </div>
            <span className="font-medium text-sm">{toastMessage}</span>
          </div>
        )}

        <h2 className="text-xl font-semibold border-b-2 border-gray-400 pb-2 text-[#303030] mb-6">
          Edit Profile
        </h2>

        {loading && <p className="text-gray-600">Saving...</p>}

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 space-y-4">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Nomor Telepon"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              type="tel"
              maxLength="15"
            />

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Jenis Kelamin</label>
              <div className="flex gap-6">
                {[
                  { value: "male", text: "Male" },
                  { value: "female", text: "Female" },
                  { value: "", text: "No Gender" },
                ].map(({ value, text }) => (
                  <div key={value} className="flex flex-col items-center">
                    <img
                      src={getGenderInfo(value).icon}
                      alt={text}
                      onClick={() => handleGenderClick(value)}
                      className={`w-12 h-12 cursor-pointer p-1 rounded-full border-2 ${
                        formData.gender === value
                          ? value === "male"
                            ? "border-blue-500"
                            : value === "female"
                            ? "border-pink-500"
                            : "border-gray-500"
                          : "border-transparent"
                      }`}
                    />
                    <span className="text-sm text-gray-800 mt-1">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <InputField
                  label="Kelas"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="Nama Jurusan"
                  name="name_department"
                  value={formData.name_department}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="No. Kelas"
                  name="name_grades"
                  value={formData.name_grades}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            <InputField
              label="Nama Orang Tua"
              name="name_parent"
              value={formData.name_parent}
              onChange={handleChange}
            />
            <InputField
              label="Nomor Telepon Orang Tua"
              name="no_hp_parent"
              value={formData.no_hp_parent}
              onChange={handleChange}
              type="tel"
              maxLength="15"
            />
            <InputField
              label="Nama Walikelas"
              name="name_walikelas"
              value={formData.name_walikelas}
              onChange={handleChange}
            />
            <InputField
              label="Absent"
              name="absent"
              value={formData.absent}
              onChange={handleChange}
              type="number"
              min="1"
              max="40"
            />

            <div className="justify-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 text-white rounded-lg ${
                  loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutProfile>
  );
};

const InputField = ({ label, name, value, onChange, readOnly, type = "text", min, max, maxLength }) => (
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      min={min}
      max={max}
      maxLength={maxLength}
      className={`w-full max-w-lg px-3 py-2 rounded-lg border border-gray-300 text-sm ${
        readOnly ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full max-w-lg px-3 py-2 rounded-lg border border-gray-300 text-sm"
    >
      <option value="">Pilih</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default EditProfile;