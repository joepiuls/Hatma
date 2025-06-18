import React, { useEffect, useState, useMemo } from 'react';
import { StatCard, ChartCard, StatusBadge } from '../../components/SalesComponents';
import {
  DollarSign,
  ShoppingCart,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Package,
  MoreHorizontal,
} from 'lucide-react';
import { useOverviewStore } from '../../store/useOverviewStore';
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {OrderDeliveryDropdown, OrderPaymentDropdown} from '../../components/ordersStatusDropdown';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

function Sales() {
  const { salesOverview, fetchSalesOverview, isLoading, error } = useOverviewStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSalesOverview();
      } catch (err) {
        console.error('Failed to fetch sales overview:', err);
      }
    }
    fetchData();
  }, [fetchSalesOverview]);


  const { 
      totalSales,
      productSalesTrends,
      pendingOrders,
      failedPayments,
      salesData,
      products,
      orders} = salesOverview;

const stats = useMemo(() => [
  {
    title: 'Total Revenue',
    value: `₦${(totalSales?.totalRevenue?.value ?? 0).toLocaleString()}`,
    trend: (totalSales?.totalRevenue?.trend ?? '+0.0%').toLocaleString?.() ?? '+0.0%',
    increasing: totalSales?.totalRevenue?.isIncreasing ?? false,
    icon: <DollarSign className="w-6 h-6" />,
    color: 'emerald',
  },
  {
    title: 'Total Orders',
    value: (totalSales?.totalTransactions?.value ?? 0).toLocaleString(),
    trend: (totalSales?.totalTransactions?.trend ?? '+0.0%').toLocaleString?.() ?? '+0.0%',
    increasing: totalSales?.totalTransactions?.isIncreasing ?? false,
    icon: <ShoppingCart className="w-6 h-6" />,
    color: 'blue',
  },
  {
    title: 'Pending Orders',
    value: (pendingOrders ?? 0).toLocaleString(),
    icon: <Clock className="w-6 h-6" />,
    color: 'orange',
  },
  {
    title: 'Failed Payments',
    value: (failedPayments ?? 0).toLocaleString(),
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'red',
  },
], [salesOverview]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        (order.customer ?? '').toLowerCase().includes(s) ||
        (order.product ?? '').toLowerCase().includes(s) ||
        (order.id ?? '').toLowerCase().includes(s);

      const fs = filterStatus.toLowerCase();
      const matchesFilter = fs === 'all'
        || (order.payment ?? '').toLowerCase() === fs
        || (order.delivery ?? '').toLowerCase() === fs;

      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStatus]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, currentPage]);



  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="text-center text-red-600 p-8">
        <p className="text-lg font-semibold">Error loading sales data</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    </div>
  );

  const maxProductValue = products.reduce((max, p) => Math.max(max, p.value ?? 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Sales Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Track your sales performance and revenue insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border hover:shadow-md">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Live Sales</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
        </div>

        {/* Revenue Trend */}
        <ChartCard title="Revenue Trends" icon={<BarChart3 className="w-5 h-5" />}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Monthly Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productSalesTrends || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e0e7ff" strokeDasharray="3 3" />
              <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false}
                tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={value =>
                typeof value === 'number'
                  ? [`₦${value.toLocaleString()}`, 'Revenue']
                  : [value, 'Revenue']
              } contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              }} />
              <Area type="monotone" dataKey="totalAmount" stroke="#3B82F6"
                strokeWidth={3} fill="url(#colorRevenue)"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#3B82F6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales by Category */}
          <ChartCard title="Sales by Category" icon={<PieChartIcon className="w-5 h-5" />}>
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-4 flex-1">
                {salesData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                      <p className="text-xs text-gray-500">₦{(item.value ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ml-8">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={salesData} dataKey="percentage" cx="50%" cy="50%" outerRadius={50} innerRadius={25}>
                      {salesData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartCard>

          {/* Top Selling Products */}
          <ChartCard title="Top Selling Products" icon={<Package className="w-5 h-5" />}>
            <div className="space-y-4">
              {products.map((product, idx) => {
                const barWidth = maxProductValue > 0
                  ? `${(product.value / maxProductValue) * 100}%`
                  : '0%';
                return (
                  <div key={product.id ?? idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg text-white text-sm font-bold"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₦{(product.value ?? 0).toLocaleString()}</p>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length], width: barWidth }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
                <p className="text-sm text-gray-500 mt-1">Manage and track your latest orders</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    aria-label="Search orders"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="successful">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-4 text-left">
                  </th>
                  {['Order', 'Customer', 'Product', 'Date', 'Amount', 'Payment', 'Delivery'].map(col => (
                    <th key={col} className="bg-gray-50 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : paginatedOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                    </td>
                    <td className="px-6 py-4"><span className="text-sm font-medium text-gray-900">{order.id}</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-900">{order.customer}</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-600">{order.product}</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-500">{order.date}</span></td>
                    <td className="px-6 py-4"><span className="text-sm font-semibold text-gray-900">{(order.amount ?? 0).toLocaleString()}</span></td>
                    <td className="px-6 py-4">
                      <OrderPaymentDropdown order={order} />
                    </td>
                    <td className="px-6 py-4">
                      <OrderDeliveryDropdown order={order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50">
            <span className="text-sm text-gray-600">
              Showing {paginatedOrders.length} of {filteredOrders.length} orders
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.ceil(filteredOrders.length / ORDERS_PER_PAGE) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)))}
                disabled={currentPage === Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)}
                className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
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

export default Sales;
