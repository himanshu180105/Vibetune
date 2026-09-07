const { asyncHandler } = require('../middleware/errorMiddleware');
const artistService = require('../services/artistService');
const songService = require('../services/songService');
const albumService = require('../services/albumService');

/**
 * GET /artists/:id — Artist profile page
 */
const getArtistProfile = asyncHandler(async (req, res) => {
  const artist = await artistService.getArtistById(req.params.id);

  if (!artist) {
    req.flash('error', 'Artist not found');
    return res.redirect('/');
  }

  const [songs, albums] = await Promise.all([
    songService.getSongsByArtist(artist._id),
    albumService.getAlbumsByArtist(artist._id)
  ]);

  res.render('pages/artist', {
    title: `${artist.name} — VibeTune`,
    artist,
    songs,
    albums
  });
});

module.exports = {
  getArtistProfile
};
