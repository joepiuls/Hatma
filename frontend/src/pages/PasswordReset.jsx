import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "../../firebaseConfig";
import { confirmPasswordReset } from "firebase/auth";
import logo from "../assets/Logo.png";
import "react-toastify/dist/ReactToastify.css";

function PasswordResetForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  // Get reset token from URL
  const searchParams = new URLSearchParams(location.search);
  const resetToken = searchParams.get("oobCode");

  const password = watch("password", "");

  // 🔹 Handle Password Reset
  const onSubmit = async (data) => {
    if (!resetToken) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, resetToken, data.password);
      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Bar */}
      <div className="w-full bg-white py-4 px-6 flex justify-center items-center z-10 absolute top-0">
        <header className="w-full max-w-6xl flex justify-between items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-[200px] h-auto" />
          </Link>
        </header>
      </div>

      <div className="absolute top-16 w-11/12 max-w-6xl bg-primary h-60 rounded-xl flex justify-center items-center shadow-md"></div>

      {/* Reset Password Form */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 relative z-10 mt-20">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">Reset Password</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* New Password Field */}
          <div className="mb-6">
            <label className="block font-medium mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z]|.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{8,}$/,
                    message: "Password must contain at least 8 characters with one special character",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-secondary text-white font-medium rounded-md mb-3 hover:bg-yellow-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={!isValid || loading}
          >
            {loading ? "Updating..." : "Continue"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            className="w-full py-2 px-4 bg-gray-200 text-black font-medium rounded-md hover:bg-gray-300 transition"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordResetForm;
