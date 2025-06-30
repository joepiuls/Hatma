import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/Logo.png";
import useAuthStore from "../store/useAuthStore";
import { FaBars } from "react-icons/fa";
import {BsCart3} from 'react-icons/bs'
import { MdLogout } from "react-icons/md";
import { toast } from "sonner";
import MobileSidebar from "../components/Sidebar"; 
import { useCartStore } from "../store/useCartStore";

const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [approachOpen, setApproachOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile sidebar state


  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let timeoutId;

  const handleLogOut = async () => {
    toast.success('You have LoggedOut');
    await logout();
  };

  const handleMouseEnter = (setState) => {
    clearTimeout(timeoutId);
    setState(true);
  };

  const handleMouseLeave = (setState) => {
    timeoutId = setTimeout(() => {
      setState(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown") && !event.target.closest(".user-menu")) {
        setServicesOpen(false);
        setApproachOpen(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white relative z-20 text-primary px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to={"/"}>
            <img src='/logo.png' alt="Logo" className="w-[250px] h-auto" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-lg">
          <li><Link to="/about" className="hover:text-secondary">About</Link></li>
          
          {/* Services Dropdown */}
          <li className="relative dropdown"
              onMouseEnter={() => handleMouseEnter(setServicesOpen)}
              onMouseLeave={() => handleMouseLeave(setServicesOpen)}>
            <span className="hover:text-secondary cursor-pointer">Services</span>
            {servicesOpen && (
              <ul className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-48 py-2">
                <li><Link to="/services/hatma-prime" className="block px-4 py-2 hover:bg-gray-100">Hatma Prime</Link></li>
                <li><Link to="/services/brand-development" className="block px-4 py-2 hover:bg-gray-100">Brand Development</Link></li>
                <li><Link to="/services/digital-marketing" className="block px-4 py-2 hover:bg-gray-100">Digital Marketing</Link></li>
                <li><Link to="/services/cac-registration" className="block px-4 py-2 hover:bg-gray-100">CAC Registration</Link></li>
                <li><Link to="/services/branding" className="block px-4 py-2 hover:bg-gray-100">Branding</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/shop" className="hover:text-secondary">Shop</Link></li>
          <li><Link to="/work" className="hover:text-secondary">Our Work</Link></li>
          
          <li className="relative dropdown"
              onMouseEnter={() => handleMouseEnter(setApproachOpen)}
              onMouseLeave={() => handleMouseLeave(setApproachOpen)}>
            <span className="hover:text-secondary cursor-pointer">Approach</span>
            {approachOpen && (
              <ul className="absolute left-0 mt-2 bg-white shadow-md rounded-md w-48 py-2">
                <li><Link to="/blog" className="block px-4 py-2 hover:bg-gray-100">Blog</Link></li>
                <li><Link to="/faq" className="block px-4 py-2 hover:bg-gray-100">FAQ & Help</Link></li>
                <li><Link to="/pricing" className="block px-4 py-2 hover:bg-gray-100">Pricing</Link></li>
                <li><Link to="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact Us</Link></li>
              </ul>
            )}
          </li>
        </ul>

        {/* Right Section */}
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-6 relative user-menu">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center 
              justify-center text-white font-semibold">
                {user?.name ? (
                  user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                ) : (
                  'U'
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white border rounded shadow-md w-40 text-sm">
                <Link to='/profile' className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                {
                  user.isAdmin===true && <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</Link>
                }
                <button
                  onClick={handleLogOut}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600"
                >
                  <MdLogout />
                  <span>Logout</span>
                </button>
              </div>
            )}

           <Link to="/cart" className="relative inline-block">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md">
                <BsCart3 className="text-primary text-2xl" />
              </div>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-slate-200 text-black text-[12px] font-semibold rounded-full px-2 py-[2px] shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        ) : (
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link to="/signup">
            <button className="bg-secondary text-black px-2 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-lg hover:bg-warning transition">
              Sign Up
            </button>
          </Link>
          <Link 
            to="/login" 
            className="text-primary hover:text-secondary text-sm md:text-base"
          >
            Login
          </Link>
        </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileOpen(true)}
        >
          <FaBars className="w-6 h-6" />
        </button>

        {/* Mobile Sidebar Component */}
        <MobileSidebar
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navbar;