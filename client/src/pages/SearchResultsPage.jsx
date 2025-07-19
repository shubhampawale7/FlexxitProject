import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../services/api";
import MovieGridSkeleton from "../components/ui/MovieGridSkeleton";
import MovieCard from "../components/ui/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";

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
};

const EmptyState = ({ query }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20 flex flex-col items-center"
  >
    <FaSearch className="text-6xl text-neutral-400 dark:text-neutral-600 mb-4" />
    <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
      No results found for "{query}"
    </h2>
    <p className="text-neutral-600 dark:text-neutral-400 max-w-sm">
      Please check your spelling or try searching for something else.
    </p>
  </motion.div>
);

const SearchResultsPage = ({ onMediaClick }) => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/content/search?term=${query}`);
        setResults(res.data);
      } catch (error) {
        toast.error(`Failed to fetch results for "${query}"`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white p-4 md:p-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-5xl font-black">Search Results</h1>
        {!isLoading && query && (
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Found {results.length} results for "
            <span className="text-red-500 font-semibold">{query}</span>"
          </p>
        )}
      </motion.div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="skeleton" exit={{ opacity: 0 }}>
            <MovieGridSkeleton />
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
          >
            {results.map(
              (media) =>
                media.poster_path && (
                  <motion.div variants={itemVariants} key={media.id}>
                    <MovieCard media={media} onMediaClick={onMediaClick} />
                  </motion.div>
                )
            )}
          </motion.div>
        ) : (
          query && (
            <motion.div key="empty">
              <EmptyState query={query} />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResultsPage;
