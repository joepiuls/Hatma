import { useState } from "react";
import Frame from "../assets/Frame.png";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Brand Development",
    description: [
      "360-degree brand analysis",
      "Positioning strategy",
      "Trainings and Workshops",
    ],
    image: Frame,
    link:'/services/brand-development',
  },
  {
    title: "Design Service",
    description: ["Web Design", "UI Design", "Brand Identity Design"],
    image: Frame,
    link:'/services/branding',
  },
  {
    title: "Promotions",
    description: ["Content creation", "Campaign management", "Influencer marketing"],
    image: Frame,
    link:'/services/digital-marketing',
  },
  {
    title: "Business Registration",
    description: [
      "Brand registration",
      "NGO registration",
      "Intellectual Property",
      "Legal rights",
    ],
    image: Frame,
    link:'/services/cac-registration',
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-gray-50 py-16 px-6 md:px-20 flex justify-center items-center">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-primary uppercase">Our Services</h2>
          <h3 className="text-4xl font-extrabold text-gray-900 leading-snug">
            Envision your dream with creativity and expertise
          </h3>
          <p className="mt-4 text-gray-600">
            From giving you an edge over your competitors to premium visual identity,
            protection from piracy, and increased visibility.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 justify-center items-start">
          {/* Left - Service Buttons */}
          <div className="flex flex-col w-full max-w-sm space-y-3">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all font-semibold shadow-sm border-l-4 text-gray-800 hover:bg-primary/10 hover:shadow-md ${
                  activeIndex === index
                    ? "bg-white border-primary text-primary"
                    : "bg-white border-transparent"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Right - Active Service Card */}
          <div className="flex-1">
            <div className="rounded-2xl shadow-lg bg-white overflow-hidden max-w-xl mx-auto">
              <img
                src={services[activeIndex].image}
                alt={services[activeIndex].title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {services[activeIndex].title}
                </h4>
                <ul className="space-y-2 text-gray-700">
                  {services[activeIndex].description.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">➜</span> {item}
                    </li>
                  ))}
                </ul>
                <Link to={services[activeIndex].link} className="block mt-6">
                <button className="mt-6 w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/90 transition-all">
                  See Details
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
