import React, { useState, useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import EmailSubscription from "../components/EmailSubscription";
import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore";


const SkeletonCard = () => (
  <div className="animate-pulse bg-white border rounded-2xl shadow-sm overflow-hidden">
    <div className="bg-gray-200 h-52 w-full" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

const Shop = () => {
  const {
    products,
    searchProducts,
    clearSearch,
    searchResults,
    loadProducts,
  } = useProductStore();

  const {addToCart} = useCartStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      searchProducts(searchTerm);
    } else {
      clearSearch();
    }
  }, [searchTerm]);

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

  const handleRequestSubmit = (data) => {
    toast.success("Request submitted successfully!");
    reset();
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <section className="bg-yellow-50 p-6 md:p-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-800">
              Discover Modern Tech
            </h1>
            <p className="text-xl text-gray-700 max-w-xl">
              Explore innovative gadgets designed to elevate your digital lifestyle. Find the best picks in tech, curated just for you.
            </p>
            <button className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition">
              Shop Now
            </button>
          </div>
          <img
            src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
            alt="Tech gadgets"
            className="w-full h-80 object-cover rounded-xl shadow-xl"
          />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold text-gray-800">
              Featured Products
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-500 text-lg">
              Handpicked tech items just for you
            </motion.p>
          </div>

          <motion.div className="flex flex-wrap justify-center gap-4 mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-48 px-4 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
            </select>
            <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
              <input
                type="checkbox"
                checked={showNewArrivals}
                onChange={(e) => setShowNewArrivals(e.target.checked)}
                className="accent-yellow-500"
              />
              <span className="text-sm">New Arrivals</span>
            </label>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.length === 0
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : currentProducts.map((product) => (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    key={product._id}
                    className="bg-white border rounded-2xl shadow-sm hover:shadow-md overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-3">${product.price}</p>
                      <button 
                      onClick={()=> addToCart(product)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition font-semibold">
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
          </div>

          <div className="flex justify-center mt-14 space-x-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors duration-150 ${
                  currentPage === i + 1
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-100">
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
          <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-center mb-8">
            Request an Item
          </motion.h3>
          <form className="space-y-6" onSubmit={handleSubmit(handleRequestSubmit)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="your@email.com"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="John Doe"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium mb-1">Item Description</label>
              <textarea
                {...register("description", { required: true })}
                className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-500 h-32"
                placeholder="Describe the item you're looking for..."
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-medium mb-1">Attachment URL (optional)</label>
              <input
                type="url"
                {...register("attachment")}
                className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Paste image URL here..."
              />
            </motion.div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl transition-colors font-semibold"
            >
              Submit Request
            </motion.button>
          </form>
        </div>
      </section>

      <EmailSubscription />
    </div>
  );
};

export default Shop;
