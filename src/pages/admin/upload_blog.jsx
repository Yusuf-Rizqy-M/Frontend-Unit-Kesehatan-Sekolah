import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import AddImageIcon from "../../assets/img/upload_file.png";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

// Toast Notification Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto close after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-72 max-w-96 animate-slide-in`}>
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white bg-opacity-20">
        <span className="text-sm font-bold">{icon}</span>
      </div>
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default function UploadBlog() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info' // 'success', 'error', 'info'
  });
  
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  // Category mapping based on your select options
  const categoryMap = {
    "Kesehatan mental": "1",
    "Kesehatan Fisik": "2", 
    "Pencegahan penyakit": "3",
    "Kebersihan diri": "4",
    "Pola Hidup Sehat": "5"
  };

  // Function to show toast notification
  const showToast = (message, type = 'info') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Function to close toast notification
  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image'],
      ];

      const quill = new Quill(editorRef.current, {
        modules: { toolbar: toolbarOptions },
        theme: 'snow',
        placeholder: 'Mulai menulis artikel Anda di sini...',
      });

      quillRef.current = quill;
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageSelected(true);
      setSelectedFileName(file.name);
      setSelectedFile(file);
      showToast('Gambar berhasil dipilih', 'success');
      console.log("Image selected:", file);
    }
  };

  const handlePublishArticle = async () => {
    if (!title.trim()) {
      showToast('Judul artikel wajib diisi', 'error');
      return;
    }

    if (!category) {
      showToast('Kategori wajib dipilih', 'error');
      return;
    }

    if (!selectedFile) {
      showToast('Gambar wajib dipilih', 'error');
      return;
    }

    if (!quillRef.current) {
      showToast('Editor belum siap', 'error');
      return;
    }

    const content = quillRef.current.root.innerHTML;
    if (!content.trim() || content === '<p><br></p>') {
      showToast('Konten artikel wajib diisi', 'error');
      return;
    }

    setIsLoading(true);
    showToast('Sedang mempublikasikan artikel...', 'info');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', content);
      formData.append('category_id', categoryMap[category]);
      formData.append('image', selectedFile);

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }

      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://api-uks.rplrus.com/api/articles', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const textResponse = await response.text();
        console.log('Non-JSON response:', textResponse);
        throw new Error(`Server mengembalikan respons non-JSON (Status: ${response.status}). Periksa konsol untuk detail.`);
      }

      console.log('API Response:', result);

      if (response.ok && result.status) {
        showToast('Artikel berhasil dipublikasikan!', 'success');
        console.log('Article created:', result.data);
        
        // Reset form after successful publication
        setTimeout(() => {
          setTitle('');
          setCategory('');
          setImageSelected(false);
          setSelectedFileName('');
          setSelectedFile(null);
          if (quillRef.current) {
            quillRef.current.setContents([]);
          }
          navigate('/article');
        }, 2000); // Wait 2 seconds to show success message before navigating
      } else {
        throw new Error(result.message || `Kesalahan API: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Kesalahan saat mempublikasikan artikel:', error);
      showToast(`Kesalahan: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToArticles = () => {
    navigate('/article');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-white font-bold">
                Unggah artikel baru
              </h1>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-200"
                onClick={handleBackToArticles}
                aria-label="Kembali ke halaman artikel"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Kembali ke Artikel
              </button>
            </div>

            <div className="bg-[#9BC7B6] dark:bg-[#051D4E] rounded-[10px] p-4 flex items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="Masukkan judul"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 rounded-[10px] border-none bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-white placeholder-[#6D9C9D] dark:placeholder-gray-400 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="rounded-[10px] p-4 flex items-center gap-4 mb-6">
              <label className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-[10px] cursor-pointer transition-colors duration-200 shadow-sm w-auto">
                <img src={AddImageIcon} alt="Add" className="w-5 h-5" />
                <span className="font-medium text-sm">
                  {imageSelected ? selectedFileName : "Tambah Gambar"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-[200px] rounded-[10px] border-none bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none"
              >
                <option value="">Kategori</option>
                <option value="Kesehatan mental">Kesehatan mental</option>
                <option value="Kesehatan Fisik">Kesehatan Fisik</option>
                <option value="Pencegahan penyakit">Pencegahan penyakit</option>
                <option value="Kebersihan diri">Kebersihan diri</option>
                <option value="Pola Hidup Sehat">Pola Hidup Sehat</option>
              </select>
            </div>

            <div className="mb-6">
              <div
                ref={editorRef}
                className="bg-white dark:bg-gray-700 rounded-lg min-h-64"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                className={`px-6 py-2 font-medium rounded-lg transition-colors duration-200 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-teal-600 hover:bg-teal-700'
                } text-white`}
                onClick={handlePublishArticle}
                disabled={isLoading}
              >
                {isLoading ? 'Publishing...' : 'Publis Artikel'}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />

      {/* Add CSS for slide-in animation */}
      <style jsx>{`
        .animate-slide-in {
          animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}