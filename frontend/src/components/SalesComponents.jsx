import {ArrowUpRight, ArrowDownRight} from 'lucide-react';

function StatCard({ title, value, trend, increasing, icon, color }) {
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600',
    blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
    orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600',
    red: 'from-red-500 to-red-600 bg-red-50 text-red-600',
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

function StatusBadge({ status, type }) {
  const getStatusStyle = (status, type) => {
    if (type === 'payment') {
      switch (status.toLowerCase()) {
        case 'successful':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'failed':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      switch (status.toLowerCase()) {
        case 'complete':
        case 'delivered':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'in transit':
        case 'processing':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(status, type)}`}>
      {status}
    </span>
  );
}
export { StatCard, ChartCard, StatusBadge };