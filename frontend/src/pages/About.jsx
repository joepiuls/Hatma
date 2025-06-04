import { useState } from "react";
import user from "../assets/user.jpg";
import user1 from "../assets/user1.jpg";
import user2 from "../assets/user2.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState('Creativity'); 

  const teamMembers = [
    {
      name: "Tobi Adeniyi",
      role: "Brand Strategist",
      image: user,
      description:
        "Tobi is a Marketing and Brand Strategist at [Company Name], focused on helping businesses build strong and memorable identities. He specializes in developing creative campaigns, managing brand positioning, and ensuring consistent messaging across all platforms."
    },
    {
      name: "Jane Doe",
      role: "Marketing Lead",
      image: user1,
      description:
        "Jane is an expert in digital marketing and brand growth strategies, helping businesses scale through targeted campaigns and analytics."
    },
    {
      name: "John Smith",
      role: "Creative Director",
      image: user2,
      description:
        "John leads creative initiatives to ensure that brands have a unique and compelling visual identity in today's market."
    }
  ];

  const content = {
    Creativity: {
      text: "We believe creativity is more than just aesthetics — it’s a tool for solving problems and creating meaningful connections.",
      image: user,
    },
    Harmony: {
      text: "Harmony is about balance and synergy, ensuring all elements work seamlessly together for optimal impact.",
      image: user1,
    },
    Collaboration: {
      text: "Collaboration fuels innovation, enabling diverse perspectives to come together and create extraordinary results.",
      image: user2,
    },
  };

  return (
    <section className="bg-white py-20 px-4 md:px-8 lg:px-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Empowering SMEs Through <span className="text-primary">Innovative Solutions</span>
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Bridging creativity with strategic excellence for sustainable growth
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          {[user, user1, user2].map((src, index) => (
            <img
              key={index}
              src={src}
              alt="Team member"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg object-cover hover:scale-110 transition-transform duration-300"
            />
          ))}
        </div>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
      </div>

      {/* About Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Values Section */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Core Values</h3>
            {Object.keys(content).map((key) => (
              <div
                key={key}
                onClick={() => setActiveTab(key)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeTab === key 
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{key}</h4>
                {activeTab === key && (
                  <p className="text-gray-600 leading-relaxed">{content[key].text}</p>
                )}
              </div>
            ))}
          </div>

          {/* Image Section */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            {activeTab && (
              <img
                src={content[activeTab].image}
                alt={activeTab}
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership</h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Meet the visionary minds driving innovation and excellence at the core of our operations
          </p>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="team-swiper"
          >
            {teamMembers.map((member, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-xl shadow-lg p-6 m-4 hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 mx-auto rounded-full object-cover mb-6 border-4 border-white shadow-md"
                  />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                  <p className="text-primary mb-4 font-medium">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Team of Innovators
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            We're always looking for passionate individuals to join our growing team
          </p>
          
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
