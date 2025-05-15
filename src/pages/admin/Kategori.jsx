import React, { useState } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { FaTrash } from "react-icons/fa";

const KategoriPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [
    { id: 1, name: "Kesehatan Mental", description: "Lorem ipsum dolor sit amet", image: "image1.jpg", action: "edit" },
    { id: 2, name: "Pencegahan Penyakit", description: "Lorem ipsum dolor sit amet", image: "image2.jpg", action: "edit" },
    { id: 3, name: "Kebersihan Diri", description: "Lorem ipsum dolor sit amet", image: "image3.jpg", action: "edit" },
    { id: 4, name: "Kesehatan Fisik", description: "Lorem ipsum dolor sit amet", image: "image4.jpg", action: "edit" },
    { id: 5, name: "Pola Hidup Sehat", description: "Lorem ipsum dolor sit amet", image: "image5.jpg", action: "edit" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl text-gray-800 dark:text-white font-bold">
                Kategori
              </h2>
              <button className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Tambahkan Kategori</span>
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-200">
                  <th className="py-3 px-4 border-b-2 border-[#CDDDFF] font-semibold">No</th>
                  <th className="py-3 px-4 border-b-2 border-[#CDDDFF] font-semibold">Name</th>
                  <th className="py-3 px-4 border-b-2 border-[#CDDDFF] font-semibold">Deskripsi</th>
                  <th className="py-3 px-4 border-b-2 border-[#CDDDFF] font-semibold text-center">Gambar</th>
                  <th className="py-3 px-4 border-b-2 border-[#CDDDFF] font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="py-2 px-4 border-b-2 border-[#CDDDFF] text-gray-800 dark:text-gray-200">{category.id}</td>
                    <td className="py-2 px-4 border-b-2 border-[#CDDDFF] text-gray-800 dark:text-gray-200">{category.name}</td>
                    <td className="py-2 px-4 border-b-2 border-[#CDDDFF] text-gray-800 dark:text-gray-200 italic">{category.description}</td>
                    <td className="py-2 px-4 border-b-2 border-[#CDDDFF] text-center">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400 inline-block"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4-4 4 4 4-4 4 4m-16 0v4h16v-4m0-12h-4l-2 2H8l-2-2H4v12h16V4z"
                        />
                      </svg>
                    </td>
                    <td className="py-2 px-4 border-b-2 border-[#CDDDFF] text-center">
                      <div className="flex justify-center gap-2">
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-red-500 cursor-pointer">
                          <FaTrash className="text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
              <span>Showing 1-10 of 101</span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded-l dark:border-gray-600"></button>
                <button className="px-3 py-1 border bg-teal-500 text-white dark:border-gray-600">1</button>
                <button className="px-3 py-1 border dark:border-gray-600">2</button>
                <button className="px-3 py-1 border dark:border-gray-600">3</button>
                <button className="px-3 py-1 border dark:border-gray-600">...</button>
                <button className="px-3 py-1 border dark:border-gray-600">10</button>
                <button className="px-3 py-1 border rounded-r dark:border-gray-600"></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KategoriPage;