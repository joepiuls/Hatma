import React, { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
import { Check, MessageSquare } from 'lucide-react';
import Newsletter from './blog/Newletter';

// const stripePromise = loadStripe('your_publishable_key');

function Pricing() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    budget: ''
  });

  const plans = [
    {
      name: 'Basic Plan',
      description: 'Best for freelancers, startups or businesses in specialized social media management',
      price: '$200',
      period: 'Monthly',
      features: [
        'Manage 3 social media platform',
        '10 Posts per month',
        'Basic analytics/reporting',
        'Standard graphics design/Pre set templates',
        'Basic message engagement',
        'No video content/reels'
      ],
      priceId: 'price_basic'
    },
    {
      name: 'Professional Plan',
      description: 'Best for freelancers, startups or businesses in specialized social media management',
      price: '$700',
      period: 'Monthly',
      features: [
        'Manage 6 social media platform',
        '25 Posts per month',
        'Monthly analytics with expert recommendations',
        'Customized graphics and video content',
        'Advanced message engagement',
        'Brand positioning and optimization',
        'Ad management',
        'Social media consultation'
      ],
      priceId: 'price_professional'
    },
    {
      name: 'Enterprise',
      description: 'Large businesses with complex social media needs, multiple locations, and/or custom brand partnerships.',
      price: '$1000',
      period: 'Monthly',
      features: [
        'Manage at least 7 social media platform',
        'Unlimited Posts per month',
        'Weekly analytics with expert recommendations',
        'Customized graphics and video content',
        'Full engagement management',
        'Brand monitoring and optimization',
        'Ad management',
        'Weekly SEO strategy consultation',
        'Personalized account manager',
        'Brand sponsorship and business help'
      ],
      priceId: 'price_enterprise'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Custom request submitted:', formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      budget: ''
    });
  };

//   const handleSubscribe = async (priceId) => {
//     try {
//       const stripe = await stripePromise;
      
//       // Here you would typically make a call to your backend to create a Stripe Checkout Session
//       // For demo purposes, we'll just show an alert
//       alert('In production, this would redirect to Stripe Checkout for ' + priceId);
      
//       // The actual implementation would look something like this:
//       /*
//       const response = await fetch('/create-checkout-session', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           priceId: priceId,
//         }),
//       });

//       const session = await response.json();
//       const result = await stripe.redirectToCheckout({
//         sessionId: session.id,
//       });

//       if (result.error) {
//         console.error(result.error);
//       }
//       */
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container flex flex-row gap-10 justify-center px-4">
          <div className="max-w-3xl  flex flex-col gap-4 justify-center">
            <h1 className="text-4xl font-bold text-primary mb-4">HATMA PRIME</h1>
            <p className="text-lg text-black w-[500px] mb-4">
              Our platform goes beyond standard social media management by offering tailored solutions for businesses in specialized fields
            </p>
          </div>
          <div>
          <img
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"
                alt="Custom Solutions"
                className="rounded-lg w-[500px] h-[400px] object-cover border-[1px] border-black"
              />
          </div>
        </div>
      </div>

      <div className='w-full h-[150px] bg-blue-200'></div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#1C0C4F] mb-4">Choose a Plan that is right for you</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-12">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white flex flex-col justify-between rounded-lg p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className='bg-blue-200 p-2 rounded-lg'>
                <h3 className="text-xl font-bold text-[#1C0C4F] mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                </div>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-4xl font-bold text-secondary">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="font-medium text-[#1C0C4F]">What we offer :</p>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-[#1C0C4F] mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className='flex justify-end'>
              <button
                onClick={() => handleSubscribe(plan.priceId)}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary transition-colors"
              >
                Get Started
              </button>
              </div>

              
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Want to elevate your brand? Become our partner today.</h2>
          <button className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors mt-4">
            GET STARTED
          </button>
        </div>
      </div>

      {/* Custom Request Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1C0C4F] mb-2">Have a custom need?</h2>
          <p className="text-center text-gray-600 mb-12">Let's talk about it. Reach out to us today</p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"
                alt="Custom Solutions"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                  ></textarea>
                </div>
                <div>
                  <input
                    type="text"
                    name="budget"
                    placeholder="Your Budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF8A00] text-white py-3 rounded-lg hover:bg-[#e67a00] transition-colors"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}

export default Pricing;