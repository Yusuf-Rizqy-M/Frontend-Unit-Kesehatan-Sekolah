import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import UKS2Img from "../assets/img/UKS2.png";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [token, setToken] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = () => {
      const tokenStorage = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userStorage = localStorage.getItem('user') || sessionStorage.getItem('user');

      if (tokenStorage && userStorage && userStorage !== "undefined") {
        try {
          const parsedUser = JSON.parse(userStorage);
          setNickname(parsedUser?.name || 'User');
          setToken(tokenStorage);
        } catch (e) {
          console.error("Gagal parsing user:", e);
          setNickname('');
          setToken('');
        }
      } else {
        setNickname('');
        setToken('');
      }
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setNickname('');
    setToken('');
    navigate('/');
    window.dispatchEvent(new Event("storage"));
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Kalkulator BMI", href: "/kalkulatorbmi" },
    { name: "Antrian", href: "/antrian" },
    { name: "Edukasi Kesehatan", href: "/edukasikesehatan" },
    { name: "About Us", href: "/aboutus" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-1 lg:px-8">
        <div className="flex items-center lg:flex-1 min-w-0">
          <Link to="/" className="-m-1.5 p-1.5">
            <img alt="Logo" src={UKS2Img} className="h-20 w-auto" />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="-m-2.5 p-2.5 text-gray-700">
            <Bars3Icon className="size-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-x-20">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative group text-sm font-semibold transition-all duration-300 ${location.pathname === item.href ? "text-gray-900" : "text-gray-500"
                }`}
            >
              {item.name}
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-full bg-[#00ACC1] origin-center scale-x-0 transition-transform duration-300 ${location.pathname === item.href ? "scale-x-100" : "group-hover:scale-x-100"
                  }`}
              ></span>
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end relative" ref={dropdownRef}>
          {token ? (
            <div className="relative inline-block text-left">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 font-semibold text-[#2A8F9E] hover:underline"
              >
                {nickname}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-cyan-100 shadow-lg z-50">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300">
                    <img
                      src={`https://ui-avatars.com/api/?name=${nickname}`}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{nickname}</p>
                      <p className="text-xs text-gray-600 truncate">
                        {JSON.parse(localStorage.getItem("user") || "{}")?.email || "user@email.com"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col py-2">
                    <Link
                      to="/editprofile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-cyan-200"
                    >
                      <i className="fas fa-user-cog text-cyan-700 w-5 text-center" /> Edit Profile
                    </Link>
                    <Link
                      to="/antrian"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-cyan-200"
                    >
                      <i className="fas fa-notes-medical text-cyan-700 w-5 text-center" /> Ambil Antrian
                    </Link>
                    <Link
                      to="/kalkulatorbmi"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-cyan-200"
                    >
                      <i className="fas fa-calculator text-cyan-700 w-5 text-center" /> Kalkulator BMI
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full"
                  >
                    <i className="fas fa-sign-out-alt text-red-600 w-5 text-center" /> Keluar akun
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
    </header>
  );
}
