import React from "react";
import SidebarProfile from "./sidebar"; // Sidebar kiri

const LayoutProfile = ({ children }) => {
  return (
    <>
      
      <div className="flex">
        <SidebarProfile /> {/* Sidebar kiri */}
        <main className="flex-1 p-4 bg-[#F9FCFD] min-h-screen overflow-y-auto">
          {children} {/* Konten halaman */}
        </main>
      </div>
    </>
  );
};

export default LayoutProfile;
