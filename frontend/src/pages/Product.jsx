import React, { useEffect, useState } from 'react';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import EmailSubscription from '../components/EmailSubscription';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useParams, Link } from 'react-router-dom';
import { trackEvent } from '../utils/trackEvent';
import { toast } from 'sonner';
import { api } from '../axios';

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Black');

  const { id } = useParams();
  const { getProductById, getProductsByCategory, loadProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const product = getProductById(id);

useEffect(() => {
  // Load product if not already loaded
  if (!product) {
    loadProducts();
  }

  // Track views
  const trackView = async () => {
    try {
      await api.patch(`/user/products/${id}/view`);
    } catch (error) {
      toast.error('View tracking failed');
    }
  };

  trackView(); 

}, [product, loadProducts, id]); 


  if (!product) {
    return <div className="text-center py-20 text-gray-500">Loading product...</div>;
  }

  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());
  const relatedProducts = shuffle(getProductsByCategory(product.category, product.id)).slice(0, 3);

  return (
    <div className="bg-white">
      <div className="text-black font-sans w-full mx-auto px-10 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="rounded-xl overflow-hidden border mb-4">
              <img
                src={product.images || "https://via.placeholder.com/400x300"}
                alt={product.name}
                className="w-full h-[300px] object-cover"
              />
            </div>
            <div className="flex gap-4">
              {(product.images || [product.imageUrl]).slice(0, 3).map((img, index) => (
                <div key={index} className="w-20 h-16 overflow-hidden rounded-lg border">
                  <img
                    src={img || "https://via.placeholder.com/100x80"}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <FaStar className="text-yellow-400 mr-1" />
              4.5 - 22 ratings
            </div>
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">NGN {product.price?.toLocaleString()}</p>
              <p className="text-sm text-gray-400 line-through">NGN {(product.originalPrice || (product.price * 2))?.toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {product.description || "No description available."}
            </p>

            <div className="mb-4">
              <p className="font-semibold mb-2">Available in:</p>
              <div className="flex items-center gap-4">
                {['Black', 'White', 'Grey'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-md border-2 flex items-center justify-center ${
                      selectedColor === color ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  >
                    {selectedColor === color && <span className="text-white font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <button
                onClick={()=>addToCart(product)}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg text-center hover:bg-black transition"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-10 mt-12 rounded-lg">
          <div className="border-b border-gray-300">
            <div className="flex gap-8 mb-6">
              {['Description', 'Delivery Information', 'Reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                  className={`pb-3 text-base font-medium ${
                    activeTab === tab.toLowerCase().replace(' ', '-')
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="space-y-6 text-gray-800">
                <p>{product.description}</p>
                <div>
                  <h3 className="text-lg font-semibold mb-2">More details</h3>
                  <ul className="space-y-2 text-sm">
                    {product.features?.length > 0
                      ? product.features.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FaArrowRight className="mt-1 text-blue-900" />
                            <span>{detail}</span>
                          </li>
                        ))
                      : <li>No additional details available.</li>}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'delivery-information' && (
              <div className="text-gray-800">
                <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                <p>Standard delivery within 3–5 business days. Express shipping available at checkout. Free returns within 30 days of purchase.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="font-semibold">John D. (Verified Buyer)</p>
                  <p className="text-sm text-gray-600 mt-1">"Excellent product quality and fast delivery!"</p>
                </div>
                <button className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Related Items</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts > 0 ? relatedProducts.map((related) => (
              <div
                key={related.id}
                className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition"
              >
                <img
                  src={related.imageUrl || "https://via.placeholder.com/300x200"}
                  alt={related.name}
                  className="h-48 w-full object-cover rounded-lg mb-4"
                />
                <h3 className="text-center font-semibold mb-1">{related.name}</h3>
                <p className="text-center text-gray-600 mb-2">
                  NGN {related.price.toLocaleString()}
                </p>
                <Link
                  to={`/product/${related.id}`}
                  className="block w-full bg-yellow-500 text-white py-2 rounded text-center hover:bg-yellow-600"
                >
                  View Product
                </Link>
              </div>
            )): 'No Related Products'}
          </div>
        </div>
      </div>

      <EmailSubscription />
    </div>
  );
};

export default ProductPage;
