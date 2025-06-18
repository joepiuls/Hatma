import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Loader } from 'lucide-react';
import EmailSubscription from '../../components/EmailSubscription';
import { trackEvent } from '../../utils/trackEvent';
import useSubmitStore from '../../store/useSubmitStore';

function Pricing() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

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

  const [message, setMessage] = useState('');
  
  const {loading, submitCustomRequest} = useSubmitStore();

  const onSubmit = async(data) => {
    await submitCustomRequest(data);
    await trackEvent('service_request');
    reset();
  };

  const handleClick = ()=>{
        const phone = "+23409025249323"; 
        const text = encodeURIComponent(message);
        trackEvent('conversion', {method:'whatsApplink'});
        trackEvent('service_request')
        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
      }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container flex flex-col md:flex-row gap-10 justify-center px-4">
          <div className="max-w-3xl flex flex-col gap-4 justify-center">
            <h1 className="text-4xl font-bold text-primary mb-4">HATMA PRIME</h1>
            <p className="text-lg text-black w-full md:w-[500px] mb-4">
              Our platform goes beyond standard social media management by offering tailored solutions for businesses in specialized fields
            </p>
          </div>
          <div className="w-full md:w-[500px] h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"
              alt="Custom Solutions"
              className="rounded-lg w-full h-full object-cover border border-black"
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
                  onClick={() => {
                    setMessage(`I want to get Started with Hatma Prime Can you Guide Me through this ${plan.name} `);
                    handleClick()
                  }}
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
          <button
            onClick={() => {
                    setMessage(`I want to get Started with Hatma Prime Can you Guide me through.`);
                    handleClick()
                  }}
            className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors mt-4"
          >
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
            <div className="w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"
                alt="Custom Solutions"
                className="rounded-lg w-full h-[500px] object-cover"
              />
            </div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input
                  type="text"
                  {...register("name", { required: 'Name is required' })}
                  placeholder="Name"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                <input
                  type="email"
                  {...register("email", { required: 'Email is required' })}
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <input
                  type="tel"
                  {...register("phone", { required: 'Phone number is required' })}
                  placeholder="Phone number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

                <textarea
                  {...register("message", { required: 'Message is required' })}
                  rows="4"
                  placeholder="Your message"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

                <input
                  type="text"
                  {...register("budget", { required: 'Budget is required' })}
                  placeholder="Your Budget"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                />
                {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary flex items-center justify-center text-white py-3 rounded-lg hover:bg-[#e67a00] transition-colors"
                >
                 {loading ? <Loader className='animate-spin text-center' /> : ' Get Started'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <EmailSubscription />
    </div>
  );
}

export default Pricing;
