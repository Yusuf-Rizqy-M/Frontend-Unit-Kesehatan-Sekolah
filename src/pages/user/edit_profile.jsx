import React, { useState } from "react";
import LayoutProfile from "../../components/user/layout_profile";
import ProfileImg from "../../assets/img/doctor_img_rounded.png";
import MaleIcon from "../../assets/img/male.png";
import FemaleIcon from "../../assets/img/femenine.png";

const EditProfile = () => {
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
    phone: "",
    gender: "",
    name_department: "",
    name_grades: "",
    class: "",
    parentName: "",
    parentPhone: "",
    teacherName: "",
    absent: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  return (
    <LayoutProfile>
      <div className="bg-white min-h-screen py-10 px-6 lg:px-16">
        <h2 className="text-xl font-semibold border-b-2 border-gray-400 pb-2 text-[#303030] mb-6">
          Edit Profile
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 space-y-4">
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
            <InputField label="Nomor Telepon" name="phone" value={formData.phone} onChange={handleChange} />

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Jenis Kelamin</label>
              <div className="flex gap-6">
                <img
                  src={MaleIcon}
                  alt="Male"
                  onClick={() => handleGenderClick("Male")}
                  className={`w-12 h-12 cursor-pointer p-1 rounded-full border-2 ${
                    formData.gender === "Male" ? "border-blue-500" : "border-transparent"
                  }`}
                />
                <img
                  src={FemaleIcon}
                  alt="Female"
                  onClick={() => handleGenderClick("Female")}
                  className={`w-12 h-12 cursor-pointer p-1 rounded-full border-2 ${
                    formData.gender === "Female" ? "border-pink-500" : "border-transparent"
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <SelectField
                  label="Kelas"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  options={["10", "11", "12"]}
                />
              </div>
              <div className="flex-1">
                <SelectField
                  label="Nama Jurusan"
                  name="name_department"
                  value={formData.name_department}
                  onChange={handleChange}
                  options={Object.keys(gradeOptions)}
                />
              </div>
              <div className="flex-1">
                <SelectField
                  label="No. Kelas"
                  name="name_grades"
                  value={formData.name_grades}
                  onChange={handleChange}
                  options={gradeOptions[formData.name_department] || []}
                />
              </div>
            </div>

            <InputField label="Nama Orang Tua" name="parentName" value={formData.parentName} onChange={handleChange} />
            <InputField
              label="Nomor Telepon Orang Tua"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
            />
            <InputField
              label="Nama Walikelas"
              name="teacherName"
              value={formData.teacherName}
              onChange={handleChange}
            />
            <InputField label="Absent" name="absent" value={formData.absent} onChange={handleChange} />

            <div className="justify-center mt-8">
              <button
                onClick={() => console.log("Save button clicked", formData)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutProfile>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full max-w-lg px-3 py-2 rounded-lg border border-gray-300 text-sm"
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
