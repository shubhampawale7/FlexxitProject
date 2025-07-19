import React from "react";
import { Link } from "react-router-dom";
import { FaTv, FaSearch, FaList, FaPalette } from "react-icons/fa";
import Accordion from "../components/ui/Accordion";
import { motion } from "framer-motion";
import AnimatedGradientText from "../components/ui/AnimatedGradientText";

const faqData = [
  {
    question: "What is Flexxit?",
    answer:
      "Flexxit is a Netflix clone built for demonstration purposes, showcasing a modern, feature-rich web application using the MERN stack. It includes features like user authentication, content Browse, a personal watchlist, and much more.",
  },
  {
    question: "What can I watch on Flexxit?",
    answer:
      "Flexxit uses the TMDB API to feature a wide variety of movies and TV shows, from trending hits to timeless classics across many genres.",
  },
  {
    question: "Is Flexxit free?",
    answer:
      "Yes, this project is completely free to use as it is a portfolio piece designed to showcase full-stack development skills.",
  },
];

const FeatureCard = ({ icon, title, text, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="relative p-8 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-neutral-800"
    >
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full mx-auto mb-6">
          {icon}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-neutral-600 dark:text-neutral-400">{text}</p>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  return (
    <div className="bg-gray-50 dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-black z-0">
          <div className="absolute inset-0 bg-grid-gray-200/[0.6] dark:bg-grid-neutral-800/[0.4] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10"
        >
          <AnimatedGradientText className="text-5xl md:text-8xl font-black tracking-tighter">
            Your Next Binge Awaits.
          </AnimatedGradientText>
          <p className="text-lg md:text-2xl mt-6 max-w-2xl mx-auto text-neutral-700 dark:text-neutral-300">
            Discover thousands of movies and TV shows. Save your favorites.
            Watch the trailers. All in one place.
          </p>
          <Link
            to="/signup"
            className="mt-10 inline-block bg-red-600 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-red-500/50"
          >
            Start Your Journey
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 bg-white dark:bg-neutral-950">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Everything You Need, <br /> and More.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<FaTv className="text-3xl text-red-500" />}
              title="Endless Content"
              text="Explore a vast library of movies and TV shows powered by the TMDB API."
              index={0}
            />
            <FeatureCard
              icon={<FaList className="text-3xl text-red-500" />}
              title="Personalized Lists"
              text="Keep track of what to watch next with your own customizable 'My List'."
              index={1}
            />
            <FeatureCard
              icon={<FaSearch className="text-3xl text-red-500" />}
              title="Instant Search"
              text="Find any title in seconds with our live, autocomplete search bar."
              index={2}
            />
            <FeatureCard
              icon={<FaPalette className="text-3xl text-red-500" />}
              title="Custom Experience"
              text="Choose your look with light & dark themes and personalize your profile avatar."
              index={3}
            />
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold text-center mb-10"
          >
            Any Questions?
          </motion.h2>
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-neutral-800">
            {faqData.map((faq, index) => (
              <Accordion key={index} title={faq.question}>
                <p>{faq.answer}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
