import React, { useEffect, useState, useMemo } from 'react';
import { 
  Package, Eye, Plus, 
  Search, Edit3, Trash2,
  Star, Grid3X3, List,
  ArrowUp, ArrowDown, Crown,
  AlertTriangle, ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useAdminProductStore } from '../../store/useAdminProductStore';
import { useOverviewStore } from '../../store/useOverviewStore';
import AddProductForm from './AddProduct';
import EditProductForm from './Edit_Product';

export default function ProductDashboard() {
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'ascending'
  });

  const { products, loadProducts } = useProductStore();
  const { deleteProduct } = useAdminProductStore();
  const { fetchOverview, overview } = useOverviewStore();

  const { mostViewedProduct, totalProducts, totalProductViews, leastViewedProduct } = overview;

  useEffect(() => {
    fetchOverview();
    loadProducts();
  }, []);

  // Enhanced stats with calculations
  const stats = [
    {
      title: 'Total Products',
      value: totalProducts?.toLocaleString() || '0',
      icon: <Package className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Total Views',
      value: totalProductViews.value?.toLocaleString() || '0',
      trend: totalProductViews.trend || '+0%',
      increasing: totalProductViews.increasing || true,
      icon: <Eye className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Featured Products',
      value: products.filter(p => p.featured).length.toString(),
      icon: <Star className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Low Stock Items',
      value: products.filter(p => p.stock < 10).length.toString(),
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'orange'
    }
  ];

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Sorting functionality
  const sortedProducts = useMemo(() => {
    const sortableProducts = [...products];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        // Handle nested properties
        const aValue = sortConfig.key === 'views' ? a.analytics?.views || 0 : a[sortConfig.key];
        const bValue = sortConfig.key === 'views' ? b.analytics?.views || 0 : b[sortConfig.key];
        
        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending' 
            ? aValue - bValue 
            : bValue - aValue;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(product => {
      const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product?.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product?.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sortedProducts, searchTerm, filterCategory]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // Generate page numbers for pagination controls
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const half = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage - half;
    let endPage = currentPage + half;
    
    if (startPage < 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    }
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === currentItems.length 
        ? [] 
        : currentItems.map(product => product._id)
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedProducts([]);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Get sort indicator for table headers
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' 
      ? <ArrowUp className="w-3 h-3 inline-block ml-1" /> 
      : <ArrowDown className="w-3 h-3 inline-block ml-1" />;
  };

  if (view === 'add') {
    return <AddProductForm setView={setView} />;
  }

  if (view === 'edit') {
    return <EditProductForm product={selectedProduct} setView={setView} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Product Management
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">Manage your product inventory and performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setView('add')}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium">Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Top Products Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InsightCard
            title="Most Viewed Product"
            product={mostViewedProduct}
            type="top"
            icon={<Crown className="w-5 h-5" />}
          />
          <InsightCard
            title="Least Viewed Product"
            product={leastViewedProduct}
            type="bottom"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Product Portfolio</h3>
                <p className="text-sm text-gray-500 mt-1">Manage and track your product inventory</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
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

          {/* Products Content */}
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : viewMode === 'table' ? (
            <ProductTable 
              products={currentItems}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              onSelectAll={handleSelectAll}
              onEdit={(product) => {
                setSelectedProduct(product);
                setView('edit');
              }}
              onDelete={deleteProduct}
              sortConfig={sortConfig}
              requestSort={requestSort}
              getSortIndicator={getSortIndicator}
            />
          ) : (
            <ProductGrid 
              products={currentItems}
              onEdit={(product) => {
                setSelectedProduct(product);
                setView('edit');
              }}
              onDelete={deleteProduct}
            />
          )}

          {/* Pagination - Only show if there are items */}
          {filteredProducts.length > 0 && (
            <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                </span>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[5, 10, 20, 50].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border border-gray-200 transition-colors ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-2 rounded-lg border border-gray-200 transition-colors ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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
      <div className="p-4 md:p-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                {increasing ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${increasing ? 'text-green-600' : 'text-red-600'}`}>
                  {trend}
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-2 md:p-3 rounded-xl ${bgClass.split(' ')[2]} ${bgClass.split(' ')[3]} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, product, type, icon }) {
  const isTop = type === 'top';
  const colorClass = isTop ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-2 mb-3 md:mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          {icon}
        </div>
        <h3 className="text-base md:text-lg font-bold text-gray-900">{title}</h3>
      </div>
      
      {product ? (
        <div className="flex items-center space-x-3 md:space-x-4">
          <img 
            src={product.images?.[0] || product.images || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'} 
            alt={product.title || product.name}
            className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{product.title || product.name}</h4>
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {(product.views || product.analytics?.views || 0).toLocaleString()} views
            </p>
            <div className="flex items-center space-x-1 mt-1">
              <Eye className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              <span className="text-xs md:text-sm text-gray-500">Total impressions</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 md:py-8">
          <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No product data available</p>
        </div>
      )}
    </div>
  );
}

function ProductTable({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onSelectAll, 
  onEdit, 
  onDelete,
  sortConfig,
  requestSort,
  getSortIndicator
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 md:px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={onSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th 
              className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('name')}
            >
              <div className="flex items-center">
                Product
                {getSortIndicator('name')}
              </div>
            </th>
            <th 
              className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('category')}
            >
              <div className="flex items-center">
                Category
                {getSortIndicator('category')}
              </div>
            </th>
            <th 
              className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('price')}
            >
              <div className="flex items-center">
                Price
                {getSortIndicator('price')}
              </div>
            </th>
            <th 
              className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('stock')}
            >
              <div className="flex items-center">
                Stock
                {getSortIndicator('stock')}
              </div>
            </th>
            <th 
              className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('views')}
            >
              <div className="flex items-center">
                Views
                {getSortIndicator('views')}
              </div>
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {products.map((product) => {
            const views = product.analytics?.views || product.views || 0;
            return (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 md:px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => onSelectProduct(product._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 md:px-6 py-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={product.images?.[0] || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'} 
                      alt={product.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-3">
                  <span className="text-sm font-semibold text-gray-900">₦{product.price?.toLocaleString()}</span>
                </td>
                <td className="px-4 md:px-6 py-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                    {product.stock < 10 && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3">
                  <span className="text-sm text-gray-500">{views.toLocaleString()}</span>
                </td>
                <td className="px-4 md:px-6 py-3">
                  <div className="flex items-center space-x-2">
                    {product.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="p-1 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

function ProductGrid({ products, onEdit, onDelete }) {
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => {
          const views = product.analytics?.views || product.views || 0;
          return (
            <div key={product._id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={product.images?.[0] || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'} 
                  alt={product.name}
                  className="w-full h-40 md:h-48 object-cover"
                />
                {product.featured && (
                  <div className="absolute top-2 left-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1 md:p-2 bg-white rounded-lg shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="p-1 md:p-2 bg-white rounded-lg shadow-md text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? 'In Stock' : 'Out'}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-lg font-bold text-gray-900">₦{product.price?.toLocaleString()}</span>
                  <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-500">
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{views.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs md:text-sm">
                  <span className="text-gray-500">Stock: {product.stock}</span>
                  {product.stock < 10 && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Low Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}