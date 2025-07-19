import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "sonner";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (token) {
        try {
          const profileRes = await api.get("/api/auth/profile");
          setUser(profileRes.data);
          const watchlistRes = await api.get("/api/user/watchlist");
          setWatchlist(watchlistRes.data);
        } catch (error) {
          toast.error("Session expired. Please log in again.");
          logout();
        }
      }
      setLoading(false);
    };
    if (token) {
      initialize();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (formData) => {
    const res = await api.post("/api/auth/login", formData);
    localStorage.setItem("token", res.data.token);
    setUser(res.data);
    setToken(res.data.token);
    return res;
  };

  const signup = async (formData) => {
    return await api.post("/api/auth/register", formData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWatchlist([]);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const addToWatchlist = async (media) => {
    try {
      const res = await api.post("/api/user/watchlist/add", {
        id: media.id,
        mediaType: media.mediaType,
      });
      setWatchlist(res.data);
      toast.success("Added to My List");
    } catch (error) {
      toast.error("Failed to add to list.");
    }
  };

  const removeFromWatchlist = async (media) => {
    try {
      const res = await api.post("/api/user/watchlist/remove", {
        id: media.id,
        mediaType: media.mediaType,
      });
      setWatchlist(res.data);
      toast.success("Removed from My List");
    } catch (error) {
      toast.error("Failed to remove from list.");
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await api.put("/api/user/profile", profileData);
      setUser(res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const updateUserPassword = async (passwordData) => {
    try {
      await api.put("/api/user/profile/password", passwordData);
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password."
      );
    }
  };

  const value = {
    user,
    token,
    watchlist,
    loading,
    login,
    signup,
    logout,
    addToWatchlist,
    removeFromWatchlist,
    updateUserProfile,
    updateUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
