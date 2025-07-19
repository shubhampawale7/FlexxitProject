import express from "express";
import {
  getBrowseRows,
  getMediaDetails,
  searchMedia,
  getMoviesByGenre,
  getTvSeasonDetails,
  getGenreList,
} from "../controllers/contentController.js";

const router = express.Router();

router.get("/browse", getBrowseRows);
router.get("/media/:mediaType/:id", getMediaDetails);
router.get("/tv/:tvId/season/:seasonNumber", getTvSeasonDetails);
router.get("/search", searchMedia);
router.get("/genres", getGenreList);
router.get("/genre/:genreId", getMoviesByGenre);

export default router;
