import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Types
interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  affiliate: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admin/students');
        setStudents(res.data.data);
        setFilteredStudents(res.data.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch students');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = students.filter(
        student =>
          student.firstName.toLowerCase().includes(term) ||
          student.lastName.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          (student.affiliate?.firstName && student.affiliate.firstName.toLowerCase().includes(term)) ||
          (student.affiliate?.lastName && student.affiliate.lastName.toLowerCase().includes(term)) ||
          (student.affiliate?.email && student.affiliate.email.toLowerCase().includes(term))
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Students</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search students or affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          search icon
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Students Found</h2>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try a different search term.' : 'There are currently no students in the system.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map(student => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${student.status === 'active' ? 'bg-green-100 text-green-800' : 
                          student.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.affiliate ? 
                          `${student.affiliate.firstName} ${student.affiliate.lastName}` : 
                          'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.affiliate ? student.affiliate.email : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminStudents; 