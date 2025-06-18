import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { 
  ExternalLink, 
  ArrowRight, 
  Filter, 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  Award,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";



const OurWork = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const categories = ['All', 'Branding', 'Digital Marketing', 'Web Development', 'Strategy'];

  const projects = [
    {
      id: 1,
      title: "TechFlow Solutions",
      category: "Branding",
      client: "B2B SaaS Startup",
      year: "2024",
      duration: "3 months",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Complete brand identity redesign for a growing SaaS company, including logo, visual system, and brand guidelines.",
      results: [
        { metric: "Brand Recognition", value: "85%", icon: Award },
        { metric: "Customer Engagement", value: "+150%", icon: TrendingUp },
        { metric: "Lead Generation", value: "+200%", icon: Target }
      ],
      tags: ["Brand Identity", "Logo Design", "Visual System"],
      challenge: "TechFlow needed a modern, trustworthy brand identity that would resonate with enterprise clients while maintaining approachability for smaller businesses.",
      solution: "We developed a clean, professional visual identity with modular elements that could adapt across different touchpoints and market segments.",
      testimonial: {
        text: "The new brand identity has transformed how our clients perceive us. We've seen a significant increase in enterprise inquiries.",
        author: "Sarah Chen, CEO"
      }
    },
    {
      id: 2,
      title: "GreenEarth Initiative",
      category: "Digital Marketing",
      client: "Environmental NGO",
      year: "2024",
      duration: "6 months",
      image: "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Comprehensive digital marketing campaign to raise awareness and drive donations for environmental conservation.",
      results: [
        { metric: "Social Reach", value: "2.5M", icon: Users },
        { metric: "Donation Increase", value: "+300%", icon: TrendingUp },
        { metric: "Volunteer Sign-ups", value: "+450%", icon: Target }
      ],
      tags: ["Social Media", "Content Strategy", "Campaign Management"],
      challenge: "GreenEarth needed to amplify their message and reach younger demographics to increase environmental awareness and action.",
      solution: "We created an integrated digital campaign using storytelling, user-generated content, and strategic partnerships to maximize impact.",
      testimonial: {
        text: "This campaign exceeded all our expectations. The team's creativity and strategic thinking made all the difference.",
        author: "Marcus Rodriguez, Director"
      }
    },
    {
      id: 3,
      title: "RetailMax Platform",
      category: "Web Development",
      client: "E-commerce Retailer",
      year: "2024",
      duration: "4 months",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Custom e-commerce platform development with advanced analytics and inventory management capabilities.",
      results: [
        { metric: "Page Load Speed", value: "2.1s", icon: Zap },
        { metric: "Conversion Rate", value: "+180%", icon: TrendingUp },
        { metric: "User Retention", value: "+220%", icon: Users }
      ],
      tags: ["E-commerce", "Custom Development", "Analytics"],
      challenge: "RetailMax needed a scalable platform that could handle high traffic volumes while providing detailed analytics and seamless user experience.",
      solution: "We built a custom solution with microservices architecture, real-time analytics, and progressive web app capabilities.",
      testimonial: {
        text: "The platform has revolutionized our operations. Sales have increased dramatically since launch.",
        author: "Elena Vasquez, CTO"
      }
    },
    {
      id: 4,
      title: "FinanceForward Strategy",
      category: "Strategy",
      client: "Financial Services",
      year: "2023",
      duration: "2 months",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Strategic business transformation and digital adoption roadmap for a traditional financial services firm.",
      results: [
        { metric: "Digital Adoption", value: "95%", icon: Target },
        { metric: "Operational Efficiency", value: "+160%", icon: TrendingUp },
        { metric: "Customer Satisfaction", value: "4.8/5", icon: Award }
      ],
      tags: ["Business Strategy", "Digital Transformation", "Process Optimization"],
      challenge: "FinanceForward needed to modernize their operations and embrace digital transformation while maintaining regulatory compliance.",
      solution: "We developed a phased transformation strategy with clear milestones, training programs, and technology integration plans.",
      testimonial: {
        text: "The strategic roadmap provided clear direction for our digital transformation. Results exceeded projections.",
        author: "David Park, Managing Director"
      }
    },
    {
      id: 5,
      title: "HealthTech Connect",
      category: "Branding",
      client: "Healthcare Technology",
      year: "2023",
      duration: "5 months",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Brand positioning and visual identity for a healthcare technology platform connecting patients with specialists.",
      results: [
        { metric: "Brand Trust Score", value: "92%", icon: Award },
        { metric: "User Acquisition", value: "+250%", icon: Users },
        { metric: "Platform Adoption", value: "+180%", icon: TrendingUp }
      ],
      tags: ["Healthcare Branding", "Trust Building", "User Experience"],
      challenge: "Building trust and credibility in the sensitive healthcare sector while making technology accessible to all demographics.",
      solution: "We created a warm, professional brand identity that emphasizes human connection and medical expertise.",
      testimonial: {
        text: "The branding perfectly captures our mission. Patients and doctors immediately understand and trust our platform.",
        author: "Dr. Amanda Foster, Founder"
      }
    },
    {
      id: 6,
      title: "EduTech Revolution",
      category: "Digital Marketing",
      client: "Educational Platform",
      year: "2023",
      duration: "8 months",
      image: "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      description: "Multi-channel marketing campaign to promote online learning platform and increase student enrollment.",
      results: [
        { metric: "Student Enrollment", value: "+400%", icon: Users },
        { metric: "Course Completion", value: "89%", icon: Target },
        { metric: "Revenue Growth", value: "+350%", icon: TrendingUp }
      ],
      tags: ["Education Marketing", "Student Acquisition", "Content Marketing"],
      challenge: "Competing in the crowded online education market while demonstrating real learning outcomes and value.",
      solution: "We developed a content-first strategy showcasing student success stories and created targeted campaigns for different learning segments.",
      testimonial: {
        text: "The marketing strategy transformed our business. We went from startup to market leader in less than a year.",
        author: "James Wilson, CEO"
      }
    }
  ];
const backgroundPattern = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  };

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const stats = [
    { label: "Projects Completed", value: "150+", icon: Award },
    { label: "Happy Clients", value: "98%", icon: Users },
    { label: "Years Experience", value: "8+", icon: Calendar },
    { label: "Industries Served", value: "25+", icon: Target }
  ];

  return (
       <section className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] py-20 px-4 md:px-8 lg:px-16">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-[#170E3D]/10 text-[#170E3D] px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Eye size={16} />
          Our Portfolio
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-[#030712] mb-6 leading-tight">
          Transforming Ideas Into 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#170E3D] to-[#F3AB14]"> Success Stories</span>
        </h1>
        
        <p className="text-xl text-[#6D6464] mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover how we've helped businesses across industries achieve remarkable growth through 
          strategic innovation, creative excellence, and data-driven solutions.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#170E3D]/10 to-[#F3AB14]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent size={24} className="text-[#170E3D]" />
                </div>
                <div className="text-3xl font-bold text-[#030712] mb-1">{stat.value}</div>
                <div className="text-sm text-[#6D6464] font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-[#6D6464] mr-4">
            <Filter size={20} />
            <span className="font-medium">Filter by:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-[#170E3D] to-[#F3AB14] text-white shadow-lg transform scale-105'
                  : 'bg-white text-[#6D6464] hover:bg-[#f8fafc] hover:text-[#170E3D] border border-[#D4D4D4] hover:border-[#170E3D]/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[#170E3D] px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ExternalLink size={20} className="text-[#170E3D]" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-[#030712] group-hover:text-[#170E3D] transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-sm text-[#BDBDBD]">{project.year}</span>
                </div>
                
                <p className="text-[#6D6464] mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#BDBDBD]">
                    {project.client}
                  </div>
                  <div className="flex items-center gap-1 text-[#170E3D] font-medium text-sm group-hover:gap-2 transition-all">
                    View Case Study
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Case Study Carousel */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#030712] mb-4">
            Featured Case Studies
          </h2>
          <p className="text-lg text-[#6D6464] max-w-2xl mx-auto">
            Deep dive into our most impactful projects and the strategies that drove success
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            effect="fade"
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            autoplay={{ 
              delay: 6000,
              disableOnInteraction: false 
            }}
            loop={true}
            className="case-study-swiper rounded-3xl overflow-hidden shadow-2xl"
          >
            {projects.slice(0, 3).map((project) => (
              <SwiperSlide key={project.id}>
                <div className="relative h-96 md:h-[500px]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/80 via-[#030712]/40 to-transparent"></div>
                  
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-2xl mx-auto px-8 text-white">
                      <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
                        {project.category}
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-bold mb-4">
                        {project.title}
                      </h3>
                      
                      <p className="text-lg mb-6 text-[#D4D4D4]">
                        {project.description}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        {project.results.map((result, index) => {
                          const IconComponent = result.icon;
                          return (
                            <div key={index} className="text-center">
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-2">
                                <IconComponent size={20} className="text-white" />
                              </div>
                              <div className="text-2xl font-bold">{result.value}</div>
                              <div className="text-sm text-[#D4D4D4]">{result.metric}</div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="bg-white text-[#030712] px-8 py-3 rounded-xl font-semibold hover:bg-[#f8fafc] transition-colors duration-300 inline-flex items-center gap-2"
                      >
                        View Full Case Study
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div 
            ref={prevRef}
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-all duration-300 group"
            aria-label="Previous case study"
          >
            <ChevronLeft size={20} className="text-[#170E3D] group-hover:scale-110 transition-transform" />
          </div>
          <div 
            ref={nextRef}
            className="absolute top-1/2 -translate-y-1/2 right-4 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-all duration-300 group"
            aria-label="Next case study"
          >
            <ChevronRight size={20} className="text-[#170E3D] group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-[#170E3D] via-[#1A2E62] to-[#F3AB14] rounded-3xl p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={backgroundPattern}></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target size={16} />
              Ready to Start Your Project?
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's Create Your Success Story
            </h3>
            <p className="text-[#D4D4D4] mb-8 max-w-xl mx-auto text-lg">
              Join the growing list of businesses that have transformed their operations with our expertise
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#170E3D] px-8 py-4 rounded-xl font-semibold hover:bg-[#f8fafc] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
                Start Your Project
                <ArrowRight size={20} />
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2">
                View All Work
                <Eye size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-64 md:h-80 object-cover"
                loading="lazy"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} className="text-[#170E3D]" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-[#170E3D]/10 text-[#170E3D] px-3 py-1 rounded-full text-sm font-medium">
                  {selectedProject.category}
                </span>
                <span className="text-[#BDBDBD]">{selectedProject.year}</span>
                <span className="text-[#BDBDBD]">•</span>
                <span className="text-[#BDBDBD]">{selectedProject.duration}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-[#030712] mb-4">
                {selectedProject.title}
              </h2>
              
              <p className="text-lg text-[#6D6464] mb-8">
                {selectedProject.description}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {selectedProject.results.map((result, index) => {
                  const IconComponent = result.icon;
                  return (
                    <div key={index} className="text-center p-4 bg-[#f8fafc] rounded-xl">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-[#170E3D]/10 text-[#170E3D] rounded-xl mb-3">
                        <IconComponent size={20} />
                      </div>
                      <div className="text-2xl font-bold text-[#030712]">{result.value}</div>
                      <div className="text-sm text-[#6D6464]">{result.metric}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#030712] mb-3">Challenge</h3>
                  <p className="text-[#6D6464]">{selectedProject.challenge}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[#030712] mb-3">Solution</h3>
                  <p className="text-[#6D6464]">{selectedProject.solution}</p>
                </div>
                
                <div className="bg-gradient-to-r from-[#170E3D]/10 to-[#F3AB14]/10 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#030712] mb-3">Client Testimonial</h3>
                  <blockquote className="text-[#170E3D] italic mb-3">
                    "{selectedProject.testimonial.text}"
                  </blockquote>
                  <cite className="text-[#170E3D] font-medium">
                    — {selectedProject.testimonial.author}
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OurWork;