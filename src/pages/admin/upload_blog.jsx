import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import AddImageIcon from "../../assets/img/upload_file.png";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function UploadBlog() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // Category mapping based on your select options
  const categoryMap = {
    "Kesehatan mental": "1",
    "Kesehatan Fisik": "2", 
    "Pencegahan penyakit": "3",
    "Kebersihan diri": "4",
    "Pola Hidup Sehat": "5"
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
      console.log("Image selected:", file);
    }
  };

  const handlePublishArticle = async () => {
    // Validation
    if (!title.trim()) {
      alert('Judul artikel harus diisi');
      return;
    }

    if (!category) {
      alert('Kategori harus dipilih');
      return;
    }

    if (!selectedFile) {
      alert('Gambar harus dipilih');
      return;
    }

    if (!quillRef.current) {
      alert('Editor belum siap');
      return;
    }

    const content = quillRef.current.root.innerHTML;
    if (!content.trim() || content === '<p><br></p>') {
      alert('Konten artikel harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', content);
      formData.append('category_id', categoryMap[category]);
      formData.append('image', selectedFile);

      // Log the FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }

      // Get token from localStorage if it exists
      const token = localStorage.getItem('token');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://api-uks.rplrus.com/api/articles', {
        method: 'POST',
        headers: headers,
        body: formData,
        // Don't set Content-Type header - let browser set it automatically for FormData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, get text to see what the server actually returned
        const textResponse = await response.text();
        console.log('Non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response (Status: ${response.status}). Check console for details.`);
      }

      console.log('API Response:', result);

      if (response.ok && result.status) {
        alert('Artikel berhasil dipublish!');
        console.log('Article created:', result.data);
        
        // Reset form
        setTitle('');
        setCategory('');
        setImageSelected(false);
        setSelectedFileName('');
        setSelectedFile(null);
        if (quillRef.current) {
          quillRef.current.setContents([]);
        }

        // Optional: Redirect to articles page or refresh the articles list
        // window.location.href = '/articles'; // Uncomment if you want to redirect
        
      } else {
        throw new Error(result.message || `API Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-white font-bold mb-6">
              Upload new article
            </h1>

            <div className="bg-[#9BC7B6] dark:bg-[#051D4E] rounded-[10px] p-4 flex items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-0">
                <span className="absolute inset-y-0 left-3 flex items-center text-[#6D9C9D] dark:text-gray-400">
                </span>
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
              <label className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-[10px] cursor-pointer transition-colors duration-200 shadow-sm w-auto">
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
                {isLoading ? 'Publishing...' : 'Publish Artikel'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}