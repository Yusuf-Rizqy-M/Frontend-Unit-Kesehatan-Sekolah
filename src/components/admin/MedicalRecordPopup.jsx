import React from 'react';

const MedicalRecordPopup = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Rekam Medis - {student.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Anamnesa Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Anamnesa</h3>
          <textarea
            className="w-full p-3 bg-blue-100 dark:bg-gray-700 border-none rounded-lg text-gray-800 dark:text-white text-sm"
            placeholder="Lorem Ipsum Dollare sit Amet"
            rows="4"
          />
        </div>

        {/* Health Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Tensi', value: '000' },
            { label: 'Nadi', value: '000' },
            { label: 'Suhu', value: '000' },
            { label: 'Spo', value: '000' },
            { label: 'Tinggi Badan', value: '000 cm' },
            { label: 'Berat Badan', value: '000 kg' },
          ].map((metric, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label className="text-sm text-gray-800 dark:text-white">{metric.label}</label>
              <input
                type="text"
                value={metric.value}
                readOnly
                className="p-3 bg-blue-100 dark:bg-gray-700 border-none rounded-lg text-center text-sm text-gray-800 dark:text-white"
              />
            </div>
          ))}
        </div>

        {/* Terapi Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Terapi</h3>
          <textarea
            className="w-full p-3 bg-blue-100 dark:bg-gray-700 border-none rounded-lg text-gray-800 dark:text-white text-sm"
            placeholder="Lorem Ipsum Dollare sit Amet"
            rows="4"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-200 dark:bg-gray-600 text-blue-600 dark:text-white rounded-full hover:bg-blue-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Batalkan
          </button>
          <button
            className="px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors duration-200"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordPopup;