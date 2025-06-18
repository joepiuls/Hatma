import React, { useState, useEffect, useRef } from "react";
import { useProductStore } from "../store/useProductStore";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import EmailSubscription from "../components/EmailSubscription";
import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";
import useSubmitStore from "../store/useSubmitStore";
import { Loader, Search, Filter, ChevronDown, Star, ShoppingCart, Plus } from "lucide-react";
import { trackEvent } from "../utils/trackEvent";

// Brand colors
const colors = {
  primary: "#170E3D",
  secondary: "#F3AB14",
  dark: "#1A2E62",
  light: "#3DD98D",
  info: "#2F80ED",
  success: "#27AE60",
  warning: "#E2B93B",
  error: "#EB5757",
  black: "#030712",
  white: "#FFFFFF",
  gray1: "#282424",
  gray2: "#6D6464",
  gray3: "#D4D4D4",
  gray4: "#BDBDBD",
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl overflow-hidden border border-gray-200 bg-white">
    <div className="bg-gray-200 h-60 w-full" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

const debounceTimeout = 300;

const Shop = () => {
  const { products, searchProducts, clearSearch, searchResults, loadProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { submitProductRequest, loading } = useSubmitStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const debounceRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);


  console.log(searchTerm);
  
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (searchTerm) {
        searchProducts(searchTerm);
      } else {
        clearSearch();
      }
    }, debounceTimeout);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, searchProducts, clearSearch]);

  const filteredProducts = (searchTerm ? searchResults : products).filter((product) => {
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    const matchesNew = !showNewArrivals || product.isFeatured;
    return matchesCategory && matchesNew;
  });

  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const onSubmit = async (data) => {
    try {
      await submitProductRequest(data);
      toast.success("Request submitted successfully!");
      trackEvent("service_request");
      reset();
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ backgroundColor: colors.gray3 }}>
      {/* Hero Section */}
      <section 
        className="relative py-16 md:py-24 overflow-hidden"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
            style={{ backgroundColor: colors.info }}
          ></div>
          <div 
            className="absolute top-0 right-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
            style={{ backgroundColor: colors.dark }}
          ></div>
          <div 
            className="absolute bottom-0 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
            style={{ backgroundColor: colors.info }}
          ></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold leading-tight text-white"
            >
              Discover <span style={{ color: colors.secondary }}>Premium Tech</span> for Modern Living
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl max-w-xl"
              style={{ color: colors.gray3 }}
            >
              Explore cutting-edge gadgets curated to elevate your digital experience. Premium quality, innovative design.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/products" 
                className="px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: colors.primary
                }}
              >
                Explore Collection
              </Link>
              <button 
                className="border-2 px-8 py-3.5 rounded-xl font-semibold transition-all"
                style={{ 
                  borderColor: colors.gray3,
                  color: colors.white,
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                New Arrivals
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div 
              className="absolute -top-6 -right-6 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-30"
              style={{ backgroundColor: colors.secondary }}
            ></div>
            <img
              src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
              alt="Tech gadgets"
              className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-2xl"
              style={{ border: `8px solid ${colors.dark}` }}
            />
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl md:text-4xl font-bold"
              style={{ color: colors.primary }}
            >
              Featured Products
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mt-3"
              style={{ color: colors.gray2 }}
            >
              Handpicked selection of premium tech items
            </motion.p>
          </div>

          {/* Enhanced Filter Bar */}
          <motion.div 
            className="flex flex-wrap items-center justify-between gap-4 mb-10 p-5 rounded-2xl shadow-sm"
            style={{ 
              backgroundColor: colors.white,
              border: `1px solid ${colors.gray3}`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative w-full md:w-auto flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.gray2 }}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl shadow-sm focus:outline-none"
                style={{ 
                  border: `1px solid ${colors.gray3}`,
                  backgroundColor: colors.white,
                }}
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm text-gray-700 transition-colors"
                  style={{ 
                    border: `1px solid ${colors.gray3}`,
                    backgroundColor: colors.white,
                  }}
                >
                  <Filter size={18} />
                  <span>Filters</span>
                  <ChevronDown size={18} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-lg p-4 z-10"
                    style={{ 
                      backgroundColor: colors.white,
                      border: `1px solid ${colors.gray3}`,
                    }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.gray1 }}>Category</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg focus:outline-none"
                        style={{ 
                          border: `1px solid ${colors.gray3}`,
                          backgroundColor: colors.white,
                        }}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="newArrivals"
                        checked={showNewArrivals}
                        onChange={(e) => setShowNewArrivals(e.target.checked)}
                        style={{ 
                          accentColor: colors.secondary,
                        }}
                      />
                      <label htmlFor="newArrivals" className="text-sm" style={{ color: colors.gray1 }}>
                        New Arrivals
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length === 0
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : currentProducts.map((product) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ translateY: -8 }}
                    key={product._id}
                    className="rounded-2xl shadow-sm hover:shadow-md overflow-hidden transition-all duration-300"
                    style={{ 
                      backgroundColor: colors.white,
                      border: `1px solid ${colors.gray3}`,
                    }}
                  >
                    <Link to={`/products/${product._id}`} className="block">
                      <div className="relative">
                        <img
                          src={product.images}
                          alt={product.name}
                          className="w-full h-60 object-cover"
                        />
                        {product.isFeatured && (
                          <div 
                            className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            NEW
                          </div>
                        )}
                        <div 
                          className="absolute bottom-3 left-3 flex items-center px-2 py-1 rounded-full"
                          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                        >
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs ml-1 text-white">4.8</span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link to={`/products/${product._id}`}>
                            <h3 
                              className="text-lg font-semibold hover:text-blue-600 transition-colors"
                              style={{ color: colors.primary }}
                            >
                              {product.name}
                            </h3>
                          </Link>
                          <span className="text-xs" style={{ color: colors.gray2 }}>
                            {product.category}
                          </span>
                        </div>
                        <span 
                          className="text-lg font-bold"
                          style={{ color: colors.primary }}
                        >
                          ${product.price}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product)}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-medium"
                        style={{ 
                          backgroundColor: colors.secondary,
                          color: colors.primary
                        }}
                      >
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16">
              <div 
                className="flex items-center gap-2 p-2 rounded-xl shadow-sm"
                style={{ 
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray3}`,
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      currentPage === i + 1
                        ? 'text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{ 
                      backgroundColor: currentPage === i + 1 ? colors.secondary : 'transparent',
                    }}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Request Section */}
      <section className="py-20" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div 
                className="md:w-2/5 p-8 flex flex-col justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-3">Can't find what you need?</h3>
                  <p className="mb-6" style={{ color: colors.gray3 }}>
                    We'll source premium tech products tailored to your specific requirements.
                  </p>
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      <Plus className="text-white" />
                    </div>
                    <p className="text-sm">Personalized recommendations</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      <Plus className="text-white" />
                    </div>
                    <p className="text-sm">Priority access to new arrivals</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="md:w-3/5 p-8"
                style={{ backgroundColor: colors.white }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
                  Request an Item
                </h3>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.gray1 }}>Email</label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      className="w-full px-4 py-3 rounded-xl focus:outline-none"
                      placeholder="your@email.com"
                      style={{ 
                        border: `1px solid ${colors.gray3}`,
                        backgroundColor: colors.white,
                      }}
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.gray1 }}>Full Name</label>
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      className="w-full px-4 py-3 rounded-xl focus:outline-none"
                      placeholder="John Doe"
                      style={{ 
                        border: `1px solid ${colors.gray3}`,
                        backgroundColor: colors.white,
                      }}
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.gray1 }}>Item Description</label>
                    <textarea
                      {...register("description", { required: true })}
                      className="w-full px-4 py-3 rounded-xl focus:outline-none h-32"
                      placeholder="Describe the item you're looking for..."
                      style={{ 
                        border: `1px solid ${colors.gray3}`,
                        backgroundColor: colors.white,
                      }}
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.gray1 }}>Attachment URL (optional)</label>
                    <input
                      type="url"
                      {...register("attachment")}
                      className="w-full px-4 py-3 rounded-xl focus:outline-none"
                      placeholder="Paste image URL here..."
                      style={{ 
                        border: `1px solid ${colors.gray3}`,
                        backgroundColor: colors.white,
                      }}
                    />
                  </motion.div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center text-center text-white py-3.5 rounded-xl transition-all font-semibold shadow-md"
                    style={{ 
                      backgroundColor: colors.secondary,
                      color: colors.primary
                    }}
                  >
                    {loading ? <Loader className='animate-spin text-center' /> : 'Submit Request'}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EmailSubscription />
    </div>
  );
};

export default Shop;