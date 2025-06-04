import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Category from '../components/Category';
import { motion } from 'framer-motion';

function CACRegisteration() {
  const location = useLocation();

  const registrationServices = [
    {
      title: 'Business or Brand Registration',
      description: 'Protect your brand\'s identity with our comprehensive brand registration services.',
      icon: '📋'
    },
    {
      title: 'NGO Registration',
      description: 'Our NGO registration services simplify the process of setting up a non-governmental organization for maximum impact.',
      icon: '🏢'
    },
    {
      title: 'Intellectual Property Registration',
      description: 'Protect your innovations and creative works with our intellectual property registration services.',
      icon: '📜'
    },
    {
      title: 'Legal advisory',
      description: 'Our legal advisory services offer expert guidance on various legal matters related to business registration and operation.',
      icon: '⚖️'
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

      {/* CAC Registration Description */}
      <div className="py-12 px-4 md:px-8 lg:px-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1D1849] mb-6">CAC REGISTRATION</h2>
        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
          Starting a business can be daunting, but our business registration services simplify the process. We guide you 
          through every step, ensuring compliance with local regulations and laws so you can focus on what matters most
          —growing your business.
        </p>
      </div>

      {/* Registration Services */}
      <div className="py-8 px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {registrationServices.map((service, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold text-[#1D1849] mb-3">{service.title}</h3>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <button className="w-full bg-[#1D1849] text-white py-2 rounded-md hover:bg-[#2a2468] transition-colors duration-300">
              Get Started
            </button>
          </div>
        ))}
      </div>

      {/* Learn More Section */}
      <div className="bg-[#F2EFFF] py-12 px-4 md:px-8 lg:px-16 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1D1849] mb-6">
            Learn more about the many ways we can support your business
          </h2>
          <button className="bg-[#1D1849] text-white font-bold py-3 px-8 rounded-md hover:bg-[#2a2468] transition-colors duration-300">
            BOOK A CONSULTATION
          </button>
        </div>
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

export default CACRegisteration;