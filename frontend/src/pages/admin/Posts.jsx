import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
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
  BookOpen
} from 'lucide-react';
import { useBlogStore } from '../../store/useBlogStore';
import { useOverviewStore } from '../../store/useOverviewStore';
import { useAdminBlogStore } from '../../store/useAdminBlogStore';
import AddPostForm from './AddPost';
import EditPostForm from './EditPost';

export default function PostDashboard() {
  const [view, setView] = useState('list');
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState([]);

  const { fetchBlogs, blogs } = useBlogStore();
  const { fetchOverview, overview } = useOverviewStore();
  const { deleteBlog } = useAdminBlogStore();

  const { mostViewedBlog, totalBlogs, blogViews, leastViewedBlog } = overview;

  useEffect(() => {
    fetchOverview();
    fetchBlogs();
  }, []);

  // Enhanced stats with calculations
  const stats = [
    {
      title: 'Total Posts',
      value: totalBlogs?.toLocaleString() || '0',
    
      icon: <FileText className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Total Views',
      value: blogs.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString(),
      trend: '+8.3%',
      increasing: true,
      icon: <Eye className="w-6 h-6" />,
      color: 'green'
    },
     {
      title: 'Monthly Views',
      value: blogViews?.value?.toLocaleString() || '0',
      trend: blogViews?.trend || '+0%',
      increasing: blogViews?.trend?.startsWith('+'),
      icon: <Eye className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Published Today',
      value: blogs.filter(post => {
        const today = new Date().toDateString();
        const postDate = new Date(post.createdAt).toDateString();
        return today === postDate;
      }).length.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Draft Posts',
      value: blogs.filter(post => post.status === 'draft').length.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'orange'
    }
  ];

  // Get unique categories for filter
  const categories = ['all', ...new Set(blogs.map(p => p.category).filter(Boolean))];

  // Filter posts
  const filteredPosts = blogs.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle post selection
  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === filteredPosts.length 
        ? [] 
        : filteredPosts.map(post => post._id)
    );
  };

  if (view === 'add') {
    return <AddPostForm setView={setView} />;
  }

  if (view === 'edit') {
    return <EditPostForm post={selectedPost} setView={setView} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Blog Management
            </h1>
            <p className="text-gray-600 mt-2">Create, manage and track your blog content</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                setSelectedPost(null);
                setView('add');
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Post</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Top Posts Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InsightCard
            title="Most Viewed Post"
            post={mostViewedBlog}
            type="top"
            icon={<Crown className="w-5 h-5" />}
          />
          <InsightCard
            title="Least Viewed Post"
            post={leastViewedBlog}
            type="bottom"
            icon={<TrendingDown className="w-5 h-5" />}
          />
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Blog Posts</h3>
                <p className="text-sm text-gray-500 mt-1">Manage and track your blog content</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
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

          {/* Posts Content */}
          {viewMode === 'table' ? (
            <PostTable 
              posts={filteredPosts}
              selectedPosts={selectedPosts}
              onSelectPost={handleSelectPost}
              onSelectAll={handleSelectAll}
              onEdit={(post) => {
                setSelectedPost(post);
                setView('edit');
              }}
              onDelete={deleteBlog}
            />
          ) : (
            <PostGrid 
              posts={filteredPosts}
              onEdit={(post) => {
                setSelectedPost(post);
                setView('edit');
              }}
              onDelete={deleteBlog}
            />
          )}

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {filteredPosts.length} of {blogs.length} posts
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
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

function InsightCard({ title, post, type, icon }) {
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
      
      {post ? (
        <div className="flex items-center space-x-4">
          <img 
            src={post.images || 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg'} 
            alt={post.title}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{post.title}</h4>
            <p className="text-2xl font-bold text-gray-900">{post.views?.toLocaleString() || '0'} views</p>
            <div className="flex items-center space-x-1 mt-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Total impressions</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No post data available</p>
        </div>
      )}
    </div>
  );
}

function PostTable({ posts, selectedPosts, onSelectPost, onSelectAll, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return statusClasses[status] || statusClasses.published;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Post</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Views</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {posts.map((post) => (
            <tr key={post._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={post.images || 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg'} 
                    alt={post.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt || 'No excerpt available'}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {post.author?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-sm text-gray-900">{post.author?.name || 'Anonymous'}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {post.category || 'Uncategorized'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{post.views?.toLocaleString() || '0'}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(post._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PostGrid({ posts, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.published;
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img 
                src={post.images || 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg'} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(post)}
                    className="p-2 bg-white rounded-lg shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(post._id)}
                    className="p-2 bg-white rounded-lg shadow-md text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}>
                  {post.status || 'Published'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {post.category || 'Uncategorized'}
                </span>
                <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt || 'No excerpt available'}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {post.author?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-sm text-gray-600">{post.author?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{post.views?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}