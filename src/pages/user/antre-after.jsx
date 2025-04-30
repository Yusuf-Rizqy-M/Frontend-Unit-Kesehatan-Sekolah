import Layout from '../../components/user/layout';
import { Link } from 'react-router-dom';
import { useState, useEffect} from 'react';
import axios from 'axios';

function AntreAfter (){

    return (
        <Layout>
            <section className="bg-white w-full min-h-screen py-20 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 z-1 pointer-events-none">
                    <div className="absolute top-10 left-[-30px] w-[120px] h-[120px] bg-[#FFD1DC] rounded-full opacity-50" />
                    <div className="absolute bottom-20 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] opacity-60" />
                    <div className="absolute top-[300px] right-[100px] w-[70px] h-[70px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />
                    <div className="absolute bottom-[150px] left-[100px] w-[90px] h-[90px] bg-[#B0E0E6] rounded-full opacity-40" />
                </div>

                {/* Header Section */}
                <div className="w-full h-[100px] bg-[#4FB7BD] flex items-center justify-center shadow-md p-6 z-10 relative -mt-20">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold text-white text-center">
                        Mohon Menunggu hingga antrean kamu
                    </h2>
                </div>

                <h3 className="mt-10 text-1xl font-medium text-[#1C4245] text-center z-10 relative">
                     Kamu akan diberi nontifikasi jika sudah antrian kamu <br />
                     Kamu bisa izin ke guru kamu dengan cara menunjukan web ini <br />
                     Atau menunggu hingga istirahat tiba

                </h3>

                <div className="flex flex-wrap justify-center gap-6 mt-10 z-10 relative">
                    {/* Antrean sekarang */}
                    <div className="flex flex-col items-center w-full sm:w-[300px]">
                        <h2 className="text-2xl font-semibold text-[#1C4245] mb-2">Antrean sekarang</h2>
                        <div className="w-[300px] h-[200px] bg-[#93D3CC] rounded-xl shadow-lg flex items-center justify-center">
                        <h1 className="text-white text-8xl font-bold">01</h1>
                        </div>
                    </div>

                    {/* Antrean kamu */}
                    <div className="flex flex-col items-center w-full sm:w-[300px]">
                        <h2 className="text-2xl font-semibold text-[#1C4245] mb-2">Antrean kamu</h2>
                        <div className="w-[300px] h-[200px] bg-[#93D3CC] rounded-xl shadow-lg flex items-center justify-center">
                        <h1 className="text-white text-8xl font-bold">10</h1>
                        </div>
                    </div>

                    {/* Tombol Buat Antrian */}
                    <div className="w-full flex justify-center mt-8">
                        <Link 
                        to="/Antre"
                        className="px-6 py-3 bg-red-100 text-red-700 border border-red-500 rounded-lg hover:bg-red-200 transition">
                            Batalkan
                        </Link>
                    </div>
                </div>

      


            </section>
        </Layout>
    )
}


export default AntreAfter