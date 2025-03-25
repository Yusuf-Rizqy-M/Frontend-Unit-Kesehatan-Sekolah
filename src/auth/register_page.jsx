import React from "react";
import DoctorImg from "../assets/img/doctor_img.png";

const RegisterPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Section with Teal Background */}
      <div
        style={{
          flex: 1,
          background: "#d0f0f4", // Teal background
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-black leading-tight">
         Hallo, Selamat Datang!
        </h1>
         <img
              src={DoctorImg} alt="Doctor Illustration" className="w-50 md:max-w-md"
          />
        <p>UKS SMK RUS</p>
        <p className="text-1xl md:text-2xl font-regular text-black">
          UKS SMK RUS
        </p>
      </div>
      
      <div
        style={{
          flex: 1,
          background: "white",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Sign in to your account</h2>
      </div>
    </div>
  );
};

export default RegisterPage;
