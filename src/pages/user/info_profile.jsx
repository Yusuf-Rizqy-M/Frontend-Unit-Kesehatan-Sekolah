import React from "react";
import LayoutProfile from "../../components/user/layout_profile";
import ProfileImg from "../../assets/img/doctor_img_rounded.png";
import MaleIcon from "../../assets/img/gendermale.png";

const InfoProfile = () => {
  return (
    <LayoutProfile>
      <div className="bg-[#E3F7F6]">
        <main className="bg-[#F9FCFD] min-h-screen overflow-y-auto pt-10 px-6 lg:px-16 py-10">
          <h2 className="text-xl font-semibold border-b-2 border-gray-400 pb-2 text-[#303030] text-left w-[80%]">
            Info Profile
          </h2>


          <div className="mt-6 flex flex-col lg:flex-row gap-12">
            {/* Left: Info Form */}
            <div className="lg:w-2/3 w-full space-y-4">
              {[
                { label: "Name", value: "Ahmad Kanabawi" },
                { label: "Email", value: "AhmadKanabawi@exemple.com" },
                { label: "Nomor Telepon", value: "628929203232993" },
                { label: "Jenis Kelamin", value: "" },
                { label: "Nama Jurusan", value: "Animasi" },
                { label: "Kelas", value: "10" },
                { label: "Nama Orang Tua", value: "Sab’an Setyono" },
                { label: "Nomor Telepon Orang Tua", value: "628929203232993" },
                { label: "Nama Walikelas", value: "Aryo Fajar Pamaungkas" },
                { label: "Absent", value: "02" },
              ].map((item, i) =>
                item.label === "Jenis Kelamin" ? (
                  <div key={i} className="flex flex-col text-left">
                    <label className="block text-sm font-medium text-gray-800 mb-1 text-left">
                      {item.label}
                    </label>
                    <div className="flex items-center gap-2 w-[420px]">
                      <img src={MaleIcon} alt="Gender" className="w-8 h-8" />
                      <span className="text-gray-800 font-medium">Male</span>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex flex-col text-left">
                    <label className="block text-sm font-medium text-gray-800 mb-1 text-left">
                      {item.label}
                    </label>
                    <input
                      type="text"
                      value={item.value}
                      readOnly
                      className="w-[600px] px-3 py-2 rounded-lg bg-gray-200 text-gray-800 border border-gray-300 text-sm cursor-default text-left"
                    />


                  </div>
                )
              )}
            </div>

            {/* Right: Profile Image */}
            <div className="lg:w-1/3 w-full flex justify-start items-start">
              <img
                src={ProfileImg}
                alt="Profile"
                className="w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] lg:w-[180px] lg:h-[180px] object-cover rounded-full border 
               -ml-2 sm:-ml-6 md:-ml-10 lg:-ml-12"
              />
            </div>



          </div>
        </main>
      </div>
    </LayoutProfile>
  );
};

export default InfoProfile;
