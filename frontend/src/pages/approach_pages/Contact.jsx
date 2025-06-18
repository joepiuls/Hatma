import React, { useState } from 'react';
import { Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react'
import { useForm } from 'react-hook-form';
import useSubmitStore from '../../store/useSubmitStore';
import { trackFormSubmission } from '../../utils/trackEvent';
function App() {
 
  const {
      register,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm();
    
    const {loading, submitCustomRequest} = useSubmitStore();
  
    const onSubmit = async(data) => {
      await submitCustomRequest(data);
      trackFormSubmission('contact-form', data);
      reset();
    };

  return (
    <div className="min-h-screen bg-white">
      {/* Get in Touch Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Get in Touch</h1>
          <p className="text-center text-gray-600 mb-12">We are excited to hear about your Product</p>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=600&h=600" 
                alt="Contact illustration" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-purple-100 opacity-40 rounded-lg"></div>
            </div>

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
                 {loading ? <Loader className='animate-spin text-center' /> : ' Contact Us'}
                </button>
              </form>
          </div>
        </div>
      </section>

      {/* Our Office Section */}
      <section className="bg-[#1C0C4F] py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Our Office</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
              alt="Office"
              className="rounded-lg shadow-xl"
            />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Abuja</h3>
              <p className="text-gray-300 mb-6">Wuse 2, along suleja road 02146</p>
              <button className="bg-orange-500 text-white py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Connect with us Section */}
      <section className="bg-orange-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect with us</h2>
              <p className="text-gray-600 mb-8">
                Reach out to us on our social media handles and join us on our journey
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-[#1C0C4F] hover:text-orange-500 transition-colors">
                  <Linkedin className="w-8 h-8" />
                </a>
                <a href="#" className="text-[#1C0C4F] hover:text-orange-500 transition-colors">
                  <Facebook className="w-8 h-8" />
                </a>
                <a href="#" className="text-[#1C0C4F] hover:text-orange-500 transition-colors">
                  <Instagram className="w-8 h-8" />
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"
                alt="Connect with us"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-100 to-orange-50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Do you have any specific question or enquiry?
          </h2>
          <p className="text-gray-600 mb-8">
            Give us a call and we will help you find the best resource available to meet your needs
          </p>
          <div className="inline-flex items-center justify-center gap-2 text-2xl font-bold text-[#1C0C4F]">
            <Phone className="w-6 h-6" />
            091-3333-4444
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;