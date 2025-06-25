import { Link } from "react-router-dom";

const solutions = [
    {
      title: "E-commerce tools",
      description:
        "Simplify your online sales with our intuitive e-commerce platform that empowers your brand to thrive.",
      button: "Learn more",
      link:'/shop'
    },
    {
      title: "Analytics and Insights",
      description:
        "Gain actionable insights with our data-driven approach, together with workshops and training that empower you to make informed decisions for your brand's growth.",
      button: "Learn more",
      link:'/services/digital-marketing'
    },
    {
      title: "Design Service",
      description:
        "Comprehensive design solutions covering brand design, UI design, and web design to elevate your business identity and differentiate you from competition.",
      button: "/services/branding",
    },
  ];
  
  const Solutions = () => {
    return (
      <section className="py-16 bg-white text-center">
        {/* Section Header */}
        <h3 className="text-yellow-500 text-lg font-semibold">Our solutions</h3>
        <h2 className="text-3xl font-bold text-[#170E3D] mt-2">
          Achieve Brand Success with our proven process
        </h2>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Equipping you with the essential elements for business growth.
        </p>
  
        {/* Solutions Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-left border border-gray-200 hover:shadow-lg transition-all"
            >
              {/* Small Yellow Square */}
              <div className="w-6 h-6 bg-yellow-500 mb-4"></div>
              <h3 className="text-xl font-bold text-[#170E3D]">{solution.title}</h3>
              <p className="text-gray-600 mt-2">{solution.description}</p>
              <Link to={solution.link || '#'} className="px-6 py-2 mt-4 inline-block">
              <button className="  bg-[#170E3D] text-white rounded-lg hover:bg-[#120B30] transition-all">
                {solution.button}
              </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default Solutions;
  