import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaLess } from "react-icons/fa";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { LoaderCircle } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import Googlelogin from "./GoogleLogin";


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {signUp, loading} = useAuthStore(); 

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await signUp(data);
    toast.success('Sucessfully SignedUp');
    navigate('/login');
};



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative pb-20">
      {/* Top Bar */}
      <div className="w-full bg-white shadow-xl py-4 px-6 flex justify-center items-center z-10">
        <header className="w-full max-w-6xl flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to={"/"}>
              <img src={logo} alt="Logo" className="w-[200px] h-auto" />
            </Link>
          </div>
        </header>
      </div>

      {/* Background */}
      <div className="absolute top-16 w-11/12 max-w-6xl bg-primary h-60 rounded-xl flex justify-center items-center shadow-md"></div>

      {/* Signup Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full relative z-10 mt-20">
        <h2 className="text-2xl font-semibold text-center mb-6">Create an Account</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              className={`w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-yellow-500"
              }`}
              {...register("name", { required: "Full Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

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

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className={`w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-yellow-500"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              className={`w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-yellow-500"
              }`}
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 
            rounded-md font-semibold hover:bg-yellow-600 flex justify-center transition"
          >
            {loading ? <LoaderCircle  className="animate-spin " /> : 'Sign Up'}
          </button>
        </form>

        {/* Google Signup */}
        <button
        disabled={loading}
        className="w-full flex justify-center 
         mt-4 font-semibold">
         {loading ? <LoaderCircle className="animate-spin" />  : 
         <div>
           <Googlelogin /> 
          </div>}
        </button>

        {/* Login Link */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
