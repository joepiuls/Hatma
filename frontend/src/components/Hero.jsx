import RibbonText from './RibbonText';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Hero = () => {
  const {user} = useAuthStore();
  return (
    <section className="relative bg-[#170E3D] text-white py-24 flex flex-col items-center text-center">
      {/* Hero Content */}
      <div className="max-w-2xl z-10">
        <h1 className="text-5xl font-bold mb-6 ">
          Transforming Ideas into Branding Success
        </h1>
        <p className="text-lg text-gray-300 px-4 leading-tight">
        With our tailored services and e-commerce solutions, you're not just accessing tools; 
        you're investing in empowerment and excellence. 
        We help you grow with solutions designed to elevate your brand and boost your success.
        </p>

        {!user && <Link to={"/signup"}>
        <button className="mt-8 px-20 py-2 bg-[#F3AB14] text-black font-semibold rounded-lg shadow-md hover:bg-[#E2A010] transition-all">
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
