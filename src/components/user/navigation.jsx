import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import UKS2Img from "../../assets/img/UKS2.png";
import warning from "../../assets/img/warning.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState(""); // Added state for role
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = () => {
      const tokenStorage =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userStorage =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (tokenStorage && userStorage && userStorage !== "undefined") {
        try {
          const parsedUser = JSON.parse(userStorage);
          setNickname(parsedUser?.name || "User");
          setRole(parsedUser?.role || ""); // Set role from user data
          setToken(tokenStorage);
        } catch (e) {
          console.error("Gagal parsing user:", e);
          setNickname("");
          setRole("");
          setToken("");
        }
      } else {
        setNickname("");
        setRole("");
        setToken("");
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setDropdownOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setNickname("");
    setRole("");
    setToken("");
    navigate("/");
    window.dispatchEvent(new Event("storage"));
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Kalkulator BMI", href: "/kalkulatorbmi" },
    { name: "Antrian", href: "/antreuser" },
    { name: "Edukasi Kesehatan", href: "/edukasikesehatan" },
    { name: "About Us", href: "/aboutus" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-1 lg:px-8">
        {/* Logo */}
        <div className="flex items-center lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img alt="Logo" src={UKS2Img} className="h-20 w-auto" />
          </Link>
        </div>

        {/* Burger Button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700"
          >
            <Bars3Icon className="size-6" />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-20">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative group text-sm font-semibold transition-all duration-300 ${
                location.pathname === item.href
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {item.name}
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-full bg-[#00ACC1] origin-center scale-x-0 transition-transform duration-300 ${
                  location.pathname === item.href
                    ? "scale-x-100"
                    : "group-hover:scale-x-100"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Profile Dropdown or Login (Desktop) */}
        <div
          className="hidden lg:flex lg:flex-1 lg:justify-end relative"
          ref={dropdownRef}
        >
          {token ? (
            <div className="relative inline-block text-left">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 font-semibold text-[#2A8F9E] hover:underline"
              >
                {nickname}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg z-50">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300">
                    <img
                      src={`https://ui-avatars.com/api/?name=${nickname}`}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {nickname}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {JSON.parse(localStorage.getItem("user") || "{}")
                          ?.email || "user@email.com"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col py-2">
                    <Link
                      to="/infoprofile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-cyan-200"
                    >
                      <i className="fas fa-user-cog text-cyan-700 w-5 text-center" />{" "}
                      Prefrence
                    </Link>
                    {role === "admin" && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-cyan-200"
                      >
                        <i className="fas fa-tachometer-alt text-cyan-700 w-5 text-center" />
                        Dashboard
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full"
                  >
                    <i className="fas fa-sign-out-alt text-red-600 w-5 text-center" />{" "}
                    Keluar akun
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-[#82AAAA] text-[#545657] font-semibold bg-white transition-colors duration-300 hover:bg-[#2A8F9E] hover:text-white"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center shadow-lg relative">
            <div className="flex justify-center mb-4">
              <img src={warning} alt="Warning" className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Yakin ingin Logout Akun?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Saat kamu logout, semua data yang belum disimpan akan hilang.
              Simpan terlebih dahulu kalau diperlukan.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Lanjutkan, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Popup */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white p-6 flex flex-col">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 mt-4 space-y-5 text-left">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-lg font-semibold ${
                  location.pathname === item.href
                    ? "text-[#2A8F9E]"
                    : "text-gray-700 hover:text-[#00ACC1]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {token && (
              <div className="border-t pt-4 mt-4 space-y-4 text-left">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${nickname}`}
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {nickname}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {JSON.parse(localStorage.getItem("user") || "{}")
                        ?.email || "user@email.com"}
                    </p>
                  </div>
                </div>

                {/* Dropdown-style Links */}
                <div className="flex flex-col gap-2 items-start">
                  <Link
                    to="/infoprofile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-base text-gray-800 hover:text-[#2A8F9E]"
                  >
                    <i className="fas fa-user-cog text-cyan-700 w-5 text-center" />
                    Edit Profile
                  </Link>
                  {role === "admin" && (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-base text-gray-800 hover:text-[#2A8F9E]"
                    >
                      <i className="fas fa-tachometer-alt text-cyan-700 w-5 text-center" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex items-center gap-2 text-base text-red-600 hover:text-red-700"
                  >
                    <i className="fas fa-sign-out-alt text-red-600 w-5 text-center" />
                    Keluar akun
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}