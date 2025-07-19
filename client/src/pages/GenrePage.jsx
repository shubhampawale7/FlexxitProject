import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import api from "../services/api";
import MovieGridSkeleton from "../components/ui/MovieGridSkeleton";
import MovieCard from "../components/ui/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter } from "react-icons/fa";

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

const GenrePage = ({ onMediaClick }) => {
  const { genreId } = useParams();
  const location = useLocation();
  const genreName = location.state?.genreName || "Genre";

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (!genreId) return;

    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/content/genre/${genreId}`, {
          params: { sortBy, year },
        });
        setMovies(res.data);
      } catch (error) {
        toast.error(`Failed to fetch movies for ${genreName}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [genreId, genreName, sortBy, year]);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1980; i--) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">
      {/* Page Header */}
      <div className="relative bg-gray-100 dark:bg-neutral-900 pt-24 pb-12 px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-red-500 uppercase tracking-widest">
            Genre
          </p>
          <h1 className="text-4xl md:text-6xl font-black mt-2">{genreName}</h1>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 bg-white/80 dark:bg-black/80 backdrop-blur-lg z-30 py-4 px-4 md:px-8 border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
            <FaFilter />
            <span className="font-semibold">Filters</span>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-100 dark:bg-neutral-800 rounded-md p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="popularity.desc">Popularity</option>
              <option value="release_date.desc">Newest</option>
              <option value="vote_average.desc">Top Rated</option>
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-gray-100 dark:bg-neutral-800 rounded-md p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="">All Years</option>
              {generateYearOptions().map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-4 md:p-8">
        {isLoading ? (
          <MovieGridSkeleton />
        ) : movies.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
          >
            <AnimatePresence>
              {movies.map(
                (media) =>
                  media.poster_path && (
                    <motion.div
                      variants={itemVariants}
                      exit="exit"
                      key={media.id}
                    >
                      <MovieCard
                        media={{ ...media, media_type: "movie" }}
                        onMediaClick={onMediaClick}
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              No results found for this criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
