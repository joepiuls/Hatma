// PortfolioDashboard.jsx
import React, { useState } from 'react';
import { TrendingDown, Plus, Pencil, Trash } from 'lucide-react';
import EditInfo from './EditInfo';
import AddInfo from './AddInfo';
 
function PortfolioDashboard() {
  const stats = [
    { title: 'Total Projects', value: '7,265' },
    { title: 'Total Views', value: '3,671', trend: '-0.03%' },
    { title: 'Most Viewed', value: '15' },
  ];

  const [portfolioItems, setPortfolioItems] = useState([
    { id: 1, title: 'Kate Morrison', client: 'SKU', category: '30', views: '30', status: 'Active' },
    { id: 2, title: 'John Doe', client: 'XYZ Corp', category: 'Design', views: '45', status: 'Draft' },
    { id: 3, title: 'Jane Smith', client: 'ABC Inc', category: 'Development', views: '60', status: 'Published' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const [view, setView] = useState('list');
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAdd = () => {
    setSelectedProject(null);
    setView('add');
  };

  const handleEdit = (id) => {
    const project = portfolioItems.find(item => item.id === id);
    setSelectedProject(project);
    setView('edit');
  };

  const handleDelete = (id) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCancel = () => {
    setView('list');
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-semibold">{stat.value}</span>
                {stat.trend && (
                  <div className="flex items-center text-red-500">
                    <TrendingDown size={20} />
                    <span className="ml-1">{stat.trend}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {view === 'list' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-medium">Portfolio</h3>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                <Plus size={16} /> Add Project
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {portfolioItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
                            alt={item.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <span className="ml-4 text-sm font-medium text-gray-900">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-500 text-sm">{item.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 flex items-center justify-between border-t">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="p-2 rounded-md hover:bg-gray-100"
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === i + 1 ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className="p-2 rounded-md hover:bg-gray-100"
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'add' && (
          <AddInfo onCancel={handleCancel} />
        )}

        {view === 'edit' && selectedProject && (
          <EditInfo onCancel={handleCancel} project={selectedProject} />
        )}
      </div>
    </div>
  );
}

export default PortfolioDashboard;
