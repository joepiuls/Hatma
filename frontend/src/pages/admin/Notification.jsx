import React, { useEffect, useRef } from "react";
import { Bug, User, Radio, ShoppingBag, Star, StarHalf, Bell } from "lucide-react";
import { RiCloseLine } from 'react-icons/ri';
import { useNotificationStore } from "../../store/useNotificationStore";

const Notification = ({ isOpen, onClose }) => {
  const {
    notifications,
    topSellingProducts,
    subscribers,
    stats,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    markMultipleAsRead,
    fetchStats
  } = useNotificationStore();

  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications
      .filter(n => !n.read)
      .map(n => n.id);
      
    if (unreadIds.length > 0) {
      markMultipleAsRead(unreadIds);
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const iconMap = {
    bug: Bug,
    user: User,
    radio: Radio,
    shopping: ShoppingBag,
    bell: Bell
  };

  // Card components
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="px-4 py-3 border-b border-gray-100">
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h3 className="text-base font-medium text-gray-800">
      {children}
    </h3>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`p-2 ${className}`}>
      {children}
    </div>
  );

  const Separator = () => <div className="w-full h-px bg-gray-100 my-2"></div>;

  const Avatar = ({ children, className = "" }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${className}`}>
      {children}
    </div>
  );

  const AvatarFallback = ({ children }) => (
    <span className="font-medium text-sm">{children}</span>
  );

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-amber-500">
            {i < fullStars ? (
              <Star size={14} fill="currentColor" />
            ) : hasHalfStar && i === fullStars ? (
              <StarHalf size={14} fill="currentColor" />
            ) : (
              <Star size={14} />
            )}
          </span>
        ))}
      </div>
    );
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMinutes = Math.floor((now - date) / 60000);
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Notification panel with ref for click detection */}
      <div 
        ref={panelRef}
        className="absolute right-0 top-0 h-screen w-full max-w-sm bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside panel from closing
      >
        {/* Panel header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <RiCloseLine size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-red-100 text-red-600 p-3 rounded-full mb-4">
              <Bug size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Failed to load</h3>
            <p className="text-gray-600 mb-4">{error.message || "Network error"}</p>
            <button 
              onClick={fetchNotifications}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Data display */}
        {!loading && !error && (
          <div className="flex-1 overflow-y-auto p-4 space-y-10">
            {/* Notification Stats */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
                    <span className="text-xs text-gray-600 mt-1">Total</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-2xl font-bold text-gray-800">{stats.unread}</span>
                    <span className="text-xs text-gray-600 mt-1">Unread</span>
                  </div>
                  {stats.byType.map(typeStat => (
                    <div 
                      key={typeStat.type} 
                      className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl font-bold text-gray-800">{typeStat.count}</span>
                      <span className="text-xs text-gray-600 mt-1 capitalize">{typeStat.type}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {/* Notifications Card */}
            {notifications.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Alerts</CardTitle>
                    <span className="text-xs text-gray-500">
                      {notifications.filter(n => !n.read).length} unread
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  {notifications.map((item) => {
                    const Icon = iconMap[item.iconType] || Bell;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                          !item.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => !item.read && markNotificationAsRead(item.id)}
                      >
                        <div className={`p-2 rounded-lg ${item.iconBg}`}>
                          <span className={item.iconColor}>
                            <Icon size={16} />
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatTime(item.timestamp)}</p>
                        </div>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
            
            {/* Top Selling Products Card */}
            {topSellingProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topSellingProducts.map((product, index) => (
                    <div key={product.id} className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 p-2">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                            <ShoppingBag className="text-gray-400" size={20} />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <div className="mt-1">
                            <RatingStars rating={product.rating} />
                          </div>
                          <p className="font-bold text-gray-900 mt-1">{product.price}</p>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Sold: {product.totalSold}</span>
                            <span>{product.revenue}</span>
                          </div>
                        </div>
                      </div>
                      {index < topSellingProducts.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {/* Subscribers Card */}
            {subscribers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {subscribers.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {subscriber.avatarUrl ? (
                          <img 
                            src={subscriber.avatarUrl} 
                            alt={subscriber.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <Avatar className="bg-indigo-100">
                            <AvatarFallback className="text-indigo-800">
                              {subscriber.initials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-800 block">
                            {subscriber.name}
                          </span>
                          <span className="text-xs text-gray-500 block truncate">
                            {subscriber.email}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTime(subscriber.subscribedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Empty state */}
            {!notifications.length && !topSellingProducts.length && !subscribers.length && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                  <Radio size={32} />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No notifications</h3>
                <p className="text-gray-600 max-w-xs">
                  You're all caught up! Check back later for new updates.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;