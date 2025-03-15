'use client'
import React, { useState } from "react";
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from "react-router-dom";
import UKS2Img from "../assets/img/UKS2.png";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Kalkulator BMI", href: "/KalkulatorBmi" },
    { name: "Kondisi", href: "/Kondisi" },
    { name: "Edukasi Kesehatan", href: "/EdukasiKesehatan" },
    { name: "About Us", href: "/AboutUs" }
  ];

  return (
    <header className="bg-white border-b border-gray-300">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-1 lg:px-8">
        <div className="flex items-center lg:flex-1 min-w-0">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Uks</span>
            <img alt="Logo" src={UKS2Img} className="h-20 w-auto" />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-20">
          {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`relative text-sm font-semibold transition-all duration-300 
              ${location.pathname === item.href ? 
                "text-gray-900" : 
                "text-gray-500"} 
                 hover:text-teal-500`}
          >
            {item.name}
            <span 
              className={`absolute left-0 bottom-[-2px] h-[2px] w-0 bg-teal-500 transition-all duration-300 
                ${location.pathname === item.href ? "w-full" : "hover:w-full"}`}
            ></span>
        </Link>
        
         
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <button className="px-4 py-2 rounded-full border border-[#82AAAA] text-[#545657] 
              font-semibold bg-white transition-colors duration-300 
              hover:bg-[#2A8F9E] hover:text-white focus:outline focus:outline-4 focus:outline-auto">
              Log In
        </button>

        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Uks</span>
              <img alt="Logo" src={UKS2Img} className="h-8 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block rounded-lg px-3 py-2 text-base font-semibold 
                      ${location.pathname === item.href ? "text-teal-500" : "text-gray-900"} 
                      hover:bg-gray-50`}
                    onClick={() => setMobileMenuOpen(false)} 
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
              <button className="block w-full rounded-full px-3 py-2.5 text-base font-semibold 
                text-[#545657] bg-white border border-[#82AAAA] transition-colors duration-300 
                hover:bg-[#2A8F9E] hover:text-white focus:outline focus:ring-2 focus:ring-[#82AAAA]">
                Log In
              </button>

              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
