import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import AddImageIcon from "../../assets/img/upload_file.png";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

export default function UploadBlog() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [imageSelected, setImageSelected] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]); // State for dynamic categories
    const [isLoading, setIsLoading] = useState(false);
    const quillRef = useRef(null);
    const editorRef = useRef(null);
    const navigate = useNavigate();

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://api-uks.rplrus.com/api/categories', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Server returned non-JSON response');
                }

                const result = await response.json();
                if (response.ok && result.status) {
                    setCategories(result.data);
                    console.log('Fetched categories:', result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                alert(`Error fetching categories: ${error.message}`);
            }
        };

        fetchCategories();
    }, []);

    // Initialize Quill editor
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
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', content);
            formData.append('category_id', category); // Use category ID directly
            formData.append('image', selectedFile);

            // Log FormData contents for debugging
            console.log('FormData contents:');
            console.log('Title:', title);
            console.log('Category ID:', category);
            console.log('Image:', selectedFile.name);
            console.log('Content length:', content.length);

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
                console.error('Non-JSON response:', textResponse);
                throw new Error(`Server returned non-JSON response (Status: ${response.status}). Check console for details.`);
            }

            console.log('API Response:', result);

            if (response.ok && result.status) {
                alert('Artikel berhasil dipublish!');
                console.log('Article created:', result.data);

                setTitle('');
                setCategory('');
                setImageSelected(false);
                setSelectedFileName('');
                setSelectedFile(null);
                if (quillRef.current) {
                    quillRef.current.setContents([]);
                }

                navigate('/article');
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
                                Upload new article
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
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.title}
                                    </option>
                                ))}
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