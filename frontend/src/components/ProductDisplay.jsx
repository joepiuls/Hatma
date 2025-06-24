import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';

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


export default function FeaturedProducts() {
  const { products } = useProductStore();
  const { addToCart } = useCartStore();

  const featuredProducts = products
    .filter(product => product.featured)
    .slice(0, 4);

  return (
    <div className="py-10 px-6 md:px-16">
      <div className="text-left mb-8">
        <h2 className="text-xl font-bold text-secondary">Featured Products</h2>
        <h2 className="text-3xl font-bold text-primary">Best Sellers</h2>
        <p className="text-gray-500 max-w-xl">
          Explore our top-rated digital gadgets loved by customers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          // Show skeleton loaders while products are loading
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : featuredProducts.length > 0 ? (
          // Display featured products
          featuredProducts.map((product) => (
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
                  <div 
                    className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    FEATURED
                  </div>
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
                        className="text-lg font-semibold hover:text-primary transition-colors"
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
          ))
        ) : (
          // Show when no featured products exist
          <div className="col-span-full text-center py-10">
            <h3 className="text-2xl font-bold text-gray-500">
              No featured products available
            </h3>
            <p className="text-gray-400 mt-2">
              Check back later for our featured selections
            </p>
          </div>
        )}
      </div>
    </div>
  );
}