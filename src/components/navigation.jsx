'use client';
import React, { useState } from "react";
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { href, Link, useLocation } from "react-router-dom";
import UKS2Img from "../assets/img/UKS2.png";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Kalkulator BMI", href: "/kalkulatorbmi" },
    // { name: "Kondisi", href: "/Kondisi" },
    { name: "Edukasi Kesehatan", href: "/edukasikesehatan" },
    { name: "About Us", href: "/aboutus" },
    { name: "Antre", href: "/newpass"}
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-md">
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
              className={`relative group text-sm font-semibold transition-all duration-300 
       ${location.pathname === item.href ? "text-gray-900" : "text-gray-500"}`}
            >
              {item.name}
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-full bg-[#00ACC1] origin-center scale-x-0 transition-transform duration-300 
         ${location.pathname === item.href ? "scale-x-100" : "group-hover:scale-x-100"}
       `}
              ></span>
            </Link>

          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            to="/login"
            className="px-4 py-2 rounded-full border border-[#82AAAA] text-[#545657] 
              font-semibold bg-white transition-colors duration-300 
              hover:bg-[#2A8F9E] hover:text-white focus:outline focus:outline-4 focus:outline-auto"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed top-4 right-4 z-50 w-[280px] rounded-xl bg-white shadow-lg ring-1 ring-gray-900/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Uks</span>
                <img alt="Logo" src={UKS2Img} className="h-8 w-auto" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block rounded-md px-3 py-2 text-sm font-semibold 
                    ${location.pathname === item.href ? "text-teal-500" : "text-gray-900"} hover:bg-gray-100`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full px-3 py-2 text-sm font-semibold 
                    text-[#545657] border border-[#82AAAA] hover:bg-[#2A8F9E] hover:text-white"
                >
                  Sign in
                </Link>
              </div>
              <div>
                <Link
                  to="/RegisterPage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full px-3 py-2 text-sm font-semibold 
                    text-[#545657] border border-[#82AAAA] hover:bg-[#2A8F9E] hover:text-white"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </Dialog>
    </header>
  );
}
