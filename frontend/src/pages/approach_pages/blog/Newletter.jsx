import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to your backend
      // For demo purposes, we'll simulate a successful subscription
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="bg-[#E6E0FF] py-12 w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-bold text-[#1C0C4F] mb-2">Stay informed with us</h3>
            <p className="text-gray-600 mb-4">Sign up for our newsletter to receive updates</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#FF8A00] text-white px-6 py-3 rounded-lg hover:bg-[#e67a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              
              {status !== 'idle' && (
                <div className={`flex items-center gap-2 ${
                  status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : status === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : null}
                  <p>{message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;