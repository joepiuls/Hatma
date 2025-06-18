import React, { useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MousePointer,
  ShoppingCart,
  Eye,
  Package,
  FileText,
  DollarSign,
  Activity,
  Globe,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useOverviewStore } from '../../store/useOverviewStore';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

function Analytics() {
  const { overview, fetchOverview, isLoading, error } = useOverviewStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const {
    sessions,
    conversions,
    serviceRequests,
    pageViews,
    totalProductViews,
    totalUsers,
    totalSales,
    trafficSources,
    topPages,
    totalProducts,
    totalBlogs,
    userStats,
    blogViewTrends,
    productSalesTrends,
    mostViewedProduct,
    leastViewedProduct,
    mostViewedBlog,
    leastViewedBlog,
    blogViews,
  } = overview || {};

  console.log(overview);
  
  const safeValue = (val) => (typeof val === 'number' ? val : 0);

  const stats = [
    {
      title: 'Total Sessions',
      value: safeValue(sessions?.value).toLocaleString(),
      trend: sessions?.trend || '',
      increasing: sessions?.increasing || false,
      icon: <Activity className="w-6 h-6" />,
      color: 'blue',
    },
    {
      title: 'Conversions',
      value: safeValue(conversions?.value).toLocaleString(),
      trend: conversions?.trend || '',
      increasing: conversions?.increasing || false,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'green',
    },
    {
      title: 'Page Views',
      value: safeValue(pageViews?.value).toLocaleString(),
      trend: pageViews?.trend || '',
      increasing: pageViews?.increasing || false,
      icon: <Eye className="w-6 h-6" />,
      color: 'purple',
    },
    {
      title: 'Total Revenue',
      value: `₦${safeValue(totalSales?.totalRevenue?.value).toLocaleString()}`,
      trend: totalSales?.totalRevenue?.trend || '',
      increasing: totalSales?.totalRevenue?.increasing || false,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'emerald',
    },
    {
      title: 'Service Requests',
      value: safeValue(serviceRequests?.value).toLocaleString(),
      trend: serviceRequests?.trend || '',
      increasing: serviceRequests?.increasing || false,
      icon: <MousePointer className="w-6 h-6" />,
      color: 'orange',
    },
    {
      title: 'Product Views',
      value: safeValue(totalProductViews?.value).toLocaleString(),
      trend: totalProductViews?.trend || '',
      increasing: totalProductViews?.increasing || false,
      icon: <Package className="w-6 h-6" />,
      color: 'indigo',
    },
    {
      title: 'Total Users',
      value: safeValue(totalUsers?.value).toLocaleString(),
      trend: totalUsers?.trend || '',
      increasing: totalUsers?.increasing || false,
      icon: <Users className="w-6 h-6" />,
      color: 'pink',
    },
    {
      title: 'Transactions',
      value: safeValue(totalSales?.totalTransactions?.value).toLocaleString(),
      trend: totalSales?.totalTransactions?.trend || '',
      increasing: totalSales?.totalTransactions?.increasing || false,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'cyan',
    },
  ];

  // Transform traffic sources for pie chart
  const trafficSourcesData = trafficSources?.map((source, index) => ({
    name: source._id,
    value: source.count,
    percentage: Math.round((source.count / trafficSources.reduce((sum, s) => sum + s.count, 0)) * 100)
  })) || [];

  // Transform top pages for bar chart
  const topPagesData = topPages?.map(page => ({
    name: page._id.replace('/', '').substring(0, 10) || 'Home',
    value: page.count,
    fullPath: page._id
  })) || [];

  // Services data (mock based on overview data)
  const servicesData = [
    { name: 'Consulting', value: Math.floor(serviceRequests?.value * 0.4) || 35 },
    { name: 'Development', value: Math.floor(serviceRequests?.value * 0.3) || 28 },
    { name: 'Design', value: Math.floor(serviceRequests?.value * 0.2) || 18 },
    { name: 'Support', value: Math.floor(serviceRequests?.value * 0.1) || 8 }
  ];

  // Conversion data
  const conversionsData = [
    { label: 'Completed', percentage: 65, value: Math.floor(conversions?.value * 0.65) },
    { label: 'In Progress', percentage: 25, value: Math.floor(conversions?.value * 0.25) },
    { label: 'Abandoned', percentage: 10, value: Math.floor(conversions?.value * 0.1) }
  ];

  if (isLoading) {
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
        <div className="text-center text-red-600 p-8">
          <p className="text-lg font-semibold">Error loading analytics</p>
          <p className="text-sm mt-2">{error}</p>
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
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your business performance</p>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Real-time Data</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* User Visits Line Chart */}
        <ChartCard title="User Activity Trends" icon={<Activity className="w-5 h-5" />}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={userStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="_id" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#colorUsers)"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services Bar Chart */}
          <ChartCard title="Services Requested" icon={<BarChart3 className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={servicesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Conversion Pie Chart */}
          <ChartCard title="Conversion Status" icon={<PieChartIcon className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={conversionsData} 
                  dataKey="value" 
                  nameKey="label" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100}
                  innerRadius={40}
                >
                  {conversionsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Sources */}
          <ChartCard title="Traffic Sources" icon={<Globe className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={trafficSourcesData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100}
                  innerRadius={40}
                >
                  {trafficSourcesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Pages */}
          <ChartCard title="Top Performing Pages" icon={<Eye className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPagesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value, name, props) => [value, `Views for ${props.payload.fullPath}`]}
                />
                <Bar 
                  dataKey="value" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Revenue Trends */}
        <ChartCard title="Revenue & Sales Trends" icon={<DollarSign className="w-5 h-5" />}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={productSalesTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="_id" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="totalAmount" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
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
    emerald: 'from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600',
    orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600',
    indigo: 'from-indigo-500 to-indigo-600 bg-indigo-50 text-indigo-600',
    pink: 'from-pink-500 to-pink-600 bg-pink-50 text-pink-600',
    cyan: 'from-cyan-500 to-cyan-600 bg-cyan-50 text-cyan-600',
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

function ChartCard({ title, children, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-2 mb-6">
        {icon && (
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default Analytics;