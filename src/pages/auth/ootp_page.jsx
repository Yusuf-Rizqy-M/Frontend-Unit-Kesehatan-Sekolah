import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import OtpImg from "../../assets/img/email.png";
import LogoImg from "../../images/uks2.png"; // Updated to match Edit Profile path
import UKS2Img from "../../images/uks2.png"; // Impor gambar UKS2Img, sesuaikan path

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set favicon and title (matching Edit Profile)
  useEffect(() => {
    // Mengatur judul tab
    document.title = 'OTP Verification';
    
    // Mengatur favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img; // Menggunakan UKS2Img sebagai favicon
    document.head.appendChild(favicon);

    // Debugging logs
    console.log("OtpPage component mounted");
    console.log("Initial document title:", document.title);
    console.log("UKS2Img import path:", UKS2Img);
    console.log("Initial favicon href:", favicon ? favicon.href : "No favicon found");
    console.log("Set favicon href to:", favicon.href);

    // Check title and favicon after rendering
    const timeout = setTimeout(() => {
      console.log("Document title after render:", document.title);
      const updatedFavicon = document.querySelector("link[rel='icon']");
      console.log("Favicon after render:", updatedFavicon ? updatedFavicon.href : "No favicon found");
    }, 1000);

    return () => {
      clearTimeout(timeout);
      console.log("OtpPage component unmounted");
    };
  }, []);

  useEffect(() => {
    if (!email) {
      console.log("No email found in state, redirecting to forgot password");
      navigate("/forgot-password", { replace: true });
    } else {
      console.log("Email received in OTP page:", email);
      // Auto-focus the first OTP input
      document.getElementById("otp-input-0")?.focus();
    }
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.some((digit) => digit === "")) {
      setError("Mohon isi semua kode OTP.");
      return;
    }

    setLoading(true);
    setError("");

    const otpCode = otp.join("");

    try {
      console.log("Verifying with data:", { email, otp: otpCode });
      const response = await axios.post(
        "https://api-uks.rplrus.com/api/verify-otp",
        { email, token: otpCode }, // Moved to request body
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log("Verification response:", response.data);

      if (
        response.data.status === true ||
        response.data.success === true ||
        response.status === 200
      ) {
        if (response.data.token) {
          localStorage.setItem("resetToken", response.data.token);
        }
        navigate("/gantipassword", {
          state: {
            email,
            verified: true,
            token: response.data.token || otpCode,
          },
          replace: true,
        });
      } else {
        setError(response.data.message || "Kode OTP tidak valid.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat verifikasi OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Left Panel */}
      <div className="w-1/2 bg-[#DDF6FF] relative flex flex-col items-center justify-center p-10">
        {/* Background Shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Kode <br /> OTP
        </h1>
        <img
          src={OtpImg}
          alt="OTP"
          className="w-60 h-auto mb-6 object-contain"
        />
        <hr className="w-24 border-[1.5px] border-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">UKS SMK RUS</h2>
        <p className="text-sm text-gray-600 text-center max-w-xs">
          Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau
          dan meningkatkan kesehatan di sekolah.
        </p>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center p-10 bg-white">
        <img
          src={LogoImg}
          alt="Logo"
          className="w-16 h-auto mb-6 object-contain"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Masukkan Kode OTP Anda
        </h2>
        {email && (
          <p className="text-sm text-gray-600 mb-4 text-center">
            Kami telah mengirimkan kode OTP ke email{" "}
            <span className="font-semibold">{email}</span>
          </p>
        )}
        <form onSubmit={handleVerifyOtp} className="w-full max-w-xs">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Kode OTP
          </label>

          <div className="flex gap-4 mb-6 justify-center">
            {[1, 2, 3, 4].map((i, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                required
                placeholder="0"
                className="w-12 h-12 text-center border border-gray-400 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2A8D9C] text-white py-2 rounded-md font-semibold hover:bg-cyan-700 transition-colors duration-200 mb-4 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>

          <a
            href="/login"
            className="text-sm text-[#2A8D9C] hover:underline flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to log in
          </a>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;