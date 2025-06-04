import { ShoppingCart } from "lucide-react";
import Frame from "../assets/frame.png";

const products = [
  {
    title: "Headphones",
    price: "NGN 5000.00",
    image: Frame,
    link: "/product/headphones",
  },
  {
    title: "Selfie Stick",
    price: "NGN 5000.00",
    image: Frame,
    link: "/product/selfie-stick",
  },
  {
    title: "Earbuds",
    price: "NGN 5000.00",
    image: Frame,
    link: "/product/earbuds",
  },
  {
    title: "Earbuds",
    price: "NGN 5000.00",
    image: Frame,
    link: "/product/earbuds",
  },
];

export default function ProductDisplay() {
  return (
    <div className="py-10 px-6 md:px-16">
      <div className="text-left mb-8">
      <h2 className="text-xl font-bold text-secondary">Discover</h2>
        <h2 className="text-3xl font-bold text-primary">Shop</h2>
        <p className="text-gray-500 max-w-xl">
          Enhance your workflow with high-quality digital gadgets.
        </p>
      </div>

      {/* Product Grid */}
      <div className="flex flex-wrap  gap-4">
      {products.map((product, index) => (
        <div key={index} className="card w-72 bg-white shadow-black shadow-sm p-5 rounded-xl overflow-hidden">
          {/* Image Section - Takes up Most of the Card */}
          <div className="relative h-60">
            <img 
              src={product.image} 
              alt={product.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            {/* Shopping Cart Icon Button */}
            <a 
              href={product.link} 
              className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </a>
          </div>

          {/* Product Details Below Image */}
          <div className="card-body flex flex-col items-center p-4">
            <h3 className="card-title text-lg font-bold">{product.title}</h3>
            <p className="text-gray-600">{product.price}</p>

            {/* Buy Now Button */}
            <button className="btn btn-warning btn-sm w-full text-white mt-3">
              Buy now
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
