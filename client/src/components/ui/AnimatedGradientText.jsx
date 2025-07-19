import React from "react";
import { motion } from "framer-motion";

const AnimatedGradientText = ({ children, className }) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      style={{
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundSize: "200% 200%",
        backgroundImage:
          "linear-gradient(45deg, #ff2525, #ff7575, #ffffff, #ff7575, #ff2525)",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 5,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedGradientText;
