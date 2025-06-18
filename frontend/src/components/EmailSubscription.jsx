import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../axios";
import { trackEvent } from "../utils/trackEvent";

const EmailSubscription = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setMessage("");
    await api.post('/subscribe', data);
    setMessage("Thank you for subscribing!");
    trackEvent('subscribe', { email: data.email });
    reset(); 
  };

  return (
    <div className="w-full bg-[#C5B4ED] py-20 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section */}
        <div className="text-black">
          <h2 className="text-2xl font-bold">Stay informed with us</h2>
          <p className="text-sm mt-1">Sign up for our newsletter to receive updates</p>
        </div>

        {/* Right Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex items-center mt-4 md:mt-0">
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              className={`w-[250px] md:w-[300px] px-4 py-2 border rounded-l-md focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="submit"
              className="bg-secondary text-black px-6 py-2 rounded-r-md hover:bg-secondary"
            >
              Subscribe
            </button>
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
          {message && (
            <p className="text-green-600 text-xs mt-1">{message}</p>
          )}

          {/* Privacy Policy Notice */}
          <p className="text-xs mt-2">
            By subscribing, you agree to our{" "}
            <a href="#" className="text-primary underline">
              privacy policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default EmailSubscription;
