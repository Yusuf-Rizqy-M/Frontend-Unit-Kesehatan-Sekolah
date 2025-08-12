import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PengaturanProfil = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone_number: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token autentikasi tidak ditemukan. Silakan masuk kembali.');
        }

        const response = await axios({
          method: 'get',
          url: 'https://api-uks.rplrus.com/api/user',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, email, phone_number } = response.data.data;
        setProfile({ name, email, phone_number: phone_number || '' });
      } catch (err) {
        const errorMessage =
          err.response?.status === 401
            ? "Akses tidak diizinkan. Silakan masuk kembali."
            : err.message || 'Gagal memuat profil';
        showToastMessage(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneKeyDown = (e) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];
    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      showToastMessage('Silakan masukkan alamat email yang valid', "error");
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (profile.phone_number && !phoneRegex.test(profile.phone_number)) {
      showToastMessage('Silakan masukkan nomor telepon yang valid (10 hingga 15 digit)', "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan. Silakan masuk kembali.');
      }

      const { email, phone_number } = profile;
      const dataToSend = { email, phone_number };

      console.log('Data yang dikirim:', dataToSend);

      const response = await axios({
        method: 'put',
        url: 'https://api-uks.rplrus.com/api/user/update',
        data: dataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Respons dari server:', response.data);

      if (response.data.message === 'Profile updated successfully') {
        showToastMessage('Profil berhasil diperbarui', "success");
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Gagal memperbarui profil');
      }
    } catch (err) {
      console.error('Detail kesalahan:', err.response || err);
      const errorMessage =
        err.response?.status === 401
          ? 'Akses tidak diizinkan: Token tidak valid atau kadaluarsa. Silakan masuk kembali.'
          : err.response?.data?.message || err.message || 'Gagal memperbarui profil';
      showToastMessage(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full animate-pulse">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          </div>
          <p className="text-center text-gray-500 mt-4">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-lg w-full transition-all duration-300 hover:shadow-xl">
        <style>
          {`
            .animate-fade-in-out {
              animation: fadeInOut 3s ease-in-out;
            }
            @keyframes fadeInOut {
              0% { opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}
        </style>
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#75CCD1] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1 className="text-3xl font-bold text-[#75CCD1] tracking-tight">Pengaturan Profil</h1>
          <p className="text-gray-500 mt-2 text-sm">Perbarui informasi pribadi Anda</p>
        </div>

        {showToast && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${
              toastType === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            } px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50`}
          >
            <div
              className={`rounded-full p-1 ${
                toastType === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {toastType === "error" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="font-medium text-sm">{toastMessage}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-200 shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed py-3 px-4"
                disabled
                title="Nama hanya dapat diubah oleh admin"
                aria-label="Nama lengkap (tidak dapat diubah)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#75CCD1] focus:ring-[#75CCD1] transition duration-200 ease-in-out py-3 px-4 bg-white"
                required
                placeholder="Masukkan alamat email"
                aria-label="Alamat email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone_number"
                value={profile.phone_number}
                onChange={handleInputChange}
                onKeyDown={handlePhoneKeyDown}
                maxLength={15}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#75CCD1] focus:ring-[#75CCD1] transition duration-200 ease-in-out py-3 px-4 bg-white"
                placeholder="Masukkan nomor telepon"
                aria-label="Nomor telepon"
              />
            </div>
            <div className="flex justify-between items-center">
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
                aria-label="Kembali ke dasbor"
              >
                Kembali ke Dashboard
              </Link>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
                  aria-label="Batal mengedit profil"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2 bg-[#75CCD1] text-white rounded-xl hover:bg-[#5ABBC0] transition duration-200 ease-in-out font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={isSubmitting ? 'Menyimpan perubahan' : 'Simpan perubahan'}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-600">Nama Lengkap</p>
              <p className="mt-1 text-lg text-[#75CCD1] font-semibold">{profile.name || 'Belum diatur'}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-600">Alamat Email</p>
              <p className="mt-1 text-lg text-[#75CCD1] font-semibold">{profile.email || 'Belum diatur'}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-600">Nomor Telepon</p>
              <p className="mt-1 text-lg text-[#75CCD1] font-semibold">{profile.phone_number || 'Belum diatur'}</p>
            </div>
            <div className="flex justify-between">
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
                aria-label="Kembali ke dasbor"
              >
                Kembali ke Dashboard
              </Link>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-[#75CCD1] text-white rounded-xl hover:bg-[#5ABBC0] transition duration-200 ease-in-out font-medium"
                aria-label="Edit profil"
              >
                Edit Profil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PengaturanProfil;