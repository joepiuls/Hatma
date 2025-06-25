import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Category from '../components/Category';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/trackEvent';
import { Link } from 'lucide-react';

function BrandDevelopment() {
    const location  = useLocation();

  const services = [
    {
      title: '360 Degree Analysis',
      description: 'Brand health analysis to stay competitive and differentiate your brand from competitors.',
      actions: [
        'Comprehensive marketing insight',
        'Clear brand positioning',
        'Risk Assessment',
        'Performance Benchmarking',
        'Informed Resource Allocation'
      ]
    },
    {
      title: 'Brand Health Management',
      description: 'Develop and implement positioning strategy to differentiate your brand from competitors.',
      actions: [
        'Clarity on brand performance',
        'Identify growth opportunities',
        'Competitive audit',
        'Customer Engagement',
        'Risk Mitigation'
      ]
    },
    {
      title: 'Brand Training and Workshop',
      description: 'Equip your team with the knowledge and skills needed to effectively communicate and grow your brand.',
      actions: [
        'Custom Workshops',
        'Brand guideline training',
        'Internal Communication strategy',
        'Practical Tools and resources',
        'Improved Team Alignment'
      ]
    }
  ];

  const projects = [
    { id: 1, title: 'PROJECT TITLE', category: 'MARKETING' },
    { id: 2, title: 'PROJECT TITLE', category: 'MARKETING' },
    { id: 3, title: 'PROJECT TITLE', category: 'MARKETING' },
    { id: 4, title: 'PROJECT TITLE', category: 'MARKETING' },
    { id: 5, title: 'PROJECT TITLE', category: 'MARKETING' },
    { id: 6, title: 'PROJECT TITLE', category: 'MARKETING' }
  ];

  const text = `Hello, I am interested in your Brand Development services. Please provide more information.`;
  

  useEffect(()=>{
    trackEvent('page_visit', {page: 'Brand-development'});
  }, [])

  const handleClick = () => {
    const phone = "+23409025249323"; 
    const message = encodeURIComponent(text);
    trackEvent('conversion', {method:'whatsApplink'});
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#F2EFFF] py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#1D1849] leading-tight mb-6">
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
      </div>

      {/* Category Navigation */}
      <Category location={location} />

      {/* Brand Development Section */}
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1D1849] mb-6">Brand Development</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            With Hatma Prime services, it is ensured that your brand remains competitive and relevant, maintains a
            positive brand image with our proactive monitoring and leverages strategic partnerships and sponsorships
            to amplify your brand's reach and credibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-[#1D1849] mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Actions:</p>
                {service.actions.map((action, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
              <button 
              onClick={handleClick}
              className="mt-8 w-full bg-[#1D1849] text-white py-2 rounded-md hover:bg-[#2a2468] transition-colors">
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#1D1849] py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Want to elevate your brand? Become our partner today.
        </h2>
        <Link to="/pricing" className="inline-block">
        <button 
          className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition-colors font-medium">
          GET STARTED
        </button>
        </Link>
      </div>
    </div>
  );
}

export default BrandDevelopment;