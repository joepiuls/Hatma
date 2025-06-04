const ApproachSection = () => {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Title and Description */}
        <div className="bg-blue-100 p-10 flex flex-col justify-center">
          <h3 className="text-sm font-semibold uppercase text-gray-700">Our Approach</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-black mt-3">
            The complete solution your business needs to grow without limits
          </h2>
        </div>
  
        {/* Right Side: Features List */}
        <div className="bg-yellow-50 p-10 flex flex-col justify-center space-y-6">
          <FeatureCard 
            title="Holistic support" 
            description="Offering end-to-end solutions that cover every aspect of brand growth, from design to digital strategy." 
          />
          <FeatureCard 
            title="Adaptability" 
            description="Tailored services that can scale with your business, ensuring flexibility to meet your evolving needs." 
          />
          <FeatureCard 
            title="Innovation" 
            description="Combining innovative strategies with practical insights to drive sustainable growth and maximize impact." 
          />
        </div>
      </section>
    );
  };
  
  const FeatureCard = ({ title, description }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    );
  };
  
  export default ApproachSection;
  