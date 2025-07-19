import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../services/api";
import Hero from "../components/ui/Hero";
import MovieRow from "../components/ui/MovieRow";
import HeroSkeleton from "../components/ui/HeroSkeleton";
import MovieRowSkeleton from "../components/ui/MovieRowSkeleton";
import { motion, AnimatePresence } from "framer-motion";

const BrowsePage = ({ onMediaClick }) => {
  const [rows, setRows] = useState([]);
  const [heroMedia, setHeroMedia] = useState(null);
  const [heroTrailerKey, setHeroTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/api/content/browse");
        setRows(res.data.rows);
        setHeroMedia(res.data.heroMovie);
        setHeroTrailerKey(res.data.heroTrailerKey);
      } catch (error) {
        toast.error("Failed to fetch content.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <AnimatePresence>
        {isLoading ? (
          <motion.div key="skeleton" exit={{ opacity: 0 }}>
            <HeroSkeleton />
            <div className="py-2">
              <MovieRowSkeleton />
              <MovieRowSkeleton />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {heroMedia && (
              <Hero
                movie={heroMedia}
                trailerKey={heroTrailerKey}
                onMoreInfoClick={onMediaClick}
              />
            )}
            <div className="py-2 -mt-4 md:-mt-16 lg:-mt-24 relative z-10">
              {rows.map(({ title, movies }) => (
                <MovieRow
                  key={title}
                  title={title}
                  movies={movies}
                  onMediaClick={onMediaClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowsePage;
