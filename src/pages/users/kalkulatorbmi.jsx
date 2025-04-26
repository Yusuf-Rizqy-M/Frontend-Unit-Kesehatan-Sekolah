import Layout from '../../components/user/layout';
import { useState } from 'react';
import laki from "../../assets/img/laki.png"; // <--- Tambahin ini
import Perempuan from "../../assets/img/Perempuan.png"; // <--- Tambahin ini

function KalkulatorBmi() {
  const [gender, setGender] = useState('man');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    if (height && weight) {
      const bmi = weight / ((height / 100) ** 2);
      let status = '';

      if (gender === 'man') {
        if (bmi < 18.5) status = 'Kurus';
        else if (bmi < 25) status = 'Berat Ideal';
        else if (bmi < 30) status = 'Berat Berlebih';
        else status = 'Obesitas';
      } else if (gender === 'woman') {
        if (bmi < 18) status = 'Kurus'; // <- contoh lebih rendah sedikit
        else if (bmi < 24) status = 'Berat Ideal';
        else if (bmi < 29) status = 'Berat Berlebih';
        else status = 'Obesitas';
      }

      setResult({
        bmi: bmi.toFixed(1),
        status,
      });
    }
  };


  const getIndicatorPosition = () => {
    if (!result) return 'left-[37%]'; // posisi default tengah-tengah
    if (result.status === 'Kurus') return 'left-[10%]';
    if (result.status === 'Berat Ideal') return 'left-[35%]';
    if (result.status === 'Berat Berlebih') return 'left-[60%]';
    if (result.status === 'Obesitas') return 'left-[85%]';
  };


  return (
    <Layout>
    <main className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Kiri - Ilustrasi & Hasil */}
        <div className="bg-white p-8 rounded-2xl shadow-md text-center w-full h-full">
          <img
            src={gender === 'man' ? laki : Perempuan}
            alt="Ilustrasi Olahraga"
            className="mx-auto mb-6 w-48 h-48 object-contain"
          />



          <h2 className="text-xl font-bold text-gray-700 mb-2">
            BMI untuk {gender === 'man' ? 'Laki-laki' : 'Perempuan'}
          </h2>
          <p
            className={`text-3xl font-bold mb-2 ${result
              ? result.status === 'Kurus' || result.status === 'Obesitas'
                ? 'text-red-500'
                : result.status === 'Berat Ideal'
                  ? 'text-green-500'
                  : 'text-yellow-400'
              : 'text-emerald-500'
              }`}
          >
            {result ? result.status : 'Berat Ideal'}
          </p>


          {/* Bar */}
          <div className="flex items-center justify-center my-6">
            <div className="relative w-64 h-4 rounded-full bg-red-400 overflow-hidden">
              <div className="absolute left-1/4 w-1/4 h-full bg-green-400"></div>
              <div className="absolute left-2/4 w-1/4 h-full bg-yellow-300"></div>

              {/* Bulatan indikator bergerak */}
              <div className={`absolute top-1/2 ${getIndicatorPosition()} -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-300 rounded-full z-10 transition-all duration-500`}></div>
            </div>
          </div>


          <p className="text-sm text-gray-500 leading-relaxed">
            Pastikan asupan kalori sesuai kebutuhan harian & konsumsi makanan sehat
          </p>
        </div>

        {/* Kanan - Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8">BMI Kalkulator</h2>

          <div className="flex mb-6 w-full h-12 rounded-lg overflow-hidden border border-gray-300">
            <button
              className={`flex-1 font-semibold transition ${gender === 'man' ? 'bg-cyan-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setGender('man')}
            >
              Man
            </button>
            <button
              className={`flex-1 font-semibold transition ${gender === 'woman' ? 'bg-cyan-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setGender('woman')}
            >
              Woman
            </button>
          </div>



          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Tinggi (cm)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Berat (kg)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <button
            onClick={calculateBMI}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-full text-lg font-bold transition"
          >
            Hitung BMI
          </button>
        </div>
      </main>
    </Layout>
  );
}

export default KalkulatorBmi;
