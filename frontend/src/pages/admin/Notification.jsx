import React from "react";
import { 
  Bug, User, Radio, 
  ShoppingBag, Star, StarHalf 
} from "lucide-react";
import { 
RiCloseLine 
} from 'react-icons/ri';

const Notification = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  // Notification data
  const notifications = [
    { 
      icon: <Bug size={16} />, 
      iconBg: "bg-indigo-100", 
      iconColor: "text-indigo-600",
      title: "Low stock of laptop", 
      time: "Just now" 
    },
    { 
      icon: <User size={16} />, 
      iconBg: "bg-blue-100", 
      iconColor: "text-blue-600",
      title: "New user registered", 
      time: "59 minutes ago" 
    },
    { 
      icon: <Bug size={16} />, 
      iconBg: "bg-indigo-100", 
      iconColor: "text-indigo-600",
      title: "John Doe requested a talent", 
      time: "12 hours ago" 
    },
    { 
      icon: <Radio size={16} />, 
      iconBg: "bg-blue-100", 
      iconColor: "text-blue-600",
      title: "Andi Lane subscribed to you", 
      time: "Today, 11:59 AM" 
    },
  ];

  // Top selling products
  const topSellingProducts = [
    { name: "Gaming Pad Pro", price: "$87.99", rating: 4.5 },
    { name: "Wireless Headset", price: "$129.99", rating: 4.8 },
    { name: "Mechanical Keyboard", price: "$74.50", rating: 4.2 },
  ];

  // Subscribers
  const subscribers = [
    { name: "Natali Craig", initials: "NC" },
    { name: "Drew Cano", initials: "DC" },
    { name: "Andi Lane", initials: "AL" },
    { name: "Koray Okumus", initials: "KO" },
    { name: "Kate Morrison", initials: "KM" },
    { name: "Melody Macy", initials: "MM" },
  ];


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

  const Separator = () => (
    <div className="w-full h-px bg-gray-100 my-2"></div>
  );

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

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Notification panel */}
      <div className="absolute right-0 top-0 h-screen w-full max-w-sm bg-white shadow-xl flex flex-col">
        {/* Panel header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <RiCloseLine size={20} className="text-gray-600" />
          </button>
        </div>
        
        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-10">
          {/* Notifications Card */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {notifications.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${item.iconBg}`}>
                    <span className={item.iconColor}>{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Selling Products Card */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-2">
                    <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                      <ShoppingBag className="text-gray-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <div className="mt-1">
                        <RatingStars rating={product.rating} />
                      </div>
                      <p className="font-bold text-gray-900 mt-1">{product.price}</p>
                    </div>
                  </div>
                  {index < topSellingProducts.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Subscribers Card */}
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subscribers.map((subscriber, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="bg-indigo-100">
                      <AvatarFallback className="text-indigo-800">
                        {subscriber.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-800">
                      {subscriber.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notification
