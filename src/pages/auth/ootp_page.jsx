import OtpImg from "../../assets/img/email.png";
import LogoImg from "../../assets/img/UKS2.png";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      console.log("No email found in state, redirecting to forgot password");
      navigate("/forgot-password", { replace: true });
    } else {
      console.log("Email received in OTP page:", email);
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
        `https://api-uks.rplrus.com/api/verify-otp?email=${email}&token=${otpCode}`
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

        {/* isi */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Kode <br /> OOTP
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
        {" "}
        <img
          src={LogoImg}
          alt="Logo"
          className="w-16 h-auto mb-6 object-contain"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Masuk Kode OOTP Anda
        </h2>
        {email && (
          <p className="text-sm text-gray-600 mb-4 text-center">
            Kami telah mengirimkan kode OTP ke email{" "}
            <span className="font-semibold">{email}</span>
          </p>
        )}
        <form onSubmit={handleVerifyOtp} className="w-full max-w-xs">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Kode OOTP
          </label>

          <div className="flex gap-4 mb-6">
            {[1, 2, 3, 4].map((i, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
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
