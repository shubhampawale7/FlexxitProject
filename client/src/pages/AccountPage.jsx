import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import Input from "../components/common/Input";
import { motion } from "framer-motion";

const avatars = [
  "https://api.dicebear.com/8.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/8.x/bottts/svg?seed=Daisy",
  "https://api.dicebear.com/8.x/bottts/svg?seed=Milo",
  "https://api.dicebear.com/8.x/bottts/svg?seed=Zoe",
  "https://api.dicebear.com/8.x/bottts/svg?seed=Sammy",
  "https://api.dicebear.com/8.x/bottts/svg?seed=Loki",
  "https://api.dicebear.com/8.x/bottts/svg?seed=Max",
  "https://api.dicebear.com/8.x/bottts/svg?seed=Luna",
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const AccountPage = () => {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(user?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || avatars[0]
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (name.trim() === "") return toast.error("Name cannot be empty.");
    updateUserProfile({ name, avatar: selectedAvatar });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    updateUserPassword({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-3xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-black mb-2"
        >
          Account Settings
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-neutral-600 dark:text-neutral-400 mb-8"
        >
          Manage your profile, avatar, and password.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="bg-gray-100 dark:bg-neutral-900 rounded-xl shadow-lg"
        >
          <div className="border-b border-gray-200 dark:border-neutral-800">
            <nav className="flex space-x-2 p-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                  activeTab === "profile"
                    ? "bg-red-600 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-neutral-800"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                  activeTab === "security"
                    ? "bg-red-600 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-neutral-800"
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Choose Your Avatar
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {avatars.map((avatarUrl) => (
                        <motion.img
                          key={avatarUrl}
                          src={avatarUrl}
                          alt="avatar"
                          onClick={() => setSelectedAvatar(avatarUrl)}
                          className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-300 ${
                            selectedAvatar === avatarUrl
                              ? "ring-4 ring-red-500 p-1"
                              : "hover:scale-110"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  </div>
                  <Input
                    id="name"
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <p className="mt-1 text-lg opacity-70">{user?.email}</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition transform hover:scale-105"
                  >
                    Save Profile
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    id="newPassword"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    id="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition transform hover:scale-105"
                  >
                    Change Password
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccountPage;
