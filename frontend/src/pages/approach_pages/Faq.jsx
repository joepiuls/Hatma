import React, { useState } from 'react';
import { ChevronDown, Linkedin, Facebook, Instagram } from 'lucide-react';
import EmailSubscription from '../../components/EmailSubscription';
import { useForm } from 'react-hook-form';
import useSubmitStore from '../../store/useSubmitStore';
import { trackEvent } from '../../utils/trackEvent';

function Faq() {
  const [activeQuestion, setActiveQuestion] = useState(null);

 const faqQuestions = [
  {
    id: 1,
    question: 'What are the services that we offer?',
    answer: 'We offer comprehensive digital marketing, branding, and business development services.'
  },
  {
    id: 2,
    question: 'Can I employ your services as a pay per project?',
    answer: 'Yes, we offer flexible payment options including pay-per-project arrangements.'
  },
  {
    id: 3,
    question: 'What is Hatma Prime all about?',
    answer: 'Hatma Prime is our premium service package that offers exclusive benefits and priority support.'
  },
  {
    id: 4,
    question: 'How do I get started with your services?',
    answer: 'Simply contact us through our website or social media platforms, and we’ll schedule a free consultation to understand your goals and recommend the best plan.'
  },
  {
    id: 5,
    question: 'What industries do you work with?',
    answer: 'We work with a wide range of industries including tech, fashion, health, finance, education, and more. Our strategies are tailored to fit your niche.'
  },
  {
    id: 6,
    question: 'Do you offer ongoing support after project completion?',
    answer: 'Yes, we provide ongoing support, performance monitoring, and optional maintenance packages after the initial project delivery.'
  },
  {
    id: 7,
    question: 'How long does it take to complete a typical project?',
    answer: 'Timelines vary based on the project scope, but most projects are completed within 2 to 6 weeks. We provide a detailed timeline after the initial consultation.'
  },
  {
    id: 8,
    question: 'Can I request custom packages tailored to my business needs?',
    answer: 'Absolutely. We specialize in creating custom packages that align with your specific goals, budget, and industry requirements.'
  },
  {
    id: 9,
    question: 'Is Hatma Prime suitable for startups or only large businesses?',
    answer: 'Hatma Prime is suitable for both startups and established businesses looking for dedicated support, strategic scaling, and faster results.'
  },
  {
    id: 10,
    question: 'Where is your team based?',
    answer: 'Our team is globally distributed, with core operations managed from our headquarters. This allows us to offer diverse insights and 24/7 availability.'
  }
];


  const handleQuestionClick = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

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
      {/* Help Section */}
      <div className="bg-[#E6E0FF] py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1C0C4F] mb-2">How may we help you today?</h2>
          <p className="text-[#1C0C4F] mb-6">Speak to our customer representative today and let's resolve your issue.</p>
          <button 
          onClick={()=>{
            setMessage('Hello I want you to');
            handleClick();
          }}
          className="bg-[#1C0C4F] text-white px-8 py-2 rounded-md">Start</button>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary flex items-center justify-center text-white py-3 rounded-lg hover:bg-slate-950 transition-colors"
                >
                 {loading ? <Loader className='animate-spin text-center' /> : ' Get Started'}
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
      <EmailSubscription />
    </div>
  );
}

export default Faq;