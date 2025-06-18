import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Category from '../components/Category';
import { motion } from 'framer-motion';

function DigitalMarketing() {

  const location = useLocation();
  const marketingServices = [
    {
      title: 'Brand Storytelling and Content Creation',
      image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      offerings: [
        'Brand Narrative Development',
        'Content Strategy',
        'Content Creation',
        'Content Calendar'
      ]
    },
    {
      title: 'Brand Activation and Campaign Management',
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      offerings: [
        'Campaign Planning',
        'Creative Development',
        'Execution and Management',
        'Performance Tracking'
      ]
    },
    {
      title: 'Influencer Marketing',
      image: 'https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      offerings: [
        'Campaign Planning',
        'Creative Development',
        'Execution and Management',
        'Performance Tracking'
      ]
    }
  ];

  const projects = [
    {
      title: 'PROJECT TITLE',
      imageUrl: 'https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'MARKETING'
    },
    {
      title: 'PROJECT TITLE',
      imageUrl: 'https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'MARKETING'
    },
    {
      title: 'PROJECT TITLE',
      imageUrl: 'https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      category: 'MARKETING'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#F2EFFF] py-12 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1849] mb-4">
            We are empowering small and medium enterprise with innovative solutions
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 md:mt-0"
        >
        <div className="w-full md:w-auto relative flex justify-center">
          <div className="bg-white p-4 md:p-8 rounded-md shadow-md w-48 h-48 sm:w-64 sm:h-64 md:w-[400px] md:h-[300px] flex items-center justify-center">
            <div className="text-4xl md:text-7xl lg:text-9xl font-bold" style={{ 
              background: 'linear-gradient(90deg, #1D1849, #8A56AC, #FFA500)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SEO
            </div>
          </div>
        </div>
        </motion.div>
      </div>

      {/* Category Tabs */}
      <Category location={location} />

      {/* Digital Marketing Description */}
      <div className="py-12 px-4 md:px-8 lg:px-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1D1849] mb-6">DIGITAL MARKETING</h2>
        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
          We believe in a collaborative approach that focuses on understanding your unique business needs. By 
          leveraging insights and creative strategies, we craft targeted marketing solutions that align with your goals and 
          deliver measurable results.
        </p>
      </div>

      {/* Marketing Services */}
      <div className="py-8 px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {marketingServices.map((service, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#1D1849] mb-4">{service.title}</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-700 mb-2">What we offer :</p>
                {service.offerings.map((offering, idx) => (
                  <p key={idx} className="text-gray-600 flex items-center">
                    <span className="mr-2">•</span>
                    {offering}
                  </p>
                ))}
              </div>
              <button className="mt-6 w-full bg-[#1D1849] text-white py-2 rounded-md hover:bg-[#2a2468] transition-colors duration-300">
                Get Started
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-[#1D1849] text-white py-12 px-4 text-center mt-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Want to elevate your brand? Become our partner today.
        </h2>
        <button className="mt-6 bg-[#FFA500] hover:bg-[#E69500] text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105">
          GET STARTED
        </button>
      </div>

      {/* Portfolio Section */}
      <div className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Our work
          <div className="w-16 h-1 bg-[#FFA500] mx-auto mt-2"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="flex flex-col">
              <div className="relative bg-white border rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold tracking-wider" style={{ 
                      background: 'linear-gradient(90deg, #FF4500, #FFA500, #8A56AC)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700">{project.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DigitalMarketing;