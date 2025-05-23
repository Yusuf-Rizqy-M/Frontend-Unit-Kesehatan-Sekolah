import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { FaChevronRight, FaPlus } from "react-icons/fa";

// Sample data for articles
const initialArticles = [
  { id: 1, title: "Pentingnya Menjaga Kesehatan Mental di Era Modern", description: "Kesehatan mental adalah kondisi...", jurusan: "IPA", kelas: "X" },
  { id: 2, title: "Pencegahan Penyakit", description: "Kesehatan mental adalah kondisi...", jurusan: "IPS", kelas: "XI" },
  { id: 3, title: "Kebersihan Diri", description: "Kesehatan mental adalah kondisi...", jurusan: "IPA", kelas: "XII" },
  { id: 4, title: "Kesehatan Fisik", description: "Kesehatan mental adalah kondisi...", jurusan: "IPS", kelas: "X" },
  { id: 5, title: "Pola Hidup Sehat", description: "Kesehatan mental adalah kondisi...", jurusan: "IPA", kelas: "XI" },
  { id: 6, title: "Menjaga Kesehatan", description: "Kesehatan mental adalah kondisi...", jurusan: "IPS", kelas: "XII" },
  { id: 7, title: "Olahraga Rutin", description: "Kesehatan mental adalah kondisi...", jurusan: "IPA", kelas: "X" },
  { id: 8, title: "Makan Sehat", description: "Kesehatan mental adalah kondisi...", jurusan: "IPS", kelas: "XI" },
];

// SearchBar Component
const SearchBar = ({ searchQuery, onSearchChange, onAddClick }) => (
  <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-[#9BC7B6] dark:bg-[#051D4E]">
    <div className="relative flex-1 min-w-0">
      <span className="absolute inset-y-0 left-3 flex items-center text-[#6D9C9D] dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </span>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={onSearchChange}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-white placeholder-[#6D9C9D] dark:placeholder-gray-400 focus:outline-none"
      />
    </div>
    <button
      onClick={onAddClick}
      className="flex items-center justify-center gap-2 w-[150px] px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300"
    >
      <span className="text-sm font-medium">Tambahkan</span>
      <FaPlus className="w-4 h-4" />
    </button>
  </div>
);

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

// ArticleTable Component
const ArticleTable = ({ articles, indexOfFirstItem, onView }) => (
  <table className="w-full text-sm bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
    <thead>
      <tr className="text-left text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
        <th className="py-3 px-4 font-medium">No</th>
        <th className="py-3 px-4 font-medium">Name</th>
        <th className="py-3 px-4 font-medium">Deskripsi</th>
        <th className="py-3 px-4 font-medium">Category</th>
        <th className="py-3 px-4 font-medium text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {articles.map((article, index) => (
        <tr
          key={article.id}
          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{indexOfFirstItem + index + 1}</td>
          <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{article.title}</td>
          <td className="py-3 px-4 text-gray-700 dark:text-gray-200 italic">{article.description}</td>
          <td className="py-3 px-4 text-gray-700 dark:text-gray-200">{article.jurusan}</td>
          <td className="py-3 px-4 text-center">
            <button
              className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              onClick={() => onView(article)}
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

ArticleTable.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      jurusan: PropTypes.string.isRequired,
    })
  ).isRequired,
  indexOfFirstItem: PropTypes.number.isRequired,
  onView: PropTypes.func.isRequired,
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, filteredArticles, indexOfFirstItem, itemsPerPage }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-between items-center mt-6 text-gray-500 dark:text-gray-300 text-sm">
      <span>
        Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfFirstItem + itemsPerPage, filteredArticles.length)} of {filteredArticles.length}
      </span>
      <div className="flex space-x-1">
        <button
          className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 ${
              currentPage === pageNumber ? "bg-teal-500 dark:bg-teal-600 text-white" : ""
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        {totalPages > 3 && currentPage < totalPages - 1 && (
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
            ...
          </button>
        )}
        {totalPages > 3 && currentPage < totalPages && (
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        )}
        <button
          className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  filteredArticles: PropTypes.array.isRequired,
  indexOfFirstItem: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
};

// Main Article Component
const Article = () => {
  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles] = useState(initialArticles);

  // Dark Mode Handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Article Filtering and Pagination
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  // Event Handlers
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleView = (article) => {
    // Placeholder for view functionality
  };

  const handleAddClick = () => {
    // Placeholder for add functionality
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow p-6">
          <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-6">Articles</h2>
            <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} onAddClick={handleAddClick} />
            {filteredArticles.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No articles available.</div>
            ) : (
              <>
                <ArticleTable articles={currentArticles} indexOfFirstItem={indexOfFirstItem} onView={handleView} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  filteredArticles={filteredArticles}
                  indexOfFirstItem={indexOfFirstItem}
                  itemsPerPage={itemsPerPage}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Article;