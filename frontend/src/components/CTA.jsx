import React from 'react';
import { trackEvent } from '../utils/trackEvent';

const CTA = () => {
    const handleClick = () => {
        const phone = "+23409025249323";
        const message = encodeURIComponent("Hello, I am interested in your services. Please provide more information.");
        trackEvent('conversion', { method: 'whatsApplink' });
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    };

    return (
      <section className="bg-primary text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Get a Free Consultation Today</h2>
        <p className="text-gray-300 max-w-lg mx-auto mb-6">
          Contact us to learn more about our branding services and e-commerce solutions.
        </p>
        <button
          onClick={handleClick}
          className="bg-secondary text-black px-6 py-3 rounded font-semibold">
          Consult
        </button>
      </section>
    );
  };
  
  export default CTA;
  