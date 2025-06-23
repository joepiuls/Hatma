import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  PieChart,
  ShoppingBag,
  Folder,
  MessageSquare,
  CreditCard,
  BadgeInfo,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import logo from '../../assets/Logo.png';
import useAuthStore from '../../store/useAuthStore';
const Sidebar = ({isCollapsed, setIsCollapsed}) => {
  const { user } = useAuthStore();

  const navigationItems = [
    { icon: <PieChart size={20} />, label: "Overview", path: "/admin"},
    { icon: <ShoppingBag size={20} />, label: "Products", path: "/admin/products" },
    { icon: <Folder size={20} />, label: "Analytics", path: "/admin/analytics" },
    { icon: <MessageSquare size={20} />, label: "Sales & Finance", path: "/admin/sales" },
    { icon: <CreditCard size={20} />, label: "Forms & Orders", path: "/admin/orders" },
    { icon: <BadgeInfo size={20} />, label: "Information", path: "/admin/info" },
    { icon: <BookOpen size={20} />, label: "Blog", path: "/admin/blog" },
    // { icon: <Users size={20} />, label: "HR", path: "/admin/hr" },
    // { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" }
  ];

  return (
    <div className={`h-screen bg-white shadow-lg flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo/Collapse Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          {!isCollapsed ? (
            <Link to="/" className="flex items-center">
              <img src={logo} alt='Logo'/>
            </Link>
          ) : (
            <div className="bg-gradient-to-r from-indigo-600 to-secondary w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl text-white">
              HB
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:bg-gray-100 p-1 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 mt-4 overflow-y-auto px-2">
        {navigationItems.map((item, index) => {
        const isOverview = item.path === "/admin";
        return (
          <NavLink
            key={index}
            to={item.path}
            end={isOverview} // only apply `end` for Overview
            className={({ isActive }) =>
              `flex items-center p-3 my-1 rounded-xl transition-colors group ${
                isActive
                  ? "bg-indigo-50 text-primary border-l-4 border-blue-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                <div
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-100'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    className: isActive ? 'text-primary' : 'text-gray-600',
                    size: 20
                  })}
                </div>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </div>
            )}
          </NavLink>
        );
      })}
      </nav>

      {/* User Profile */}
      <div className={`p-3 border-t border-gray-200 ${isCollapsed ? 'text-center' : ''}`}>
        <div className="flex items-center">
          <div className="relative">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium">
              H
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          {!isCollapsed && user && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;