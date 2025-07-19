import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/common/Input";
import { FaArrowRight } from "react-icons/fa";
import AnimatedGradientText from "../components/ui/AnimatedGradientText";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    setIsLoading(true);
    try {
      await signup(formData);
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        {/* Image Panel */}
        <div className="hidden md:block relative bg-neutral-900">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1578681994506-b8f46342cc1e?q=80&w=1887&auto=format&fit=crop')",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 text-white text-center">
            <AnimatedGradientText className="text-5xl font-black tracking-tighter">
              Join Today.
            </AnimatedGradientText>
            <p className="mt-6 text-lg text-white/80">
              Become a part of the Flexxit community and unlock a universe of
              entertainment.
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full p-8 sm:p-12 bg-gray-50 dark:bg-neutral-900"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/"
              className="text-red-600 text-3xl font-black tracking-wider"
            >
              FLEXXIT
            </Link>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold text-black dark:text-white mt-8"
          >
            Create an Account
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-neutral-600 dark:text-neutral-400 mt-2 mb-8"
          >
            Start your journey with us today.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Input
                id="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 group flex items-center justify-center font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 disabled:bg-red-400 transform hover:scale-105"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && (
                  <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            </motion.div>
          </form>

          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-8"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black dark:text-white hover:text-red-500 transition-colors"
            >
              Sign in here
            </Link>
            .
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
