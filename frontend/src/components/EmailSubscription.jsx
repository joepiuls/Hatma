import { useState } from "react";
// import { db } from "../firebase"; // Import Firebase config
// import { collection, addDoc } from "firebase/firestore";

const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setMessage("Invalid email address");
      return;
    }

    // try {
    //   await addDoc(collection(db, "subscribers"), { email });
    //   setMessage("Subscribed successfully!");
    //   setEmail("");
    // } catch (error) {
    //   setMessage("Subscription failed. Try again.");
    // }
  };

  return (
    <div className="w-full bg-[#C5B4ED] py-20 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section: Heading & Subtext */}
        <div className="text-black">
          <h2 className="text-2xl font-bold">Stay informed with us</h2>
          <p className="text-sm mt-1">Sign up for our newsletter to receive updates</p>
        </div>


        <div className="flex flex-col">
        {/* Right Section: Input & Button */}
        <div className="flex items-center mt-4 md:mt-0">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-[250px] md:w-[300px] px-4 py-2 border rounded-l-md focus:outline-none"
          />
          <button className="bg-secondary text-black px-6 py-2 rounded-r-md hover:bg-secondary">
            Subscribe
          </button>
        </div>
            {/* Privacy Policy Notice */}
            <p className="text-xs mt-2">
                By subscribing, you agree to our <a href="#" className="text-primary underline">privacy policy</a>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default EmailSubscription;
