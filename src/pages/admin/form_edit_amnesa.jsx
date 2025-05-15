import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditRekamMedis = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { student, record } = state || {};

  const [formData, setFormData] = useState({
    date: record?.date || '',
    anamnesa: record?.anamnesa || '',
    tensi: record?.tensi || '',
    nadi: record?.nadi || '',
    suhu: record?.suhu || '',
    spo: record?.spo || '',
    tinggiBadan: record?.tinggiBadan || '',
    beratBadan: record?.beratBadan || '',
    terapi: record?.terapi || '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (record && student?.id) {
      navigate(`/MedicalRecord/${student.id}`, {
        state: {
          student,
          updatedRecord: { ...record, ...formData },
        },
      });
    } else {
      console.error("Student ID or record is missing, navigating to /rekammedis");
      navigate('/rekammedis', {
        state: { student },
      });
    }
  };

  const handleCancel = () => {
    if (student?.id) {
      navigate(`/MedicalRecord/${student.id}`, { state: { student } });
    } else {
      console.error("Student ID is missing, navigating to /rekammedis");
      navigate('/rekammedis');
    }
  };

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleCancel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 font-sans">
      <div ref={popupRef} className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
        <div className="flex items-center mb-4">
          <button
            onClick={handleCancel}
            className="mr-2 text-teal-800 hover:text-teal-600 transition-colors"
            aria-label="Kembali"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Halaman Rekam Medis
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              className="w-full p-2 rounded-lg bg-[#E6F0FA] text-gray-800 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anamnesa
            </label>
            <textarea
              name="anamnesa"
              value={formData.anamnesa}
              onChange={handleFormChange}
              placeholder="Lorem Ipsum Dollare sit Amet"
              className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800 focus:outline-none resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tensi
              </label>
              <input
                type="text"
                name="tensi"
                value={formData.tensi}
                onChange={handleFormChange}
                placeholder="000"
                className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nadi
              </label>
              <input
                type="text"
                name="nadi"
                value={formData.nadi}
                onChange={handleFormChange}
                placeholder="000"
                className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Suhu
              </label>
              <input
                type="text"
                name="suhu"
                value={formData.suhu}
                onChange={handleFormChange}
                placeholder="000"
                className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                SpO
              </label>
              <input
                type="text"
                name="spo"
                value={formData.spo}
                onChange={handleFormChange}
                placeholder="000"
                className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tinggi Badan
              </label>
              <input
                type="text"
                name="tinggiBadan"
                value={formData.tinggiBadan}
                onChange={handleFormChange}
                placeholder="000 cm"
                className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Berat Badan
              </label>
              <input
                type="text"
                name="beratBadan"
                value={formData.beratBadan}
                onChange={handleFormChange}
                placeholder="000 kg"
                className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terapi
            </label>
            <textarea
              name="terapi"
              value={formData.terapi}
              onChange={handleFormChange}
              placeholder="Lorem Ipsum Dollare sit Amet"
              className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800 focus:outline-none resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-[#B3E5FC] text-teal-800 rounded-lg hover:bg-[#81D4FA] transition-colors font-semibold"
            >
              Batalkan
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#26A69A] text-white rounded-lg hover:bg-[#1E887D] transition-colors font-semibold"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRekamMedis;