const { asyncHandler } = require('../middleware/errorMiddleware');
const songService = require('../services/songService');
const artistService = require('../services/artistService');
const albumService = require('../services/albumService');

/**
 * GET / — Home page with featured content
 */
const getHome = asyncHandler(async (req, res) => {
  const [recentSongs, popularSongs, artists, albums, genres] = await Promise.all([
    songService.getRecentSongs(10),
    songService.getPopularSongs(10),
    artistService.getAllArtists(8),
    albumService.getAllAlbums(8),
    songService.getAllGenres()
  ]);

  res.render('pages/home', {
    title: 'VibeTune — Your Music, Your Vibe',
    recentSongs,
    popularSongs,
    artists,
    albums,
    genres
  });
});

/**
 * GET /browse — Browse songs by genre
 */
const getBrowse = asyncHandler(async (req, res) => {
  const genres = await songService.getAllGenres();
  const { genre } = req.query;

  let songs = [];
  if (genre) {
    songs = await songService.getSongsByGenre(genre, 50);
  }

  res.render('pages/browse', {
    title: genre ? `${genre} — Browse — VibeTune` : 'Browse — VibeTune',
    genres,
    songs,
    selectedGenre: genre || null
  });
});

module.exports = {
  getHome,
  getBrowse
};
