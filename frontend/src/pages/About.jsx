import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Users, Target, Lightbulb, X, Mail, Phone, Linkedin, Globe } from "lucide-react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const UserPage = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('about');
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const stats = [
    { label: "Projects", value: "42+" },
    { label: "Experience", value: "8 years" },
    { label: "Clients", value: "28+" },
  ];

  const skills = [
    { name: "Strategic Planning", level: 95 },
    { name: "Team Leadership", level: 92 },
    { name: "Creative Direction", level: 88 },
    { name: "Business Development", level: 90 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-secondary p-6 rounded-t-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col md:flex-row items-center gap-8 pt-8">
            <img 
              src={user.image} 
              alt={user.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <div className="text-white text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
              <p className="text-xl md:text-2xl font-medium mt-2">{user.role}</p>
              <p className="mt-4 max-w-2xl">{user.description}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                <a href="#" className="bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 flex items-center gap-2 transition-colors">
                  <Mail size={18} />
                  <span>Email</span>
                </a>
                <a href="#" className="bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 flex items-center gap-2 transition-colors">
                  <Phone size={18} />
                  <span>Call</span>
                </a>
                <a href="#" className="bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 flex items-center gap-2 transition-colors">
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 flex items-center gap-2 transition-colors">
                  <Globe size={18} />
                  <span>Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 border-b">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {['about', 'experience', 'skills', 'projects'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize flex-shrink-0 ${
                  activeTab === tab 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Professional Summary</h3>
              <p className="text-gray-700 leading-relaxed">
                {user.name} is a passionate leader with extensive experience in {user.role.toLowerCase()}. 
                With a strong background in strategic planning and team development, {user.name.split(' ')[0]} has 
                successfully led numerous projects to completion, consistently exceeding client expectations. 
                Known for innovative problem-solving and fostering collaborative environments, 
                {user.name.split(' ')[0]} brings a unique blend of creativity and analytical thinking to every challenge.
              </p>
              
              <h3 className="text-2xl font-bold mt-8">Education</h3>
              <div className="border-l-2 border-primary pl-4 space-y-6">
                <div>
                  <h4 className="font-bold text-lg">MBA in Business Strategy</h4>
                  <p className="text-primary">Stanford University</p>
                  <p className="text-gray-600">2010 - 2012</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg">BSc in Business Administration</h4>
                  <p className="text-primary">Harvard University</p>
                  <p className="text-gray-600">2006 - 2010</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Core Competencies</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-2xl font-bold mt-8">Industry Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Marketing'].map((expertise, idx) => (
                  <span 
                    key={idx} 
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {expertise}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'experience' && (
            <div className="space-y-8">
              <div className="border-l-2 border-primary pl-4 space-y-6">
                <div>
                  <h4 className="font-bold text-lg">{user.role}</h4>
                  <p className="text-primary">Innovate Solutions Inc.</p>
                  <p className="text-gray-600">2018 - Present</p>
                  <p className="mt-2 text-gray-700">
                    Leading cross-functional teams to deliver innovative solutions for clients across multiple industries. 
                    Responsible for strategic planning, client relations, and business development.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Senior Strategy Consultant</h4>
                  <p className="text-primary">Global Consulting Group</p>
                  <p className="text-gray-600">2014 - 2018</p>
                  <p className="mt-2 text-gray-700">
                    Advised Fortune 500 companies on business transformation initiatives. 
                    Developed growth strategies and operational improvement plans.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Business Development Manager</h4>
                  <p className="text-primary">TechForward Solutions</p>
                  <p className="text-gray-600">2012 - 2014</p>
                  <p className="mt-2 text-gray-700">
                    Managed key accounts and developed new business opportunities. 
                    Led a team of 5 business development associates.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'projects' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Featured Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((project) => (
                  <div key={project} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gray-200 border-b"></div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2">Digital Transformation Initiative</h4>
                      <p className="text-gray-600 text-sm mb-3">Led the digital transformation for a major retail client, resulting in 40% increased online sales.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Strategy</span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Digital</span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">E-commerce</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState('Innovation');
  const [selectedUser, setSelectedUser] = useState(null);

  const [text, setText] = useState("Hello, I want to a member of your team");

   const handleClick = ()=>{
        const phone = "+23409025249323"; 
        const message = encodeURIComponent(text);
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      }

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Chief Executive Officer",
      image: "https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      description: "Sarah leads our vision with over 15 years of experience in strategic business development and innovation."
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Creative Strategy",
      image: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      description: "Marcus brings creative excellence to every project, delivering compelling brand experiences."
    },
    {
      name: "Elena Vasquez",
      role: "Director of Operations",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      description: "Elena ensures operational excellence through systematic processes and people-first approaches."
    },
    {
      name: "David Park",
      role: "Technology Lead",
      image: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop",
      description: "David architects cutting-edge solutions that drive digital transformation and innovation."
    }
  ];

  const content = {
    Innovation: {
      text: "We push boundaries and embrace cutting-edge solutions to solve complex business challenges.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      icon: Lightbulb
    },
    Collaboration: {
      text: "Success comes through partnership. We work closely with clients and teams to deliver great results.",
      image: "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      icon: Users
    },
    Excellence: {
      text: "We maintain the highest standards and deliver quality solutions that drive real impact.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      icon: Target
    }
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
          {teamMembers.slice(0, 3).map((member, index) => (
            <button 
              key={index} 
              onClick={() => setSelectedUser(member)}
              className="focus:outline-none transform transition-transform hover:scale-110 duration-300"
            >
              <img
                src={member.image}
                loading="lazy"
                alt={`Team member ${member.name}`}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </button>
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
                role="button"
                tabIndex={0}
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
                loading="lazy"
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
            modules={[Navigation, Pagination, Autoplay]}
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
                  <button 
                    onClick={() => setSelectedUser(member)}
                    className="focus:outline-none w-full"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      className="w-48 h-48 mx-auto rounded-full object-cover mb-6 border-4 border-white shadow-md"
                    />
                  </button>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                  <p className="text-primary mb-4 font-medium">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
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
          <div className="mx-auto flex flex-col justify-center sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => handleClick()}
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
      
      {/* User Profile Modal */}
      {selectedUser && (
        <UserPage 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </section>
  );
};

export default AboutSection;