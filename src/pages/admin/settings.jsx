import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone_number: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan masuk.');
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
        setError(err.message || 'Gagal mengambil profil');
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
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setError('Silakan masukkan alamat email yang valid');
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (profile.phone_number && !phoneRegex.test(profile.phone_number)) {
      setError('Silakan masukkan nomor telepon yang valid (10 hingga 15 digit)');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan masuk.');
      }

      const { email, phone_number } = profile;
      const dataToSend = { email, phone_number };

      console.log('Data being sent:', dataToSend);

      const response = await axios({
        method: 'put',
        url: 'https://api-uks.rplrus.com/api/user/update',
        data: dataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response from server:', response.data);

      if (response.data.message === 'Profile updated successfully') {
        setSuccess('Profil berhasil diperbarui');
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Gagal memperbarui profil');
      }
    } catch (err) {
      console.error('Error details:', err.response || err);
      if (err.response?.status === 401) {
        setError('Tidak diizinkan: Token tidak valid atau kedaluwarsa. Silakan masuk kembali.');
      } else {
        setError(err.response?.data?.message || err.message || 'Gagal memperbarui profil');
      }
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
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#75CCD1] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1 className="text-3xl font-bold text-[#75CCD1] tracking-tight">Pengaturan Profil</h1>
          <p className="text-gray-500 mt-2 text-sm">Perbarui informasi pribadi Anda</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-white border-l-4 border-[#75CCD1] text-[#75CCD1] p-4 rounded-xl mb-6 animate-fade-in">
            {success}
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#75CCD1] focus:ring-[#75CCD1] transition duration-200 ease-in-out py-3 px-4 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telephone
              </label>
              <input
                type="tel"
                name="phone_number"
                value={profile.phone_number}
                onChange={handleInputChange}
                onKeyDown={handlePhoneKeyDown}
                maxLength={15}
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#75CCD1] focus:ring-[#75CCD1] transition duration-200 ease-in-out py-3 px-4 bg-white"
              />
            </div>
            <div className="flex justify-between items-center">
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
              >
                Ke Dashboard
              </Link>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2 bg-[#75CCD1] text-white rounded-xl hover:bg-[#5ABBC0] transition duration-200 ease-in-out font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="mt-1 text-lg text-[#75CCD1] font-semibold">{profile.email || 'Belum diatur'}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm font-medium text-gray-600">Nomor Telephone</p>
              <p className="mt-1 text-lg text-[#75CCD1] font-semibold">{profile.phone_number || 'Belum diatur'}</p>
            </div>
            <div className="flex justify-between">
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 ease-in-out font-medium"
              >
                Ke Dashboard
              </Link>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-[#75CCD1] text-white rounded-xl hover:bg-[#5ABBC0] transition duration-200 ease-in-out font-medium"
              >
                Ubah Profil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;