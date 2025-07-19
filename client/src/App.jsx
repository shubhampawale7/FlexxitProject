import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";
import MovieModal from "./components/ui/MovieModal";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BrowsePage from "./pages/BrowsePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import WatchPage from "./pages/WatchPage";
import MyListPage from "./pages/MyListPage";
import AccountPage from "./pages/AccountPage";
import GenrePage from "./pages/GenrePage";

function App() {
  const location = useLocation();
  const shouldShowNavAndFooter = !location.pathname.startsWith("/watch");
  const [selectedMedia, setSelectedMedia] = useState(null); // From ID to object

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
  };
  const handleCloseModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Toaster position="top-center" richColors />
      {shouldShowNavAndFooter && <Navbar onMediaClick={handleMediaClick} />}
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/browse"
              element={<BrowsePage onMediaClick={handleMediaClick} />}
            />
            <Route
              path="/search"
              element={<SearchResultsPage onMediaClick={handleMediaClick} />}
            />
            <Route path="/watch/:mediaType/:id" element={<WatchPage />} />
            <Route
              path="/my-list"
              element={<MyListPage onMediaClick={handleMediaClick} />}
            />
            <Route path="/account" element={<AccountPage />} />
            <Route
              path="/genre/:genreId"
              element={<GenrePage onMediaClick={handleMediaClick} />}
            />
          </Route>
        </Routes>
      </main>
      {shouldShowNavAndFooter && <Footer />}
      {selectedMedia && (
        <MovieModal
          media={selectedMedia}
          onClose={handleCloseModal}
          onMediaClick={handleMediaClick}
        />
      )}
    </div>
  );
}

export default App;
