import React, { useState, useEffect } from 'react'; // Added useEffect import
import { useNavigate, Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import UksImg2 from '../../assets/img/doctor_img_rounded.png';
import LogoImg from '../../assets/img/UKS2.png';
import UKS2Img from '../../assets/img/uks2.png'; // Favicon import

const LoginPage = () => {
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Set favicon and debug
  useEffect(() => {
    console.log('LoginPage component mounted');
    console.log('Initial document title:', document.title);
    console.log('UKS2Img import path:', UKS2Img); // Log the resolved favicon path
    let favicon = document.querySelector("link[rel='icon']");
    console.log('Initial favicon href:', favicon ? favicon.href : 'No favicon found');

    // Set favicon using DOM manipulation
    favicon = favicon || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = `${UKS2Img}?v=${Date.now()}`; // Add cache-busting
    document.head.appendChild(favicon);
    console.log('Set favicon href to:', favicon.href);

    // Set document title
    document.title = 'Login';

    // Check title and favicon after rendering
    const timeout = setTimeout(() => {
      console.log('Document title after render:', document.title);
      const updatedFavicon = document.querySelector('link[rel="icon"]');
      console.log('Favicon after render:', updatedFavicon ? updatedFavicon.href : 'No favicon found');
    }, 1000);

    return () => {
      clearTimeout(timeout);
      console.log('LoginPage component unmounted');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await login(email, password, remember);
    if (data) {
      const role = data.user.role;
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-poppins bg-white">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 bg-[#DDF6FF] flex flex-col justify-center items-center p-8 lg:p-12 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-2 left-10 w-8 h-8 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6 leading-tight">
          Halo<br />Selamat datang!
        </h1>
        <img src={UksImg2} alt="Doctor" className="w-48 h-48 sm:w-56 sm:h-56 mb-6" />
        <hr className="w-20 border-[1.5px] border-gray-400 mb-4" />
        <div className="text-center px-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">UKS SMK RUS</h2>
          <p className="text-sm text-gray-600 max-w-xs">
            Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau dan meningkatkan kesehatan di sekolah.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-sm flex flex-col items-start mb-8">
          <img src={LogoImg} alt="Logo" className="w-14 h-14 mb-4 object-contain" />
          <h2 className="text-2xl font-bold text-gray-800">
            Sign in ke <span className="text-cyan-500">UKS</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm text-left">
          <div className="mb-5">
            <label className="block text-xs font-semibold mb-1 text-black">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm text-black"
            />
          </div>

          <div className="mb-5 relative">
            <label className="block text-xs font-semibold mb-1 text-black">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm text-black pr-10"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-cyan-500 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="mb-5 flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="remember" className="text-sm text-gray-700">Ingat saya</label>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-full text-sm transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-gray-800 font-semibold underline">
              Lupa password?
            </Link>
          </div>
        </form>

        <p className="mt-8 text-sm text-gray-700 text-center">
          Belum punya akun?{' '}
          <Link to="/RegisterPage" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;