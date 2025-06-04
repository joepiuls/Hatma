import React, { useState } from 'react';
import { Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    budget: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g John doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="$5000"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Submit
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