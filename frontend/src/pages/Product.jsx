import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import EmailSubscription from '../components/EmailSubscription';

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Black');

  const relatedProducts = [
    { id: 1, name: 'Product', price: 5000 },
    { id: 2, name: 'Product', price: 5000 },
    { id: 3, name: 'Product', price: 5000 },
  ];

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item(s) to cart`);
    setQuantity(1);
  };

  return (
    <div className='bg-white'>
    <div className="bg-white text-black font-sans w-full mx-auto px-10 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Main image */}
        <div>
          <div className="rounded-xl overflow-hidden border mb-4">
            <img
              src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg"
              alt="Product"
              className="w-full h-[300px] object-cover"
            />
          </div>
          {/* Thumbnail images */}
          <div className="flex gap-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="w-20 h-16 overflow-hidden rounded-lg border">
                <img
                  src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg"
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">HP elite book pro</h1>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <FaStar className="text-yellow-400 mr-1" />
            4.5 - 22 ratings
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-gray-900">NGN 200,000.00</p>
            <p className="text-sm text-gray-400 line-through">NGN 500,000.00</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This laptop is perfect for any occasion, be it gaming, coding or basic everyday stuff.
            Lightweight and portable, it offers superior comfort and style.
          </p>

          <div className="mb-4">
            <p className="font-semibold mb-2">Available in :</p>
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
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 text-white py-3 rounded-lg text-center hover:bg-black transition"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-gray-50 p-10 mt-12 rounded-lg'>
      <div className=" bg-gray-50 border-b border-gray-300">
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

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'description' && (
          <div className="space-y-6 text-gray-800">
            <p>
              Aliquam dis vulputate vulputate integer sagittis. Faucibus dolor ornare faucibus vel sed
              et eleifend habitasse amet. Montes, mauris varius ac est bibendum. Scelerisque a, risus
              ac ante. Veit consectetur neque, elit, aliquet. Non varius proin sed urna, egestas
              consequat laoreet diam tincidunt. Magna eget faucibus cras justo, tortor sed donec tempus.
              Imperdiet consequat, quis diam arcu, nulla lobortis justo netus dis.
            </p>
            <div>
              <h3 className="text-lg font-semibold mb-2">More details</h3>
              <ul className="space-y-2 text-sm">
                {Array(3).fill(
                  'Aliquam dis vulputate vulputate integer sagittis. Faucibus ds diam arcu, nulla lobortis justo netus dis.'
                ).map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaArrowRight className="mt-1 text-blue-900" />
                    <span>{detail}</span>
                  </li>
                ))}
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

      {/* Related Products */}
      <div className='mt-10'>
      <h2 className="text-2xl font-bold mb-6">Related Items</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition"
          >
            <div className="bg-indigo-100 h-48 flex items-center justify-center rounded-lg mb-4" />
            <h3 className="text-center font-semibold mb-1">{product.name}</h3>
            <p className="text-center text-gray-600 mb-2">NGN {product.price.toFixed(2)}</p>
            <button className="block w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
              Buy now
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
    <EmailSubscription />
    </div>
  );
};

export default ProductPage;
