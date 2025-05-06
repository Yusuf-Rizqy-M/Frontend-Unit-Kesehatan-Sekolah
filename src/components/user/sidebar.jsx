import React from "react";
import { FaUserCog, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
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
          <NavLink
            to="/infoprofile"
            className={({ isActive }) =>
              `flex items-center justify-start gap-2 w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? "text-white bg-teal-600 hover:bg-teal-700"
                  : "text-teal-700 bg-white hover:bg-teal-50 hover:text-teal-800 hover:shadow-md"
              }`
            }
          >
            <FaUserCog />
            <span className="text-left">Info profile</span>
          </NavLink>
          <NavLink
            to="/editprofile"
            className={({ isActive }) =>
              `flex items-center justify-start gap-2 w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? "text-white bg-teal-600 hover:bg-teal-700"
                  : "text-teal-700 bg-white hover:bg-teal-50 hover:text-teal-800 hover:shadow-md"
              }`
            }
          >
            <FaInfoCircle />
            <span className="text-left">Edit Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Tombol Keluar di paling bawah */}
      <div className="mt-auto">
        <Link
          to="/"
          className="flex items-center justify-start gap-2 w-full text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 hover:shadow-md transition-colors duration-200"
        >
          <FaSignOutAlt />
          <span className="text-left">Keluar</span>
        </Link>
      </div>
    </aside>
  );
};

export default SidebarProfile;