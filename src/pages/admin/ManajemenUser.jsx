import React, { useState } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { User, Users } from 'lucide-react';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function ManajemenUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-white font-bold mb-6">Manajemen User</h1>

            {/* Cards */}
            {/* Cards */}
            <div className="flex gap-6 mb-6">
              {/* Card 1 */}
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <User className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Siswa</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">300</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Admin</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">5</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-[#9BC7B6] dark:bg-[#051D4E] rounded-[10px] p-4 flex items-center gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-[#6D9C9D] dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="
                    w-230 pl-10 pr-4 py-2 rounded-[10px]
                    bg-white dark:bg-gray-700
                    text-[#6D9C9D] dark:text-white
                    placeholder-[#6D9C9D] dark:placeholder-gray-400
                    focus:outline-none
                  "
                />
              </div>

              {/* Jurusan */}
              <select className="w-[200px] rounded-[10px] bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none">
                <option>Jurusan</option>
              </select>

              {/* Kelas */}
              <select className="w-[200px] rounded-[10px] bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none">
                <option>Kelas</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-white">
                <thead className="text-teal-600 uppercase text-xs border-b border-[#CDDDFF]">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Kelas</th>
                    <th className="px-4 py-3">Nama Kelas</th>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3">No HP</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }, (_, i) => (
                    <tr key={i} className="border-b border-[#CDDDFF]">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">User 1</td>
                      <td className="px-4 py-2">10</td>
                      <td className="px-4 py-2">Animasi 2D 4</td>
                      <td className="px-4 py-2">Male</td>
                      <td className="px-4 py-2">085786673009</td>
                      <td className="px-4 py-2 flex gap-2">
                        <FaEye className="text-gray-500 hover:text-blue-600 cursor-pointer" />
                        <FaEdit className="text-gray-500 hover:text-yellow-500 cursor-pointer" />
                        <FaTrash className="text-gray-500 hover:text-red-500 cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm dark:text-gray-300">
              <p>Showing 1–10 of 101</p>
              <div className="flex gap-1">
                <button className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300">&lt;</button>
                <button className="px-3 py-1 border rounded bg-green-600 dark:bg-[#204ECF] text-white">1</button>
                <button className="px-3 py-1 border rounded">2</button>
                <button className="px-3 py-1 border rounded">3</button>
                <span className="px-2 py-1">...</span>
                <button className="px-3 py-1 border rounded">10</button>
                <button className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300">&gt;</button>
              </div>
            </div>


          </div>
        </main>
      </div>
    </div>
  );
}
