import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { FaSearch, FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

const NavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="relative text-black dark:text-white font-semibold group text-sm"
  >
    {children}
    <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
  </Link>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-6 rounded-full p-1 flex items-center bg-gray-300 dark:bg-neutral-700 relative"
    >
      <FaSun className="text-yellow-500" />
      <FaMoon className="text-white ml-auto" />
      <motion.div
        className="absolute w-5 h-5 bg-white dark:bg-neutral-900 rounded-full shadow-md"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{
          left: theme === "light" ? "2px" : "auto",
          right: theme === "dark" ? "2px" : "auto",
        }}
      />
    </button>
  );
};

const SearchModal = ({ onClose, onMediaClick }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    const debounceSearch = setTimeout(() => {
      api
        .get(`/api/content/search?term=${query}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    }, 300);
    return () => clearTimeout(debounceSearch);
  }, [query]);

  const handleResultClick = (media) => {
    onMediaClick({ id: media.id, mediaType: media.media_type });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[100] flex justify-center p-4 pt-[20vh]"
      onClick={onClose}
    >
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or TV show..."
          autoFocus
          className="w-full text-2xl md:text-4xl bg-transparent text-white placeholder-neutral-500 text-center focus:outline-none border-b-2 border-neutral-700 focus:border-red-500 transition-colors pb-2"
        />
        <div className="mt-6 max-h-[50vh] overflow-y-auto">
          {results.map((media) => (
            <div
              key={media.id}
              onClick={() => handleResultClick(media)}
              className="flex items-center p-2 rounded-lg hover:bg-neutral-800 cursor-pointer"
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${media.poster_path}`}
                alt={media.title || media.name}
                className="w-12 h-auto mr-4 rounded"
              />
              <span className="text-white text-lg">
                {media.title || media.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = ({ onMediaClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isGenreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (user) {
      api
        .get("/api/content/genres")
        .then((res) => setGenres(res.data))
        .catch((err) => console.error("Failed to fetch genres", err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white/10 dark:bg-black/20 px-4 sm:px-6 lg:px-8 shadow-md backdrop-blur-xl sticky top-0 z-50 border-b border-white/10 dark:border-black/20">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                to={user ? "/browse" : "/"}
                className="text-red-600 text-3xl font-black tracking-wider transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
              >
                FLEXXIT
              </Link>
              {user && (
                <div className="hidden lg:flex items-center space-x-8">
                  <NavLink to="/my-list">My List</NavLink>
                  <div
                    className="relative"
                    onMouseEnter={() => setGenreDropdownOpen(true)}
                    onMouseLeave={() => setGenreDropdownOpen(false)}
                  >
                    <button className="relative text-black dark:text-white font-semibold group text-sm">
                      Genres
                    </button>
                    <AnimatePresence>
                      {isGenreDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-96 bg-white dark:bg-neutral-800 rounded-lg shadow-2xl p-4 origin-top"
                        >
                          <div className="grid grid-cols-3 gap-2">
                            {genres.map((genre) => (
                              <Link
                                key={genre.id}
                                to={`/genre/${genre.id}`}
                                state={{ genreName: genre.name }}
                                className="block text-sm px-3 py-2 rounded-md text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                              >
                                {genre.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              {user && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-black dark:text-white hover:text-red-500 transition-colors"
                >
                  <FaSearch size={18} />
                </button>
              )}
              <ThemeToggle />
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center transition-transform duration-300 hover:scale-110"
                  >
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-md"
                    />
                  </button>
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onMouseLeave={() => setUserDropdownOpen(false)}
                        className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-2xl overflow-hidden origin-top-right"
                      >
                        <Link
                          to="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-3 text-sm text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                          Account
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition duration-300 transform hover:scale-105 shadow-md hover:shadow-red-500/50"
                >
                  Sign In
                </Link>
              )}
            </div>

            <div className="lg:hidden flex items-center">
              {user && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-black dark:text-white mr-4"
                >
                  <FaSearch size={20} />
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-black dark:text-white"
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={24} />
                ) : (
                  <FaBars size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal
            onClose={() => setIsSearchOpen(false)}
            onMediaClick={onMediaClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 w-4/5 h-full bg-white dark:bg-neutral-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-10">
                <NavLink
                  to="/my-list"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My List
                </NavLink>
                <NavLink
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Account
                </NavLink>
                <div className="px-4">
                  <ThemeToggle />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-lg font-bold text-red-500"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
