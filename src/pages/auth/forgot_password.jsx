import React, { useState, useEffect } from "react"; // Added useEffect import
import PasswordImg from "../../assets/img/email.png";
import LogoImg from "../../images/uks2.png"; // Updated to match Edit Profile path
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UKS2Img from "../../images/uks2.png"; // Impor gambar UKS2Img, sesuaikan path

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Set favicon and title (matching Edit Profile)
  useEffect(() => {
    // Mengatur judul tab
    document.title = 'Forgot Password';
    
    // Mengatur favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img; // Menggunakan UKS2Img sebagai favicon
    document.head.appendChild(favicon);

    // Debugging logs
    console.log("ForgotPassword component mounted");
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
      console.log("ForgotPassword component unmounted");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Attempting to send OTP to email:", email);

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    try {
      console.log("Sending request to:", "https://api-uks.rplrus.com/api/forgot-password");
      const response = await axios.post(
        "https://api-uks.rplrus.com/api/forgot-password", 
        { email }, 
        axiosConfig
      ); 
     
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
      console.log("Response data structure:", JSON.stringify(response.data));
      console.log("OTP email sent successfully, navigating to OTP page");
      
      navigate("/otp", { 
        state: { 
          email,
          timestamp: new Date().getTime()
        },
        replace: true 
      });
      
      return;
    } catch (err) {
      console.error("Error sending OTP:", err);
      
      if (err.response) {
        console.error("Error response status:", err.response.status);
        console.error("Error response data:", err.response.data);
        console.error("Error response headers:", err.response.headers);
        setError(err.response?.data?.message || "Terjadi kesalahan pada server.");
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("Tidak ada respon dari server. Periksa koneksi internet Anda.");
      } else {
        console.error("Request setup error:", err.message);
        setError("Terjadi kesalahan dalam mengirim permintaan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Left side */}
      <div className="w-1/2 bg-[#DDF6FF] flex flex-col items-center justify-center p-10 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-2 left-10 w-8 h-8 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Lupa <br /> Password
        </h1>
        <img src={PasswordImg} alt="Reset" className="w-60 h-60 mb-6 object-contain" />
      </div>

      {/* Right side */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-10">
        <img src={LogoImg} alt="Logo" className="w-16 h-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Masukkan alamat Email anda
        </h2>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <label className="block text-xs font-semibold mb-2 text-black">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email anda"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm text-black"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2AA7B9] text-white py-2 rounded-md font-semibold mt-6 hover:bg-cyan-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Mengirim OTP..." : "Selanjutnya"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;