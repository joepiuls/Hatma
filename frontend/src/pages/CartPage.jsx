import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PaystackCheckoutButton from '../components/PaystackCheckoutButton';

const CartPage = () => {
  const {user} = useAuthStore();
  const navigate = useNavigate();;

 
  const {
    cartItems, 
    incrementQuantity, loadCartFromServer,
    decrementQuantity, getCartTotal, 
    removeFromCart} = useCartStore();


  const [additionalInfo, setAdditionalInfo] = useState('');
  const {totalPrice} = getCartTotal();

  const [cartLoaded, setCartLoaded] = useState(false);

useEffect(() => {
  if(!user) return navigate('/');
  if (user && user._id && !cartLoaded) {
    loadCartFromServer();
    setCartLoaded(true);
  }
}, [user, cartLoaded]);



  return (
    <div className="w-full bg-white mx-auto px-4 sm:px-6 lg:px-10 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
      <p className="text-sm text-gray-500 mb-8">Home / Cart</p>

      {/* Table Headers */}
      <div className="hidden md:grid grid-cols-12 border-b border-gray-200 py-3 text-sm font-semibold">
        <div className="col-span-5">Product</div>
        <div className="col-span-2 text-center">Quantity</div>
        <div className="col-span-2 text-right">Total</div>
        <div className="col-span-3"></div>
      </div>

      {/* Cart Items */}
      {cartItems?.map((item) => (
        <div key={item._id} className="grid grid-cols-12 items-center border-b border-gray-200 py-6 gap-4">
          <div className="col-span-12 md:col-span-5 flex gap-4 items-center">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-24 h-24 object-contain rounded-lg border border-gray-100 p-2" 
            />
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{item?.name}</h3>
              <p className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {item.inStock ? 'In stock' : 'Out of stock'}
              </p>
              <p className="text-sm font-semibold text-yellow-600">
                NGN {item?.price}
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 flex justify-center mt-4 md:mt-0">
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1">
              <button
                onClick={() => decrementQuantity(item._id)}
                className="px-2 text-lg font-bold hover:bg-gray-100 rounded"
              >
                -
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-12 text-center bg-transparent text-lg"
              />
              <button
                onClick={() => incrementQuantity(item._id)}
                className="px-2 text-lg font-bold hover:bg-gray-100 rounded"
              >
                +
              </button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 text-right mt-4 md:mt-0">
            <p className="text-lg font-semibold">
              NGN {(item.quantity * item.price).toLocaleString()}
            </p>
          </div>

          <div className="col-span-12 md:col-span-3 text-right mt-4 md:mt-0">
            <button 
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 hover:text-red-800 text-sm flex items-center justify-end w-full md:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Additional Information */}
      <div className="mt-8 border-b border-spacing-y-10 border-gray-300 grid md:grid-cols-2 gap-8 w-full">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Input Text"
            className="w-full bg-transparent p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows={4}
          />
        </div>

        {/* Summary + Actions */}
        <div className="space-y-6">
          <div className="border-t border-gray-300 pt-6">
            <div className="flex justify-between text-xl font-semibold mb-4">
              <span>Subtotal</span>
              <span>NGN {totalPrice}</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Taxes and shipping calculated at checkout</p>
            <div className="flex flex-col gap-3">
              <PaystackCheckoutButton additionalInfo={additionalInfo}  />
              
              <button  className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50 py-3 rounded-lg font-medium transition-colors">
                <Link to={'/shop'} className='w-full'>
                Continue Shopping
                </Link>
              </button>
              
              
            </div>
          </div>
        </div>
        <div className='border-b w-full border-x-gray-300'></div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img 
                src={`https://images.pexels.com/photos/${356056 + id}/pexels-photo-${356056 + id}.jpeg?auto=compress&cs=tinysrgb&w=400`} 
                alt="Related product" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg mb-2">Wireless Speaker</h3>
                <p className="text-yellow-600 font-semibold mb-4">NGN 5000.00</p>
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;