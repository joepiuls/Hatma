import React, { useState } from 'react';
import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';

function Sales() {
  // Stats data
  const stats = [
    { title: 'Total Revenue', value: '7,265', trend: '+11.01%', increasing: true },
    { title: 'Total Orders', value: '3,671', trend: '-0.03%', increasing: false },
    { title: 'Pending orders', value: '15', trend: '', increasing: false },
    { title: 'Failed payments', value: '2', trend: '', increasing: false },
  ];

  const salesData = [
    { category: 'Laptop', percentage: 52.1 },
    { category: 'Accessories', percentage: 22.8 },
    { category: 'Phone', percentage: 13.9 },
    { category: 'Other', percentage: 11.2 },
  ];

  // Products data
  const products = [
    { name: 'Bag', value: 15000 },
    { name: 'game pad', value: 30000 },
    { name: 'lightpen', value: 20000 },
    { name: 'earpiece', value: 25000 },
    { name: 'microphone', value: 12000 },
  ];

  // Orders data
  const orders = [
    { id: '#CM9801', customer: 'Natali Craig', product: 'Meadow Lane Oakland', date: 'Just now', amount: '$15,000', payment: 'Successful', delivery: 'Complete' },
    { id: '#CM9802', customer: 'Kate Morrison', product: 'Larry San Francisco', date: 'A minute ago', amount: '$15,000', payment: 'Successful', delivery: 'Complete' },
    { id: '#CM9803', customer: 'Drew Cano', product: 'Bagwell Avenue Ocala', date: '1 hour ago', amount: '$10,000', payment: 'Pending', delivery: 'Pending' },
    { id: '#CM9804', customer: 'Orlando Diggs', product: 'Washburn Baton Rouge', date: 'Yesterday', amount: '$20,000', payment: 'Pending', delivery: 'Pending' },
    { id: '#CM9805', customer: 'Andi Lane', product: 'Nest Lane Olivette', date: 'Feb 2, 2023', amount: '$13,000', payment: 'Pending', delivery: 'Pending' },
  ];

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle checkbox selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length 
        ? [] 
        : orders.map(order => order.id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="space-x-4">
              <span className="font-medium">Revenue over Time</span>
              <span className="text-gray-400">Orders over time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                <span className="text-sm">New Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                <span className="text-sm">Existing users</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full h-full flex items-end">
                <div 
                  className="w-full bg-black bg-opacity-10 rounded-sm"
                  style={{ height: `${Math.random() * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Total Sales</h3>
              <button className="text-gray-500 hover:text-gray-700">
                Filter
              </button>
            </div>
            <div className="space-y-4">
              {salesData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${index === 0 ? 'black' : index === 1 ? 'blue-400' : index === 2 ? 'green-400' : 'gray-400'}`}></div>
                    <span>{item.category}</span>
                  </div>
                  <span>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Top Selling Product</h3>
              <span className="text-gray-400">Least selling Product</span>
            </div>
            <div className="flex items-end space-x-4 h-64">
              {products.map((product, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-sm ${index === 0 ? 'bg-purple-400' : index === 1 ? 'bg-teal-400' : index === 2 ? 'bg-black' : index === 3 ? 'bg-blue-400' : 'bg-gray-300'}`}
                    style={{ height: `${(product.value / 30000) * 100}%` }}
                  ></div>
                  <span className="mt-2 text-sm text-gray-600">{product.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-medium">Orders made</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Id</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.payment === 'Successful' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.delivery === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.delivery}
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

export default Sales;