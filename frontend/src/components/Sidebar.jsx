import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaUserCircle, 
  FaShoppingCart, 
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { MdLogout, MdClose } from "react-icons/md";
import logo from "../assets/Logo.png";
import useAuthStore from "../store/useAuthStore";

const MobileSidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [approachOpen, setApproachOpen] = useState(false);

  const handleLogOut = async () => {
    await logout();
    onClose();
    toast.info('You have logged out');
  };

  const servicesLinks = [
    { path: "/services/hatmaprime", name: "Hatma Prime" },
    { path: "/services/branddevelopment", name: "Brand Development" },
    { path: "/services/digitalmarketing", name: "Digital Marketing" },
    { path: "/services/cac", name: "CAC Registration" },
    { path: "/services/brading", name: "Branding" }
  ];

  const approachLinks = [
    { path: "/blog", name: "Blog" },
    { path: "/faq", name: "FAQ & Help" },
    { path: "/pricing", name: "Pricing" },
    { path: "/contact", name: "Contact Us" }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-xl w-64 transform transition-transform ease-in-out duration-300 z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"  // Changed from left to right
        } md:hidden`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          {/* Regular Links */}
          <Link 
            to="/about" 
            onClick={onClose}
            className="block px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            About
          </Link>

          {/* Services Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span>Services</span>
              {servicesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {servicesOpen && (
              <div className="ml-4 space-y-1 border-l border-gray-200 pl-4">
                {servicesLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Shop Link */}
          <Link
            to="/shop"
            onClick={onClose}
            className="block px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Shop
          </Link>

          {/* Our Work Link */}
          <Link
            to="/work"
            onClick={onClose}
            className="block px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Our Work
          </Link>

          {/* Approach Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setApproachOpen(!approachOpen)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span>Approach</span>
              {approachOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {approachOpen && (
              <div className="ml-4 space-y-1 border-l border-gray-200 pl-4">
                {approachLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;