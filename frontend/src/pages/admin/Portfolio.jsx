import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search,
  EyeOff, 
  Filter, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Star,
  Calendar,
  User,
  BarChart3,
  Grid3X3,
  List,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  AlertTriangle,
  Clock,
  ExternalLink,
  Award,
  Target,
  Users,
  Zap
} from 'lucide-react';
import AddPortfolioForm from './AddInfo';
import EditPortfolioForm from './EditInfo';
import usePortfolioStore from '../../store/usePortfolioStore';

export default function PortfolioDashboard() {
  const [view, setView] = useState('list');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); 


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusToggle = (project) => {
    const newStatus = project.status === 'Published' ? 'Draft' : 'Published';
    updatePortfolioStatus(project.id, newStatus);
  };

  
 
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const {
    fetchPortfolioStats,
    fetchPortfolioItems,
    computedStats,
    portfolioItems,
    mostViewed,
    leastViewed,
    historicalData,
    loading,
    error,
    updatePortfolioStatus,
    deletePortfolioItem
  } = usePortfolioStore();

 

useEffect(() => {
    fetchPortfolioStats();
    fetchPortfolioItems();
}, [fetchPortfolioStats, fetchPortfolioItems]);


  // Get unique categories and statuses for filters
  const categories = ['all', ...new Set(portfolioItems.map(p => p.category))];
  const statuses = ['all', ...new Set(portfolioItems.map(p => p.status))];

  // Filter projects
  const filteredProjects = portfolioItems.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });


  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handleAdd = () => {
    setSelectedProject(null);
    setView('add');
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setView('edit');
  };

  const handleDelete = (id) => {
    deletePortfolioItem(id);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedProject(null);
  };

  if (view === 'add') {
    return <AddPortfolioForm onCancel={handleCancel} />;
  }

  if (view === 'edit') {
    return <EditPortfolioForm onCancel={handleCancel} project={selectedProject} />;
  }

if (loading) {
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
          <p className="text-gray-600 mt-2">{error.message}</p>
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
              Portfolio Management
            </h1>
            <p className="text-gray-600 mt-2">Showcase your best work and track project performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAdd}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Project</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {computedStats().map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Top Projects Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InsightCard
            title="Most Viewed Project"
            project={mostViewed}
            type="top"
            icon={<Crown className="w-5 h-5" />}
          />
          <InsightCard
            title="Least Viewed Project"
            project={leastViewed}
            type="bottom"
            icon={<TrendingDown className="w-5 h-5" />}
          />
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Project Portfolio</h3>
                <p className="text-sm text-gray-500 mt-1">Manage and showcase your project portfolio</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status}
                    </option>
                  ))}
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

          {/* Projects Content */}
          {viewMode === 'table' ? (
            <ProjectTable 
             projects={currentProjects}
             onEdit={handleEdit}
             onDelete={handleDelete}
             onStatusToggle={handleStatusToggle}
            />
          ) : (
            <ProjectGrid 
              projects={currentProjects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          )}

           <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, filteredProjects.length)} 
                of {filteredProjects.length} projects
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg border border-gray-200 transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg border border-gray-200 transition-colors ${
                  currentPage === totalPages 
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
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgClass.split(' ')[2]} ${bgClass.split(' ')[3]} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, project, type, icon }) {
  const isTop = type === 'top';
  const colorClass = isTop ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-2 mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      
      {project ? (
        <div className="flex items-center space-x-4">
          <img 
            src={project.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'} 
            alt={project.title}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{project.title}</h4>
            <p className="text-sm text-gray-600 mb-1">{project.client}</p>
            <p className="text-2xl font-bold text-gray-900">{project.views?.toLocaleString() || '0'} views</p>
            <div className="flex items-center space-x-1 mt-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Total impressions</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No project data available</p>
        </div>
      )}
    </div>
  );
}
function ProjectTable({ projects, onEdit, onDelete, onStatusToggle }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Published': 'bg-green-100 text-green-800 border-green-200',
      'Draft': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Archived': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return statusClasses[status] || statusClasses['Draft'];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Views</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={project.image || 'https://via.placeholder.com/100x100?text=Project'} 
                      alt={project.title || 'Project image'}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Project';
                        e.target.onerror = null;
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {project.title || 'Untitled Project'}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {project.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {project.client || 'No client'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {project.category || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {(project.views || 0).toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">
                    {formatDate(project.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(project.status)}`}>
                      {project.status || 'Draft'}
                    </span>
                    <button
                      onClick={() => onStatusToggle(project)}
                      className={`mt-1 text-xs px-2 py-1 rounded transition-colors ${
                        project.status === 'Published'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {project.status === 'Published' ? 'Set to Draft' : 'Publish'}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStatusToggle(project)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title={project.status === 'Published' ? 'Set to Draft' : 'Publish'}
                    >
                      {project.status === 'Published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                No projects found matching your criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ProjectGrid({ projects, onEdit, onDelete, onStatusToggle }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Published': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors['Draft'];
  };

  // Icon mapping for results
  const iconMap = {
    Award: Award,
    TrendingUp: TrendingUp,
    Target: Target,
    Users: Users,
    Zap: Zap,
    Clock: Clock,
    Star: Star
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img 
                src={project.image || 'https://via.placeholder.com/300x200?text=Project+Image'} 
                alt={project.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Project+Image';
                  e.target.onerror = null;
                }}
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(project)}
                    className="p-2 bg-white rounded-lg shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onStatusToggle(project)}
                    className="p-2 bg-white rounded-lg shadow-md text-gray-600 hover:bg-gray-50 transition-colors"
                    title={project.status === 'Published' ? 'Set to Draft' : 'Publish'}
                  >
                    {project.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="p-2 bg-white rounded-lg shadow-md text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {project.category || 'Uncategorized'}
                </span>
                <span className="text-xs text-gray-500">{project.year || 'N/A'}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {project.title || 'Untitled Project'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {project.client || 'No client specified'}
              </p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {project.description || 'No description available'}
              </p>
              
              {/* Results Preview */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {(project.results || []).slice(0, 3).map((result, index) => {
                  const IconComponent = iconMap[result.icon] || Award;
                  return (
                    <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-md mb-1">
                        <IconComponent className="w-3 h-3" />
                      </div>
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {result.value || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {result.metric || 'Metric'}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{(project.views || 0).toLocaleString()}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(project.createdAt)}
                </span>
              </div>
              
              {/* Status Toggle Button */}
              <div className="mt-3">
                <button
                  onClick={() => onStatusToggle(project)}
                  className={`w-full py-2 text-sm rounded-lg font-medium ${
                    project.status === 'Published'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  } transition-colors`}
                >
                  {project.status === 'Published' ? 'Set to Draft' : 'Publish Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}