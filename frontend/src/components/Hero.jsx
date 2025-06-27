import RibbonText from './RibbonText';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { trackConversion } from '../utils/trackEvent';

const Hero = () => {
  const {user} = useAuthStore();

  const handleClick = () => {
    trackConversion('sign-up', 1);
  };
  
  return (
    <section className="relative bg-[#170E3D] text-white py-24 flex flex-col items-center text-center">
      {/* Hero Content */}
      <div className="max-w-2xl z-10">
        <h1 className="text-5xl font-bold mb-6 ">
          Helping SMEs Build Successful Brands 
        </h1>
        <p className="text-lg text-gray-300 px-4 leading-tight">
        With our tailored services and e-commerce for small and medium-sized enterprises (SMEs), 
        you're not just accessing tools; you're investing in growth to build your brand, expand your reach, 
        and evolve with the digital era.
        </p>

        {!user && <Link to={"/signup"}>
        <button
          onClick={handleClick}
          className="mt-8 px-20 py-2 bg-[#F3AB14] text-black font-semibold rounded-lg shadow-md hover:bg-[#E2A010] transition-all">
          Sign up
        </button>
        </Link>}
        
      </div>

      {/* Centered Crossed Ribbons */}
      <div className="w-full flex justify-center mt-16">
        <RibbonText />
      </div>
    </section>
  );
};

export default Hero;
