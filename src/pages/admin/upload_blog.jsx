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
  const quillRef = useRef(null);
  const editorRef = useRef(null);

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
      console.log("Image selected:", file);
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

            <div className="rounded-[10px] p-4 flex items-center gap-4 mb-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Masukkan judul"
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

              <select className="w-[200px] rounded-[10px] border-none bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none">
                <option> Kategori</option>
                <option>Kesehatan mental</option>
                <option>Kesehatan Fisik</option>
                <option>Pencegahan penyakit</option>
                <option>Kebersihan diri</option>
                <option>Pola Hidup Sehat</option>
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
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200"
                onClick={() => {
                  if (quillRef.current) {
                    const content = quillRef.current.root.innerHTML;
                    console.log("Editor content:", content);
                  }
                }}
              >
                Publish Artikel
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
