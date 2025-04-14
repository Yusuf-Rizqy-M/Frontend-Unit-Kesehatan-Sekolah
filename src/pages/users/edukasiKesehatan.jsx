import Layout from '../../components/layout';

function EdukasiKesehatan() {
  return (
    <Layout>
      <main>
        <section className="-mt-115 relative w-full flex justify-center items-center bg-white mb-16 min-h-[300px]">
          {/* Kotak */}
          <div className="w-[1200px] h-[165px] bg-[#4FB7BD]  rounded-[20px] flex items-center shadow-md pl-20 pt-6">
            <h2 className="text-3xl font-bold text-white text-left">
              Jelajahi <br /> berbagai {' '}
              <span className="text-[#1C4245]">Edukasi kesehatan</span>
            </h2>
          </div>
        </section>
        <h2 className="-mt-17 text-3xl font-semibold text-[#2A8F9E] text-center"> 
              Apa yang ingin {' '} <span className="text-[#1C4245]">dibaca?</span>
        </h2>
        

      </main>
    </Layout>
  );
}

export default EdukasiKesehatan;
