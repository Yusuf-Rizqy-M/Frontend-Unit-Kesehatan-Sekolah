import React from "react";
import { FaUserCog, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import UksLogo from "../../assets/img/UKS2.png";

const SidebarProfile = () => {
  return (
    <aside className="w-64 bg-[#C9EBE9] min-h-screen p-4 flex flex-col justify-between">
      {/* Logo UKS di atas */}
      <div>
        <div className="flex justify-center mb-8">
          <img src={UksLogo} alt="UKS Logo" className="w-24 h-auto" />
        </div>
        {/* Navigasi utama */}
        <nav className="space-y-4">
          <Link
            to="/profilesettings"
            className="flex items-center justify-start gap-2 w-full text-white bg-teal-600 px-4 py-2 rounded-md"
          >
            <FaUserCog />
            <span className="text-left">Profile settings</span>
          </Link>
          <Link
            to="/infoprofile"
            className="flex items-center justify-start gap-2 w-full text-teal-700 bg-white px-4 py-2 rounded-md"
          >
            <FaInfoCircle />
            <span className="text-left">Info profile</span>
          </Link>
        </nav>
      </div>

      {/* Tombol Keluar di paling bawah */}
      <div className="mt-auto">
        <Link
          to="/"
          className="flex items-center justify-start gap-2 w-full text-white bg-red-500 px-4 py-2 rounded-md"
        >
          <FaSignOutAlt />
          <span className="text-left">Keluar</span>
        </Link>
      </div>
    </aside>
  );
};

export default SidebarProfile;
