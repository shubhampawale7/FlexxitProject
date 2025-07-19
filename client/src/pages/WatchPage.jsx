import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegSadCry } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const LoadingState = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white gap-4">
    <CgSpinner className="animate-spin text-5xl text-red-600" />
    <p className="text-lg text-neutral-400">Loading Trailer...</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white text-center p-4">
    <FaRegSadCry className="text-6xl text-neutral-600 mb-4" />
    <h2 className="text-2xl font-bold">Trailer Not Found</h2>
    <p className="text-neutral-400 mt-2">{message}</p>
  </div>
);

const WatchPage = () => {
  const { mediaType, id } = useParams();
  const [mediaDetails, setMediaDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUiVisible, setIsUiVisible] = useState(true);

  useEffect(() => {
    let timeoutId;
    const handleMouseMove = () => {
      setIsUiVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsUiVisible(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    handleMouseMove();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!id || !mediaType) return;
    const fetchMedia = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/content/media/${mediaType}/${id}`);
        setMediaDetails(res.data.details);

        if (res.data.trailer) {
          const youtubeEmbedUrl = `https://www.youtube.com/embed/${res.data.trailer.key}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&controls=1&modestbranding=1`;
          setTrailerUrl(youtubeEmbedUrl);
        } else {
          setError("A trailer is not available for this title.");
        }
      } catch (err) {
        setError("Could not load the requested content.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedia();
  }, [mediaType, id]);

  const title = mediaDetails?.title || mediaDetails?.name;

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center cursor-none relative">
      <AnimatePresence>
        {isUiVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 p-4 md:p-6 flex items-center space-x-4 z-10"
          >
            <Link
              to="/browse"
              className="bg-black/50 w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
            >
              <IoArrowBack size={24} />
            </Link>
            <div>
              <p className="text-neutral-300 text-sm">Now Playing</p>
              <h1 className="text-white text-lg font-bold drop-shadow-lg">
                {title || ""}
              </h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-screen-2xl aspect-video">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              <LoadingState />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full relative"
            >
              <ErrorState message={error} />
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full h-full"
            >
              <iframe
                className="w-full h-full"
                src={trailerUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WatchPage;
