import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg text-center">
        {/* Error Code */}
        <h1 className="text-9xl font-bold text-primary mb-4 animate-bounce">
          403
        </h1>
        
        {/* Error Message */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops! Unauthorized Access
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">
          You do not have permission to view this page.
          Please check your access rights or contact support if you believe this is an error.
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-block bg-secondary text-black px-8 py-3 rounded-lg
          hover:bg-warning transition-transform transform hover:scale-105
          font-medium text-lg"
        >
            Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;