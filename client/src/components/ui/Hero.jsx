import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import {
  IoInformationCircleOutline,
  IoVolumeHigh,
  IoVolumeMute,
} from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
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

const Hero = ({ movie, trailerKey, onMoreInfoClick }) => {
  const [playTrailer, setPlayTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    let timer;
    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setPlayTrailer(true);
      }, 5000);
    };
    const handleInteraction = () => {
      setPlayTrailer(false);
      startTimer();
    };
    startTimer();
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("scroll", handleInteraction);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, [movie]);

  const highResBackdrop = `https://image.tmdb.org/t/p/original${movie?.backdrop_path}`;
  const lowResBackdrop = `https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`;
  const trailerUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${
    isMuted ? 1 : 0
  }&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&iv_load_policy=3`;

  const truncateOverview = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="relative h-[56.25vw] min-h-[450px] max-h-[850px] w-full">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <AnimatePresence>
          {playTrailer && trailerKey ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <iframe
                src={trailerUrl}
                className="w-full h-full scale-[1.3]"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Trailer"
              ></iframe>
            </motion.div>
          ) : (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full"
            >
              <LazyLoadImage
                src={highResBackdrop}
                placeholderSrc={lowResBackdrop}
                effect="blur"
                className="w-full h-full object-cover"
                alt={movie?.title}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col justify-end h-full pb-16 sm:pb-24 md:pb-32 px-4 sm:px-8 md:px-16 lg:px-24 text-white"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-5xl lg:text-6xl font-black drop-shadow-xl"
        >
          {movie?.title || movie?.name}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-xl text-sm md:text-base lg:text-lg drop-shadow-lg"
        >
          {truncateOverview(movie?.overview, 120)}
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="flex flex-row items-center mt-6 space-x-3"
        >
          <Link
            to={`/watch/${movie.media_type}/${movie.id}`}
            className="flex items-center justify-center bg-white text-black font-bold rounded-lg px-6 py-2.5 hover:bg-neutral-200 transition-colors duration-300 transform hover:scale-105"
          >
            <FaPlay className="mr-2" />
            Play
          </Link>
          <button
            onClick={() =>
              onMoreInfoClick({ id: movie.id, mediaType: movie.media_type })
            }
            className="flex items-center justify-center bg-white/20 backdrop-blur-md text-white font-bold rounded-lg px-6 py-2.5 hover:bg-white/30 transition-colors duration-300 transform hover:scale-105"
          >
            <IoInformationCircleOutline className="mr-2 text-2xl" />
            More Info
          </button>
        </motion.div>
      </motion.div>
      {playTrailer && trailerKey && (
        <div className="absolute bottom-16 sm:bottom-24 md:bottom-32 right-4 sm:right-8 md:right-16 z-20">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white/50 bg-black/30 text-white hover:bg-white/20 hover:border-white transition-all duration-300"
          >
            {isMuted ? <IoVolumeMute size={20} /> : <IoVolumeHigh size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default Hero;
