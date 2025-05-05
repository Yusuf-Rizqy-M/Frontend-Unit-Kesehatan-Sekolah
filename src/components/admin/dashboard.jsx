// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// export default function Dashboard() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [nickname, setNickname] = useState('');
//   const [token, setToken] = useState('');
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar toggle
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const loadUser = () => {
//       const tokenStorage = localStorage.getItem('token') || sessionStorage.getItem('token');
//       const userStorage = localStorage.getItem('user') || sessionStorage.getItem('user');

//       if (tokenStorage && userStorage && userStorage !== "undefined") {
//         try {
//           const parsedUser = JSON.parse(userStorage);
//           setNickname(parsedUser?.name || 'User');
//           setToken(tokenStorage);
//         } catch (e) {
//           console.error("Gagal parsing user:", e);
//           setNickname('');
//           setToken('');
//         }
//       } else {
//         setNickname('');
//         setToken('');
//       }
//     };

//     loadUser();
//     window.addEventListener('storage', loadUser);
//     return () => window.removeEventListener('storage', loadUser);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
//     setNickname('');
//     setToken('');
//     navigate('/');
//     window.dispatchEvent(new Event("storage"));
//   };

//   const menuItems = [
//     { name: "Home", href: "/" },
//     { name: "Kalkulator BMI", href: "/kalkulatorbmi" },
//     { name: "Antrian", href: "/antrian" },
//     { name: "Edukasi Kesehatan", href: "/edukasikesehatan" },
//     { name: "About Us", href: "/aboutus" },
//   ];

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div className={`fixed inset-0 z-40 bg-gray-800 bg-opacity-50 transition-all ${sidebarOpen ? "block" : "hidden"}`} onClick={() => setSidebarOpen(false)}></div>
//       <div className={`fixed z-50 top-0 left-0 w-64 bg-white shadow-lg transition-all transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
//         <div className="flex justify-between items-center p-4">
//           <button onClick={() => setSidebarOpen(false)}>
//             <XMarkIcon className="h-6 w-6 text-gray-600" />
//           </button>
//         </div>
//         <div className="flex flex-col space-y-2">
//           {menuItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.href}
//               className={`text-sm font-semibold p-4 hover:bg-gray-200 ${location.pathname === item.href ? "bg-gray-200" : ""}`}
//             >
//               {item.name}
//             </Link>
//           ))}
//         </div>

//         {/* User info in Sidebar */}
//         <div className="mt-4 p-4 bg-gray-100">
//           <div className="flex items-center gap-4">
//             <img
//               src={`https://ui-avatars.com/api/?name=${nickname}`}
//               alt="User avatar"
//               className="w-10 h-10 rounded-full"
//             />
//             <div>
//               <p className="text-sm font-semibold">{nickname}</p>
//               <p className="text-xs text-gray-600">{JSON.parse(localStorage.getItem("user") || "{}")?.email}</p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="mt-4 w-full text-red-600 hover:bg-red-100 py-2 px-4 rounded-md"
//           >
//             Log Out
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-64">
//         <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-md">
//           <nav className="mx-auto flex max-w-7xl items-center justify-between p-1 lg:px-8">
//             <div className="flex items-center lg:flex-1 min-w-0">
//               <button onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700">
//                 <Bars3Icon className="h-6 w-6" />
//               </button>
//             </div>
//           </nav>
//         </header>
//         <main>
//           {/* Your main content goes here */}
//         </main>
//       </div>
//     </div>
//   );
// }
