// src/pages/Login.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";
import { LoaderCircle } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import GoogleLogin from "./GoogleLogin";
import { trackEvent } from "../utils/trackEvent";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success === true) {
      await trackEvent("session", {
        action: "login",
        userId: user._id,
        email: user.email,
      });

      const redirectTo = new URLSearchParams(location.search).get("redirectTo") || "/";
      navigate(redirectTo);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative pb-10">
      <div className="w-full bg-white py-4 px-6 flex justify-center items-center z-10">
        <header className="w-full max-w-6xl flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to={"/"}>
              <img src={logo} alt="Logo" className="w-[200px] h-auto" />
            </Link>
          </div>
        </header>
      </div>

      <div className="absolute top-16 w-11/12 max-w-6xl bg-primary h-60 rounded-xl flex justify-center items-center shadow-md"></div>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full relative z-10 mt-20">
        <h2 className="text-2xl font-semibold text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="e.g. zuliat@example.com"
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

          <div className="text-right mb-4 text-sm">
            <Link to="/forgot-password" className="text-red-500 hover:underline">
              Forgot password
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 flex justify-center rounded-md font-semibold hover:bg-yellow-600 transition"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Login"}
          </button>
        </form>

        <button
          disabled={loading}
          className="w-full flex justify-center mt-4 font-semibold"
        >
          <GoogleLogin />
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{' '}
          <Link to={'/signup'} className="text-yellow-500 font-semibold hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
