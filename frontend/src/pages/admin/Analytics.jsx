import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function Analytics() {
  // Stats data
  const stats = [
    { title: 'Total visits', value: '7,265', trend: '+11.01%', increasing: true },
    { title: 'Average Session', value: '3.67', suffix: 'hours', trend: '', increasing: false },
    { title: 'Growth', value: '15%', trend: '', increasing: true },
    { title: 'Subscribers', value: '2,318', trend: '+6.08%', increasing: true },
  ];

  // Monthly data for the line chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  // Services data
  const services = [
    { name: 'Hatma Prime', value: 15000 },
    { name: 'Design', value: 28000 },
    { name: 'Cac Reg', value: 20000 },
    { name: 'Branding', value: 30000 },
    { name: 'Marketing', value: 12000 },
    { name: 'Other', value: 25000 },
  ];

  // Conversion data
  const conversionData = [
    { label: 'Contact forms', percentage: 52.1 },
    { label: 'Whatsapp Link', percentage: 22.8 },
    { label: 'Newsletters', percentage: 13.9 },
    { label: 'Other', percentage: 11.2 },
  ];

  // Traffic source data
  const trafficSource = [
    { source: 'Google search', percentage: 52.1 },
    { source: 'Social Media', percentage: 22.8 },
    { source: 'Email', percentage: 13.9 },
    { source: 'Other', percentage: 11.2 },
  ];

  // Top pages data
  const topPages = [
    { name: 'HomePage', value: 15000 },
    { name: 'Shop', value: 28000 },
    { name: 'Portfolio', value: 20000 },
    { name: 'Blog', value: 30000 },
    { name: 'Services', value: 25000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl font-semibold">{stat.value}</span>
                  {stat.suffix && <span className="ml-1 text-sm text-gray-500">{stat.suffix}</span>}
                </div>
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

        {/* Line Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="space-x-4">
              <button className="font-medium">Total Users</button>
              <button className="text-gray-400">visits over time</button>
              <button className="text-gray-400">Bounce Rate</button>
            </div>
            <div className="flex items-center space-x-4">
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
          <div className="h-64 relative">
            {/* Line chart visualization */}
            <div className="absolute inset-0 flex items-end">
              {months.map((month, index) => (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div className="w-full h-full relative">
                    <div 
                      className="absolute bottom-0 w-full bg-black bg-opacity-10 rounded-sm transition-all duration-300"
                      style={{ 
                        height: `${Math.random() * 100}%`,
                        opacity: 0.1 
                      }}
                    ></div>
                    <div 
                      className="absolute bottom-0 w-full bg-gray-300 bg-opacity-10 rounded-sm transition-all duration-300"
                      style={{ 
                        height: `${Math.random() * 100}%`,
                        opacity: 0.1 
                      }}
                    ></div>
                  </div>
                  <span className="mt-2 text-sm text-gray-500">{month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-6">Services requested</h3>
            <div className="h-64 flex items-end space-x-4">
              {services.map((service, index) => (
                <div key={service.name} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-sm ${
                      index === 2 ? 'bg-black' : 
                      index === 3 ? 'bg-blue-400' :
                      index === 4 ? 'bg-gray-300' :
                      'bg-green-400'
                    }`}
                    style={{ height: `${(service.value / 30000) * 100}%` }}
                  ></div>
                  <span className="mt-2 text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '100%' }}>
                    {service.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Donut Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-6">Conversion</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                {conversionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-black' : 
                        index === 1 ? 'bg-blue-400' :
                        index === 2 ? 'bg-green-400' :
                        'bg-gray-300'
                      } mr-2`}></div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="ml-4 text-sm">{item.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="w-32 h-32 rounded-full border-8 border-black border-opacity-20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-semibold">52.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Source */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-6">Top Traffic source</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                {trafficSource.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-black' : 
                        index === 1 ? 'bg-blue-400' :
                        index === 2 ? 'bg-green-400' :
                        'bg-gray-300'
                      } mr-2`}></div>
                      <span className="text-sm">{item.source}</span>
                    </div>
                    <span className="ml-4 text-sm">{item.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="w-32 h-32 rounded-full border-8 border-black border-opacity-20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-semibold">52.1%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Pages */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-6">Top performing Pages</h3>
            <div className="h-64 flex items-end space-x-4">
              {topPages.map((page, index) => (
                <div key={page.name} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-sm ${
                      index === 2 ? 'bg-black' : 
                      index === 3 ? 'bg-blue-400' :
                      index === 4 ? 'bg-gray-300' :
                      'bg-green-400'
                    }`}
                    style={{ height: `${(page.value / 30000) * 100}%` }}
                  ></div>
                  <span className="mt-2 text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '100%' }}>
                    {page.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;