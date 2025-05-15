import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const FormAnamnesaView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recordId } = useParams();
  const { student, newRecord = {} } = state || {};

  const formData = {
    anamnesa: newRecord.anamnesa || '',
    tensi: newRecord.tensi || '',
    nadi: newRecord.nadi || '',
    suhu: newRecord.suhu || '',
    spo: newRecord.spo || '',
    tinggiBadan: newRecord.tinggiBadan || '',
    beratBadan: newRecord.beratBadan || '',
    terapi: newRecord.terapi || '',
  };

  const handleCancel = () => {
    console.log("Navigating to /MedicalRecord with student:", student);
    if (student?.id) {
      navigate(`/MedicalRecord/${student.id}`, { state: { student } });
    } else {
      console.error("Student ID is missing, navigating to /rekammedis");
      navigate('/rekammedis');
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 font-sans">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
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
              Anamnesa
            </label>
            <p className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800">
              {formData.anamnesa}
            </p>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tensi
              </label>
              <p className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800">
                {formData.tensi}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nadi
              </label>
              <p className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800">
                {formData.nadi}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Suhu
              </label>
              <p className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800">
                {formData.suhu}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                SpO
              </label>
              <p className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800">
                {formData.spo}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tinggi Badan
              </label>
              <p className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800">
                {formData.tinggiBadan}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Berat Badan
              </label>
              <p className="w-full p-2 rounded-lg bg-[#E6F0FA] text-center text-gray-800">
                {formData.beratBadan}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terapi
            </label>
            <p className="w-full h-24 p-4 rounded-lg bg-[#E6F0FA] text-gray-800">
              {formData.terapi}
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-[#B3E5FC] text-teal-800 rounded-lg hover:bg-[#81D4FA] transition-colors font-semibold"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAnamnesaView;