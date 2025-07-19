import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./MovieCard";

const rowVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const MovieRow = ({ title, movies, onMediaClick }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const { scrollXProgress } = useScroll({ container: rowRef });
  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const checkArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    // Initial check
    checkArrows();
    // Re-check on scroll and resize
    const currentRef = rowRef.current;
    currentRef?.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);

    return () => {
      currentRef?.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, [movies]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="md:px-12 my-8 md:my-12"
    >
      <h2 className="text-black dark:text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-0">
        {title}
      </h2>
      <div className="group relative">
        <div
          ref={rowRef}
          className="flex overflow-x-scroll space-x-4 px-4 md:px-0 scrollbar-hide"
        >
          {movies.map(
            (movie) =>
              movie?.poster_path && (
                <div key={movie.id} className="w-40 md:w-48 flex-shrink-0">
                  <MovieCard media={movie} onMediaClick={onMediaClick} />
                </div>
              )
          )}
        </div>

        {/* Arrows and Progress Bar Container */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <AnimatePresence>
            {showLeftArrow && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => handleScroll("left")}
                className="absolute top-0 bottom-0 left-0 z-20 h-full w-12 bg-gradient-to-r from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
              >
                <FaChevronLeft className="text-white h-8 w-8 drop-shadow-lg" />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showRightArrow && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => handleScroll("right")}
                className="absolute top-0 bottom-0 right-0 z-20 h-full w-12 bg-gradient-to-l from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
              >
                <FaChevronRight className="text-white h-8 w-8 drop-shadow-lg" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="relative h-0.5 mt-3 mx-12 hidden md:block">
        <div className="bg-neutral-200 dark:bg-neutral-800 h-full w-full absolute rounded-full"></div>
        <motion.div
          className="bg-red-600 h-full w-full absolute rounded-full"
          style={{ scaleX, transformOrigin: "left" }}
        />
      </div>
    </motion.div>
  );
};

export default MovieRow;
