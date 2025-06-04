import React from 'react'
import { Link } from 'react-router-dom';


const Category = ({location}) => {
    const categories = [
    'HATMA PRIME',
    'BRAND DEVELOPMENT',
    'DIGITAL MARKETING',
    'CAC REGISTRATION',
    'BRANDING'
  ];
  return (
     <div className="flex flex-wrap justify-center gap-2 py-4 px-4 bg-white">
        {categories.map((category, index) => {
        const path = `/services/${category.toLowerCase().replace(/\s+/g, '-')}`;
        const isActive = location.pathname === path || 
                        (index === 0 && location.pathname === '/services');

        return (
            <Link
            key={index}
            to={path}
            className={`px-4 py-2 text-sm md:text-base font-medium rounded transition-all duration-300 ${
                isActive
                ? 'bg-[#1D1849] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            >
            {category}
            </Link>
        );
        })}
      </div>
  )
}

export default Category