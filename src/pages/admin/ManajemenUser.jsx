import React, { useState, useEffect } from "react";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { User, Users } from 'lucide-react';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';

// Define gradeOptions as per RegisterPage
const gradeOptions = {
  RPL: ["RPL 1", "RPL 2"],
  "Animasi 3D": ["Animasi 3D 1", "Animasi 3D 2", "Animasi 3D 3"],
  "Animasi 2D": ["Animasi 2D 4", "Animasi 2D 5"],
  "DKV DG": ["DKV DG 1", "DKV DG 2", "DKV DG 3"],
  "DKV TG": ["DKV TG 4", "DKV TG 5"],
};

export default function ManajemenUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [editForm, setEditForm] = useState({
    name_department: "",
    class: "",
    name_grades: ""
  });
  const usersPerPage = 10;

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError('No admin token found. Please log in as an admin.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://api-uks.rplrus.com/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        const userData = response.data.data;
        setUsers(userData);
        setTotalStudents(userData.filter(user => user.role === 'user').length);
        setTotalAdmins(userData.filter(user => user.role === 'admin').length);
      } else {
        setError('Failed to retrieve users: ' + response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized: Invalid or expired admin token. Please log in again.');
      } else {
        setError('Error fetching users: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (id) => {
    setModalLoading(true);
    setModalError(null);
    const token = getToken();

    try {
      const response = await axios.get(`https://api-uks.rplrus.com/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        setSelectedUser(response.data.data);
        setEditForm({
          name_department: response.data.data.name_department || "",
          class: response.data.data.class || "",
          name_grades: response.data.data.name_grades || ""
        });
        return response.data.data;
      } else {
        setModalError('Failed to retrieve user details: ' + response.data.message);
        return null;
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setModalError('Unauthorized: Invalid or expired admin token. Please log in again.');
      } else {
        setModalError('Error fetching user details: ' + err.message);
      }
      return null;
    } finally {
      setModalLoading(false);
    }
  };

  const updateUserClassDepartment = async (id, data) => {
    setModalLoading(true);
    setModalError(null);
    const token = getToken();

    try {
      const response = await axios.put(
        `https://api-uks.rplrus.com/api/users/${id}/update-class-department`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        await fetchUsers(); // Refresh user list
        setShowEditModal(false);
        setSelectedUser(null);
        setEditForm({ name_department: "", class: "", name_grades: "" });
      } else {
        setModalError('Failed to update user: ' + response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setModalError('Unauthorized: Invalid or expired admin token. Please log in again.');
      } else {
        setModalError('Error updating user: ' + err.message);
      }
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter ? user.name_department === departmentFilter : true;
    const matchesGrade = gradeFilter ? user.name_grades === gradeFilter : true;
    const matchesClass = classFilter ? user.class === classFilter : true;
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesDepartment && matchesGrade && matchesClass && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e) => {
    setDepartmentFilter(e.target.value);
    setGradeFilter("");
    setCurrentPage(1);
  };

  const handleGradeChange = (e) => {
    setGradeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleClassChange = (e) => {
    setClassFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleViewClick = (id) => {
    fetchUserDetails(id).then(() => {
      if (!modalError) setShowViewModal(true);
    });
  };

  const handleEditClick = (id) => {
    fetchUserDetails(id).then(() => {
      if (!modalError) setShowEditModal(true);
    });
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setShowViewModal(false);
      setShowEditModal(false);
      setSelectedUser(null);
      setEditForm({ name_department: "", class: "", name_grades: "" });
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "name_department" ? { name_grades: "" } : {})
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      updateUserClassDepartment(selectedUser.id, editForm);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <p>Loading...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-white font-bold mb-6">Manajemen User</h1>

            <div className="flex gap-6 mb-6">
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <User className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Siswa</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">{totalStudents}</p>
                </div>
              </div>
              <div className="flex items-center bg-white dark:bg-[#051D4E] rounded-[20px] shadow px-6 py-4 w-[220px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#1B4A4F] dark:border-white mr-4">
                  <Users className="text-[#1B4A4F] dark:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#1B4A4F] dark:text-white font-medium">Total Admin</p>
                  <p className="text-[20px] font-bold text-[#1B4A4F] dark:text-white leading-tight">{totalAdmins}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#9BC7B6] dark:bg-[#051D4E] rounded-[10px] p-4 flex items-center gap-4 mb-6">
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
                  onChange={handleSearchChange}
                  className="
                    w-full pl-10 pr-4 py-2 rounded-[10px]
                    bg-white dark:bg-gray-700
                    text-[#6D9C9D] dark:text-white
                    placeholder-[#6D9C9D] dark:placeholder-gray-400
                    focus:outline-none
                  "
                />
              </div>
              <select
                value={classFilter}
                onChange={handleClassChange}
                className="w-[150px] rounded-[10px] bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none"
              >
                <option value="">Kelas</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
              <select
                value={departmentFilter}
                onChange={handleDepartmentChange}
                className="w-[200px] rounded-[10px] bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none"
              >
                <option value="">Jurusan</option>
                {Object.keys(gradeOptions).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={gradeFilter}
                onChange={handleGradeChange}
                disabled={!departmentFilter}
                className="w-[200px] rounded-[10px] bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none"
              >
                <option value="">No. Kelas</option>
                {departmentFilter &&
                  gradeOptions[departmentFilter].map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
              </select>
              <select
                value={roleFilter}
                onChange={handleRoleChange}
                className="w-[120px] rounded-[10px] bg-white dark:bg-gray-700 text-[#6D9C9D] dark:text-gray-200 text-left pl-5 py-2 focus:outline-none appearance-none"
              >
                <option value="">Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-white">
                <thead className="text-teal-600 uppercase text-xs border-b border-[#CDDDFF]">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Kelas</th>
                    <th className="px-4 py-3">Nama Kelas</th>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3">No HP</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id} className="border-b border-[#CDDDFF]">
                      <td className="px-4 py-2">{indexOfFirstUser + index + 1}</td>
                      <td className="px-4 py-2">{user.name || '-'}</td>
                      <td className="px-4 py-2">{user.class || '-'}</td>
                      <td className="px-4 py-2">{user.name_grades || '-'}</td>
                      <td className="px-4 py-2">{user.gender || '-'}</td>
                      <td className="px-4 py-2">{user.phone_number || '-'}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <FaEye
                          className="text-gray-500 hover:text-blue-600 cursor-pointer"
                          onClick={() => handleViewClick(user.id)}
                        />
                        <FaEdit
                          className={`text-gray-500 ${user.role === 'admin' ? 'opacity-50 pointer-events-none' : 'hover:text-yellow-500 cursor-pointer'}`}
                          onClick={user.role !== 'admin' ? () => handleEditClick(user.id) : undefined}
                        />
                        <FaTrash className="text-gray-500 hover:text-red-500 cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6 text-sm dark:text-gray-300">
              <p>Showing {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}</p>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  {'<'}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page
                        ? 'bg-green-600 dark:bg-[#204ECF] text-white'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  {'>'}
                </button>
              </div>
            </div>

            {/* View Modal for User Details */}
            {showViewModal && selectedUser && (
              <div 
                className="fixed inset-0 bg-transparent flex items-center justify-center z-50 modal-overlay"
                onClick={handleModalClick}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">User Details</h2>
                  {modalLoading ? (
                    <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                  ) : modalError ? (
                    <p className="text-red-500">{modalError}</p>
                  ) : (
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedUser.name || '-'}</p>
                      <p><strong>Email:</strong> {selectedUser.email || '-'}</p>
                      <p><strong>Role:</strong> {selectedUser.role || '-'}</p>
                      <p><strong>Phone Number:</strong> {selectedUser.phone_number || '-'}</p>
                      <p><strong>Gender:</strong> {selectedUser.gender || '-'}</p>
                      {selectedUser.role !== 'admin' && (
                        <>
                          <p><strong>Department:</strong> {selectedUser.name_department || '-'}</p>
                          <p><strong>Class:</strong> {selectedUser.class || '-'}</p>
                          <p><strong>Grade:</strong> {selectedUser.name_grades || '-'}</p>
                          <p><strong>Absent:</strong> {selectedUser.absent || '-'}</p>
                        </>
                      )}
                      <p><strong>Parent Phone:</strong> {selectedUser.no_hp_parent || '-'}</p>
                      <p><strong>Parent Name:</strong> {selectedUser.name_parent || '-'}</p>
                      <p><strong>Wali Kelas:</strong> {selectedUser.name_walikelas || '-'}</p>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal for Updating Class and Department */}
            {showEditModal && selectedUser && (
              <div 
                className="fixed inset-0 bg-transparent flex items-center justify-center z-50 modal-overlay"
                onClick={handleModalClick}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Edit Class and Department</h2>
                  {modalLoading ? (
                    <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                  ) : modalError ? (
                    <p className="text-red-500">{modalError}</p>
                  ) : (
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                          <select
                            name="name_department"
                            value={editForm.name_department}
                            onChange={handleEditFormChange}
                            className="w-full rounded-[10px] bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 pl-3 py-2 focus:outline-none border border-gray-300 dark:border-gray-600"
                          >
                            <option value="">Select Department</option>
                            {Object.keys(gradeOptions).map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class</label>
                          <select
                            name="class"
                            value={editForm.class}
                            onChange={handleEditFormChange}
                            className="w-full rounded-[10px] bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 pl-3 py-2 focus:outline-none border border-gray-300 dark:border-gray-600"
                          >
                            <option value="">Select Class</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grade</label>
                          <select
                            name="name_grades"
                            value={editForm.name_grades}
                            onChange={handleEditFormChange}
                            disabled={!editForm.name_department}
                            className="w-full rounded-[10px] bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 pl-3 py-2 focus:outline-none border border-gray-300 dark:border-gray-600"
                          >
                            <option value="">Select Grade</option>
                            {editForm.name_department &&
                              gradeOptions[editForm.name_department].map((grade) => (
                                <option key={grade} value={grade}>{grade}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                            setEditForm({ name_department: "", class: "", name_grades: "" });
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditSubmit}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}