import Layout from '../../components/layout';
import { Link } from 'react-router-dom';
import MentalHealth from '../../assets/img/loveydovey.png';
import KesehatanFisik from '../../assets/img/strong.png';
import PencegahanPenyakit from '../../assets/img/shieldy2.png';
import PolaHidupSehat from '../../assets/img/sleepy.png';
import KebersihanDiri from '../../assets/img/cleaannn.png';
import EducationCard from '../../widget/educationcard';

function EdukasiKesehatan() {
  return (
    <Layout>
      <main>
      <section className="relative w-full flex justify-center items-center bg-white mb-20 min-h-[300px]  mt-[-250px]">
          {/* Kotak */}
          <div className="w-[1200px] h-[200px] bg-[#75CCD1] rounded-[20px] flex items-center shadow-md pl-12 pt-6">
            <h2 className="text-4xl font-bold text-white text-left leading-tight">
              Jelajahi <br /> berbagai <span className="text-[#005A79]">Edukasi kesehatan</span>
            </h2>
          </div>
      </section>


        <h2 className="-mt-17 text-3xl font-semibold text-[#2A8F9E] text-center"> 
          Apa yang ingin <span className="text-[#005A79]">dibaca?</span>
        </h2>
        
        {/* changed */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <Link to="/KesehatanMental">
            <EducationCard title="Kesehatan Mental" icon={MentalHealth} />
          </Link>
          <Link to="/FisikEdu" >
            <EducationCard title="Kesehatan Fisik" icon={KesehatanFisik} />
          </Link>
          <Link to="/CegahSakit" >
            <EducationCard title="Pencegahan Penyakit " icon={PencegahanPenyakit} />
          </Link>
          <Link to="/KebersihanDiri" >
            <EducationCard title="Kebersihan Diri " icon={KebersihanDiri} />
          </Link>
          <Link to="/PolaHidupSehat" >
            <EducationCard title="Pola Hidup Sehat " icon={PolaHidupSehat} />
          </Link>
        </div>
      </main>
    </Layout>  
  );
}

export default EdukasiKesehatan;