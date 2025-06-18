import React, { useEffect } from "react";
import { useOverviewStore } from "../../store/useOverviewStore";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { 
  Users, 
  MousePointer, 
  ShoppingCart, 
  Eye, 
  Package, 
  FileText, 
  DollarSign, 
  Activity,
  Globe,
  TrendingUp,
  TrendingDown,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from "lucide-react";

export default function Overview() {
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
    totalTransactions,
    trafficSources,
    totalRevenue,
    totalUser,
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
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <div className="text-center text-red-600 p-8">
          <p className="text-lg font-semibold">Error loading dashboard</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">Monitor your business performance at a glance</p>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Data</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <StatCard 
            label="Total Sessions" 
            value={sessions?.value?.toLocaleString() || '0'} 
            icon={<Activity className="w-6 h-6" />}
            color="blue"
            trend={Number(sessions?.trend) || 0}
          />
          <StatCard 
            label="Conversions" 
            value={conversions?.value?.toLocaleString() || '0'} 
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            trend={Number(conversions?.trend) || 0}
          />
          <StatCard 
            label="Service Requests" 
            value={serviceRequests?.value?.toLocaleString() || '0'} 
            icon={<MousePointer className="w-6 h-6" />}
            color="purple"
            trend={Number(serviceRequests?.trend) || 0}
          />
          <StatCard 
            label="Page Views" 
            value={pageViews?.value?.toLocaleString() || '0'} 
            icon={<Eye className="w-6 h-6" />}
            color="indigo"
            trend={Number(pageViews?.trend) || 0}
          />
          <StatCard 
            label="Product Views" 
            value={totalProductViews?.value?.toLocaleString() || '0'} 
            icon={<Package className="w-6 h-6" />}
            color="orange"
            trend={Number(totalProductViews?.trend) || 0}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard 
            label="Total Products" 
            value={totalProducts || '0'} 
            icon={<Package className="w-5 h-5" />}
            color="gray"
            compact
          />
          <StatCard 
            label="Total Blogs" 
            value={totalBlogs || '0'} 
            icon={<FileText className="w-5 h-5" />}
            color="gray"
            compact
          />
          <StatCard 
            label="Total Users" 
            value={totalUser} 
            icon={<Users className="w-5 h-5" />}
            color="gray"
            compact
          />
          <StatCard 
            label="Monthly Total Revenue" 
            value={`₦${totalSales?.totalRevenue?.value?.toLocaleString() || '0'}`} 
            icon={<DollarSign className="w-5 h-5" />}
            color="emerald"
            compact
          />

          <StatCard 
            label="Overall Total Revenue" 
            value={`₦${totalRevenue.toLocaleString() || '0'}`} 
            icon={<DollarSign className="w-5 h-5" />}
            color="emerald"
            compact
          />

          <StatCard 
            label="Monthly Transactions" 
            value={totalSales?.totalTransactions?.value?.toLocaleString() || '0'} 
            icon={<ShoppingCart className="w-5 h-5" />}
            color="gray"
            compact
          />
           <StatCard 
            label="Total Transactions" 
            value={totalTransactions?.toLocaleString() || '0'} 
            icon={<ShoppingCart className="w-5 h-5" />}
            color="gray"
            compact
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ChartSection 
            title="Blog View Trends" 
            data={blogViewTrends || []} 
            dataKey="views"
            color="#3B82F6"
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <ChartSection 
            title="Product Sales Trends" 
            data={productSalesTrends || []} 
            dataKey="totalAmount"
            color="#10B981"
            icon={<TrendingUp className="w-5 h-5" />}
            prefix="₦"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ChartSection 
            title="User Registrations Over Time" 
            data={userStats || []} 
            dataKey="count"
            color="#8B5CF6"
            icon={<Users className="w-5 h-5" />}
            chartType="area"
          />
          
          {/* Traffic Sources & Top Pages */}
          <div className="grid grid-cols-1 gap-6">
            <Section title="Top Traffic Sources" icon={<Globe className="w-5 h-5" />}>
              <div className="space-y-3">
                {trafficSources?.map((src, index) => (
                  <div key={src._id} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getSourceColor(index)}`}></div>
                      <span className="font-medium text-gray-900">{src._id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-900">{src.count.toLocaleString()}</span>
                      <p className="text-xs text-gray-500">visits</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Top Pages" icon={<Eye className="w-5 h-5" />}>
              <div className="space-y-3">
                {topPages?.map((page, index) => (
                  <div key={page._id} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${getPageColor(index)}`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 font-mono text-sm">{page._id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-900">{page.count.toLocaleString()}</span>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {/* Most & Least Viewed */}
        <Section title="Performance Insights" icon={<Crown className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InsightCard
              title="Most Viewed Product"
              name={mostViewedProduct?.name || "N/A"}
              value={`${mostViewedProduct?.views || 0} views`}
              type="product"
              isTop={true}
            />
            <InsightCard
              title="Least Viewed Product"
              name={leastViewedProduct?.name || "N/A"}
              value={`${leastViewedProduct?.views || 0} views`}
              type="product"
              isTop={false}
            />
            <InsightCard
              title="Most Viewed Blog"
              name={mostViewedBlog?.title || "N/A"}
              value={`${mostViewedBlog?.views || 0} views`}
              type="blog"
              isTop={true}
            />
            <InsightCard
              title="Least Viewed Blog"
              name={leastViewedBlog?.title || "N/A"}
              value={`${leastViewedBlog?.views || 0} views`}
              type="blog"
              isTop={false}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

// Utility Components



function StatCard({ label, value, icon, color, trend, compact }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
    green: 'from-green-500 to-green-600 bg-green-50 text-green-600',
    purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600',
    indigo: 'from-indigo-500 to-indigo-600 bg-indigo-50 text-indigo-600',
    orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600',
    emerald: 'from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600',
    gray: 'from-gray-500 to-gray-600 bg-gray-50 text-gray-600',
  };

  const bgClass = colorClasses[color] || colorClasses.gray;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden">
      <div className={`p-${compact ? '4' : '6'} relative`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-${compact ? 'xs' : 'sm'} font-medium text-gray-600 mb-1`}>{label}</p>
            <p className={`text-${compact ? 'xl' : '2xl'} font-bold text-gray-900 mb-2`}>{value}</p>
            {trend !== undefined && !compact && (
              <div className="flex items-center space-x-1">
                {trend > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(trend)}%
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-${compact ? '2' : '3'} rounded-xl ${bgClass.split(' ')[2]} ${bgClass.split(' ')[3]} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}


function Section({ title, children, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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


function ChartSection({ title, data, dataKey, color = "#3B82F6", icon, prefix, chartType = 'line' }) {
  const formatValue = (value) => {
    if (prefix) {
      return `${prefix}${value?.toLocaleString()}`;
    }
    return value?.toLocaleString();
  };

  return (
    <Section title={title} icon={icon}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
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
                tickFormatter={formatValue}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [formatValue(value), title]}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={3}
                fill={`url(#color-${dataKey})`}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                tickFormatter={formatValue}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [formatValue(value), title]}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Section>
  );
}


function InsightCard({ title, name, value, type, isTop }) {
  const Icon = type === 'product' ? Package : FileText;
  const colorClass = isTop ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50';
  const trendIcon = isTop ? TrendingUp : TrendingDown;
  const TrendIcon = trendIcon;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`p-1 rounded-full ${colorClass}`}>
          <TrendIcon className="w-4 h-4" />
        </div>
      </div>
      <h4 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h4>
      <p className="text-gray-800 font-medium mb-1 line-clamp-1" title={name}>{name}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Helper functions
function getSourceColor(index) {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
  return colors[index % colors.length];
}

function getPageColor(index) {
  const colors = ['bg-gradient-to-r from-blue-500 to-blue-600', 'bg-gradient-to-r from-green-500 to-green-600', 'bg-gradient-to-r from-purple-500 to-purple-600', 'bg-gradient-to-r from-orange-500 to-orange-600'];
  return colors[index % colors.length];
}