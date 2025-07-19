import User from "../models/User.js";

const getWatchlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.watchlist);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const addToWatchlist = async (req, res) => {
  console.log("Received body:", req.body); // <-- ADD THIS LINE
  const { id, mediaType } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const itemExists = user.watchlist.some(
      (item) => item.id === String(id) && item.mediaType === mediaType
    );
    if (itemExists) {
      return res.status(400).json({ message: "Item already in watchlist" });
    }

    user.watchlist.push({ id: String(id), mediaType });

    await user.save();
    res.status(201).json(user.watchlist);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const removeFromWatchlist = async (req, res) => {
  const { id, mediaType } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.watchlist = user.watchlist.filter(
      (item) => !(item.id === String(id) && item.mediaType === mediaType)
    );
    await user.save();
    res.json(user.watchlist);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateUserPassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { currentPassword, newPassword } = req.body;
  if (user && (await user.matchPassword(currentPassword))) {
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } else {
    res.status(401).json({ message: "Invalid current password" });
  }
};

export {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateUserProfile,
  updateUserPassword,
};
