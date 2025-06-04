import { Outlet } from 'react-router-dom';
import SideBar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';
import Footer from './Footer';
import Notification from './Notification'; // Import the notification panel

export default function AdminDashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State for notification panel

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Fixed Sidebar */}
      <div className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Pass notification handler to Navbar */}
        <Navbar 
          isCollapsed={isCollapsed} 
          onNotificationClick={() => setIsNotificationOpen(true)} 
        />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
        
        <Footer />
      </div>

      {/* Notification Panel */}
      <Notification 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </div>
  );
}