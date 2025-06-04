// components/ServiceTabs.jsx
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import image from "../assets/seo_image.jpg"; 

const services = {
  "HATMA PRIME": {
    description: "You don't have to be a content creator, writer, speaker, influencer or Algorithm expert to shine your brand across social media platforms. Hatma prime does it all while you sleep.",
    image: image,
    offerings: [
      "Brand Audit and Optimization",
      "Brand Partnership and Sponsorship Strategy",
      "Brand monitoring and Management"
    ],
  },
  "BRAND DEVELOPMENT": {
    description: "Develop a solid foundation for your brand, ensuring it resonates deeply with your target audience through storytelling, design, and positioning.",
    image: image,
    offerings: [
      "Logo Design & Identity System",
      "Brand Guidelines Creation",
      "Voice & Messaging Strategy"
    ],
  },
  "DIGITAL MARKETING": {
    description: "Reach and engage your audience with tailored strategies across SEO, social media, and content marketing.",
    image: image,
    offerings: [
      "Social Media Marketing",
      "Content Strategy",
      "Email Marketing"
    ],
  },
  "CAC REGISTRATION": {
    description: "Get your business officially registered with Corporate Affairs Commission hassle-free and efficiently.",
    image: image,
    offerings: [
      "Business Name Registration",
      "Incorporation Services",
      "CAC Documentation Support"
    ],
  },
  "BRANDING": {
    description: "Craft a visual and emotional identity that captures attention and builds lasting recognition.",
    image: image,
    offerings: [
      "Visual Design & Assets",
      "Packaging Design",
      "Brand Campaign Strategy"
    ],
  },
};

export default function ServiceTabs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = Object.keys(services);

  return (
    <div className="bg-white py-10 px-4 text-gray-800">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-primary">HATMA PRIME, an investment in empowerment and excellence.</h2>
      </div>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex flex-wrap justify-center space-x-2 mb-6">
          {tabs.map((tab, i) => (
            <Tab key={i} className={({ selected }) =>
              `px-4 py-2 rounded-md text-sm font-semibold focus:outline-none transition-all ${
                selected ? "bg-primary text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`
            }>
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {tabs.map((tab, i) => (
            <Tab.Panel key={i}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-secondary mb-4">{tab}</h3>
                  <p className="mb-6 text-gray-600">{services[tab].description}</p>
                  <ul className="space-y-4">
                    {services[tab].offerings.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md">
                        <span>{item}</span>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <img
                    src={services[tab].image}
                    alt={tab}
                    className="rounded-lg shadow-lg w-full object-cover"
                  />
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
