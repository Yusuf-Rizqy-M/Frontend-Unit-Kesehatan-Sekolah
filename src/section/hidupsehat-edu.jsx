import Layout from "../components/layout";
import UksImg1 from "../assets/img/hospital-room-interior.jpg";
import UksImg2 from "../assets/img/hospital-room-interior.jpg";
import UksImg3 from "../assets/img/hospital-room-interior.jpg";
import clean from "../assets/img/cleaannn.png";
import sleepy from "../assets/img/sleepy.png";
const articles = [
  { 
    title: "Hospitality", 
    description: "Selamat datang di UKS SMK RUS, tempat di mana kepedulian dan kenyamanan menjadi prioritas utama. Kami hadir sebagai ruang yang aman, bersih, dan ramah untuk mendukung kesehatan fisik maupun mental seluruh warga sekolah. Mulai dari pertolongan pertama, istirahat sementara, hingga konsultasi ringan, UKS siap menjadi tempat andalan ketika kamu merasa kurang fit atau sekadar butuh jeda sejenak. Kami percaya bahwa lingkungan yang sehat adalah kunci untuk belajar dan tumbuh dengan optimal", 
    image: UksImg1 
  },

  { 
    title: "Emergency Treatment", 
    description: "UKS SMK RUS siap memberikan penanganan pertama untuk kondisi darurat yang terjadi di lingkungan sekolah. Mulai dari luka ringan, pingsan, mimisan, hingga keluhan mendadak lainnya, tim UKS akan sigap memberikan pertolongan sesuai prosedur yang berlaku. Dengan peralatan P3K yang lengkap dan pengurus yang terlatih, kami memastikan setiap situasi darurat ditangani dengan cepat, aman, dan penuh perhatian.", 
    image: UksImg2 
  },

  { 
    title: "Health Check Up", 
    description: "UKS SMK RUS menyediakan layanan pemeriksaan kesehatan rutin untuk seluruh siswa, sebagai upaya preventif dalam menjaga kondisi tubuh agar tetap fit selama proses belajar mengajar. Pemeriksaan ini mencakup pengecekan tekanan darah, suhu tubuh, berat badan, tinggi badan, hingga observasi gejala umum yang dapat mengganggu aktivitas belajar. Dengan layanan ini, kami berharap siswa dapat menyadari pentingnya menjaga kesehatan sejak dini dan terhindar dari risiko penyakit ringan maupun serius.", 
    image: UksImg3 
   },
];


function KebersihanDiri() {   
    console.log("fisik edu  component rendered");
    return (     
    <Layout>
        <main>       
        <section className="w-full px-4 md:px-20 py-5bg-white">
            {/* Section Title */}
            <div className="text-center mb-12">
            <img
                src={sleepy}
                alt="Kesehatan Fisik Icon"
                className="mx-auto w-40 h-40 mb-2"
            />

                <h2 className="text-xl md:text-2xl font-semibold text-[#2A8F9E]">
                Artikel tentang <span className="text-[#2A8F9E]">Pola Hidup Sehat</span>
                </h2>
                <hr className="mt-2 border-t border-gray-200 w-3/4 mx-auto" />
            </div>

            {/* Articles */}
            <div className="space-y-12">
                {articles.map((article, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 border-b border-gray-200 pb-6"
                >
                    {/* Text */}
                    <div className="w-full md:w-3/5 text-left pl-4 md:pl-6">
                    <h3 className="text-base md:text-lg font-semibold text-[#1C4245] mb-2">
                        {article.title}
                    </h3>
                    <p className="text-sm text-[#1C4245]">
                        {article.description}
                    </p>
                    </div>

                    {/* Image */}
                    <div className="w-full md:w-2/5">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-100 h-auto object-cover rounded-xl shadow-sm p-20px"
                    />
                    </div>
                </div>
                ))}
            </div>
            </section>

        </main>  
    </Layout>   
  ); 
}  

export default KebersihanDiri;