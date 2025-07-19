import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import api from "../services/api";
import MovieGridSkeleton from "../components/ui/MovieGridSkeleton";
import MovieCard from "../components/ui/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaList, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

const EmptyList = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20 flex flex-col items-center"
  >
    <FaList className="text-6xl text-neutral-400 dark:text-neutral-600 mb-4" />
    <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
      Your List is Empty
    </h2>
    <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mb-6">
      Add shows and movies to your list to watch them later.
    </p>
    <Link
      to="/browse"
      className="flex items-center justify-center bg-red-600 text-white font-bold rounded-lg px-6 py-3 hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
    >
      <FaPlusCircle className="mr-2" />
      Browse & Add
    </Link>
  </motion.div>
);

const MyListPage = ({ onMediaClick }) => {
  const { watchlist } = useAuth();
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (watchlist.length === 0) {
        setIsLoading(false);
        setMediaItems([]);
        return;
      }
      setIsLoading(true);
      try {
        const mediaPromises = watchlist.map((item) =>
          api.get(`/api/content/media/${item.mediaType}/${item.id}`)
        );
        const mediaResponses = await Promise.all(mediaPromises);
        setMediaItems(mediaResponses.map((res) => res.data.details));
      } catch (error) {
        toast.error("Could not load your list.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMediaDetails();
  }, [watchlist]);

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white p-4 md:p-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-5xl font-black mb-2">My List</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          All your saved movies and shows in one place.
        </p>
      </motion.div>

      <div className="mt-8">
        {isLoading ? (
          <MovieGridSkeleton />
        ) : mediaItems.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
          >
            <AnimatePresence>
              {mediaItems.map(
                (media) =>
                  media.poster_path && (
                    <motion.div
                      variants={itemVariants}
                      exit="exit"
                      key={media.id}
                    >
                      <MovieCard media={media} onMediaClick={onMediaClick} />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyList />
        )}
      </div>
    </div>
  );
};

export default MyListPage;
