import React from "react";
import { 
  FaArrowUp, FaArrowDown, FaUser, FaShoppingBag, 
  FaCalendar, FaEllipsisV, FaClipboard, FaCircle 
} from "react-icons/fa";

const Overview = () => {
  // Stats cards data
  const statsCards = [
    { title: "Views", value: "7,265", change: "+11.01%", isPositive: true, bgColor: "bg-indigo-100" },
    { title: "Visits", value: "3,671", change: "-0.03%", isPositive: false, bgColor: "bg-blue-100" },
    { title: "New Orders", value: "156", change: "+15.03%", isPositive: true, bgColor: "bg-indigo-100" },
    { title: "Subscribers", value: "2,318", change: "+6.08%", isPositive: true, bgColor: "bg-blue-100" },
  ];

  // Services data
  const servicesData = [
    { name: "Hatma Prime", value: 84, color: "bg-indigo-500" },
    { name: "Design", value: 147, color: "bg-teal-400" },
    { name: "Cac Reg", value: 105, color: "bg-gray-800" },
    { name: "Branding", value: 168, color: "bg-blue-400" },
    { name: "Marketing", value: 63, color: "bg-blue-300" },
    { name: "Other", value: 126, color: "bg-green-400" },
  ];

  // Sales data
  const salesData = [
    { category: "Laptop", percentage: "52.1%", color: "bg-indigo-500" },
    { category: "Accessories", percentage: "22.8%", color: "bg-blue-400" },
    { category: "Phone", percentage: "13.9%", color: "bg-teal-400" },
    { category: "Other", percentage: "11.2%", color: "bg-gray-400" },
  ];

  // Form submissions data
  const formSubmissions = [
    { id: 1, name: "Natali Craig", phoneNo: "#CM9801", email: "Meadow Lane Oakland", date: "Just now", type: "Landing Page", status: "Complete" },
    { id: 2, name: "Kate Morrison", phoneNo: "#CM9802", email: "Larry San Francisco", date: "A minute ago", type: "CRM Admin pages", status: "Complete" },
    { id: 3, name: "Drew Cano", phoneNo: "#CM9803", email: "Bagwell Avenue Ocala", date: "1 hour ago", type: "Client Project", status: "Pending" },
    { id: 4, name: "Orlando Diggs", phoneNo: "#CM9804", email: "Washburn Baton Rouge", date: "Yesterday", type: "Admin Dashboard", status: "Pending" },
    { id: 5, name: "Andi Lane", phoneNo: "#CM9805", email: "Nest Lane Olivette", date: "Feb 2, 2023", type: "App Landing Page", status: "In Progress", highlighted: true },
    { id: 6, name: "Natali Craig", phoneNo: "#CM9801", email: "Meadow Lane Oakland", date: "Just now", type: "Landing Page", status: "In Progress" },
    { id: 7, name: "Kate Morrison", phoneNo: "#CM9802", email: "Larry San Francisco", date: "A minute ago", type: "CRM Admin pages", status: "In Progress" },
    { id: 8, name: "Drew Cano", phoneNo: "#CM9803", email: "Bagwell Avenue Ocala", date: "1 hour ago", type: "Client Project", status: "In Progress" },
    { id: 9, name: "Orlando Diggs", phoneNo: "#CM9804", email: "Washburn Baton Rouge", date: "Yesterday", type: "Admin Dashboard", status: "In Progress" },
    { id: 10, name: "Andi Lane", phoneNo: "#CM9805", email: "Nest Lane Olivette", date: "Feb 2, 2023", type: "App Landing Page", status: "In Progress" },
  ];

  return (
    <div className="flex flex-wrap w-full items-start gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {statsCards.map((card, index) => (
          <div key={index} className={`rounded-xl shadow-md p-6 ${card.bgColor}`}>
            <h3 className="text-sm font-normal text-gray-700">{card.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${card.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change}
                </span>
                {card.isPositive ? 
                  <FaArrowUp className="text-green-600 text-xs" /> : 
                  <FaArrowDown className="text-red-600 text-xs" />
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Total Users Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-900">Total Users</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span>visits over time</span>
            <span>Bounce Rate</span>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <FaCircle className="text-blue-500 text-xs" />
              <span>New Users</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCircle className="text-indigo-500 text-xs" />
              <span>Existing users</span>
            </div>
          </div>
          
          {/* Chart */}
          <div className="mt-4 h-64 flex items-end gap-4 justify-between">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="flex items-end justify-center gap-1 w-full">
                  <div className="w-4 bg-blue-400 rounded-t" style={{ height: `${30 + Math.random() * 70}%` }}></div>
                  <div className="w-4 bg-indigo-500 rounded-t" style={{ height: `${40 + Math.random() * 60}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services Requested Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-900">Services requested</h2>
          
          {/* Bar Chart */}
          <div className="mt-4 h-48 flex items-end gap-4 justify-between">
            {servicesData.map((service, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-8 ${service.color} rounded-t`} 
                  style={{ height: `${service.value / 2}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Services Requested Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-900">Services requested</h2>
          
          {/* Bar Chart */}
          <div className="mt-4 h-48 flex items-end gap-4 justify-between">
            {servicesData.map((service, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-8 ${service.color} rounded-t`} 
                  style={{ height: `${service.value / 2}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{service.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-900">Total Sales</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
            {/* Pie Chart */}
            <div className="relative w-40 h-40 rounded-full bg-gray-200 border-8 border-indigo-500 overflow-hidden">
              <div className="absolute inset-0 bg-blue-500" style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%)" }}></div>
              <div className="absolute inset-0 bg-teal-400" style={{ clipPath: "polygon(50% 50%, 100% 100%, 0 100%)" }}></div>
              <div className="absolute inset-0 bg-gray-400" style={{ clipPath: "polygon(50% 50%, 0 100%, 0 0)" }}></div>
            </div>

            <div className="flex-1">
              {salesData.map((item, i) => (
                <div key={i} className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                    <span className="text-sm text-gray-700">{item.category}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forms Submitted Table */}
      <div className="w-full bg-white rounded-xl shadow-md p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Forms submitted</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formSubmissions.map((sub) => (
                <tr key={sub.id} className={sub.highlighted ? "bg-gray-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-800">{sub.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{sub.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.phoneNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{sub.email}</span>
                      {sub.highlighted && <FaClipboard className="ml-1 text-gray-500 text-sm" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendar className="text-gray-500 text-sm mr-1" />
                      <span className="text-sm text-gray-900">{sub.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'Complete' ? 'bg-green-100 text-green-800' : 
                      sub.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      <FaCircle className={`mr-1 text-xs ${
                        sub.status === 'Complete' ? 'text-green-500' : 
                        sub.status === 'Pending' ? 'text-yellow-500' : 
                        'text-blue-500'
                      }`} />
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {sub.highlighted && (
                      <button className="text-gray-500 hover:text-gray-700">
                        <FaEllipsisV />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <FaArrowUp className="transform rotate-90 h-4 w-4" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  4
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  5
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <FaArrowUp className="transform -rotate-90 h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;