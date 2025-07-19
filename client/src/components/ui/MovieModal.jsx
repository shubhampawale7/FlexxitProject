import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoPlay, IoAdd, IoCheckmark } from "react-icons/io5";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const SimilarMediaCard = ({ media, onCardClick }) => {
  const posterPath = `https://image.tmdb.org/t/p/w500${media.poster_path}`;
  return (
    <motion.div
      variants={itemVariants}
      className="flex-shrink-0 cursor-pointer group"
      onClick={() =>
        onCardClick({ id: media.id, mediaType: media.media_type || "movie" })
      }
    >
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <LazyLoadImage
          alt={media.title || media.name}
          src={posterPath}
          placeholderSrc={posterPath.replace("w500", "w200")}
          effect="blur"
          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
      </div>
      <p className="text-sm mt-2 truncate text-neutral-600 dark:text-neutral-400 group-hover:text-white transition-colors">
        {media.title || media.name}
      </p>
    </motion.div>
  );
};

const EpisodeCard = ({ episode, media, details, seasonNumber }) => {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors group">
      <span className="text-xl font-bold text-neutral-500 pt-1">
        {episode.episode_number}
      </span>
      <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0 bg-neutral-800">
        <LazyLoadImage
          src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
          alt={episode.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          effect="blur"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <IoPlay className="text-white text-3xl" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-black dark:text-white">{episode.name}</h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
          {episode.overview}
        </p>
      </div>
    </div>
  );
};

const TVSeasons = ({ details, media }) => {
  const [selectedSeason, setSelectedSeason] = useState(
    details.seasons.find((s) => s.season_number > 0)?.season_number || 1
  );
  const [episodes, setEpisodes] = useState([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  useEffect(() => {
    if (selectedSeason === undefined) return;
    const fetchEpisodes = async () => {
      setIsLoadingEpisodes(true);
      try {
        const res = await api.get(
          `/api/content/tv/${details.id}/season/${selectedSeason}`
        );
        setEpisodes(res.data.episodes);
      } catch (error) {
        toast.error(`Could not load episodes for Season ${selectedSeason}`);
      } finally {
        setIsLoadingEpisodes(false);
      }
    };
    fetchEpisodes();
  }, [selectedSeason, details.id]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-black dark:text-white">
          Episodes
        </h3>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="bg-gray-200 dark:bg-neutral-800 text-black dark:text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {details.seasons.map(
            (season) =>
              season.season_number > 0 && (
                <option key={season.id} value={season.season_number}>
                  {" "}
                  Season {season.season_number}{" "}
                </option>
              )
          )}
        </select>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
        {isLoadingEpisodes ? (
          <p className="text-center text-neutral-400">Loading episodes...</p>
        ) : (
          episodes.map((ep) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              media={media}
              details={details}
              seasonNumber={selectedSeason}
            />
          ))
        )}
      </div>
    </div>
  );
};

const MovieModalSkeleton = () => (
  <div className="w-full h-[90vh] bg-neutral-200 dark:bg-neutral-900 animate-pulse grid grid-cols-1 md:grid-cols-3">
    <div className="md:col-span-1 h-full bg-neutral-300 dark:bg-neutral-800"></div>
    <div className="md:col-span-2 p-8 space-y-4">
      <div className="w-3/4 h-12 bg-neutral-300 dark:bg-neutral-800 rounded-lg"></div>
      <div className="w-full h-24 bg-neutral-300 dark:bg-neutral-800 rounded-lg"></div>
      <div className="w-1/2 h-8 bg-neutral-300 dark:bg-neutral-800 rounded-lg"></div>
    </div>
  </div>
);

const MovieModal = ({ media, onClose, onMediaClick }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { watchlist, addToWatchlist, removeFromWatchlist } = useAuth();

  const isAdded = watchlist.some(
    (item) => item.id === String(media.id) && item.mediaType === media.mediaType
  );

  useEffect(() => {
    if (!media?.id || !media?.mediaType) return;
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(
          `/api/content/media/${media.mediaType}/${media.id}`
        );
        setData(res.data);
      } catch (error) {
        toast.error("Could not load details for this title.");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [media?.id, media?.mediaType, onClose]);

  const handleWatchlistToggle = () => {
    if (isAdded) {
      removeFromWatchlist(media);
    } else {
      addToWatchlist(media);
    }
  };

  const handleSimilarClick = (newMedia) => {
    onClose();
    setTimeout(() => {
      onMediaClick(newMedia);
    }, 300);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const details = data?.details;
  const similarMovies = data?.similarMovies || [];
  const title = details?.title || details?.name;
  const releaseDate = details?.release_date || details?.first_air_date;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-0 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-neutral-900 rounded-none md:rounded-xl max-w-5xl w-full h-full max-h-full md:max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <MovieModalSkeleton />
        ) : (
          details && (
            <div key={media.id} className="grid grid-cols-1 md:grid-cols-3">
              {/* Left Panel: Poster */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:col-span-1"
              >
                <LazyLoadImage
                  src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                  alt={title}
                  className="w-full h-auto object-cover"
                  effect="blur"
                />
              </motion.div>

              {/* Right Panel: Details */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="md:col-span-2 p-8"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex justify-between items-start"
                >
                  <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white pr-4">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="bg-gray-200 dark:bg-neutral-800 w-10 h-10 rounded-full flex items-center justify-center text-black dark:text-white hover:bg-red-500 hover:text-white transition-colors flex-shrink-0"
                  >
                    {" "}
                    <IoClose size={24} />{" "}
                  </button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-4 my-4 text-neutral-600 dark:text-neutral-400"
                >
                  <span>{releaseDate?.substring(0, 4)}</span>
                  <span className="font-bold text-green-500">
                    ⭐ {details.vote_average?.toFixed(1)}
                  </span>
                  {details.runtime && <span>{details.runtime} min</span>}
                  {details.number_of_seasons && (
                    <span>{details.number_of_seasons} Season(s)</span>
                  )}
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                >
                  <Link
                    to={`/watch/${media.mediaType}/${media.id}`}
                    className="flex items-center justify-center bg-red-600 text-white font-bold rounded-lg px-6 py-2.5 hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
                  >
                    {" "}
                    <IoPlay className="mr-2" /> Play Trailer{" "}
                  </Link>
                  <button
                    onClick={handleWatchlistToggle}
                    className="flex items-center justify-center bg-gray-200 dark:bg-neutral-800 text-black dark:text-white font-bold rounded-lg px-6 py-2.5 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors duration-300 transform hover:scale-105"
                  >
                    {isAdded ? (
                      <IoCheckmark className="mr-2 text-xl" />
                    ) : (
                      <IoAdd className="mr-2 text-xl" />
                    )}{" "}
                    My List
                  </button>
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="mt-6 text-black dark:text-white/90"
                >
                  {details.overview}
                </motion.p>

                {media.mediaType === "tv" && details.seasons && (
                  <TVSeasons details={details} media={media} />
                )}

                {similarMovies.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                      More Like This
                    </h3>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                    >
                      {similarMovies
                        .slice(0, 6)
                        .map(
                          (similarMedia) =>
                            similarMedia.poster_path && (
                              <SimilarMediaCard
                                key={similarMedia.id}
                                media={similarMedia}
                                onMediaClick={handleSimilarClick}
                              />
                            )
                        )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          )
        )}
      </motion.div>
    </motion.div>
  );
};

export default MovieModal;
