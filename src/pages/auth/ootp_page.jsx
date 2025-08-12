import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import OtpImg from "../../assets/img/email.png";
import LogoImg from "../../images/uks2.png";
import UKS2Img from "../../images/uks2.png";

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Set favicon and title
  useEffect(() => {
    document.title = 'OTP Verification';
    
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img;
    document.head.appendChild(favicon);

    console.log("OtpPage component mounted");
    console.log("Initial document title:", document.title);
    console.log("UKS2Img import path:", UKS2Img);
    console.log("Initial favicon href:", favicon ? favicon.href : "No favicon found");
    console.log("Set favicon href to:", favicon.href);

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
      setToastMessage("Mohon isi semua kode OTP.");
      setIsSuccess(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setLoading(true);

    const otpCode = otp.join("");

    try {
      console.log("Verifying with data:", { email, otp: otpCode });
      const response = await axios.post(
        "https://api-uks.rplrus.com/api/verify-otp",
        { email, token: otpCode },
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
        setToastMessage("Verifikasi OTP Berhasil");
        setIsSuccess(true);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/gantipassword", {
            state: {
              email,
              verified: true,
              token: response.data.token || otpCode,
            },
            replace: true,
          });
        }, 2000);
      } else {
        setToastMessage("Kode OTP yang Anda masukkan salah. Silakan periksa kembali atau minta kode baru.");
        setIsSuccess(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setToastMessage("Kode OTP yang Anda masukkan salah. Silakan periksa kembali atau minta kode baru.");
      setIsSuccess(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-poppins">
      {showToast && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50 ${
            isSuccess ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          <div
            className={`rounded-full p-1 ${isSuccess ? "bg-green-600" : "bg-red-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isSuccess ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </div>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Left Panel */}
      <div className="w-1/2 bg-[#DDF6FF] relative flex flex-col items-center justify-center p-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />

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