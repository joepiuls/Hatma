import { useEffect, useRef, useState } from 'react';

const RibbonText = () => {
  const ribbon1Ref = useRef(null);
  const ribbon2Ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Continuous subtle rotation animation
    const animateRibbons = () => {
      let rotation1 = 0;
      let rotation2 = 0;

      const animate = () => {
        rotation1 += 0.3;
        rotation2 -= 0.2;

        if (ribbon1Ref.current) {
          const baseRotation = 8;
          const oscillation = Math.sin(rotation1 * 0.01) * 2;
          ribbon1Ref.current.style.transform = `rotate(${baseRotation + oscillation}deg) translateZ(0)`;
        }
        
        if (ribbon2Ref.current) {
          const baseRotation = -8;
          const oscillation = Math.cos(rotation2 * 0.01) * 2;
          ribbon2Ref.current.style.transform = `rotate(${baseRotation + oscillation}deg) translateZ(0)`;
        }

        requestAnimationFrame(animate);
      };

      animate();
    };

    if (isVisible) {
      animateRibbons();
    }

    return () => clearTimeout(timer);
  }, [isVisible]);

  const services1 = [
    'Social Media Management',
    'Brand Development', 
    'Digital Marketing',
    'Content Strategy'
  ];

  const services2 = [
    'Business Registration',
    'Corporate Branding',
    'Design Services', 
    'Marketing Solutions'
  ];

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-48 overflow-hidden">
      {/* First Ribbon */}
      <div
        ref={ribbon1Ref}
        className={`absolute w-[120%] max-w-none bg-gradient-to-r from-ribbon-cream to-ribbon-cream-dark 
          text-ribbon-text font-semibold text-lg tracking-wide px-8 py-6 
          shadow-xl border border-ribbon-text/5 backdrop-blur-sm
          transition-all duration-700 ease-out transform-gpu
          hover:shadow-2xl hover:-translate-y-1
          ${isVisible ? 'opacity-100 animate-slide-in-left' : 'opacity-0'}
          rotate-[8deg] z-10`}
        style={{ 
          animationDelay: '0.2s',
          willChange: 'transform'
        }}
      >
        <div className="flex justify-around items-center w-full whitespace-nowrap">
          {services1.map((service, index) => (
            <span key={index} className="relative px-2 transition-all duration-300 hover:scale-105 hover:text-ribbon-text-hover">
              {service}
              {index < services1.length - 1 && (
                <span className="mx-4 font-light opacity-60 text-xl">+</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Second Ribbon */}
      <div
        ref={ribbon2Ref}
        className={`absolute w-[120%] max-w-none bg-gradient-to-r from-ribbon-blue to-ribbon-blue-dark 
          text-ribbon-text font-semibold text-lg tracking-wide px-8 py-6 
          shadow-xl border border-ribbon-text/5 backdrop-blur-sm
          transition-all duration-700 ease-out transform-gpu
          hover:shadow-2xl hover:-translate-y-1
          ${isVisible ? 'opacity-100 animate-slide-in-right' : 'opacity-0'}
          -rotate-[8deg] z-0`}
        style={{ 
          animationDelay: '0.5s',
          willChange: 'transform'
        }}
      >
        <div className="flex justify-around items-center w-full whitespace-nowrap">
          {services2.map((service, index) => (
            <span key={index} className="relative px-2 transition-all duration-300 hover:scale-105 hover:text-ribbon-text-hover">
              {service}
              {index < services2.length - 1 && (
                <span className="mx-4 font-light opacity-60 text-xl">+</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RibbonText;