import Layout from "../../components/layout";
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Antre () {
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
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">
                        Dapatkan antrean
                    </h2>
                </div>

                {/* Sub Header */}
                <h2 className="mt-10 text-2xl font-semibold text-[#1C4245] text-center z-10 relative">
                    Antrean sekarang
                </h2>

                {/* Kotak Rectangle */}
                <div className="w-[250px] h-[150px] bg-[#93D3CC] mx-auto mt-6 rounded-xl shadow-lg z-10 relative flex items-center justify-center">
                    <h1 className="text-[#FFFFFF] text-8xl font-bold">
                        {nomorAktif.toString().padStart(2, '0')}
                    </h1>
                </div>

                {/* Kotak Putih Bawah */}
                <div className="w-[800px] max-w-full bg-white mx-auto mt-16 mb-20 rounded-xl shadow-lg z-10 flex flex-col md:flex-row border border-[#A2A2A2]">
                    {/* Kiri - Form */}
                    <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-black mb-2">Tujuan ke UKS :</h3>
                            <textarea
                                value={tujuan}
                                onChange={(e) => setTujuan(e.target.value)}
                                className="w-full h-24 bg-green-100 rounded-lg p-3 text-gray-700 resize-none"
                                placeholder="Tulis tujuanmu ke UKS..."
                            />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button 
                                onClick={handleBuatAntrian}
                                className="flex-1 border border-teal-500 text-teal-700 py-2 rounded-lg hover:bg-teal-100"
                            >
                                Buat Antrian
                            </button>
                            
                        </div>
                    </div>
                    <div className="hidden md:block w-px bg-gray-300"></div>

                    {/* Kanan - Nomor Antrian */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
                        <h3 className="text-lg font-semibold text-[#1C4245] mb-4">Nomor antrian anda</h3>
                        <div className="bg-[#93D3CC] w-full h-55 flex items-center justify-center rounded-xl">
                            <span className="text-white text-7xl font-bold">
                                {nomorSaya !== null ? nomorSaya.toString().padStart(2, '0') : '--'}
                            </span>   
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Antre; 