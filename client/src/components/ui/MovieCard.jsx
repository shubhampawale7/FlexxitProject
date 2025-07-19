import React from "react";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaPlay } from "react-icons/fa";
import { IoAdd, IoCheckmark } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "react-lazy-load-image-component/src/effects/blur.css";

const Badge = ({ text }) => {
  const isTop10 = text === "Top 10";
  const bgColor = isTop10
    ? "bg-gradient-to-br from-amber-500 to-orange-600"
    : "bg-gradient-to-br from-cyan-500 to-blue-600";
  return (
    <div
      className={`absolute top-2 right-2 ${bgColor} text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-10`}
    >
      {text}
    </div>
  );
};

const MovieCard = ({ media, onMediaClick = () => {} }) => {
  if (!media) return null;

  const { watchlist, addToWatchlist, removeFromWatchlist } = useAuth();

  const isAdded = watchlist.some(
    (item) =>
      item.id === String(media.id) && item.mediaType === media.media_type
  );

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (isAdded) {
      removeFromWatchlist({ id: media.id, mediaType: media.media_type });
    } else {
      addToWatchlist({ id: media.id, mediaType: media.media_type });
    }
  };

  const highResPoster = `https://image.tmdb.org/t/p/w500${media.poster_path}`;
  const lowResPoster = `https://image.tmdb.org/t/p/w200${media.poster_path}`;
  const title = media.title || media.name;
  const matchScore = Math.round(media.vote_average * 10);

  return (
    <motion.div
      layout
      onClick={() =>
        onMediaClick({ id: media.id, mediaType: media.media_type })
      }
      whileHover="hover"
      className="relative w-full aspect-[2/3] rounded-lg cursor-pointer bg-neutral-800"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        variants={{
          initial: { scale: 1, zIndex: 1 },
          hover: {
            scale: 1.2,
            zIndex: 20,
            transition: { delay: 0.3, duration: 0.3 },
          },
        }}
        initial="initial"
        className="w-full h-full rounded-lg"
      >
        <motion.div
          className="w-full h-full rounded-lg overflow-hidden shadow-lg"
          whileHover={{ boxShadow: "0px 20px 40px rgba(0,0,0,0.5)" }}
        >
          <div className="absolute inset-0">
            <LazyLoadImage
              alt={title}
              src={highResPoster}
              placeholderSrc={lowResPoster}
              effect="blur"
              className="w-full h-full object-cover"
            />
          </div>

          {media.badge && <Badge text={media.badge} />}

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1, transition: { delay: 0.3 } }}
            className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black via-black/40 to-transparent"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="absolute bottom-0 left-0 w-full p-3"
          >
            <h3 className="text-white font-bold text-base truncate drop-shadow-lg">
              {title}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Link
                  to={`/watch/${media.media_type}/${media.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-black hover:bg-neutral-300 transition-all duration-300 transform hover:scale-110"
                >
                  <FaPlay size={12} className="ml-0.5" />
                </Link>
                <button
                  onClick={handleWatchlistToggle}
                  className="flex items-center justify-center w-8 h-8 border-2 border-gray-400 text-white rounded-full hover:border-white transition-all duration-300 transform hover:scale-110"
                >
                  {isAdded ? <IoCheckmark size={16} /> : <IoAdd size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2 text-xs">
              <span className="text-green-400 font-semibold">
                {matchScore}% Match
              </span>
              <span className="text-white/70">
                {media.release_date?.substring(0, 4) ||
                  media.first_air_date?.substring(0, 4)}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;
