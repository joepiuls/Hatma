import { RiSearchLine, RiHistoryLine, RiNotification3Line } from 'react-icons/ri';

const Navbar = ({ isCollapsed, onNotificationClick }) => {
  return (
    <div className="sticky top-0 z-20 w-full  bg-white shadow-sm transition-all">
      <header>
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b">
          <div className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-base">
            <h1 className="text-gray-500">Dashboards</h1>
            <span className="text-gray-400">/</span>
            <h2 className="font-medium">Home</h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 w-36 sm:w-48"
              />
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <RiHistoryLine size={20} className="text-gray-600" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg relative"
              onClick={onNotificationClick}
            >
              <RiNotification3Line size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;