const RibbonText = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-40">
      {/* First Ribbon - Rotated Left */}
      <div className="absolute w-screen max-w-[120%] bg-[#FEF9ED] text-[#170E3D] font-medium text-lg rotate-[8deg] px-5 py-6 flex justify-around shadow-lg">
        <span>Social Media Management</span>
        <span>+</span>
        <span>Branding</span>
        <span>+</span>
        <span>Hatma Prime</span>
        <span>+</span>
        <span>Business Registration</span>
      </div>

      {/* Second Ribbon - Rotated Right */}
      <div className="absolute w-screen max-w-[120%] bg-[#FEF9ED] text-[#170E3D] font-medium text-lg -rotate-[8deg] px-5 py-6 flex justify-around shadow-lg">
        <span>Business Registration</span>
        <span>+</span>
        <span>Social Media Management</span>
        <span>+</span>
        <span>Brand Development</span>
        <span>+</span>
        <span>Design Service</span>
      </div>
    </div>
  );
};

export default RibbonText;