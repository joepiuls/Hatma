import React, { useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Mail,
  Phone,
  Calendar,
  User,
  BarChart3,
  Grid3X3,
  List,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Crown,
  Target,
  Users,
  Zap,
  Download,
  RefreshCw
} from 'lucide-react';
import useFormStore from '../../store/useFormStore';

export default function Forms() {
  const [viewMode, setViewMode] = React.useState('table');
  const [selectedForms, setSelectedForms] = React.useState([]);

  const {
    formSubmissions,
    servicesData,
    formsData,
    historicalData,
    loading,
    error,
    filters,
    pagination,
    fetchDashboardData,
    updateFormStatus,
    deleteFormSubmission,
    updateFilters,
    updatePagination,
    computedStats
  } = useFormStore();



  useEffect(() => {
    fetchDashboardData();
  }, []);

  console.log(servicesData);
  

  const handleSelectForm = (formId) => {
    setSelectedForms(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  const handleSelectAll = () => {
    setSelectedForms(
      selectedForms.length === formSubmissions.length 
        ? [] 
        : formSubmissions.map(form => form.id)
    );
  };

  const handleStatusUpdate = async (formId, newStatus) => {
    await updateFormStatus(formId, newStatus);
  };

  const handleDelete = async (formId) => {
    await deleteFormSubmission(formId);
    setSelectedForms(prev => prev.filter(id => id !== formId));
  };

  const handleSearch = (value) => {
    updateFilters({ search: value });
  };

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  const handlePageChange = (page) => {
    updatePagination({ currentPage: page });
  };

  if (loading && formSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error.message || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Forms Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Track submissions, analyze performance, and manage leads</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={() => fetchDashboardData()}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {computedStats().map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services Requested Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Services Requested</h3>
                <p className="text-sm text-gray-500 mt-1">Breakdown by service type</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-end space-x-3 h-64 mb-4">
              {servicesData.map((service, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div 
                    className={`w-full rounded-t-lg ${service.color} hover:opacity-80 transition-opacity duration-300 cursor-pointer`}
                    style={{ 
                      height: servicesData.length > 0 
                        ? `${(service.value / Math.max(...servicesData.map(s => s.value)) * 100)}%` 
                        : '0%' 
                    }}
                  ></div>
                  <span className="mt-3 text-xs text-gray-600 font-medium text-center leading-tight">{service.name}</span>
                  <span className="text-xs text-gray-400 mt-1">{service.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forms Filled */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Forms Distribution</h3>
                <p className="text-sm text-gray-500 mt-1">By category breakdown</p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-4">
              {formsData.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="font-medium text-gray-900">{item.category}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color} transition-all duration-500 ease-out`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Form Submissions</h3>
                <p className="text-sm text-gray-500 mt-1">Manage and track all form submissions</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Complete">Complete</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                </select>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="Service Request">Service Request</option>
                  <option value="Product Request">Product Request</option>
                </select>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'table' ? (
            <FormsTable 
              forms={formSubmissions}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ) : (
            <FormsGrid 
              forms={formSubmissions}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          )}

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
                of {pagination.totalItems} submissions
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-1 rounded-lg border border-gray-200 transition-colors ${
                  pagination.currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = pagination.currentPage <= 3
                  ? i + 1
                  : Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
                  
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      pagination.currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                    disabled={page > pagination.totalPages || page < 1}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-1 rounded-lg border border-gray-200 transition-colors ${
                  pagination.currentPage === pagination.totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility Components
function StatCard({ title, value, trend, increasing, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
    green: 'from-green-500 to-green-600 bg-green-50 text-green-600',
    purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600',
    orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600',
  };

  const bgClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden">
      <div className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                {increasing ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${increasing ? 'text-green-600' : 'text-red-600'}`}>
                  {trend}
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgClass.split(' ')[2]} ${bgClass.split(' ')[3]} group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-lg">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormsTable({ forms,  onStatusUpdate, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return diffMinutes === 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? 'An hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Complete': { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        border: 'border-green-200',
        icon: <CheckCircle className="w-3 h-3" />
      },
      'Pending': { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        border: 'border-yellow-200',
        icon: <Clock className="w-3 h-3" />
      },
      'In Progress': { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        border: 'border-blue-200',
        icon: <AlertCircle className="w-3 h-3" />
      }
    };
    
    return statusConfig[status] || statusConfig['Pending'];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colors[priority] || colors['medium'];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {forms.map((form) => {
            const statusConfig = getStatusBadge(form.status);
            return (
              <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{formatDate(form.date)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {form.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{form.name}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{form.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span>{form.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {form.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium capitalize ${getPriorityColor(form.priority)}`}>
                    {form.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    {statusConfig.icon}
                    <span>{form.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onStatusUpdate(form.id, form.status === 'Complete' ? 'Pending' : 'Complete')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Toggle Status"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(form.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FormsGrid({ forms, onStatusUpdate, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Complete': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors['Pending'];
  };

  const getPriorityDot = (priority) => {
    const colors = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500'
    };
    return colors[priority] || colors['medium'];
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div key={form.id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {form.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{form.name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(form.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getPriorityDot(form.priority)}`}></div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(form.status)}`}>
                    {form.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{form.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{form.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{form.type}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">{form.message}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Source: {form.source || 'Website'}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onStatusUpdate(form.id, form.status === 'Complete' ? 'Pending' : 'Complete')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(form.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}