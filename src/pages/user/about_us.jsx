import Layout from '../../components/user/layout';
import UksImg1 from "../../assets/img/hospital-room-interior.jpg";
import UksImg2 from "../../assets/img/person_bg.png";

const pengurusData = [
  {
    nama: "Budi Santoso",
    jabatan: "Ketua UKS",
    deskripsi: "Memzimpin dan mengkoordinasi seluruh kegiatan UKS di sekolah.",
    foto: UksImg2,
  },
  {
    nama: "Siti Aminah",
    jabatan: "Wakil Ketua UKS",
    deskripsi: "Membantu ketua dalam merancang program-program kesehatan siswa.",
    foto: UksImg2,
  },
  {
    nama: "Andi Wijaya",
    jabatan: "Sekretaris UKS",
    deskripsi: "Mengelola administrasi dan dokumentasi kegiatan UKS.",
    foto: UksImg2,
  },
];

export default function AboutUs() {
  return (
    <Layout>
      <div className="bg-white text-black">

        {/* Section: Apa Itu UKS */}
        <section className="min-h-[80vh] flex items-center px-6 md:px-20 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center w-full">
            <div className="space-y-4 text-left">
              <h2 className="text-2xl font-bold">Apa Itu UKS</h2>
              <div className="w-37 h-1 bg-teal-500 mb-4"></div>
              <p className="text-gray-600 leading-relaxed">
                UKS atau Usaha Kesehatan Sekolah adalah program sekolah yang bertujuan untuk meningkatkan kesehatan peserta didik.
                Melalui UKS, sekolah membiasakan siswa untuk hidup sehat, menjaga kebersihan, dan peduli pada kesehatan diri sendiri maupun lingkungan sekitar.
                Program ini mendukung terciptanya lingkungan sekolah yang bersih, sehat, dan nyaman, sehingga siswa dapat belajar dan berkembang dengan lebih optimal.
              </p>
              <button className="bg-cyan-600 hover:bg-teal-600 text-white px-6 py-2 rounded-lg mt-4 transition">
                Jelajahi Sekarang
              </button>
            </div>
            <img
              src={UksImg1}
              alt="Ruangan Rumah Sakit"
              className="object-cover w-[455px] h-[455px] rounded-md mx-auto"
            />
          </div>
        </section>

        {/* Section: Tujuan UKS */}
        <section className="min-h-[80vh] flex items-center px-6 md:px-20 py-20">
          <div className="grid md:grid-cols-2 gap-6 items-center w-full">
            <img
              src={UksImg1}
              alt="Tujuan UKS"
              className="object-cover w-full max-w-[600px] h-[250px] md:h-[350px] rounded-md mx-auto"
            />
            <div className="space-y-3 text-left">
              <h2 className="text-2xl font-bold">Tujuan UKS</h2>
              <div className="w-36 h-1 bg-teal-500 mb-3"></div>
              <p className="text-gray-600 leading-relaxed text-sm">
                UKS datang untuk membantu siswa menjadi lebih sehat agar bisa belajar lebih baik.
                UKS mengajarkan hidup bersih dan sehat, menjaga kebersihan sekolah, dan memberikan pelayanan kesehatan sederhana di sekolah.
                Dengan begitu, siswa bisa tumbuh dan berkembang dengan optimal.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Mengenal Para Pengurus */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 md:px-20 py-20 text-center">
        <div className="space-y-12 w-full">
            <div>
              <h2 className="text-2xl font-bold">Mengenal Para Pengurus UKS</h2>
              <div className="w-100 h-1 bg-teal-500 mb-4 mx-auto"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
                UKS datang untuk membantu siswa menjadi lebih sehat agar bisa belajar lebih baik.
                UKS mengajarkan hidup bersih dan sehat, menjaga kebersihan sekolah, dan memberikan pelayanan kesehatan sederhana di sekolah.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-16">
              {pengurusData.map((pengurus, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={pengurus.foto}
                    alt={pengurus.nama}
                    className="w-44 h-44 object-cover rounded-full"
                  />
                  <h3 className="font-semibold text-lg">{pengurus.nama}</h3>
                  <p className="text-gray-500 text-sm">{pengurus.jabatan}</p>
                  <p className="text-gray-500 text-sm max-w-xs text-center">
                    {pengurus.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
