import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Category from '../components/Category';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackEvent } from '../utils/trackEvent';


function HatmaPrime() {
  const [openAccordion, setOpenAccordion] = useState(0);
  const location = useLocation();
  const [text, setText] = useState("Hello, I am interested in Hatma Prime services. Please provide more information.");

  
  const handleClick = ()=>{
      const phone = "+23409025249323"; 
    const message = encodeURIComponent(text);
      trackEvent('conversion', {method:'whatsApplink'});
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }

    useEffect(()=>{
      trackEvent('page_visit', {page: 'Hatma-prime'});
    }, [])

  const services = [
    'Brand Audit and Optimization',
    'Brand Partnership and Sponsorship Strategy',
    'Brand monitoring and Management'
  ];

  const capabilities = [
    {
      title: 'Ads Creation and Management',
      description: 'We conceptualize and craft ads that resonate with your target audience, actively driving engagement and conversions.'
    },
    {
      title: 'Brand Audit and Optimization',
      description: 'Assess your brand\'s strengths and weaknesses to optimize your approach to stay relevant and competitive.'
    },
    {
      title: 'Premium content creation',
      description: 'Engage your audience with professionally crafted content that tells your brand story and drives engagement.'
    },
    {
      title: 'Social media management',
      description: 'Stay top of mind with your audience through consistent social media presence, engagement, and analytics monitoring.'
    },
    {
      title: 'Partnership and Advertising Strategy',
      description: 'Leverage opportunities by forming strategic alliances with key industry players to maximize growth and reach.'
    },
    {
      title: 'User targeting & Blog',
      description: 'Create targeted content and blogs that address user needs, interests, and pain points to attract and convert leads.'
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
    },
    {
      title: 'PROJECT TITLE',
      imageUrl: '',
      category: ''
    },
    {
      title: 'PROJECT TITLE',
      imageUrl: '',
      category: ''
    },
    {
      title: 'PROJECT TITLE',
      imageUrl: '',
      category: ''
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
     
      <div className="relative bg-[#F2EFFF] py-8 md:py-16 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl text-center md:text-left">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D1849] mb-4">
            HATMA PRIME, an investment in empowerment and excellence.
          </h1>
          </motion.div>
        </div>

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
      {/* Description Section */}
      <div className="py-8 md:py-12 px-4 md:px-8 lg:px-16 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1D1849] mb-4">HATMA PRIME</h2>
        <p className="text-sm md:text-base lg:text-lg text-gray-700 max-w-3xl mx-auto">
          You don't have to be a content creator, writer, speaker, influencer or Algorithm expert to shine your brand 
          across social media platforms. Hatma prime does it all while you sleep.
        </p>
      </div>

      {/* Brand Services Section */}
      <div className="py-8 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-full md:w-1/2">
          {services.map((service, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <button
                className="w-full flex items-center justify-between text-left py-2 focus:outline-none"
                onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
              >
                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-[#1D1849]">{service}</h3>
                {openAccordion === index ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
              </button>
              {openAccordion === index && (
                <div className="mt-4 text-gray-700 transition-all duration-300 ease-in-out">
                  <p className="mb-4 text-sm md:text-base">
                    We provide comprehensive {service.toLowerCase()} services to help your brand stand out in today's 
                    competitive market. Our team of experts will work closely with you to develop 
                    strategies that align with your business goals.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img 
            src="https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Design process" 
            className="rounded-lg shadow-md w-full max-w-md md:max-w-none h-auto"
          />
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-[#1D1849] text-white py-8 md:py-12 px-4 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 px-4">
          Want to elevate your brand? Become our partner today.
        </h2>
        <Link to="/pricing" className="inline-block">
        <button 
        className="mt-4 md:mt-6 bg-[#FFA500] hover:bg-[#E69500] text-white font-semibold md:font-bold py-2 px-4 md:py-3 md:px-6 rounded-md transition-all duration-300 transform hover:scale-105 text-sm md:text-base">
          GET STARTED
        </button>
        </Link>
      </div>

      {/* Capabilities Section */}
      <div className="py-12 md:py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4">Capabilities</h2>
        <p className="text-center mb-8 md:mb-12 max-w-3xl mx-auto text-gray-700 text-sm md:text-base">
          With Hatma Prime services, it is ensured that your brand remains competitive and relevant, maintains a 
          positive brand image with our proactive monitoring and leverages strategic partnerships and sponsorships 
          to amplify your brand's reach and credibility.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {capabilities.map((capability, index) => (
            <div key={index} className="border rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3 text-[#1D1849]">{capability.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{capability.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HatmaPrime;