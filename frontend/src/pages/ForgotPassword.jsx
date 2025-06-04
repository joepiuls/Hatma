import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import useAuthStore from "../store/useAuthStore";



const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await forgotPassword(data.email);
    toast[res.success ? 'success' : 'error'](res.message);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen relative">
          {/* Top Bar */}
          <div className="w-full bg-white py-4 px-6 flex justify-center items-center z-10 absolute top-0">
            <header className="w-full max-w-6xl flex justify-between items-center">
              <div className="flex items-center space-x-2">
              <Link to={"/"}>
                 <img src={logo}  alt="Logo" className="w-[200px] h-auto" />
              </Link>
              </div>
            </header>
          </div>

      {/* Background */}
      <div className="absolute top-16 w-11/12 max-w-6xl bg-primary h-60 rounded-xl flex justify-center items-center shadow-md"></div>

      {/* Forgot Password Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full relative z-10 mt-20">
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Your Password</h2>
        <p className="text-center text-gray-600 mb-4">Enter your email address and we’ll send you a link to reset your password.</p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              className={`w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-yellow-500"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 rounded-md 
            font-semibold hover:bg-yellow-600 transition flex justify-center"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center mt-4 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-yellow-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
