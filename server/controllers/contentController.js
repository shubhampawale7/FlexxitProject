import axios from "axios";
import dayjs from "dayjs";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getTmdbData = async (endpoint, params = {}) => {
  const options = {
    method: "GET",
    url: `${TMDB_BASE_URL}${endpoint}`,
    params: { ...params, api_key: process.env.TMDB_API_KEY, language: "en-US" },
  };
  const response = await axios.request(options);
  return response.data;
};

const getBrowseRows = async (req, res) => {
  try {
    const endpoints = {
      "Trending Now": "/trending/all/week",
      "Top Rated Movies": "/movie/top_rated",
      "Popular TV Shows": "/tv/popular",
      "Action Movies": "/discover/movie?with_genres=28",
      "Comedy TV Shows": "/discover/tv?with_genres=35",
    };

    const promises = Object.entries(endpoints).map(
      async ([title, endpoint]) => {
        const data = await getTmdbData(endpoint);

        const itemsWithBadges = data.results.map((item, index) => {
          let badge = null;
          if (title.includes("Top Rated") && index < 10) {
            badge = "Top 10";
          } else if (
            dayjs(item.release_date || item.first_air_date).isAfter(
              dayjs().subtract(6, "month")
            )
          ) {
            badge = "New";
          }
          return {
            ...item,
            media_type:
              item.media_type ||
              (endpoint.startsWith("/movie") ? "movie" : "tv"),
            badge,
          };
        });

        return { title, movies: itemsWithBadges };
      }
    );

    let rows = await Promise.all(promises);

    const trendingRow = rows.find((row) => row.title === "Trending Now");
    let heroMedia = null;
    let heroTrailerKey = null;

    if (trendingRow && trendingRow.movies.length > 0) {
      heroMedia =
        trendingRow.movies[
          Math.floor(Math.random() * trendingRow.movies.length)
        ];

      const videosData = await getTmdbData(
        `/${heroMedia.media_type}/${heroMedia.id}/videos`
      );
      const trailer = videosData.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        heroTrailerKey = trailer.key;
      }
    }

    res.json({ rows, heroMovie: heroMedia, heroTrailerKey });
  } catch (error) {
    console.error("Error fetching browse rows:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMediaDetails = async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const [details, videos, similar] = await Promise.all([
      getTmdbData(`/${mediaType}/${id}`),
      getTmdbData(`/${mediaType}/${id}/videos`),
      getTmdbData(`/${mediaType}/${id}/similar`),
    ]);
    const trailer = videos.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );
    res.json({ details, trailer, similarMovies: similar.results });
  } catch (error) {
    console.error("Error fetching media details:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTvSeasonDetails = async (req, res) => {
  try {
    const { tvId, seasonNumber } = req.params;
    const data = await getTmdbData(`/tv/${tvId}/season/${seasonNumber}`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching TV season details:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const searchMedia = async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ message: "Search term is required" });
    }
    const data = await getTmdbData("/search/multi", { query: term });
    const validResults = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
    res.json(validResults || []);
  } catch (error) {
    console.error("Error searching media:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMoviesByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const { sortBy, year } = req.query;

    const params = {
      with_genres: genreId,
      sort_by: sortBy || "popularity.desc",
    };

    if (year) {
      params.primary_release_year = year;
    }

    const data = await getTmdbData("/discover/movie", params);
    res.json(data.results || []);
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getGenreList = async (req, res) => {
  try {
    const data = await getTmdbData("/genre/movie/list");
    res.json(data.genres || []);
  } catch (error) {
    console.error("Error fetching genre list:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export {
  getBrowseRows,
  getMediaDetails,
  searchMedia,
  getMoviesByGenre,
  getTvSeasonDetails,
  getGenreList,
};
