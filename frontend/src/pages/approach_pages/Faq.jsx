import React, { useState } from 'react';
import { ChevronDown, Linkedin, Facebook, Instagram } from 'lucide-react';
import Newsletter from './blog/Newletter';

function Faq() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const faqQuestions = [
    {
      id: 1,
      question: 'What are the services that we offer?',
      answer: 'We offer comprehensive digital marketing, branding, and business development services.'
    },
    {
      id: 2,
      question: 'Can I employ your services as a pay per project',
      answer: 'Yes, we offer flexible payment options including pay-per-project arrangements.'
    },
    {
      id: 3,
      question: 'What is Hatma Prime all about?',
      answer: 'Hatma Prime is our premium service package that offers exclusive benefits and priority support.'
    }
  ];

  const handleQuestionClick = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Help Section */}
      <div className="bg-[#E6E0FF] py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1C0C4F] mb-2">How may we help you today?</h2>
          <p className="text-[#1C0C4F] mb-6">Speak to our customer representative today and let's resolve your issue.</p>
          <button className="bg-[#1C0C4F] text-white px-8 py-2 rounded-md">Start</button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#1C0C4F] mb-2">Frequently asked Questions</h2>
        <p className="text-center text-gray-600 mb-8">Do you have questions? We have answers!!!</p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqQuestions.map((faq) => (
            <div key={faq.id} className="border rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => handleQuestionClick(faq.id)}
              >
                <span className="font-medium text-[#1C0C4F]">{faq.question}</span>
                <ChevronDown 
                  className={`transform transition-transform ${
                    activeQuestion === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeQuestion === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#1C0C4F] mb-2">We would like to hear your feedback</h2>
        <p className="text-center text-gray-600 mb-12">
          Have any suggestions, observations or you would like to share? Your opinions would help us serve you better
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <img
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800"
              alt="Feedback"
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g John doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g example@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(091) 1234-5678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1C0C4F] focus:border-[#1C0C4F]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1C0C4F] text-white py-3 rounded-lg hover:bg-[#2d1674] transition-colors"
              >
                Share your thoughts
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Connect Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-[#1C0C4F] mb-4">Connect with us</h2>
            <p className="text-gray-600 mb-8">
              Reach out to us on our social media handles and join us on our journey
            </p>
            <div className="flex space-x-4">
              <Linkedin className="w-8 h-8 text-[#1C0C4F] hover:text-[#FF8A00] cursor-pointer" />
              <Facebook className="w-8 h-8 text-[#1C0C4F] hover:text-[#FF8A00] cursor-pointer" />
              <Instagram className="w-8 h-8 text-[#1C0C4F] hover:text-[#FF8A00] cursor-pointer" />
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800"
              alt="Connect"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>

      {/* Can't Find Section */}
      <div className="bg-[#FFF9F0] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1C0C4F] mb-4">Can't find what you are looking for?</h2>
          <p className="text-gray-600 mb-6">
            Give us a call and we will help you find the best resource available to meet your needs
          </p>
          <p className="text-2xl font-bold text-[#1C0C4F]">091- 3333 - 4444</p>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}

export default Faq;