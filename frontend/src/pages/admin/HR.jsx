import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

function HR() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const stats = [
    { title: 'Total Staffs', value: '7,265', change: '+11.01%', increase: true },
    { title: 'Recently joined', value: '3,671', change: '-0.03%', increase: false },
    { title: 'Pending Invites', value: '156', change: '+15.03%', increase: true },
    { title: 'Job applications', value: '3,671', change: '-0.03%', increase: false },
  ];

  const formData = [
    { id: 1, name: 'Natali Craig', email: 'Meadow Lane Oakland', role: 'Landing Page', department: '#CM9801', date: 'Just now', status: 'Complete' },
    { id: 2, name: 'Kate Morrison', email: 'Larry San Francisco', role: 'CRM Admin pages', department: '#CM9802', date: 'A minute ago', status: 'Complete' },
    { id: 3, name: 'Drew Cano', email: 'Bagwell Avenue Ocala', role: 'Client Project', department: '#CM9803', date: 'A minute ago', status: 'Pending' },
    { id: 4, name: 'Orlando Diggs', email: 'Washburn Baton Rouge', role: 'Admin Dashboard', department: '#CM9804', date: 'Yesterday', status: 'Pending' },
    { id: 5, name: 'Andi Lane', email: 'Nest Lane Olivette', role: 'App Landing Page', department: '#CM9805', date: 'Feb 2, 2023', status: 'Pending' },
    { id: 6, name: 'Natali Craig', email: 'Meadow Lane Oakland', role: 'Landing Page', department: '#CM9801', date: 'Just now', status: 'In Progress' },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(formData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'text-green-600 bg-green-50';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'In Progress':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
              <span className={`flex items-center text-sm ${stat.increase ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.increase ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </span>
            </div>
            <p className="text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Forms Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Forms submitted</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedRows.length === formData.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Department</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="w-12 px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-medium">{row.name.charAt(0)}</span>
                      </div>
                      <span className="ml-3 text-sm font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HR;