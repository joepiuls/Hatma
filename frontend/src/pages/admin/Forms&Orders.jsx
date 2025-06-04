import React, { useState } from 'react';
import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';

function Forms() {
  // Stats data
  const stats = [
    { title: 'Total Submissions', value: '7,265', trend: '+11.01%', increasing: true },
    { title: 'Services requested', value: '3,671', trend: '-0.03%', increasing: false },
    { title: 'Product requested', value: '156', trend: '+15.03%', increasing: true },
  ];

  // Services data
  const servicesData = [
    { name: 'Hatma Prime', value: 15000 },
    { name: 'Design', value: 28000 },
    { name: 'Cac Reg', value: 20000 },
    { name: 'Branding', value: 30000 },
    { name: 'Marketing', value: 12000 },
    { name: 'Other', value: 25000 },
  ];

  // Forms data
  const formsData = [
    { category: 'Hatma Prime', percentage: 52.1 },
    { category: 'Contact us', percentage: 22.8 },
    { category: 'Feedback', percentage: 13.9 },
    { category: 'Product request', percentage: 11.2 },
  ];

  // Forms submissions data
  const forms = [
    { date: 'Just now', name: 'Natali Craig', id: '#CM9801', email: 'Meadow Lane Oakland', type: 'Landing Page', status: 'Complete' },
    { date: 'A minute ago', name: 'Kate Morrison', id: '#CM9802', email: 'Larry San Francisco', type: 'CRM Admin pages', status: 'Complete' },
    { date: 'A minute ago', name: 'Drew Cano', id: '#CM9803', email: 'Bagwell Avenue Ocala', type: 'Client Project', status: 'Pending' },
    { date: 'Yesterday', name: 'Orlando Diggs', id: '#CM9804', email: 'Washburn Baton Rouge', type: 'Admin Dashboard', status: 'Pending' },
    { date: 'Feb 2, 2023', name: 'Andi Lane', id: '#CM9805', email: 'Nest Lane Olivette', type: 'App Landing Page', status: 'Pending' },
    { date: 'Just now', name: 'Natali Craig', id: '#CM9801', email: 'Meadow Lane Oakland', type: 'Landing Page', status: 'In Progress' },
  ];

  const [selectedForms, setSelectedForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle checkbox selection
  const handleSelectForm = (formId) => {
    setSelectedForms(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectedForms(
      selectedForms.length === forms.length 
        ? [] 
        : forms.map(form => form.id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-semibold">{stat.value}</span>
                {stat.trend && (
                  <div className={`flex items-center ${stat.increasing ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.increasing ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    <span className="ml-1">{stat.trend}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services Requested Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-6">Services requested</h3>
            <div className="flex items-end space-x-4 h-64">
              {servicesData.map((service, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-sm ${
                      index === 0 ? 'bg-purple-400' :
                      index === 1 ? 'bg-teal-400' :
                      index === 2 ? 'bg-black' :
                      index === 3 ? 'bg-blue-400' :
                      index === 4 ? 'bg-gray-300' :
                      'bg-green-400'
                    }`}
                    style={{ height: `${(service.value / 30000) * 100}%` }}
                  ></div>
                  <span className="mt-2 text-sm text-gray-600">{service.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forms Filled */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-6">Forms filled</h3>
            <div className="space-y-4">
              {formsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-black' :
                      index === 1 ? 'bg-blue-400' :
                      index === 2 ? 'bg-green-400' :
                      'bg-gray-400'
                    }`}></div>
                    <span>{item.category}</span>
                  </div>
                  <span>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-medium">Forms submitted</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedForms.length === forms.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forms.map((form) => (
                  <tr key={form.id}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedForms.includes(form.id)}
                        onChange={() => handleSelectForm(form.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{form.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        form.status === 'Complete' ? 'bg-green-100 text-green-800' :
                        form.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {form.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-t">
            <div className="flex items-center">
              <button className="px-3 py-1 rounded-md bg-gray-100">&lt;</button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === page ? 'bg-gray-900 text-white' : 'bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-1 rounded-md bg-gray-100">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;