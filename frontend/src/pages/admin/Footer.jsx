import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1E1B3F] text-white py-4 px-6 flex justify-between items-center">
      <div className="text-sm">
        Copyrights 2024. Hatma Brandtech. All rights reserved
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm mr-2">Social media</span>
        <div className="flex gap-4">
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#FFA500] hover:text-[#FFB52E] transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#FFA500] hover:text-[#FFB52E] transition-colors"
          >
            <FaFacebook size={24} />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#FFA500] hover:text-[#FFB52E] transition-colors"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;