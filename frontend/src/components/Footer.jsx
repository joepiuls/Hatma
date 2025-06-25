import { Link } from "react-router-dom";
import { FaSquareXTwitter, FaTiktok, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="w-full bg-[#0D0431] text-white text-sm py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-8">
        
        {/* Get in Touch */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in touch</h3>
          <p className="mb-5">Phone number</p>
          <p className="mb-5">Email</p>
          <p className="mb-5">Address</p>
          <div className="flex space-x-4 mt-6">
            <Link to="https://www.linkedin.com/in/hatma-group-8b1b382b9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
              <FaLinkedin className="w-7 h-7 text-yellow-500 cursor-pointer hover:text-yellow-300" />
            </Link>
            <Link to="https://www.facebook.com/positivemindseti?mibextid=ZbWKwL">
              <FaFacebook className="w-7 h-7 text-yellow-500 cursor-pointer hover:text-yellow-300" />
            </Link>
            <Link to="https://x.com/hatmabrandtek?t=wIPjIj7ihvZayYxrrjB8zg&s=09">
              <FaSquareXTwitter className="w-7 h-7 text-yellow-500 cursor-pointer hover:text-yellow-300" />
            </Link>

            <Link to="https://www.instagram.com/hatmabrandtech?igsh=MTV3ZHAwNHcyY3Q2bw==">
              <FaInstagram className="w-7 h-7 text-yellow-500 cursor-pointer hover:text-yellow-300" />
            </Link>
            <Link to="https://www.tiktok.com/@hatma.brandtech?_t=8kcY36MSgFx&_r=1">
              <FaTiktok className="w-7 h-7 text-yellow-500 cursor-pointer hover:text-yellow-300" />
            </Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <Link to="/about" className="block mb-5 hover:text-yellow-400">About us</Link>
          <Link to="/partners" className="block mb-5 hover:text-yellow-400">Partners</Link>
          <Link to="/hatma-prime" className="block mb-5 hover:text-yellow-400">Hatma Prime</Link>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <Link to="/shop" className="block mb-3 hover:text-yellow-400">Shop</Link>
          <Link to="/brand-development" className="block mb-5 hover:text-yellow-400">Brand Development</Link>
          <Link to="/cac-registeration" className="block mb-5 hover:text-yellow-400">Business Registration</Link>
          <Link to="/digital-marketing" className="block mb-5 hover:text-yellow-400">Digital Marketing</Link>
          <Link to="/contact" className="block mb-5 hover:text-yellow-400">Find an Expert</Link>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <Link to="/help-center" className="block mb-5 hover:text-yellow-400">Help Center</Link>
          <Link to="/faq" className="block mb-5 hover:text-yellow-400">FAQs</Link>
          <Link to="/pricing" className="block mb-5 hover:text-yellow-400">Pricing</Link>
          <Link to="/blog" className="block mb-5 hover:text-yellow-400">Blog</Link>
        </div>

        {/* Regulations & Earnings */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Regulations</h3>
          <Link to="/legal-rights" className="block mb-5 hover:text-yellow-400">Legal Rights</Link>
          <Link to="/refund-policy" className="block mb-5 hover:text-yellow-400">Refund Policy</Link>
          <Link to="/terms" className="block mb-3 hover:text-yellow-400">Terms & Conditions</Link>
          <Link to="/privacy-policy" className="block mb-5 hover:text-yellow-400">Privacy Policy</Link>
        </div>

        <div>
          <h3 className="text-lg font-semibold mt-6 mb-4">Earn with Hatma</h3>
          <Link to="/sell-on-hatma" className="block mb-5 hover:text-yellow-400">Sell on Hatma</Link>
          <Link to="/vendors-hub" className="block mb-5 hover:text-yellow-400">Vendors Hub</Link>
          <Link to="/join-experts" className="block mb-5 hover:text-yellow-400">Join the Experts</Link>
          <Link to="/jobs" className="block mb-3 hover:text-yellow-400">Job Openings</Link>
        </div>
        
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">Copyrights {currentYear}. Hatma Brandtech. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
