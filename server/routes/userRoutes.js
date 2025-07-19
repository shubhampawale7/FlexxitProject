import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateUserProfile,
  updateUserPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/profile").put(protect, updateUserProfile);
router.route("/profile/password").put(protect, updateUserPassword);

router.route("/watchlist").get(protect, getWatchlist);
router.route("/watchlist/add").post(protect, addToWatchlist);
router.route("/watchlist/remove").post(protect, removeFromWatchlist);

export default router;
